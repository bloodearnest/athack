import '/web_modules/preact/debug.js';
import { h, render, createContext } from '/web_modules/preact.js';
import { useState, useContext, useRef } from '/web_modules/preact/hooks.js';
import { html, map, getCharacter, removeFromListState, useClickOutside, GetVantage} from '/src/core.js'


const AttackContext = createContext()

function useAttack() {
  return useContext(AttackContext)
}



function AttackProvider(props) {
    const {conditions} = getCharacter()
    const [active, setActive] = useState(false)
    const [options, setOptions] = useState([])
    const defaults = GetVantage(conditions)
    const [advantage, setAdvantage] = useState(defaults.advantage)
    const [disadvantage, setDisadvantage] = useState(defaults.disadvantage)
    const [autocrit, setAutocrit] = useState(false)
    const attackOptions = props.attack.options

    const setActiveAndReset = active => {
        if (active == false) {
            setAdvantage(defaults.advantage)
            setDisadvantage(defaults.disadvantage)
            setAutocrit(false)
        }
        setActive(active)
    }
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
        advantage: advantage,
        disadvantage: disadvantage,
        autocrit: autocrit,
        defaults: defaults,
        options: options,
        setActive: setActiveAndReset,
        toggleAdvantage: () => setAdvantage(!advantage),
        toggleDisadvantage: () => setDisadvantage(!disadvantage),
        toggleAutocrit: () => setAutocrit(!autocrit),
        removeOption: removeOption,
        addOption: addOption,
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

const AttackConditions = function() {
    const ctx = useAttack()

    // if we already have disadvantage, we cannot have advantage
    const adv_disabled = ctx.defaults.disadvantage
    // vice versa
    const dis_disabled = ctx.defaults.advantage

    return html`
        <div class=attack_conditions>
            <span class="button ${ctx.advantage ? 'on' : 'off'} ${adv_disabled ? 'disabled': ''}"
                  onClick=${adv_disabled ? null : ctx.toggleAdvantage}>Advantage</span>
            <span class="button ${ctx.disadvantage ? 'on' : 'off'} ${dis_disabled ? 'disabled': ''}"
                  onClick=${dis_disabled ? null : ctx.toggleDisadvantage}>Disadv.</span>
            <span class="button ${ctx.autocrit ? 'on': 'off'}"
                  onClick=${ctx.toggleAutocrit}>AutoCrit</span>
        </div>
    `
    console.log(vantage)


}

const AttackDetails = function() {
    const {name, attack, active, setActive, options, conditions} = useAttack()
    const ref = useRef()
    useClickOutside(ref, () => setActive(false))

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
        <${AttackConditions}/>
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
