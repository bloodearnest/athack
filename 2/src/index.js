import '/web_modules/preact/debug.js';
import { h, render, createContext } from '/web_modules/preact.js';
import { useState, useRef, useEffect } from '/web_modules/preact/hooks.js';
import { html, map, getCharacter, CharacterProvider } from '/src/core.js'
import { Attacks } from '/src/attacks.js'
import { readCharacters } from '/src/data.js'

const MODIFIERS = {
    "Bless": {hit: '1d4', save: '1d4'},
    "Bane":  {hit: '-1d4', save: '-1d4'},
    "Synaptic Static": {hit: '-1d6'},
    "Enlarge": {damage: '1d4'},
    "Reduce": {damage: '-1d4'},
    "Poisoned": {hit: 'dis'},
    "Restrained": {hit: 'dis'},
    "Prone": {hit: 'dis'},
    "Frightened": {hit: 'dis'},
}

const MOD_GROUPS = {
    "Spells": ["Bless", "Bane", "Synaptic Static", "Enlarge", "Reduce"],
    "Conditions": ["Poisoned", "Restrained", "Prone", "Frightened"],
}

const CharacterSelector = function() {
    let {name, setCharacter} = getCharacter()

    const set = (e) => {
        setCharacter(e.target.value, e.target.selectedOptions[0].parentNode.dataset.id)
    }

    let optionGroups = [html`<option value="">Choose character...</option>`];
    for (let [id, campaign] of Object.entries(CHARACTERS.campaigns)) {
        let options = map(campaign.characters, (c, _) => html`<option value="${c}">${c}</option>`)
        optionGroups.push(html`<optgroup data-id=${id} label=${campaign.name}>Campaign: ${options}</optgroup>`)
    }

    return html`
        <section id=selector class=row>
            <label for=character>
                <select name=character value=${name} onChange=${set}>${optionGroups}</select>
            </label>
        </section>
    `
}

const ConditionTag = function({condition}) {
    let {removeCondition} = getCharacter()
    return html`<span class="condition button on" onClick=${e =>removeCondition(condition)}>${condition}</span>`

}

const ConditionsBar = function() {
    const ref = useRef()
    const {conditions, addCondition} = getCharacter()
    const [active, setActive] = useState(false)

    const cls = (active ? 'on' : 'off')
    const show = (e) => { setActive(true) }
    const select = (e) => {
        addCondition(e.target.dataset.value)
        setActive(false)
    }
    const close = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setActive(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', close, false)
        return () => { document.removeEventListener('mousedown', close, false) }
    })

    let options = []
    for (let [k, v] of Object.entries(MOD_GROUPS)) {
        let valid = v.filter((o) => !conditions.includes(o))
        if (valid.length == 0) {
            continue
        }
        options.push(html`<li class=group>${k}</li>`)
        valid.forEach((o) => options.push(html`<li data-value=${o} onClick=${select}>${o}</li>`))
    }
    return html`
        <section id=conditions>
            <nav class="dropdown button" ref=${ref}>
                <ul class="popup ${cls}">${options}</ul>
                <span class="${cls}" onClick=${show}>+</span>
            </nav>
            ${conditions.map((c) => html`<${ConditionTag} condition=${c}/>`)}
        </section>
    `
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
    return html` <section id=filters class=row>${filters}</section>`
}

const Result = function() {
    return html`
        <section id=result class=row>
        </section>
    `
}

const AtHack = function({characters}) {
    return html`
        <${CharacterProvider} characters=${characters}>
            <${CharacterSelector}/>
            <${ConditionsBar}/>
            <${FilterBar}/>
            <${Attacks}/>
            <${Result}/>
        </${CharacterProvider}>
    `
}

let CHARACTERS = null
readCharacters().then((data) => {
    CHARACTERS = data;
    const app = html`<${AtHack} characters=${CHARACTERS}/>`
    render(app, document.body);
})
