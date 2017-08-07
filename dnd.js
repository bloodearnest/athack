'use strict';
// TODO: make this global houserule
var CRIT_MAX = true;

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
  let critical_threshold = rules['Improved Critical'] || 20;
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
    let rolls = [];
    let text = [];

    for (let {n, size} of this.parts) {
      if (n === 0) {
        // static bonus
        total += size;
        text.push(`${size}`);
      } else {
        for (let i = 0; i < n; i++) {
          let roll = die_func(size);
          total += roll;
          rolls.push(roll);
        }
        if (critical) {
          for (let i = 0; i < n; i++) {
            let roll = CRIT_MAX ? size : die_func(size);
            total += roll;
            rolls.push(roll)
          }
          text.push(`${n*2}d${size}`);
        } else {
          text.push(`${n}d${size}`);
        }
      }
    }
    return {
      type: this.type,
      total: total,
      rolls: rolls,
      text: text
    }
  }
}


function *roll_damage(damage_data, die_func, critical) {
  for (let type in damage_data) {
    let damage = new Damage(type, damage_data[type]);
    yield damage.roll(die_func, critical);
  }
}

function DamageResult(damages) {
  // merge all damages together
  let damage = new Map();
  for (let d of damages) {
    for (let result of d) {
      let type = result.type;
      if (damage.has(type)) {
        let merged = damage.get(type);
        merged.total += result.total;
        merged.text += "+" + result.text;
        merged.rolls = merged.rolls.concat(result.rolls);
        damage.set(type, merged);
      } else {
        damage.set(type, result);
      }
    }
  }
  let values = Array.from(damage.values());
  let grand_total = Array.from(values).reduce((a, {total}) => a + total, 0);
  let fmt_summary = ({total, type}) => `${total} ${type}`;
  let single_summary = ({total, type}) => `${type}`;
  let fmt_logmsg  = ({total, type, text, rolls}) => `${text} (${rolls.join()}) = ${total} ${type}`;
  if (values.length === 1) {
    fmt_summary = ({total, type}) => `${type}`;
  }
  return {
    summary: grand_total + " damage (" + values.map(fmt_summary).join(", ") + ")",
    logmsg: grand_total + " damage (" + values.map(fmt_logmsg).join(", ") + ")",
  };
}

function roll_attack(attack, advantage, disadvantage, autocrit, conditions) {
  let {tohit, damage, secondary, rules} = attack;
  conditions = conditions || {};
  rules = rules || {};

  const {score, rolls, critical, miss} = roll_hit(tohit, advantage, disadvantage, rules);

  if (miss) {
    return {
      results: ["Missed :("],
      log: `Missed with a 1! (${rolls.join()})`,
    }
  }

  let die_func = rules['Great Weapon Fighting'] ? gwf_die : die;
  let damage_critical = autocrit || critical;
  let base_damage = Array.from(roll_damage(damage, die_func, damage_critical));
  let all_damage = [base_damage];

  for (let [condition, active] of conditions) {
    if (active) {
      let attack_conditions = attack.conditions || {};
      let condition_damage = Array.from(
        roll_damage(attack_conditions[condition], die_func, damage_critical)
      );
      all_damage.push(condition_damage);
    }
  }

  let {summary, logmsg} = DamageResult(all_damage);
  let hit = critical ? "CRITICAL! " : `Hit ${score} for `;
  let log = `${hit} (${rolls.join()}) for ${logmsg}`;
  let results = [`${hit} ${summary}`]

  if (secondary) {
    let secondary_damage = Array.from(roll_damage(secondary, die_func, damage_critical));
    let {summary, logmsg} = DamageResult([secondary_damage]);
    results.push(`Secondary damage: ${summary}`);
    log += `, secondary damage: ${logmsg}`;
  }

  return {
    results: results,
    log: log,
  };
}
