import '/web_modules/preact/debug.js';
import { html, map } from '/src/core.js'
import { useState, useMemo } from '/web_modules/preact/hooks.js'
import { useCharacter, CardModal, Modal, useRoll, Vantage, FilterBar} from '/src/components.js'


const useAttackRoll = function(attack) {
    let roll = useRoll({
        id: attack.name,
        type: 'attack',
        extra: 'AUTOCRIT',
        bonus: attack.bonus,
        options: attack.options,
    })
    const [attackDamage, setAttackDamage] = useState(attack.default)

    let currentDamage = Object.assign({}, attack.damage[attackDamage])
    for (const [name, damage] of Object.entries(roll.getModifiers('damage'))) {
        for (let [type, value] of Object.entries(damage)) {
            if (type == 'weapon') {
                type = Object.keys(currentDamage)[0]
            }
            currentDamage[type] = (currentDamage[type] || '') + ' + ' + value
        }
    }

    return {
        attackDamage: attackDamage,
        setAttackDamage: setAttackDamage,
        attack: attack,
        currentDamage: currentDamage,
        ...roll,
    }
}


const Damage = function({damage, sign}) {
    let damages = []
    for (const [k, v] of Object.entries(damage)) {
        damages.push(html`<span class=damage data-type=${k}>${v}${'\u00A0'}${k}</span>`)
    }
    return damages || null
}

const AttackOption = function({name, option, active, toggle}) {
    let details = []
    if (option.damage) {
        const sign = option.replace ? '' : '+'
        details.push(html`<${Damage} damage=${option.damage} sign=${sign}/>`)
    }
    const t = (e) => {
        toggle(name)
    }
    return html`
        <div class="option button ${active ? 'on' : 'off'}" onPointerUp=${t}>
            <span>${name}</span>
        </div>
    `
}


const SelectAttackDamage = function({attack, roll}) {
    const set = dmg => e => roll.setAttackDamage(dmg)

    const nDamage = Object.keys(attack.damage).length
    if (nDamage < 2) {
        return null
    }

    // 1st level spells could have 9 damage options...
    const smol = nDamage > 6

    const select = e => {
        roll.setAttackDamage(e.target.dataset.id)
    }

    const options = Object.keys(attack.damage).map(d => {
        const cls = d == roll.attackDamage ? 'on' : 'off'
        const txt = smol ? d.charAt(0) : d
        return html`<span class="button ${cls}" data-id=${d} onPointerUp=${select}>${txt}</span>`
    })

    return html`<div class="attackDamage button-row ${smol ? 'smol' : ''}">${options}</div>`
}

const AttackDetails = function({hide, attack}) {
    const roll = useAttackRoll(attack)

    let details = [];
    let add = (cls, hdr, content) => details.push(html`
        <div class="detail ${cls}">
            <span class=header>${hdr}: </span>
            <span class=value>${content}</span>
        </div>
    `)
    let half = (attack.half == undefined ? false : attack.half) ? ' for half' : '';

    if (attack.tohit)  { add('tohit', 'To Hit', `${attack.tohit}`) }
    else if (attack.save)   { add('save',  'Save',   `${attack.save}${half}`) }

    if (attack.effect) { add('effect','Effect', `${attack.effect}`) }

    if (roll.currentDamage) {
        add('damage','Damage', html`<${Damage} damage=${roll.currentDamage}/>`)
    }

    if (attack.secondary) {
        if (attack.secondary.effect) { add('secondary-effect', 'Secondary Effect', `${attack.secondary.effect}`)}
        if (roll.secondaryDamage) { add('secondary-damage','Damage', html`<${Damage} damage=${roll.secondaryDamage}/>`) }
    }

    let opts = map(attack.options, (n, o) => {
        const active = roll.activeOptions.includes(n)
        const toggle = active ? roll.removeOption : roll.addOption
        return html` <${AttackOption} name=${n} option=${o} active=${active} toggle=${toggle}/>`
    })

    let conditions = null
    if (attack.tohit) {
        conditions = html`<${Vantage} roll=${roll} extra=${roll.extraName}/>`
    }

    let name = attack.name
    if (attack.url) {
        name = html`<a href=${attack.url}>${attack.name}</a>`
    }

    const attackDamage = html`<${SelectAttackDamage} attack=${attack} roll=${roll}/>`

    return html`
        <div class=details>
            ${details}
            ${attackDamage}
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

    let text = attack.tohit ? attack.tohit : attack.save

    if (!text && attack.damage) {
        const dmg = attack.damage[attack.default]
        text = Object.values(dmg)[0]
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
        return html`<${AttackDetails} hide=${hide} attack=${attack} />`
    }
    const back = (hide) => html`<${AttackDescription} attack=${attack}/>`

    return html`<${CardModal} class=attack title=${attack.name} button=${button} front=${modal} back=${back}/>`
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
