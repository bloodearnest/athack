'use strict';
// TODO: make this global houserule
var CRIT_MAX = true;

const SKIPPED = new Set(['secondary', 'effect', 'desc', 'tohit', 'advantage', 'replace', 'save', 'rules']);

const PRONOUNCE = {
  'str': 'strength',
  'dex': 'dexterity',
  'con': 'consitution',
  'wis': 'wisdom',
  'int': 'intelligence',
  'cha': 'charisma',
};

function die(size) {
  return Math.floor(Math.random() * (size)) + 1;
}

function roll_dice(n, size, annotated, critical, reroll) {
  let rolls = [];
  let total = 0;
  if (n === 0) {
    // static bonus
    total += size;
    annotated.push(`${size}`);
  } else {
    let real_n = n;
    let sign = n / (Math.abs(n));
    for (let i = 0; i < Math.abs(n); i++) {
      let roll = die(size);
      if (reroll && reroll(roll)) {
        rolls.push(`~~${roll}~~`)
        roll = die(size)
      }
      rolls.push(roll);
      total += sign * roll;
    }
    for (let i = 0; i < critical; i++) {
      real_n += n
      for (let i = 0; i < Math.abs(n); i++) {
        let roll = CRIT_MAX ? size : die(size);
        total += sign * roll;
        rolls.push(roll);
      }
    }
    annotated.push(`${real_n}d${size} (${rolls.join()})`);
  }
  return total;
}



function gwf_die(size) {
  let roll = die(size);
  if (roll < 3) {
    console.log('GWF: rerolling a ' + roll)
    roll = die(size);
  }
  return roll;
}


function *parse_dice(dice_string) {
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
        n: parts[0] === "" ? 1 : (parts[0] === "-" ? -1 : parseInt(parts[0])),
        size: parseInt(parts[parts.length-1]),
      }
    }
  }
}

function roll_d20(bonus, advantage, disadvantage, annotated, rules, conditions) {
  let roll = die(20);
  let rolls = [roll]

  if (advantage && !disadvantage) {
    rolls.push(die(20));
    if (rules['Elven Accuracy'] || false) {
        rolls.push(die(20));
    }
    roll = Math.max(...rolls);
    annotated.push(`${rolls.length}d20 keep highest (${rolls.map(r => r == roll ? r : "~~" + r + "~~").join()})`);
  } else if (disadvantage && !advantage) {
    rolls.push(die(20))
    roll = Math.min(...rolls);
    annotated.push(`2d20 keep lowest (${rolls.map(r => r == roll ? r : "~~" + r + "~~").join()})`);
  } else {
    annotated.push(`1d20 (${rolls.join()})`);
  }

  let score = roll;
  // do this now before bless

  if (conditions.get('bless')) {
    let r = die(4);
    annotated.push(`+ 1d4 (${r})`);
    score += r;
  }
  else if (conditions.get('bane')) {
    let r = die(4);
    annotated.push(`- 1d4 (${-r})`);
    score -= r;
  }

  score += parseInt(bonus);
  annotated.push('+ ' + bonus)
  annotated.push('= ' + score)
  return {
    "score": score,
    "roll": roll,
  }
}

function roll_hit(attack, conditions, advantage, disadvantage, attack_options, rules) {
  let annotated = [];
  let critical_threshold = parseInt(rules['Improved Critical'] || '20');


  let {score, roll} = roll_d20(attack.tohit, advantage, disadvantage, annotated, rules, conditions);

  for (let [option, active] of attack_options) {
    if (active) {
      let condition_data = attack.conditions[option];
      if (condition_data.tohit) {
        let parts = Array.from(parse_dice(condition_data.tohit))
        for (let {n, size} of parts) {
          score += roll_dice(n, size, annotated);
        }
      }
      if (condition_data.rules) {
        if (condition_data.rules["Improved Critical"] || false) {
          critical_threshold = parseInt(condition_data.rules["Improved Critical"]) || critical_threshold
        }
      }
    }
  }

  return {
    miss: roll === 1,
    critical: roll >= critical_threshold,
    score: score,
    annotated: annotated,
  }
}


function roll_save(bonus, name, conditions) {
  let advantage = conditions.get('advantage');
  let disadvantage = conditions.get('disadvantage');
  let annotated = [];

  let {score, roll} = roll_d20(bonus, advantage, disadvantage, annotated, {}, conditions);

  let display_name = name.toUpperCase()
  let active = []
  let f = function(value, key, map) {
    if (value) { active.push(key[0].toUpperCase() + key.slice(1)); };
  }
  conditions.forEach(f)


  // gross
  return {
    attack: {tohit: "roll"},
    hit: {
      score: score,
      annotated: annotated,
    },
    save: display_name,
    text: display_name + " save of **" + score + "**",
    hit_details: '**Saving Throw**: ' + annotated.join(" "),
    conditions: active,
  }
}

class Damage {
  constructor(type, dice_string, rules) {
    this.type = type;
    this.dice_string = dice_string;
    this.parts = Array.from(parse_dice(dice_string));
    this.reroll = (r) => false

    rules = rules || {};

    if (rules['Great Weapon Fighting']) {
      this.reroll = (r) => r < 3
    } else if (rules['Damage Speciality']) {
      if (type in rules['Damage Speciality']) {
        this.reroll = (r) => r == 1
      }
    }
  }
  roll(critical) {
    let total = 0;
    let annotated = [];

    for (let {n, size} of this.parts) {
      total += roll_dice(n, size, annotated, critical, this.reroll)
    }
    return {
      type: this.type,
      total: total,
      half: Math.floor(total/2),  // for spells
      annotated: annotated,
    }
  }
}


