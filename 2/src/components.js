import { html, map, GetVantage } from '/src/core.js'
import { createContext } from '/web_modules/preact.js';
import { createPortal } from '/web_modules/preact/compat.js'
import { useState, useEffect, useMemo, useContext, useRef } from '/web_modules/preact/hooks.js';


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


// state helper: index a state by the current character
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


// state helper to remove an item from the supplied array and set it as new state
function removeFromListState(list, set) {
    return (item) => set(list.filter(i => i != item))
}

// state helper to add an item to the supplied array and set it as new state
function addToListState(list, set) {
    return (item) => set([...list, item])
}


// character context
const CharacterContext = createContext();

function useCharacter() {
  return useContext(CharacterContext)
}

function CharacterProvider(props) {
    let initialGroup = null
    let initialName = null
    // TODO: pass this in via props? Feels ugly to have a component deal with routing
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

// roll context
const RollContext = createContext();

const useRoll = function(type, data) {
    return useContext(RollContext)
}

function RollProvider(props) {
    const type = props.type

    // set the current vantage info for this roll
    const {vantage} = useCharacter()
    let rollVantage = null
    if (type == 'save' && props.save) {
        rollVantage = vantage[type][props.save]
    } else {
        rollVantage = vantage[type]
    }

    // user state for this roll
    const [advantage, setAdvantage] = useState(false)
    const [disadvantage, setDisadvantage] = useState(false)
    const [options, setOptions] = useState([])

    // this is Autocrit for attacks, Guidance for skills and checks, and
    // Resistance for saves.
    const [extra, setExtra] = useState(false)

    // the options available for use to to select for this roll
    const rollOptions = props.options || []

    // reset roll to inital conditions vantage
    const reset = () => {
        setAdvantage(rollVantage.advantage)
        setDisadvantage(rollVantage.disadvantage)
        setExtra(false)
        // TODO: should we reset options here too?
    }

    // turn on advantage (and off disadvantage)
    const toggleAdvantage = () => {
        const adv = !advantage
        setAdvantage(adv)
        if (adv) {
            setDisadvantage(false)
        }
    }

    // turn on disadvantage (and off advantage)
    const toggleDisadvantage = () => {
        const dis = !disadvantage
        setDisadvantage(dis)
        if (dis) {
            setAdvantage(false)
        }
    }

    // manage the active options
    const removeOption = removeFromListState(options, setOptions)
    const addOption = opt => {
        let temp = options
        // spell slots are mutually exclusive, so deselect other slots
        if (rollOptions[opt].type == 'spell slot') {
            // deselect all other spell slot options
            const selector = ([k, v]) => k != opt && v['type'] == 'spell slot'
            const toRemove = Object.entries(rollOptions).filter(selector)
            temp = options.filter(o => toRemove.includes(o))
        }
        setOptions([...temp, opt])
    }

    const contextValue = {
        type: type,
        advantage: advantage,
        disadvantage: disadvantage,
        vantage: rollVantage,
        options: options,
        extra: extra,
        reset: reset,
        toggleAdvantage: toggleAdvantage,
        toggleDisadvantage: toggleDisadvantage,
        toggleExtra: () => setExtra(!extra),
        removeOption: removeOption,
        addOption: addOption,
    }

    return html`<${RollContext.Provider} value=${contextValue} ...${props} />`
}


const Vantage = function({extra}) {
    const roll = useRoll()
    // if we already have disadvantage, we cannot have advantage
    const advDisabled = roll.vantage.disadvantage
    const toggleAdvantage = advDisabled ? null : roll.toggleAdvantage
    // vice versa
    const disDisabled = roll.vantage.advantage
    const toggleDisadvantage = disDisabled ? null : roll.toggleDisadvantage
    return html`
        <div class="vantage">
            <span class="advantage button ${roll.advantage ? 'on' : 'off'} ${advDisabled ? 'disabled': ''}"
                onClick=${toggleAdvantage}>ADV</span>
            <span class="disadvantage button ${roll.disadvantage ? 'on' : 'off'} ${disDisabled ? 'disabled': ''}"
                onClick=${toggleDisadvantage}>DIS</span>
            <span class="extra button ${roll.extra ? 'on': 'off'}"
                onClick=${roll.toggleExtra}>${extra}</span>
        </div>
    `
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
    const hide = () => {
        setVisible(false);
        props.reset && props.reset()
    }
    const show = () => {
        props.reset && props.reset()
        setVisible(true);
    }
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

export {
    useCharacter, CharacterProvider,
    useRoll, RollProvider, Vantage,
    Modal,
}
