import '/web_modules/preact/debug.js';
import { h, render, createContext } from '/web_modules/preact.js';
import { useState, useContext, useRef } from '/web_modules/preact/hooks.js';
import { html, map, getCharacter, removeFromListState, Modal, GetVantage} from '/src/core.js'


const AttackContext = createContext()

function useAttack() {
  return useContext(AttackContext)
}



function AttackProvider(props) {
    const {conditions} = getCharacter()
    const [active, setActiveActual] = useState(false)
    const [options, setOptions] = useState([])
    const defaults = GetVantage(conditions)
    const [advantage, setAdvantage] = useState(defaults.advantage)
    const [disadvantage, setDisadvantage] = useState(defaults.disadvantage)
    const [autocrit, setAutocrit] = useState(false)
    const attackOptions = props.attack.options

    const setActive = f => {
        setActiveActual(f)
    }

    const setActiveAndReset = flag => {
        if (flag == false) {
            setAdvantage(defaults.advantage)
            setDisadvantage(defaults.disadvantage)
            setAutocrit(false)
        }
        setActive(flag)
    }
    const toggleAdvantage = () => {
        const adv = !advantage
        setAdvantage(adv)
        if (adv) {
            setDisadvantage(false)
        }
    }
    const toggleDisadvantage = () => {
        const dis = !disadvantage
        setDisadvantage(dis)
        if (dis) {
            setAdvantage(false)
        }
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
        toggleAdvantage: toggleAdvantage,
        toggleDisadvantage: toggleDisadvantage,
        toggleAutocrit: () => setAutocrit(!autocrit),
        removeOption: removeOption,
        addOption: addOption,
    }
    return html`<${AttackContext.Provider} value=${contextValue} ...${props} />`
}




const Damage = function({damage, sign}) {
    let damages = []
    for (const [k, v] of Object.entries(damage)) {
        damages.push(html`<span class=damage data-type=${k}>${sign}${v}${'\u00A0'}${k}</span>`)
    }
    return damages
}

const AttackOption = function({name, option}) {
    const {options, addOption, removeOption} = useAttack()
    const active = options.includes(name)
    const toggle = active ? removeOption : addOption
    let details = []
    if (option.damage) {
        const sign = option.replace ? '' : '+'
        details.push(html`<${Damage} damage=${option.damage} sign=${sign}/>`)
    }
    return html`
        <div class="option button ${active ? 'on' : 'off'}" onClick=${e => toggle(name)}>
            <span>${name}</span> <span class=info>(${details})</span>
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
            <span class="vantage">
                <span class="advantage button ${ctx.advantage ? 'on' : 'off'} ${adv_disabled ? 'disabled': ''}"
                    onClick=${adv_disabled ? null : ctx.toggleAdvantage}>ADV</span>
                <span class="disadvantage button ${ctx.disadvantage ? 'on' : 'off'} ${dis_disabled ? 'disabled': ''}"
                    onClick=${dis_disabled ? null : ctx.toggleDisadvantage}>DIS</span>
            </span>
            <span class="button autocrit ${ctx.autocrit ? 'on': 'off'}"
                  onClick=${ctx.toggleAutocrit}>AUTOCRIT</span>
        </div>
    `
    console.log(vantage)


}

const AttackDetails = function({hide}) {
    const {name, attack, options} = useAttack()

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

    let conditions = null
    if (attack.tohit) {
        conditions = html`<${AttackConditions}/>`
    }

    return html`
        <div class=details>
            <span class=close onClick=${hide}>X</span>
            <div class=name>${name}</div>
            ${details}
            ${conditions}
            <div class=options>${opts}</div>
        </div>
    `

}

const Attack = function() {
    const {name, attack} = useAttack()

    let hint = attack.tohit ? attack.tohit : attack.save

    if (attack.damage) {
        const entries = Array.from(Object.entries(attack.damage))
        if (entries.length > 0) {
            const [_, damage] = entries[0]
            hint += (hint ? ', ' : '') + damage
        }
    }
    hint = hint.replace(/ /g, '\u00A0')

    const button = (show) => {
        return html`
            <div class=summary onClick=${show}>
                <span class=name>${name}</span>
                <span class=hint>${hint}</span>
            </div>
        `
    }
    const modal = (hide) => {
        return html`<${AttackDetails} hide=${hide}/>`
    }

    return html`<${Modal} class=attack button=${button} modal=${modal}/>`
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
    return html` <div id=filters class=row>${filters}</div>`
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
            <${FilterBar}/>
            ${elements}
        </section>
    `
}

export {
    Attacks
}
