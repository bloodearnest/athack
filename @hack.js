'use strict';

const { h, render, Component } = window.preact;


const DICE_SOUNDS = [
  new Audio("sounds/roll.mp3"),
  new Audio("sounds/roll2.mp3"),
];

function play_dice_sound() {
  DICE_SOUNDS.forEach(s => s.pause());
  let sound = DICE_SOUNDS[Math.floor(Math.random() * DICE_SOUNDS.length)];
  sound.currentTime = 0;
  sound.play();
}

function compose_id(...fragments) {
  return fragments.map((f) => f.split(" ").join("_")).join("_");
}

// oh ffs, javascript. This should not be necessary.
function mmap(map, func) {
  return Array.from(map.entries()).map(([key, value]) => func(key, value));
}


const MapObject = (obj, f) => (
  Object.keys(obj).filter((k) => k !== "children")).map((k) => f(k, obj[k])
)

const DamageText = (damage) => {
  if (damage) {
    return Object.keys(damage).filter((k) => !SKIPPED.has(k)).map((k => damage[k] + " " + k)).join(" + ");
  }
  return "";
}

const log_message = (name, result) => {
  return name + ": " + result.total;
}

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
    location.hash = event.target.options[event.target.selectedIndex].text
  }
  componentWillMount() {
    let p = this.props;
    if (location.hash) {
      for (var i in p) {
        console.log(i);
        console.log(p[i].name);
        console.log(location.hash);
        if ('#' + p[i].name == location.hash) {
          this.setState({current: i});
          break;
        }
      }
    }
  }
  record(result) {
    let new_state = this.state;
    new_state.result[this.state.current] = result;
    let msg = log_message(this.props[this.state.current].name, result);
    new_state.log.unshift(msg);
    console.log(msg);
    this.setState(new_state);
  }
  render(players, {current, log}) {
    return h("main", null,
      h("nav", null,
        h("span", null, ">"),
        h("select", {onchange: this.select}, MapObject(players, (index, player) => h("option", index == current ? {selected: true} : null, player.name))),
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
    return h("section", {"class": "player", id: compose_id(player.name, 'id')},
      Array.from(this.generate_attacks(player.attacks)),
      result.hit ? h(Result, {result: result, key: result}) : h('div', {'class': 'result'}),
    );
  }
}


class Result extends Component {
  constructor() {
    super();
    this.state.details = false;
    this.toggle = this.toggle.bind(this);
    this.secondary = this.secondary.bind(this);
  }

  toggle() {
    this.setState({details: !this.state.details});
  }

  resultPart(text) {
    return h('span', {"class": "result-part"}, text);
  }

  details(hit, damage, secondary, attack) {

    let hit_details = attack.save ? null : `(${hit.rolls.join()}) + ${hit.mods.join(' + ')}`;

    let fmt = (condition, damages) => {
      let dam = damages.map((d) => `${d.annotated.join(" + ")} ${d.type}`).join(', ');
      return `${condition}: ${dam}`;
    }

    let damage_text = mmap(damage.components, fmt).map((d) => h('p', null, d));

    if (secondary) {
       damage_text = damage_text.concat(mmap(secondary.components, fmt).map((d) => h('p', null, 'Secondary ' + d)));
    }

    return h('div', {'class': 'details ' + (this.state.details ? 'show' : 'hide')},
      hit_details ? h('p', null, "Hit: " + hit_details) : null,
      damage_text,
    );
  }

  secondary(damage) {
    return h('div', {'class': 'secondary'},
      `Secondary: ${damage.total} damage`,
      this.typeSummary(damage.types),
      damage.desc || "",
    );
  }

  half_damage(damage, attack) {
    return h('div', {class: 'half-damage'}, this.resultPart(`DC ${attack.save} save for half (${damage.half})`));
  }

  effects(effects) {
    return h('div', {class: 'effects'},
        mmap(effects, (src, effect) => this.resultPart(effect)));
  }

  typeSummary(types) {
    let type_fmt = types.size == 1 ? (type, total) => `${type}` : (type, total) => `${total} ${type}`;
    return h('span', {'class': 'type'}, "(",  mmap(types, type_fmt).join(", "), ")");
  }

  render({result}) {
    let {hit, damage, secondary, effects, attack} = result;

    let hit_result = null;
    if (hit.miss) {
      hit_result = this.resultPart("Miss!");
    }
    else if (hit.critical) {
      hit_result = this.resultPart("CRITICAL:");
    }
    else if (attack.save === undefined) {
      hit_result = this.resultPart("Hit " + hit.score + " for");
    }

    return h('div', {"class": "result", onclick: this.toggle},
      h('div', {'class': 'summary'},
        hit_result,
        hit.miss ? "" : this.resultPart(damage.total + " damage"),
        hit.miss ? "" : this.typeSummary(damage.types)),
      attack.save ? this.half_damage(damage, attack) : "",
      secondary && !hit.miss ? this.secondary(secondary) : "",
      effects && !hit.miss ? this.effects(effects) : "",
      this.details(hit, damage, secondary, attack),
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
    play_dice_sound();
    let result = roll_attack(
      this.props.attack,
      this.state.advantage,
      this.state.disadvantage,
      this.state.autocrit,
      this.state.conditions,
    );
    this.props.record(result);
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
    let modifier_elements = []

    if (attack.tohit) {
      modifier_elements = [
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
          () => this.setState({disadvantage: !this.state.disadvantage}),
        ),
        this.render_switch(
          compose_id(player_name, attack.name, 'autocrit'),
          'Autocrit',
          this.state.autocrit,
          () => this.setState({autocrit: !this.state.autocrit}),
        )
      ];
    }

    return h("article", {id: id, class: "attack"},
      h("span", {"class": "text"},
        h("p", {"class": "name"}, attack.name),
        h("p", {"class": "description"}, AttackDescription(attack)),
      ),
      h("span", {"class": "buttons"},
        h("span", {"class": "conditions"}, condition_elements),
        h("span", {"class": "conditions"}, modifier_elements),
        h("span", {"class": "action noselect", onclick: this.roll}, "@"),
      )
    );
  }
}

const AttackDescription = function(attack) {
  let description = [];

  if (attack.tohit) {
    description.push(`+${attack.tohit} to hit`);
  } else if (attack.save) {
    description.push(`DC ${attack.save}`)
  }

  description.push(DamageText(attack.damage));

  if (attack.damage.secondary) {
      description.push('Secondary: ' + DamageText(attack.damage.secondary));
  }
  if (attack.rules) {
    description.push(Object.keys(attack.rules).join(', '));
  }
  return description.join(", ");
};
