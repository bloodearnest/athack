import '/web_modules/preact/debug.js';
import { h, createContext } from '/web_modules/preact.js';
import { useState, useContext, useRef, useEffect, useMemo } from '/web_modules/preact/hooks.js';
import htm from '/web_modules/htm.js'
import {createPortal} from '/web_modules/preact/compat.js'

const html = htm.bind(h)
const map = (obj, func) => Object.entries(obj).map(([k, v]) => func(k, v))
const CharacterContext = createContext();


const ATTRIBUTES = {
    'str': 'Strength',
    'dex': 'Dexterity',
    'con': 'Constitution',
    'int': 'Intelligence',
    'wis': 'Wisdom',
    'cha': 'Charisma',
}

function usePortal(id) {
  const rootElemRef = useRef(document.createElement('div'));

  useEffect(function setupElement() {
    const parentElem = document.querySelector(`#${id}`);
    parentElem.appendChild(rootElemRef.current);
    return function removeElement() {
      rootElemRef.current.remove();
    };
  }, []);

  return rootElemRef.current;
}

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
    const data = props.characters.characters[name] || {}
    const vantage = useMemo(() => GetVantage(conditions), [conditions])

    const setNameAndHash = (name, group) => {
        setName(name)
        setGroup(group)
        location.hash = group + '/' + name.replace(' ', '-')
    }

    const contextValue = {
        group: group,
        name: name,
        attacks: data.attacks,
        saves: data.saves,
        abilities: data.abilities,
        skills: data.skills,
        conditions: conditions,
        vantage: vantage,
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
    const portalRef = usePortal('modals')
    const [visible, setVisible] = useState(false)
    const hide = () => setVisible(false)
    const show = () => setVisible(true);
    useClickOutside(ref, hide)
    const cls = (visible ? 'on' : 'off')
    const portal = createPortal(html`
        <div class="modal ${props.class} ${cls}" ref=${ref} >
            <span class=close onClick=${hide}>X</span>
            ${props.modal(hide)}
        </div>
    `, portalRef)
    return html`
        <div class="${props.class} modal-wrapper">
            <div class="switch ${cls}">${props.button(show)}</div>
            ${portal}
        </div
    `
}

const MODIFIERS = {
    "Bless":     {hitbonus: '1d4',  savebonus: '1d4'},
    "Bane":      {hitbonus: '-1d4', savebonus: '-1d4'},
    "Invisible": {attacks: 'A'},
    "Synaptic Static": {hitbonus: '-1d6', checkbonus: '-1d6'},
    "Enlarge": {damage: '1d4'},
    "Reduce": {damage: '-1d4'},
    "Poisoned": {attacks: 'D', checks: 'D'},
    "Restrained": {attacks: 'D', saves: {dex: 'D'}},
    "Prone": {attacks: 'D'},
    "Frightened": {attacks: 'D', checks: 'D'},
    "Exhausted 1": {checks: 'D'},
    "Exhausted 3": {attacks: 'D', saves: 'D'},
}

function GetVantage(conditions) {
    let attacks = {advantage: 0, disadvantage: 0}
    let checks = {advantage: 0, disadvantage: 0}
    let saves = {
        str: {advantage: 0, disadvantage: 0},
        dex: {advantage: 0, disadvantage: 0},
        con: {advantage: 0, disadvantage: 0},
        'int': {advantage: 0, disadvantage: 0},
        wis: {advantage: 0, disadvantage: 0},
        cha: {advantage: 0, disadvantage: 0},
    }
    let hitbonus = {}
    let damagebonus = {}
    let savebonus = {}
    let checkbonus = {}

    let toCheck = Object.entries(MODIFIERS).filter(([k, v]) => conditions.includes(k))
    for (const [k, v] of toCheck) {
        if (v.attacks == 'A') { attacks.advantage += 1 }
        else if (v.attacks == 'D') { attacks.disadvantage += 1 }
        if (v.checks == 'A') { checks.advantage += 1 }
        else if (v.checks == 'D') { checks.disadvantage += 1 }
        if (v.saves) {
            for (const [attr, save] of Object.entries(v.saves)) {
                if (save == 'A') { saves[attr].advantage += 1 }
                else if (save == 'D') { saves[attr].disadvantage += 1 }
            }
        }
        if (v.hitbonus) { hitbonus[k] = v.hitbonus }
        if (v.savebonus) { savebonus[k] = v.savebonus }
        if (v.damage) { damagebonus[k] = v.damage }
        if (v.checkbonus) { checkbonus[k] = v.checkbonus }

    }
    const calculate = obj => {
        return {
            advantage: obj.advantage > 0 && obj.disadvantage == 0,
            disadvantage: obj.disadvantage > 0 && obj.advantage == 0,
        }
    }
    return {
        attacks: calculate(attacks),
        checks: calculate(checks),
        saves: {
            str: calculate(saves['str']),
            dex: calculate(saves['dex']),
            con: calculate(saves['con']),
            'int': calculate(saves['int']),
            wis: calculate(saves['wis']),
            cha: calculate(saves['cha']),
        },
        hitbonus: hitbonus,
        savebonus: savebonus,
        damagebonus: damagebonus,
        checkbonus: checkbonus,
    }
}


export {
    html,
    map,
    getCharacter,
    CharacterProvider,
    removeFromListState,
    Modal,
    ATTRIBUTES,
}

