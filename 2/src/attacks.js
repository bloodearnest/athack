import '/web_modules/preact/debug.js';
import { createContext } from '/web_modules/preact.js';
import { useState, useContext, useRef, useMemo } from '/web_modules/preact/hooks.js';
import { html, map } from '/src/core.js'
import { useCharacter, Modal, useRoll, Vantage} from '/src/components.js'


const AttackContext = createContext()

const Damage = function({damage, sign}) {
    let damages = []
    for (const [k, v] of Object.entries(damage)) {
        damages.push(html`<span class=damage data-type=${k}>${sign}${v}${'\u00A0'}${k}</span>`)
    }
    return damages
}

const AttackOption = function({name, option, active, toggle}) {
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

const AttackDetails = function({hide, attack, roll}) {
    const {activeOptions} = roll

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
        const active = activeOptions.includes(n)
        const toggle = active ? roll.removeOption : roll.addOption
        return html` <${AttackOption} name=${n} option=${o} active=${active} toggle=${toggle}/>`
    })

    let conditions = null
    if (attack.tohit) {
        conditions = html`<${Vantage} roll=${roll} extra=AUTOCRIT/>`
    }

    return html`
        <div class=details>
            <div class="name title">${attack.name}</div>
            ${details}
            ${conditions}
            <div class=options>${opts}</div>
        </div>
    `
}

const Attack = function({attack}) {
    const roll = useRoll({id: attack.name, type: 'attack', ...attack})

    let text = attack.tohit ? attack.tohit : attack.save

    if (!text && attack.damage) {
        const entries = Array.from(Object.entries(attack.damage))
        if (entries.length > 0) {
            const [_, damage] = entries[0]
            /*if (text) {
                text += ' (' + damage + ')'
            } else {*/
            text = damage
        }
    }
    text = text.replace(/ /g, '\u00A0')

    const button = (show) => {
        return html`
            <div class=summary>
                <span class=name>${attack.name}</span>
                <span class=button onClick=${show}>${text}</span>
            </div>
        `
    }
    const modal = (hide) => {
        return html`<${AttackDetails} hide=${hide} attack=${attack} roll=${roll}/>`
    }

    return html`<${Modal} class=attack button=${button} modal=${modal} reset=${roll.reset}/>`
}

const FILTERS = [
    'Melee',
    'Range',
    'Spell',
    'AoE',
];


const FilterBar = function() {
    const {filter, setFilter} = useCharacter()
    let filters = FILTERS.map((f) => {
        const active = f == filter
        const handler = active ? e => setFilter(null) : e => setFilter(f)
        return html`
            <span class="filter button ${active ? "on" : "off"}" onClick=${handler}>${f}</span>`
    })
    return html` <div id=filters class=row>${filters}</div>`
}


const Attacks = function() {
    const {name, attacks, filter} = useCharacter()

    // apply filters to attack list
    let selected = ([n, a]) => !filter || a.types.includes(filter)

    let elements = []
    for (let [name, attack] of Object.entries(attacks).filter(selected)) {
        elements.push(html`<${Attack} attack=${attack}/>`)
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
