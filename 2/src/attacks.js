import '/web_modules/preact/debug.js';
import { createContext } from '/web_modules/preact.js';
import { useState, useContext, useRef, useMemo } from '/web_modules/preact/hooks.js';
import { html, map } from '/src/core.js'
import { useCharacter, CardModal, Modal, useRoll, Vantage, FilterBar} from '/src/components.js'


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
    if (attack.secondary) {
        if (attack.secondary.damage) { add('secondary-damage', 'Secondary Damage', html`<${Damage} damage=${attack.secondary.damage}/>` )}
        if (attack.secondary.effect) { add('secondary-effect', 'Secondary Effect', `${attack.secondary.effect}`)}
    }

    let opts = map(attack.options, (n, o) => {
        const active = activeOptions.includes(n)
        const toggle = active ? roll.removeOption : roll.addOption
        return html` <${AttackOption} name=${n} option=${o} active=${active} toggle=${toggle}/>`
    })

    let conditions = null
    if (attack.tohit) {
        conditions = html`<${Vantage} roll=${roll} extra=AUTOCRIT/>`
    }

    let name = attack.name
    if (attack.url) {
        name = html`<a href=${attack.url}>${attack.name}</a>`
    }

    return html`
        <div class=details>
            ${details}
            ${conditions}
            <div class=options>${opts}</div>
        </div>
    `
}


const AttackDescription = function({attack}) {
    const description = (attack.description || []).map(d => html`<p class=description>${d}</p>`)

    const tag_list = Array.from(new Set(Object.keys(attack.properties || []).concat(attack.tags || []).concat(attack.notes)))
    const tags = tag_list.map((t, i) => html`${i == 0 ? '': ', '}<span>${t}</span>`)
    return html`
        <div class=attack-description>
            <div class=tags>
                ${tags}
            </div>
            ${description}
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
    let name = attack.name

    const button = (show, cls) => {
        return html`
            <div class=summary>
                <span class=name>${name}</span>
                <span class="button ${cls}" onClick=${show}>${text}</span>
            </div>
        `
    }
    const modal = (hide) => {
        return html`<${AttackDetails} hide=${hide} attack=${attack} roll=${roll}/>`
    }
    const back = (hide) => html`<${AttackDescription} attack=${attack}/>`

    return html`<${CardModal} class=attack title=${attack.name} button=${button} front=${modal} back=${back} reset=${roll.reset}/>`
}


const Attacks = function() {
    const {name, attacks} = useCharacter()
    const [attackType, setAttackType] = useState(null)
    const filters = ['Melee', 'Ranged', 'Spell', 'AoE'];

    const bar = FilterBar({ filters: filters, current: attackType, set: setAttackType })
    let selected = ([n, a]) => !attackType || a.types.includes(attackType)
    let elements = []
    for (let [name, attack] of Object.entries(attacks).filter(selected)) {
        elements.push(html`<${Attack} attack=${attack}/>`)
    }

    return html`
        <section id=attacks>
            ${bar}
            ${elements}
        </section>
    `
}

export {
    Attacks
}
