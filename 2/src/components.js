import { html, map, GetVantage, ATTRIBUTES } from '/src/core.js'
import { createContext } from '/web_modules/preact.js';
import { useState, useEffect, useMemo, useContext, useRef } from '/web_modules/preact/hooks.js';


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


const Vantage = function({extra, roll}) {
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


const useModal = function({reset}) {
    const ref = useRef()
    const [visible, setVisible] = useState(false)
    const hide = () => {
        setVisible(false);
        reset && reset()
    }
    const show = () => {
        reset && reset()
        setVisible(true);
    }
    const cls = (visible ? 'on' : 'off')
    useClickOutside(ref, hide)
    useEffect(() => {
        ref.current && ref.current.classList.add('on')
    })

    return {
        ref: ref,
        visible: visible,
        hide: hide,
        show: show,
        cls: cls,
    }
}

const Modal = function(props) {
    const state = useModal({reset: props.reset})
    const modal = !state.visible ? null : html`
        <div class="modal ${props.class}" ref=${state.ref} >
            <div class=content>
                <span class=close onClick=${state.hide}>X</span>
                ${props.modal(state.hide)}
            </div>
        </div>
    `
    return html`
        <div class="${props.class} modal-wrapper">
            ${props.button(state.show, state.cls)}
            ${modal}
        </div
    `
}


const useFlipButton = function(ref) {
    const flipRef = useRef()
    const flip = e => {
        ref.current && ref.current.classList.toggle('flipped')
    }
    // do the flip by class manipulation
    useEffect(() => {
        flipRef.current && flipRef.current.addEventListener('click', flip, false)
        return () => flipRef.current && flipRef.current.removeEventListener('click', flip, false)
    })
    return flipRef
}


const CardModal = function(props) {
    const state = useModal({reset: props.reset})
    const flipFrontRef = useFlipButton(state.ref)
    const flipBackRef = useFlipButton(state.ref)

    // modal is position: fixed, so we need to have card-outer to set a 3d
    // context, and card-inner to actuall flip
    const modal = !state.visible ? null : html`
        <div class="modal ${props.class}" ref=${state.ref}>
            <div class=card-outer>
                <div class=card-inner>
                    <div class="front content">
                        <span class=close onClick=${state.hide}>X</span>
                        <span class=flip ref=${flipFrontRef}>F</span>
                        ${props.front(state.hide)}
                    </div>
                    <div class="back content">
                        <span class=close onClick=${state.hide}>X</span>
                        <span class=flip ref=${flipBackRef}>F</span>
                        ${props.back(state.hide)}
                    </div>
                </div>
            </div>
        </div>
    `
    return html`
        <div class="${props.class} card modal-wrapper">
            ${props.button(state.show, state.cls)}
            ${modal}
        </div
    `
}



const useRoll = function({id, type, name, bonus, options}) {
    // set the current vantage info for this roll
    const {vantage} = useCharacter()
    let rollVantage = null
    if (type == 'save' && id) {
        rollVantage = vantage[type][id]
    } else {
        rollVantage = vantage[type]
    }

    // user state for this roll
    const [advantage, setAdvantage] = useState(false)
    const [disadvantage, setDisadvantage] = useState(false)
    const [activeOptions, setActiveOptions] = useState([])

    // this is Autocrit for attacks, Guidance for skills and checks, and
    // Resistance for saves.
    const [extra, setExtra] = useState(false)

    // reset roll to inital conditions vantage
    const reset = () => {
        setAdvantage(rollVantage.advantage)
        setDisadvantage(rollVantage.disadvantage)
        setExtra(false)
        setActiveOptions([])
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
    const removeOption = removeFromListState(activeOptions, setActiveOptions)
    const addOption = opt => {
        let temp = activeOptions
        // spell slots are mutually exclusive, so deselect other slots
        if (options[opt].type == 'spell slot') {
            // deselect all other spell slot options
            const selector = ([k, v]) => k != opt && v['type'] == 'spell slot'
            const toRemove = Object.entries(options).filter(selector)
            temp = activeOptions.filter(o => toRemove.includes(o))
        }
        setActiveOptions([...temp, opt])
    }

    return {
        advantage: advantage,
        disadvantage: disadvantage,
        vantage: rollVantage,
        activeOptions: activeOptions,
        extra: extra,
        reset: reset,
        toggleAdvantage: toggleAdvantage,
        toggleDisadvantage: toggleDisadvantage,
        toggleExtra: () => setExtra(!extra),
        removeOption: removeOption,
        addOption: addOption,
    }
}

const Roll = function(props) {
    const roll = useRoll({...props})
    const button = (show, cls) => html`<span class="button ${cls}" onClick=${show}>${props.bonus}</span>`
    const modal = (hide) => {
        return html`
            <div class=roll-details>
                <div class="roll-name title">${props.name} Check</div>
                <div class="detail roll-bonus">
                    <span class=header>Bonus: </span>
                    <span class=value>${props.bonus}</span>
                </div>
                <${Vantage} roll=${roll} extra=${props.extra}/>
            </div>
        `
    }

    return html`
        <div class="roll ${props.class}">
            <span class=name>${props.name}</div>
            <${Modal} class=roll-menu button=${button} modal=${modal} reset=${roll.reset}/>
        </div>
    `
}

const FilterBar = function({filters, current, set}) {
    const filterButtons = filters.map((f) => {
        const active = f == current
        const handler = active ? e => set(null) : e => set(f)
        return html`
            <span class="filter button ${active ? "on" : "off"}" onClick=${handler}>${f}</span>`
    })
    return html` <div id=filters>${filterButtons}</div>`
}


const Skills = function() {
    const character = useCharacter()
    const [ability, setAbility] = useState(null)

    const filters = Object.keys(ATTRIBUTES).filter(a => a != 'con').map(a => a.toUpperCase())
    const bar = FilterBar({ filters: filters, current: ability, set: setAbility })
    const selectedSkills = Object.entries(character.skills).filter(([k, v]) => {
        return ability == null || v.ability == ability
    })
    const skills = map(selectedSkills, (i, [id, skill]) => {
        return html`<${Roll} id=${id} class=skill extra=Guidance ...${skill}/>`
    })
    return html`
        <section id=skills>
            ${bar}
            ${skills}
        </section>
    `
}

const Checks = function() {
    const character = useCharacter()
    let checks = []
    for (const [id, name] of Object.entries(ATTRIBUTES)) {
        const check = character.abilities[id]
        checks.push(html`<${Roll} id=${id} class=check extra=Guidance ...${check}/>`)
    }
    return html`<section id=checks>${checks}</section>`
}


const Saves = function() {
    const character = useCharacter()
    let saves = []
    const options = []
    for (const [id, name] of Object.entries(ATTRIBUTES)) {
        const save = character.saves[id]
        saves.push(html`<${Roll} id=${id} class=save extra=Resistance ...${save}/>`)
    }
    return html`<section id=saves>${saves}</section>`
}




export {
    useCharacter, CharacterProvider,
    Roll,
    Modal,
    CardModal,
    Checks,
    Saves,
    Skills,
    Vantage,
    FilterBar,
    useRoll,
}