function *roll_damage(damage_data, critical, weapon_type, rules) {
  for (let type in damage_data) {
    if (SKIPPED.has(type)) {
        continue;
    }
    var d = damage_data[type]
    if (type == "weapon") {
      type = weapon_type;
    }
    let damage = new Damage(type, d, rules)
    yield damage.roll(critical);
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




function roll_attack(attack, conditions, attack_options) {
  attack_options = attack_options || {};
  let advantage = conditions.get('advantage');
  let disadvantage = conditions.get('disadvantage');
  let autocrit = conditions.get('crit');
  let rules = attack.rules || {};
  let all_damage = new Map();
  let secondary_damage = new Map();
  let secondaries = new Map();
  let effects = new Map();
  let critical = false;
  let damage_critical = false;
  let main_critical = 0
  let hit = {
    miss: false,
    annotated: [],
  };

  // only roll attack if it is an actual attack
  if (attack.tohit) {
    hit = roll_hit(attack, conditions, advantage, disadvantage, attack_options, rules);
    if (autocrit || hit.critical) {
        damage_critical = 1;
        main_critical = 1 + (rules["Brutal Critical"] || 0)
    }
  }

  // use the first damage type as the weapon type.
  let weapon_damage_type = Object.keys(attack.damage)[0];
  let base_damage = Array.from(
    roll_damage(attack.damage, main_critical, weapon_damage_type, rules)
  );
  all_damage.set("Damage", base_damage);

  if (attack.damage.secondary) {
    secondaries.set("Damage", attack.damage.secondary);
  }


  if (attack.damage.effect) {
    effects.set("Damage", attack.damage.effect);
  }

  for (let [option, active] of attack_options) {
    if (active) {
      let attack_conditions = attack.conditions || {};
      let damage = attack_conditions[option];
      let condition_damage = Array.from(
        roll_damage(damage, main_critical, weapon_damage_type, rules)
      );
      // replace the base damage with this option
      if (damage.replace) {
        all_damage.set("Damage", condition_damage);
      }
      else {
        all_damage.set(option, condition_damage);
      }
      if (damage.secondary) {
        secondaries.set(option, damage.secondary);
      }
      if (damage.effect) {
        effects.set(option, damage.effect);
      }
    }
  }

  let damage = DamageResult(all_damage)

  if (secondaries.size > 0) {
    for (let [name, dam] of secondaries) {
      // TODO: does critical always affect secondary damage?
      let sec = Array.from(roll_damage(dam, damage_critical, weapon_damage_type, rules));
      sec.desc = dam.desc
      secondary_damage.set(name, sec)
    }
  }

  let active = Array.from(attack_options.keys());
  let f = function(value, key, map) {
    if (value) { active.push(key[0].toUpperCase() + key.slice(1)); };
  }
  conditions.forEach(f)

  let result = {
    attack: attack,
    hit: hit,
    damage: damage,
    secondary: secondaries.size > 0 ? DamageResult(secondary_damage) : null,
    effects: effects.size > 0 ? effects : null,
    conditions: active,
  }

  add_details_text(result)

  return result

}

function damage_types(types) {
  if (types.size == 1) {
    return mmap(types, (type, total) => `${type}`).join()
  } else {
    return mmap(types, (type, total) => `${total} ${type}`).join(", ")
  }
}


function add_details_text(result) {
  let {hit, damage, secondary, attack} = result
  let text = "";

  if (hit.miss) {
    text = "**Miss!**"
  }
  else if (hit.critical) {
    text = "**CRITICAL**: "
  }
  else if (attack.tohit === 'roll') {
    text = hit.score.toString()
  }
  else if (attack.tohit != undefined) {
    text = "Hits AC **" + hit.score + "** for"
  }

  if (damage && !hit.miss) {
    text += " **" + damage.total + "** damage"
  }

  if (hit.critical) {
    text += ". **Suck it Josh**"
  }

  result["text"] = text
  result["damage_types"] = '(' + damage_types(damage.types) + ')'

  if (result.attack.save) {
    let half_msg = result.attack.half !== false ? ` for half (${damage.half})` : ''
    result["save_text"] = `DC ${result.attack.save} save${half_msg}`;
  }

  if (attack.tohit != undefined) {
    result["hit_details"] = "**To Hit:** " + hit.annotated.join(" ");
  }

  let fmt = (condition, damages) => {
    let dam = damages.map((d) => `${d.annotated.join(" + ")} [${d.type}]`).join(' + ');
    if (dam) {
      let header = (condition == 'Damage') ? '' : ` (${condition})`;
      return `${dam}${header}`;
    }
  }

  if (damage) {
    result["damage_details"] = "**Damage:** " + mmap(damage.components || [], fmt).join(" + ") + " = " + damage.total;
  }

  if (secondary) {
    let secondary_types = damage_types(secondary.types)
    result["secondary_text"] = `${secondary.total} damage (${secondary_types})`
    result["secondary_details"] = "**Secondary:** " + mmap(secondary.components, fmt).join(" + ") + " = " + secondary.total
  }

}
