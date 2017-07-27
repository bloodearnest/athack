'use strict';

function d(size) {
  return Math.floor(Math.random() * (size)) + 1;
}

function gwf_d(size) {
  let roll = d(size);
  if (roll < 3) {
    roll = d(size);
  }
  return roll;
}

function roll_hit(bonus, advantage, disadvantage, rules) {
  let hit = d(20);
  let rolls = [hit];
  if (advantage && !disadvantage) {
    rolls.push(d(20));
    hit = Math.max(...rolls);
  } else if (disadvantage && !advantage) {
    rolls.push(d(20))
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

function *roll_damage(damage, critical, rules) {
  for (let typ in damage) {
    let dam = damage[typ];
    let total = 0;
    let tokens = dam.split('+').map((s) => s.trim());
    let rolls = [];
    let roll_text = [];

    for (let token of tokens) {
      let parts = token.split('d');

      if (parts.length === 1) {
        total += parseInt(parts[0]);
        roll_text.push(parts[0]);
      } else {
        let n = parts[0] === "" ? 1 : parseInt(parts[0]);
        let size = parseInt(parts[parts.length-1]);
        let die = rules["Great Weapon Fighting"] ? gwf_d : d;
        if (critical) {
          // TODO: max crit house rule
          n *= 2;
        }
        for (let i = 0; i < n; i++) {
          let roll = die(size);
          total += roll;
          rolls.push(roll);
        }
        roll_text.push(n + "d" + size);
      }
    }
    yield {
      type: typ,
      total: total,
      rolls: rolls,
      text: roll_text.join("+"),
    }
  }
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

  let damage_critical = autocrit || critical;
  let base_damage = Array.from(roll_damage(damage, damage_critical, rules));
  let all_damage = [base_damage];

  for (let [condition, active] of conditions) {
    if (active) {
      let attack_conditions = attack.conditions || {};
      let condition_damage = Array.from(
        roll_damage(attack_conditions[condition], damage_critical, rules)
      );
      all_damage.push(condition_damage);
    }
  }

  let {summary, logmsg} = DamageResult(all_damage);
  let hit = critical ? "💪 CRITICAL HIT! " : `Hit ${score} `;
  let log = `${hit} (${rolls.join()}) for ${logmsg}`;
  let results = [`${hit} for ${summary}`]

  if (secondary) {
    let secondary_damage = Array.from(roll_damage(secondary, damage_critical, rules));
    let {summary, logmsg} = DamageResult([secondary_damage]);
    results.push(`Secondary damage: ${summary}`);
    log += `, secondary damage: ${logmsg}`;
  }

  return {
    results: results,
    log: log,
  };
}
