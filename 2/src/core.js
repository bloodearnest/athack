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
    }
    const [group, setGroup] = useState(initialGroup);
    const [name, setName] = useState(initialName);
    const [conditions, setConditions] = useCharacterState(name, [])
    const [filter, setFilter] = useCharacterState(name, null)
    const attacks = props.characters.attacks[name] || {}

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

export {
    html,
    map,
    getCharacter,
    CharacterProvider,
    removeFromListState,
}
