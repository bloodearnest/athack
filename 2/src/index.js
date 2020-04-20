import '/web_modules/preact/debug.js';
import { h, Component, render, createContext } from '/web_modules/preact.js';
import { useState, useContext } from '/web_modules/preact/hooks.js';
import htm from '/web_modules/htm.js'

const html = htm.bind(h)
const map = (obj, func) => Object.entries(obj).map(([k, v]) => func(k, v))

const CAMPAIGNS = {
    toa: {
      name: "Tomb of Annihilation",
      characters: ["Airnel", "Areni", "Grondrath"],
    },
    wm: {
      name: "West Marches",
      characters: ["Jerem", "The Count"]
    },
}

const CHARACTERS = {
    "Airnel": {},
    "Areni": {},
    "Grondrath": {},
    "Jerem": {},
    "The Count": {},
}


const MODIFIERS = {
    "Bless": {hit: '1d4', save: '1d4'},
    "Bane":  {hit: '-1d4', save: '-1d4'},
    "Synaptic Static": {hit: '-1d6'},
    "Enlarge": {damage: '1d4'},
    "Reduce": {damage: '-1d4'},
    "Poisoned": {hit: 'dis'},
    "Restrained": {hit: 'dis'},
    "Prone": {hit: 'dis'},
    "Frightened": {hit: 'dis'},
}

const MOD_GROUPS = {
    "Spells": ["Bless", "Bane", "Synaptic Static", "Enlarge", "Reduce"],
    "Conditions": ["Poisoned", "Restrained", "Prone", "Frightened"],
}

const CharacterContext = createContext();

function getCharacter() {
  const context = useContext(CharacterContext)
  if (!context) {
    throw new Error(`getCharacter must be used within a CharacterProvider`)
  }
  return context
}

function useCharacterState(name, initial) {
  const [state, setState] = useState({})

  const set = (value) => {
    let new_state = {...state}
    new_state[name] = value
    setState(new_state)
  }

  if (name in state) {
    return [state[name], set]
  } else {
    return [initial, set]
  }
}

function CharacterProvider(props) {
  let initialGroup = null
  let initialName = null
  if (location.hash) {
     [initialGroup, initialName] = location.hash.split('/')
  }
  const [group, setGroup] = useState(initialGroup);
  const [name, setName] = useState(initialName);
  const [conditions, setConditions] = useCharacterState(name, [])
  const data = CHARACTERS[name] || {}

  const setNameAndHash = (name, group) => {
    setName(name)
    setGroup(name)
    location.hash = group + '/' + name
  }

  const contextValue = {
      group: group,
      name: name,
      data: data,
      conditions: conditions,
      setCharacter: setNameAndHash,
      setConditions: setConditions
  }
  return html`<${CharacterContext.Provider} value=${contextValue} ...${props} />`
}

const CharacterSelector = function() {
    let {name, setCharacter} = getCharacter()

    const set = (e) => {
        setCharacter(e.target.value, e.target.selectedOptions[0].parentNode.dataset.id)
    }

    let optionGroups = [html`<option value="">Choose character...</option>`];
    for (let [id, data] of Object.entries(CAMPAIGNS)) {
        let options = data.characters.map((c) => html`<option value="${c}">${c}</option>`)
        optionGroups.push(html`<optgroup data-id=${id} label=${data.name}>Campaign: ${options}</optgroup>`)
    }

    return html`
        <section id="selector">
            <select value=${name} onChange=${set}>${optionGroups}</select>
        </section>
    `
}

const Character = function() {
    let {name} = getCharacter()
    if (!name) {
        return null;
    }
    return html`
        <section id="character">
            <${ConditionsBar}/>
            <${Attacks}/>
            <${Result}/>
        </section>
    `
}


const ConditionTag = function({condition}) {
    let {conditions, setConditions} = getCharacter()
    let remove = (e) => {
        setConditions(conditions.filter((c) => c != condition))
    }
    return html`
        <span class=condition>
            <span>${condition}</span>
            <button onClick=${remove}>X</button>
        </span>
    `

}

const ConditionsBar = function() {
    let {conditions, setConditions} = getCharacter()

    let optionGroups = [html`<option value="">Add Condition...</option>`]
    for (let [k, v] of Object.entries(MOD_GROUPS)) {
        let valid = v.filter((o) => !conditions.includes(o))
        if (valid.length == 0) {
            continue
        }
        let options = valid.map((o) => html`<option value=${o}>${o}</option>`)
        optionGroups.push(html`<optgroup label=${k}>${options}</optgroup>`)
    }
    let add = (e) => {
        setConditions([...conditions, e.target.value])
        e.preventDefault()
    }
    return html`
        <section id=condition>
            ${conditions.map((c) => html`<${ConditionTag} condition=${c}/>`)}
            <select value="" onChange=${add}>${optionGroups}</select>
        </section>
    `
}


const Attacks = function() {
    return html`
        <section id=attacks>
            Attacks here
        </section>
    `
}

const Result = function() {
    return html`
        <section id=result>
            Result Here
        </section>
    `
}

const AtHack = function() {
    return html`
        <${CharacterProvider}>
            <${CharacterSelector}/>
            <${Character}/>
        </${CharacterProvider}>
    `
}

const app = html`<${AtHack}/>`

render(app, document.body);
