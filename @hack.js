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
  constructor(props) {
    super(props);

    let characters = {};
    for (const name of Object.keys(props))
    {
      characters[name] = {
        conditions: new Map(),
        result: {},
      };
      CONDITIONS.forEach(c => characters[name].conditions.set(c, false));
    };

    this.setState({
      current: null,
      log: [],
      characters: characters
    });

    this.record = this.record.bind(this);
    this.select = this.select.bind(this);
    this.toggle_condition = this.toggle_condition.bind(this);
  }
  select(event) {
    let character_name = event.target.options[event.target.selectedIndex].text
    this.setState({current: character_name});
    location.hash = character_name;
  }
  componentWillMount() {
    if (location.hash) {
      this.setState({current: location.hash.slice(1)});
    } else {
      this.setState({current: Object.keys(this.props)[0]});
    }
  }
  record(result) {
    let new_state = this.state;
    new_state.characters[this.state.current].result = result;
    let msg = log_message(this.props[this.state.current].name, result);
    new_state.log.unshift(msg);
    console.log(msg);
    this.setState(new_state);
  }
  toggle_condition(condition) {
    let new_state = this.state;
    let condition_state = new_state.characters[this.state.current].conditions.get(condition)
    new_state.characters[this.state.current].conditions.set(condition, !condition_state);
    this.setState(new_state);
  }
  render(characters, {current, log}) {
    return h("main", null,
      h("nav", {"class": "character-selector"},
        h("span", null, ">"),
        h("select", {onchange: this.select}, Object.keys(characters).filter(n => n != 'children').map(name => h("option", name == current ? {selected: true} : null, name))),
      ),
      h(Character, {
        character: characters[current],
        name: current,
        state: this.state.characters[current],
        record: this.record,
        toggle_condition: this.toggle_condition,
      }),
      h("ul", {id: "log"}, log.map((l) => h("li", null, l))),
    );

  }
}

class Character extends Component {
  // workaround for only being able to render single nodes.
  *generate_attacks(name, attacks, conditions, options) {
    for (let attack of attacks) {
      yield h(Attack, {
        // key is important, or else components are reused based on index
        key: compose_id(name, attack.name),
        id: compose_id(name, attack.name),
        attack: attack,
        character_name: name,
        record: this.props.record,
        conditions: conditions,
      });
    }
  }
  render({character, name, state, toggle_condition}) {
    return h("section", {"class": "character", id: compose_id(name, 'id')},
      h(Conditions, {name: name, conditions: state.conditions, toggle: toggle_condition}),
      Array.from(this.generate_attacks(name, character.attacks, state.conditions, character.options)),
      state.result.hit ? h(Result, {result: state.result, key: state.result}) : h('div', {'class': 'result'}),
    );
  }
}

// global character affecting conditions
const CONDITIONS = [
  'advantage',
  'disadvantage',
  'crit',
  'bless',
];

class Conditions extends Component {
  *generate_conditions(name) {
    for (let condition of this.props.conditions.keys()) {
      yield Switch(
        compose_id(name, 'options', condition),
        condition,
        this.props.conditions.get(condition),
        () => this.props.toggle(condition),
      )
    }
  }
  render({name}) {
    return h(
      "div",
      {"class": "character-conditions buttons", id: compose_id(name, 'options', 'id')},
      Array.from(this.generate_conditions(name))
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

    let hit_details = null;
    if (attack.save == undefined) {
      hit_details = hit.annotated.join(" + ");
    }

    let fmt = (condition, damages) => {
      let dam = damages.map((d) => `${d.annotated.join(" + ")} ${d.type}`).join(', ');
      if (dam) {
        return `${condition}: ${dam}`;
      }
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
      (attack.save && (attack.half !== false)) ? this.half_damage(damage, attack) : "",
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
      this.props.conditions,
      this.state.conditions,
    );
    this.props.record(result);
  }

  toggle_condition(condition) {
    let new_state = this.state;
    let condition_state = !(this.state['conditions'].get(condition));
    new_state['conditions'].set(condition, condition_state);
    this.setState(new_state);
  }

  render({attack, character_name}) {
    let id = compose_id(character_name, attack.name);
    let conditions = attack.conditions || {};
    let condition_elements = Object.keys(conditions).map((c) => (
          Switch(
            compose_id(character_name, attack.name, c),
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

const Switch = function(id, text, checked, onclick) {
  return h("span", {"class": "condition " + (checked ? 'active' : ''), onclick: onclick}, text);
}


