import '/web_modules/preact/debug.js';
import { h, render, createContext } from '/web_modules/preact.js';
import { useState, useContext, useRef, useEffect } from '/web_modules/preact/hooks.js';
import htm from '/web_modules/htm.js'

const html = htm.bind(h)
const map = (obj, func) => Object.entries(obj).map(([k, v]) => func(k, v))
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
        initialName = initialName.replace('-', ' ')
    }
    const [group, setGroup] = useState(initialGroup);
    const [name, setName] = useState(initialName);
    const [conditions, setConditions] = useCharacterState(name, [])
    const [filter, setFilter] = useCharacterState(name, null)
    const [activeType, setActiveType] = useCharacterState(name, 'Attacks')
    const attacks = props.characters.attacks[name] || {}

    const setNameAndHash = (name, group) => {
        setName(name)
        setGroup(group)
        location.hash = group + '/' + name.replace(' ', '-')
    }

    const contextValue = {
        group: group,
        name: name,
        attacks: attacks,
        conditions: conditions,
        filter: filter,
        activeType: activeType,
        setActiveType, setActiveType,
        setCharacter: setNameAndHash,
        setFilter: setFilter,
        addCondition: addToListState(conditions, setConditions),
        removeCondition: removeFromListState(conditions, setConditions),
    }
    return html`<${CharacterContext.Provider} value=${contextValue} ...${props} />`
}

function useClickOutside(ref, handler) {
    const close = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            handler()
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', close, false)
        return () => { document.removeEventListener('mousedown', close, false) }
    })
}

const Modal = function(props) {
    const ref = useRef()
    const [visible, setVisible] = useState(false)
    const hide = (e) => {
        setVisible(false)
    }
    useClickOutside(ref, hide)
    const show = () => setVisible(true);
    const cls = (visible ? 'on' : 'off')
    return html`
        <span class="${props.class} modal-wrapper">
            <span class="switch ${cls}">${props.button(show)}</span>
            <div  class="modal ${cls}" ref=${ref}>${props.modal(hide)}</div>
        </span
    `
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

function GetVantage(conditions) {
    let advantage = false
    let disadvantage = false
    for (const c of conditions) {
        const hit = MODIFIERS[c].hit
        if (hit == 'adv') { advantage = true }
        if (hit == 'dis') { disadvantage = true }
    }
    return {
        advantage: advantage && !disadvantage,
        disadvantage: disadvantage && !advantage,
    }
}


export {
    html,
    map,
    getCharacter,
    CharacterProvider,
    removeFromListState,
    GetVantage,
    Modal,
}

