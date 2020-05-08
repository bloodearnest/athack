import { createContext } from '/web_modules/preact.js';
import { useState, useEffect, useMemo, useContext, useRef } from '/web_modules/preact/hooks.js';
import { html, map, useSwipe, useEventListener } from '/src/core.js'
import { ATTRIBUTES, d20Roll, getCharacterModifiers, getRollModifiers } from '/src/rules.js'



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
    return (item) => {
        set([...list, item])
    }
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
    const vantage = useMemo(() => getCharacterModifiers(conditions), [conditions])

    const setNameAndHash = (name, group) => {
        setName(name)
        setGroup(group)
        location.hash = group + '/' + name.replace(' ', '-')
    }

    const contextValue = {
        group: group,
        name: name,
        attacks: data.attacks || {},
        saves: data.saves || {},
        abilities: data.abilities || {},
        skills: data.skills || {},
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

const YouShallNotPass = (e) => {
    e.preventDefault && e.preventDefault()
    e.stopPropagation && e.stopPropagation()
    e.nativeEvent && e.nativeEvent.stopImmediatePropagation();
}

const useModal = function({reset}) {
    const ref = useRef()
    const [visible, setVisible] = useState(false)

    const remove = () => {
        setVisible(false)
    }
    const hide = (e) => {
        ref.current.classList.replace('on', 'off')
        YouShallNotPass(e)
        setTimeout(remove, 400)
    }

    const show = (e) => {
        reset && reset()
        setVisible(true)
    }
    const cls = (visible ? 'on' : 'off')
    //useClickOutside(ref, hide)
    useEffect(() => ref.current && ref.current.classList.add('on') )

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
                <div class=head>
                    <span class=title>${props.title}</span>
                    <span class=controls>
                        <span class=close onClick=${state.hide}>X</span>
                    </span>
                </div>
                <div class=body>
                    ${props.modal(state.hide)}
                </div>
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


const CardContent = function(props) {
    // modal is position: fixed, so we need to have card-outer to set a 3d
    // context, and card-inner to actually flip
    const flip = direction => {
        const elem = props.state.ref.current
        if (!elem) {
            return
        }
        if (direction == 'right') {
            elem.classList.add('flipped')
        } else if (direction == 'left') {
            elem.classList.remove('flipped')
        } else {
            elem.classList.toggle('flipped')
        }
    }
    // because we want events to
    const fakeClick = e => {
        console.log('fakeClick')
        if (e.target.classList.contains('flip')) {
            flip(e)
        } else if (e.target.classList.contains('close')) {
            props.state.hide(e)
        }
        YouShallNotPass(e)
    }
    useEventListener('pointerup', fakeClick, props.state.ref)
    useSwipe(flip, props.state.ref, 100)
    return html`
        <div class="modal ${props.class}" ref=${props.state.ref}>
            <div class=card-outer>
                <div class=card-inner>
                    <div class="front content">
                        <div class=head>
                            <span class=title>${props.title}</span>
                            <span class=controls>
                                <span class=flip>${'>'}</span>
                                <span class=close onClick=${props.state.hide}>X</span>
                            </span>
                        </div>
                        <div class=body>
                            ${props.front(props.state.hide)}
                        </div>
                    </div>
                    <div class="back content">
                        <div class=head>
                            <span class=title>${props.title}</span>
                            <span class=controls>
                                <span class=flip>${'<'}</span>
                                <span class=close onClick=${props.state.hide}>X</span>
                            </span>
                        </div>
                        <div class=body>
                            ${props.back(props.state.hide)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

}

// A modal that has a back that can be flipped over to show
const CardModal = function(props) {
    const state = useModal({reset: props.reset})
    const modal = state.visible ? html`<${CardContent} state=${state} ...${props}/>` : null
    return html`
        <div class="${props.class} card modal-wrapper">
            ${props.button(state.show, state.cls)}
            ${modal}
        </div
    `
}


const useRoll = function({id, type, name, bonus, options, extra}) {
    options = options || {}
    const character = useCharacter()

    // user state for this roll
    const [advantage, setAdvantage] = useState(false)
    const [disadvantage, setDisadvantage] = useState(false)
    const [activeOptions, setActiveOptions] = useState([])
    // this is Autocrit for attacks, Guidance for skills and checks, and
    // Resistance for saves.
    const [extraActive, setExtra] = useState(false)
    // the result of the roll
    const [result, setResult] = useState(null)

    // get the current vantage for this roll type
    let vantage = null
    if (type == 'save' && id) {
        vantage = character.vantage.save[id]
    } else {
        vantage = character.vantage[type]
    }

    // calculate current modifers for this roll, based on selected options
    // this will
    const rollModifiers = useMemo(
        () => {
            console.log('activeOptions changed, recalculating', activeOptions)
            return getRollModifiers(activeOptions, options)
        },
        [activeOptions],
    )

    const getModifiers = (type) => {
        return Object.assign(
            {},
            rollModifiers[type].modifiers,
            character.vantage[type].modifiers,
        )
    }

    // reset roll to inital conditions after this roll modal has been closed
    const reset = () => {
        setAdvantage(vantage.advantage)
        setDisadvantage(vantage.disadvantage)
        setExtra(false)
        setActiveOptions([])
        setResult(null)
    }

    // turn advantage on (and disadvantage off)
    const toggleAdvantage = () => {
        const adv = !advantage
        setAdvantage(adv)
        if (adv) {
            setDisadvantage(false)
        }
    }

    // turn disadvantage on (and advantage off)
    const toggleDisadvantage = () => {
        const dis = !disadvantage
        setDisadvantage(dis)
        if (dis) {
            setAdvantage(false)
        }
    }

    const toggleExtra = () => {
        const active = !extraActive
        setExtra(active)
        if (active) { addOption(extra) }
        else { removeOption(extra) }
    }

    // manage the active options
    const removeOption = removeFromListState(activeOptions, setActiveOptions)
    const addOption = addToListState(activeOptions, setActiveOptions)

    const doRoll = () => {
        const result = d20Roll(bonus, advantage, disadvantage, getModifiers(type), {})
        setTimeout(() => setResult(result), 1000)
    }

    return {
        advantage: advantage,
        disadvantage: disadvantage,
        activeOptions: activeOptions,
        extra: extraActive,
        extraName: extra,
        vantage: vantage,
        reset: reset,
        result: result,
        getModifiers: getModifiers,
        toggleAdvantage: toggleAdvantage,
        toggleDisadvantage: toggleDisadvantage,
        toggleExtra: toggleExtra,
        removeOption: removeOption,
        addOption: addOption,
        doRoll: doRoll,
        clearResult: () => setResult(null),
    }
}

const Roll = function(props) {
    const roll = useRoll({...props})
    const button = (show, cls) => html`<span class="button ${cls}" onClick=${show}>${props.bonus}</span>`

    const result = roll.result ? html`<${Result} title=${props.name} result=${roll.result} clearResult=${roll.clearResult}/>` : null

    const modal = (hide) => {
        const dropAndRoll = e => {
            hide(e)
            roll.doRoll()
        }
        return html`
            <div class=roll-details>
                <div class="roll-name title">${props.name} Check</div>
                <div class="detail roll-bonus">
                    <span class=header>Bonus: </span>
                    <span class=value>${props.bonus}</span>
                </div>
                <${Vantage} roll=${roll} extra=${props.extra}/>
                <div class=doRoll>
                    <span class=button onClick=${dropAndRoll}>Roll</span>
                </div>
                <div class=result>
                </div>
            </div>
        `
    }

    return html`
        <div class="roll ${props.class}">
            <span class=name>${props.name}</div>
            <${Modal} class=roll-menu title=${props.name} button=${button} modal=${modal} reset=${roll.reset}/>
            ${result}
        </div>
    `
}


const Result = function({title, result, clearResult}) {
    const ref = useRef()

    useEffect(() => ref.current.classList.add('on'))

    const hide = (e) => {
        ref.current.classList.replace('on', 'off')
        YouShallNotPass(e)
        setTimeout(() => clearResult(null), 400)
    }


    let records = []
    result.record.forEach(({name, description, amount}) => {
        records.push(html`
            <div>
                <span class=name>${name}</span>
                <span class=amount>${amount}</span>
                <span class=desc>${description}</span>
            </div>
        `)
    })
    return html`
        <div class="modal" ref=${ref} >
            <div class=content>
                <div class=head>
                    <span class=title>${title}</span>
                    <span class=controls>
                        <span class=close onClick=${hide}>X</span>
                    </span>
                </div>
                <div class=body>
                    <div>
                        <span class=total>${result.total}</span>
                    </div>
                    <div class=record>${records}</div>
                </div>
            </div>
        </div
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

