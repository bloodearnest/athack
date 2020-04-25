import '/web_modules/preact/debug.js';
import { h, render, createContext } from '/web_modules/preact.js';
import { useState, useContext, useRef, useEffect } from '/web_modules/preact/hooks.js';
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


// helper to remove an item from the supplied array and set it as new state
function removeFromListState(list, set) {
    return (item) => set(list.filter(i => i != item))
}

// helper to add an item to the supplied array and set it as new state
function addToListState(list, set) {
    return (item) => set([...list, item])
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
    const [filter, setFilter] = useCharacterState(name, null)
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
        filter: filter,
        setCharacter: setNameAndHash,
        setFilter: setFilter,
        addCondition: addToListState(conditions, setConditions),
        removeCondition: removeFromListState(conditions, setConditions),
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
        <section id=selector class=row>
            <label for=character>
                <select name=character value=${name} onChange=${set}>${optionGroups}</select>
            </label>
        </section>
    `
}

const ConditionTag = function({condition}) {
    let {removeCondition} = getCharacter()
    return html`<span class="condition button on" onClick=${e =>removeCondition(condition)}>${condition}</span>`

}

const ConditionsBar = function() {
    const ref = useRef()
    const {conditions, addCondition} = getCharacter()
    const [active, setActive] = useState(false)

    const cls = (active ? 'on' : 'off')
    const show = (e) => { setActive(true) }
    const select = (e) => {
        addCondition(e.target.dataset.value)
        setActive(false)
    }
    const close = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setActive(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', close, false)
        return () => { document.removeEventListener('mousedown', close, false) }
    })

    let options = []
    for (let [k, v] of Object.entries(MOD_GROUPS)) {
        let valid = v.filter((o) => !conditions.includes(o))
        if (valid.length == 0) {
            continue
        }
        options.push(html`<li class=group>${k}</li>`)
        valid.forEach((o) => options.push(html`<li data-value=${o} onClick=${select}>${o}</li>`))
    }
    return html`
        <section id=conditions>
            <nav class="dropdown button" ref=${ref}>
                <ul class="popup ${cls}">${options}</ul>
                <span class="${cls}" onClick=${show}>+</span>
            </nav>
            ${conditions.map((c) => html`<${ConditionTag} condition=${c}/>`)}
        </section>
    `
}

const FILTERS = [
    'Melee',
    'Range',
    'Spell',
    'AoE',
];


const FilterBar = function() {
    const {filter, setFilter} = getCharacter()
    let filters = FILTERS.map((f) => {
        const active = f == filter
        const handler = active ? e => setFilter(null) : e => setFilter(f)
        return html`
            <span class="filter button ${active ? "on" : "off"}" onClick=${handler}>${f}</span>`
    })
    return html` <section id=filters class=row>${filters}</section>`
}

const Damage = function({damage}) {
    let damages = []
    for (const [k, v] of Object.entries(damage)) {
        damages.push(html`<span class=damage data-type=${k}>${v} ${k}</span>`)
    }
    return damages
}

const AttackOption = function({name, option, active, add, remove}) {
    const toggle = active ? remove : add
    const handler = (e) => toggle(name)
    return html`
        <div class=option>
            <span class="button ${active ? 'on' : 'off'}" onClick=${handler}>${name}</span>
            <span class=info><${Damage} damage=${option.damage}/></span>
        </div>
    `

}

const AttackDetails = function({name, attack, active, setActive}) {
    const ref = useRef()
    const [options, setOptions] = useState([])

    const close = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setActive(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', close, false)
        return () => { document.removeEventListener('mousedown', close, false) }
    })

    const click = e => {
        e.preventDefault();
        return false;
    }

    let details = [];
    let add = (cls, hdr, content) => details.push(html`
        <div class="detail ${cls}">
            <span class=header>${hdr}: </span>
            <span class=value>${content}</span>
        </div>
    `)
    let half = (attack.half || true) ? ' for half' : '';
    if (attack.tohit)  { add('tohit', 'To Hit', `${attack.tohit}`) }
    if (attack.save)   { add('save',  'Save',   `${attack.save}${half}`) }
    if (attack.range)  { add('range', 'Range',  `${attack.range}`) }
    if (attack.damage) { add('damage','Damage', html`<${Damage} damage=${attack.damage}/>`) }
    if (attack.effect) { add('effect','Effect', `${attack.effect}`) }


    const removeOpt = removeFromListState(options, setOptions)
    const addOpt = opt => {
        let temp = options
        if (attack.options[opt].type == 'spell slot') {
            // deselect all other spell slot options
            const selector = ([k, v]) => k != opt && v['type'] == 'spell slot'
            const toRemove = Object.entries(attack.options).filter(selector)
            temp = options.filter(o => toRemove.includes(o))
        }
        setOptions([...temp, opt])
    }

    let opts = map(attack.options, (n, o) => {
        return html`
            <${AttackOption} name=${n} option=${o} active=${options.includes(n)} add=${addOpt} remove=${removeOpt}/>`
    })

    return html`
    <div class="details popup ${active ? 'on' : 'off'}" ref=${ref} onClick=${click}>
        <div class=name>${name}</div>
        ${details}
        <div class=options>${opts}</div>
    </div>`

}

const Attack = function({name, attack}) {
    const [active, setActive] = useState(false)
    return html`
        <div class="attack ${active ? 'on' : 'off'}">
            <span class=name onClick=${e => setActive(true)}>${name}</span>
            <${AttackDetails} active=${active} setActive=${setActive} name=${name} attack=${attack}/>
        </div>
    `
}

const Attacks = function() {
    const {attacks, filter} = getCharacter()

    let selected = ([n, a]) => !filter || a.types.includes(filter)

    let elements = []
    for (let [name, attack] of Object.entries(attacks).filter(selected)) {
        elements.push(html`<${Attack} name=${name} attack=${attack}/>`)
    }

    return html`
        <section id=attacks>
            ${elements}
        </section>
    `
}

const Result = function() {
    return html`
        <section id=result class=row>
        </section>
    `
}

const AtHack = function() {
    return html`
        <${CharacterProvider}>
            <${CharacterSelector}/>
            <${ConditionsBar}/>
            <${FilterBar}/>
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
