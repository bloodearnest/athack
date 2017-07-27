'use strict';

const { h, render, Component } = (window || global).preact;

function compose_id(...fragments) {
  return fragments.map((f) => f.split(" ").join("_")).join("_");
}


const MapObject = (obj, f) => (
  Object.keys(obj).filter((k) => k !== "children")).map((k) => f(k, obj[k])
)

const DamageText = (damage) => (
  damage === undefined ? "" : Object.keys(damage).map((k => damage[k] + " " + k)).join(" + ")
)


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
  let fmt_logmsg  = ({total, type, text, rolls}) => `${text} (${rolls.join()}) = ${total} ${type}`;
  if (values.length === 1) {
    let summary = grand_total + " " + values[0]["type"] + " damage";
    return {
      summary: summary,
      logmsg: summary + " (" + values.map(fmt_logmsg).join(", ") + ")",
    };
  } else {
    return {
      summary: grand_total + " damage (" + values.map(fmt_summary).join(", ") + ")",
      logmsg: grand_total + " damage (" + values.map(fmt_logmsg).join(", ") + ")",
    };
  }
}

class Party extends Component {
  constructor() {
    super();
    this.state.current = 0;
    this.state.log = [];
    this.state.result = {};
    this.record = this.record.bind(this);
  }
  record(results, logmsg) {
    let new_state = this.state;
    new_state.result[this.state.current] = results;
    new_state.log.unshift(this.props[this.state.current].name + ": " + logmsg);
    this.setState(new_state);
  }
  render(players, {current, log}) {
    return h("main", null,
      h("nav", null, MapObject(players, (index, player) => h("label", {"class": current == index ? "current" : "", onclick: () => {this.setState({current: index});}}, player.name))),
      h(Player, {player: players[current], result: this.state.result[this.state.current] || [], record: this.record}),
      h("ul", {id: "log"}, log.map((l) => h("li", null, l))),
    );

  }
}

class Player extends Component {
  // workaround for only being able to render single nodes.
  *generate_attacks(attacks) {
    for (let attack of attacks) {
      yield h(Attack, {
        // key is important, or else components are reused based on index
        key: compose_id(this.props.player.name, attack.name),
        id: compose_id(this.props.player.name, attack.name),
        attack: attack,
        player_name: this.props.player.name,
        record: this.props.record
      });
    }
  }
  render({player, result}) {
    return h("section", {"class": "player", id: compose_id(player.name)},
      Array.from(this.generate_attacks(player.attacks)),
      h("div", {"class": "result"}, result.map((r) => h("p", null, r))),
    );
  }
}

class Attack extends Component {
  constructor() {
    super();
    this.setState({
      advantage: false,
      disadvantage: false,
      autocrit: false,
      conditions: new Map(),
    });
    console.log('reset state');

    this.roll = this.roll.bind(this);
    this.toggle_condition = this.toggle_condition.bind(this);
  };
  roll(ev) {
    ev.preventDefault();
    let {results, log} = roll_attack(
      this.props.attack,
      this.state.advantage,
      this.state.disadvantage,
      this.state.autocrit,
      this.state.conditions,
    );
    this.props.record(results, log);
  }

  toggle_condition(condition) {
    let new_conditions = this.state.conditions;
    new_conditions.set(condition, !new_conditions.get(condition));
    console.log(new_conditions);
    this.setState({conditions: new_conditions});
  }

  render_switch (id, text, checked, onclick) {
    return h("span", {"class": "condition " + (checked ? 'active' : ''), onclick: onclick}, text);
  }

  render({attack, player_name}) {
    console.log('render');
    console.log(this.state.conditions);
    let id = compose_id(player_name, attack.name);
    let conditions = attack.conditions || {};
    let condition_elements = Object.keys(conditions).map((c) => (
          this.render_switch(
            compose_id(player_name, attack.name, c),
            c,
            this.state.conditions.get(c),
            () => this.toggle_condition(c),
            )
          ));
    return h("article", {id: id, class: "attack"},
      h("span", {"class": "text"},
        h("p", {"class": "name"}, attack.name),
        h("p", {"class": "description"}, AttackDescription(attack)),
      ),
      h("span", {"class": "buttons"},
        h("span", {"class": "conditions"}, condition_elements),
        h("span", {"class": "conditions"},
          this.render_switch(
            compose_id(player_name, attack.name, 'advantage'),
            'Advantage',
            this.state.advantage,
            () => this.setState({advantage: !this.state.advantage})
            ),
          this.render_switch(
            compose_id(player_name, attack.name, 'disadvantage'),
            'Disadvantage',
            this.state.disadvantage,
            () => this.setState({disadvantage: !this.state.disadvantage})
            ),
          this.render_switch(
            compose_id(player_name, attack.name, 'autocrit'),
            'Autocrit',
            this.state.autocrit,
            () => this.setState({autocrit: !this.state.autocrit})
            ),
        ),
        h("span", {"class": "action", onclick: this.roll}, "@"),
      )
    );
  }
}

const AttackDescription = function({tohit, damage, secondary, rules}) {
  let description = [`+${tohit} to hit, ${DamageText(damage)}`];
  if (rules) {
    description.push(Object.keys(rules).join());
  }
  if (secondary) {
    description.push(DamageText(secondary) + " secondary");
  }
  return description.join(", ");
};
