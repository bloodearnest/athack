'use strict';
// TODO: make this global houserule
var CRIT_MAX = true;

const SKIPPED = new Set(['secondary', 'effect', 'desc']);

function die(size) {
  return Math.floor(Math.random() * (size)) + 1;
}

function gwf_die(size) {
  let roll = die(size);
  if (roll < 3) {
    console.log('GWF: rerolling a ' + roll)
    roll = die(size);
  }
  return roll;
}

function roll_hit(bonus, advantage, disadvantage, rules) {
  let hit = die(20);
  let rolls = [hit];
  if (advantage && !disadvantage) {
    rolls.push(die(20));
    hit = Math.max(...rolls);
  } else if (disadvantage && !advantage) {
    rolls.push(die(20))
    hit = Math.min(...rolls);
  }
  let critical_threshold = parseInt(rules['Improved Critical'] || '20');
  return {
    miss: hit === 1,
    score: hit + bonus,
    rolls: rolls,
    critical: hit >= critical_threshold,
  }
}

class Damage {
  constructor(type, dice_string) {
    this.type = type;
    this.dice_string = dice_string;
    this.parts = Array.from(this.parse(dice_string));
  }

  *parse(dice_string) {
    let tokens = dice_string.split('+').map((s) => s.trim());

    for (let token of tokens) {
      let parts = token.split('d');

      if (parts.length === 1) {
        yield {
          n: 0,
          size: parseInt(parts[0])
        };
      } else {
        yield {
          n: parts[0] === "" ? 1 : parseInt(parts[0]),
          size: parseInt(parts[parts.length-1]),
        }
      }
    }
  }

  roll(die_func, critical) {
    let total = 0;
    let text = [];
    let annotated = [];

    for (let {n, size} of this.parts) {
      let rolls = [];
      if (n === 0) {
        // static bonus
        total += size;
        text.push(`${size}`);
        annotated.push(`${size}`);
      } else {
        let real_n = n;
        for (let i = 0; i < n; i++) {
          let roll = die_func(size);
          total += roll;
          rolls.push(roll);
        }
        if (critical) {
          real_n = n * 2;
          for (let i = 0; i < n; i++) {
            let roll = CRIT_MAX ? size : die_func(size);
            total += roll;
            rolls.push(roll)
          }
        }

        let t = `${real_n}d${size}`;
        text.push(t);
        annotated.push(`${t} (${rolls.join()})`);
      }
    }
    return {
      type: this.type,
      total: total,
      half: Math.floor(total/2),  // for spells
      text: text,
      annotated: annotated,
    }
  }
}


function *roll_damage(damage_data, die_func, critical) {
  for (let type in damage_data) {
    if (SKIPPED.has(type)) {
        continue;
    }
    let damage = new Damage(type, damage_data[type]);
    yield damage.roll(die_func, critical);
  }
}

function DamageResult(damages) {
  let damage_by_type = new Map();
  let grand_total = 0;

  // calculate per damage type summary
  for (let [condition, d] of damages) {
    for (let result of d) {
      let type = result.type;
      let total = damage_by_type.has(type) ? damage_by_type.get(type) : 0;
      damage_by_type.set(type, total + result.total);
      grand_total += result.total;
    }
  }

  return {
    total: grand_total,
    half: Math.floor(grand_total/2),
    components: damages,
    types: damage_by_type,
  };
}

function roll_attack(attack, advantage, disadvantage, autocrit, conditions) {
  conditions = conditions || {};
  let rules = attack.rules || {};
  let all_damage = new Map();
  let secondary_damage = new Map();
  let secondaries = new Map();
  let effects = new Map();
  let critical = false;
  let damage_critical = false;
  let hit = {miss: false};

  // only roll attack if it is an actual attack
  if (attack.tohit) {
    hit = roll_hit(attack.tohit, advantage, disadvantage, rules);
    damage_critical = autocrit || hit.critical;
  }

  let die_func = rules['Great Weapon Fighting'] ? gwf_die : die;
  let base_damage = Array.from(roll_damage(attack.damage, die_func, damage_critical));
  all_damage.set("Attack", base_damage);

  if (attack.damage.secondary) {
    secondaries.set("Attack", attack.damage.secondary);
  }

  if (attack.damage.effect) {
    effects.set("Attack", attack.damage.effect);
  }

  for (let [condition, active] of conditions) {
    if (active) {
      let attack_conditions = attack.conditions || {};
      let damage = attack_conditions[condition];
      let condition_damage = Array.from(
        roll_damage(damage, die_func, damage_critical)
      );
      all_damage.set(condition, condition_damage);
      if (damage.secondary) {
        secondaries.set(condition, damage.secondary);
      }
      if (damage.effect) {
        effects.set(condition, damage.effect);
      }
    }
  }

  if (secondaries.size > 0) {
    for (let [name, dam] of secondaries) {
      // TODO: does critical always affect secondary damage?
      let sec = Array.from(roll_damage(dam, die_func, damage_critical));
      sec.desc = dam.desc
      secondary_damage.set(name, sec)
    }
  }

  return {
    attack: attack,
    hit: hit,
    damage: DamageResult(all_damage),
    secondary: secondaries.size > 0 ? DamageResult(secondary_damage) : null,
    effects: effects.size > 0 ? effects : null,
  }
}
