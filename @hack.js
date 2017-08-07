'use strict';

const { h, render, Component } = window.preact;

function compose_id(...fragments) {
  return fragments.map((f) => f.split(" ").join("_")).join("_");
}


const MapObject = (obj, f) => (
  Object.keys(obj).filter((k) => k !== "children")).map((k) => f(k, obj[k])
)

const DamageText = (damage) => (
  damage === undefined ? "" : Object.keys(damage).map((k => damage[k] + " " + k)).join(" + ")
)


class Party extends Component {
  constructor() {
    super();
    this.state.current = 0;
    this.state.log = [];
    this.state.result = {};
    this.record = this.record.bind(this);
    this.select = this.select.bind(this);
  }
  select(event) {
    this.setState({current: event.target.selectedIndex});
  }
  record(results, logmsg) {
    let new_state = this.state;
    new_state.result[this.state.current] = results;
    let msg = this.props[this.state.current].name + ": " + logmsg;
    new_state.log.unshift(msg);
    console.log(msg);
    this.setState(new_state);
  }
  render(players, {current, log}) {
    return h("main", null,
      h("nav", null,
        h("span", null, ">"),
        h("select", {onchange: (this.select)}, MapObject(players, (index, player) => h("option", null, player.name))),
      ),
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
    this.setState({conditions: new_conditions});
  }

  render_switch (id, text, checked, onclick) {
    return h("span", {"class": "condition " + (checked ? 'active' : ''), onclick: onclick}, text);
  }

  render({attack, player_name}) {
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
