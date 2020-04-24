import '/web_modules/preact/debug.js';
import { h, render, createContext } from '/web_modules/preact.js';
import { useState, useContext } from '/web_modules/preact/hooks.js';
import htm from '/web_modules/htm.js'
import {readCharacters} from '/src/data.js'

const html = htm.bind(h)
const map = (obj, func) => Object.entries(obj).map(([k, v]) => func(k, v))

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
  const attacks = CHARACTERS.attacks[name] || {}

  const setNameAndHash = (name, group) => {
    setName(name)
    setGroup(name)
    location.hash = group + '/' + name
  }

  const contextValue = {
      group: group,
      name: name,
      attacks: attacks,
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
    for (let [id, campaign] of Object.entries(CHARACTERS.campaigns)) {
        let options = map(campaign.characters, (c, _) => html`<option value="${c}">${c}</option>`)
        optionGroups.push(html`<optgroup data-id=${id} label=${campaign.name}>Campaign: ${options}</optgroup>`)
    }

    return html`
        <section id="selector">
            <select value=${name} onChange=${set}>${optionGroups}</select>
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

const AttackSummary = function({name, attack}) {
    return html`
        <div class=attack-summary>
            <span class=name>${name}</span>
            <span class=type>${attack.types}</span>
            <span class=tohit>${attack.tohit}</span>
        </div>
    `
}


const Attacks = function() {
    const {attacks} = getCharacter()

    let elements = []
    for (let [name, attack] of Object.entries(attacks)) {
        elements.push(html`<${AttackSummary} name=${name} attack=${attack}/>`)
    }

    return html`
        <section id=attacks>
            ${elements}
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
            <${ConditionsBar}/>
            <${Attacks}/>
            <${Result}/>
        </${CharacterProvider}>
    `
}

let CHARACTERS = null
readCharacters().then((data) => {
    CHARACTERS = data;
    const app = html`<${AtHack}/>`
    render(app, document.body);
})
