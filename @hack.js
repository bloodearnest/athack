'use strict';

const { h, render, Component } = window.preact;


const DICE_SOUNDS = [
  new Audio("sounds/roll.mp3"),
  new Audio("sounds/roll2.mp3"),
];

const SWORD_SOUNDS = [
  new Audio("sounds/Princess+Bride+Sword.mp3"),
  new Audio("sounds/steelsword.mp3"),
  new Audio("sounds/Sword1.mp3"),
  new Audio("sounds/swordecho.mp3"),
  new Audio("sounds/swordraw.mp3"),
];

const RANGED_SOUNDS = [
  new Audio("sounds/throwknife.mp3"),
  new Audio("sounds/934369_SOUNDDOGS__fi.mp3"),
  new Audio("sounds/934378_SOUNDDOGS__fi.mp3"),
  new Audio("sounds/934380_SOUNDDOGS__fi.mp3"),
];

const SPELL_SOUNDS = [
  new Audio("sounds/270395__littlerobotsoundfactory__spell-04.wav"),
  new Audio("sounds/270396__littlerobotsoundfactory__spell-01.wav"),
  new Audio("sounds/270397__littlerobotsoundfactory__spell-02.wav"),
];

function say(phrase) {
  let utterance = new SpeechSynthesisUtterance(phrase);
  speechSynthesis.speak(utterance);
}


function play_random_sound(sounds) {
  sounds.forEach(s => s.pause());
  let sound = sounds[Math.floor(Math.random() * sounds.length)];
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
      let id = compose_id(name, attack.name)
      yield h(Attack, {
        // key is important, or else components are reused based on index
        key: id,
        id: id,
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
      h(Saves, {
        name: name,
        saves: character.saves,
        record: this.props.record,
        conditions: state.conditions,
      }),
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

class Saves extends Component {
  constructor() {
    super();
    this.roll = this.roll.bind(this);
  }

  *generate_saves(saves, keys) {
    for (let i = 0; i < keys.length; i++) {
      let save = keys[i]
      yield h("span", {"class": "save buttons"},
        h("span", {"class": "attr"}, save, ' ', saves[save].toString()),
        h("span", {"class": "action noselect", onclick: (ev) => this.roll(ev, save)}, "S"),
      )
    }
  }
  roll(ev, save) {
    let bonus = this.props.saves[save]
    let result = roll_save(bonus, save, this.props.conditions)
    if (result.text) {
      say(result.text)
    }
    this.props.record(result)
  }
  render({name, saves}) {
    return h(
      "div",
      {"class": "character-saves buttons", id: compose_id(name, 'saves', 'id')},
      h("div", null, Array.from(this.generate_saves(saves, ["Str", "Int"]))),
      h("div", null, Array.from(this.generate_saves(saves, ["Dex", "Wis"]))),
      h("div", null, Array.from(this.generate_saves(saves, ["Con", "Cha"]))),
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
    if (attack.tohit != undefined) {
      hit_details = hit.annotated.join(" + ");
    }

    let fmt = (condition, damages) => {
      let dam = damages.map((d) => `${d.annotated.join(" + ")} ${d.type}`).join(', ');
      if (dam) {
        return `${condition}: ${dam}`;
      }
    }

    let damage_text = ""

    if (damage) {
      damage_text = mmap(damage.components || [], fmt).map((d) => h('p', null, d));

      if (secondary) {
        damage_text = damage_text.concat(mmap(secondary.components, fmt).map((d) => h('p', null, 'Secondary ' + d)));
      }
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

  save_damage(half, damage, attack) {
    let half_msg = half !== false ? ` for half (${damage.half})` : ''
    return h('div', {class: 'half-damage'}, this.resultPart(`DC ${attack.save} save${half_msg}`));
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
    let {hit, damage, secondary, effects, attack, text} = result;

    let hit_info = [this.resultPart(text)]
    if (damage && !hit.miss) {
      //hit_info.push(this.resultPart(damage.total + " damage"))
      hit_info.push(this.typeSummary(damage.types))
    }

    return h('div', {"class": "result", onclick: this.toggle},
      h('div', {'class': 'summary'}, hit_info),
      (attack.save ? this.save_damage(attack.half, damage, attack) : ""),
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
    let result = roll_attack(
      this.props.attack,
      this.props.conditions,
      this.state.conditions,
    );
    let sounds = this.props.attack.sounds || SWORD_SOUNDS;
    play_random_sound(sounds);
    if (result.text) {
      say(result.text)
    }
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


