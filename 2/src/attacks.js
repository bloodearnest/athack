import '/web_modules/preact/debug.js';
import { h, render, createContext } from '/web_modules/preact.js';
import { useState, useContext, useRef, useEffect } from '/web_modules/preact/hooks.js';
import { html, map, getCharacter, removeFromListState } from '/src/core.js'


const AttackContext = createContext()

function useAttack() {
  return useContext(AttackContext)
}

function AttackProvider(props) {
    const [active, setActive] = useState(false)
    const [options, setOptions] = useState([])
    const attackOptions = props.attack.options
    const {conditions} = getCharacter()

    const removeOption = removeFromListState(options, setOptions)
    const addOption = opt => {
        let temp = options
        if (props.attack.options[opt].type == 'spell slot') {
            // deselect all other spell slot options
            const selector = ([k, v]) => k != opt && v['type'] == 'spell slot'
            const toRemove = Object.entries(props.attack.options).filter(selector)
            temp = options.filter(o => toRemove.includes(o))
        }
        setOptions([...temp, opt])
    }

    const contextValue = {
        active: active,
        attack: props.attack,
        name: props.name,
        options: options,
        setActive: setActive,
        removeOption: removeOption,
        addOption: addOption,
        conditions: conditions,
    }
    return html`<${AttackContext.Provider} value=${contextValue} ...${props} />`
}




const Damage = function({damage}) {
    let damages = []
    for (const [k, v] of Object.entries(damage)) {
        damages.push(html`<span class=damage data-type=${k}>${v} ${k}</span>`)
    }
    return damages
}

const AttackOption = function({name, option, active}) {
    const {addOption, removeOption} = useAttack()
    const toggle = active ? removeOption : addOption
    const handler = (e) => toggle(name)
    let details = []
    if (option.damage) {
        details.push(html`<span class=info><${Damage} damage=${option.damage}/></span>`)
    }
    return html`
        <div class=option>
            <span class="button ${active ? 'on' : 'off'}" onClick=${handler}>${name}</span>
            ${details}
        </div>
    `

}

const AttackDetails = function() {
    const ref = useRef()
    const {name, attack, active, setActive, options} = useAttack()

    const close = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setActive(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', close, false)
        return () => { document.removeEventListener('mousedown', close, false) }
    })

    let details = [];
    let add = (cls, hdr, content) => details.push(html`
        <div class="detail ${cls}">
            <span class=header>${hdr}: </span>
            <span class=value>${content}</span>
        </div>
    `)
    let half = (attack.half == undefined ? false : attack.half) ? ' for half' : '';
    if (attack.tohit)  { add('tohit', 'To Hit', `${attack.tohit}`) }
    if (attack.save)   { add('save',  'Save',   `${attack.save}${half}`) }
    if (attack.range)  { add('range', 'Range',  `${attack.range}`) }
    if (attack.damage) { add('damage','Damage', html`<${Damage} damage=${attack.damage}/>`) }
    if (attack.effect) { add('effect','Effect', `${attack.effect}`) }

    let opts = map(attack.options, (n, o) => {
        return html` <${AttackOption} name=${n} option=${o} active=${options.includes(n)}/>`
    })

    return html`
    <div class="details popup ${active ? 'on' : 'off'}" ref=${ref}>
        <div class=name>${name}</div>
        ${details}
        <div class=options>${opts}</div>
    </div>`

}

const Attack = function() {
    const {name, attack, active, setActive} = useAttack()
    return html`
        <div class="attack ${active ? 'on' : 'off'}">
            <span class=name onClick=${e => setActive(true)}>${name}</span>
            <${AttackDetails}/>
        </div>
    `
}

const Attacks = function() {
    const {name, attacks, filter} = getCharacter()

    // apply filters to attack list
    let selected = ([n, a]) => !filter || a.types.includes(filter)

    let elements = []
    for (let [name, attack] of Object.entries(attacks).filter(selected)) {
        elements.push(html`<${AttackProvider} name=${name} attack=${attack}><${Attack}/></${AttackProvider}>`)
    }

    return html`
        <section id=attacks>
            ${elements}
        </section>
    `
}

export {
    Attacks
}
