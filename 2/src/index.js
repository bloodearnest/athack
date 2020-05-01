import '/web_modules/preact/debug.js';
import { render } from '/web_modules/preact.js';
import { html, map } from '/src/core.js'
import { useCharacter, CharacterProvider, Modal, Checks, Saves, Skills } from '/src/components.js'
import { Attacks } from '/src/attacks.js'
import { readCharacters } from '/src/data.js'


const MOD_GROUPS = {
    "Conditions": ["Poisoned", "Restrained", "Prone", "Frightened", "Exhausted 1", "Exhausted 3"],
    "Spells": ["Bless", "Invisible", "Bane", "Synaptic Static", "Enlarge", "Reduce"],
}


const CharacterBar = function({characters}) {
    return html`
        <section id=character>
            <div id=selector>
                <${CharacterSelector} characters=${characters}/>
                <${AddCondition}/>
            </div>
            <${ConditionsBar}/>
        </section>
    `
}

const CharacterSelector = function({characters}) {
    let {name, setCharacter} = useCharacter()

    const button = (show, cls) => {
        return html`<span class="name ${cls}" onClick=${show}>${name || 'Character...'}</span>`
    }

    const modal = (hide) => {

        const select = (e) => {
            setCharacter(e.target.dataset.name, e.target.dataset.group)
            hide(e)
        }

        let options = []
        for (const [id, group] of Object.entries(characters.campaigns)) {
            options.push(html`<li class=group>${group.name}</li>`)
            Object.keys(group.characters).forEach((name) => {
                options.push(html`
                    <li data-name=${name} data-group=${id} onClick=${select}>${name}</li>
                `)
            })
        }
        return html`<ul>${options}</ul>`
    }

    return html`<${Modal} class=selector title=Character button=${button} modal=${modal}/>`
}

const AddCondition = function() {
    const {conditions, addCondition} = useCharacter()

    const button = (show, cls) => html`<span class="button ${cls}" onClick=${show}>+</span>`
    const optionList = (close) => {
        let options = []
        const select = (e) => {
            addCondition(e.target.dataset.value)
            close(e)
        }
        for (let [k, v] of Object.entries(MOD_GROUPS)) {
            let valid = v.filter((o) => !conditions.includes(o))
            if (valid.length == 0) {
                continue
            }
            options.push(html`<li class=group>${k}</li>`)
            valid.forEach((o) => options.push(html`<li data-value=${o} onClick=${select}>${o}</li>`))
        }
        return html`<ul>${options}</ul>`
    }

    return html`<${Modal} title="Status Effects" class="condition-menu" button=${button} modal=${optionList}/>`
}

const ConditionsBar = function() {
    const {conditions, removeCondition} = useCharacter()
    const tags = conditions.map((c) => html`<span class="condition button on" onClick=${e =>removeCondition(c)}>${c}</span>`)
    return html`<div id=conditions>${tags}</div>`
}

const RollTypeBar = function() {
    const {activeType, setActiveType} = useCharacter()
    let types = []
    for (const type of ['Attacks', 'Skills', 'Saves', 'Checks']) {
        const active = type == activeType
        types.push(html`
            <span class="${type} button ${active ? "on" : "off"}" onClick=${e => setActiveType(type)}>${type}</span>
        `)
    }

    return html`<section id=type>${types}</section>`

}


const RollType = function() {
    const {activeType} = useCharacter()
    if (activeType == 'Attacks') {
        return html`<${Attacks}/>`
    } else if (activeType == 'Skills') {
        return html`<${Skills}/>`
    } else if (activeType == 'Saves') {
        return html`<${Saves}/>`
    } else if (activeType == 'Checks') {
        return html`<${Checks}/>`
    }
}

const Result = function() {
    return html`
        <section id=result>
        </section>
    `
}

const AtHack = function({characters}) {
    return html`
        <${CharacterProvider} characters=${characters}>
            <div id=header>
                <${CharacterBar} characters=${characters}/>
                <${RollTypeBar}/>
            </div>
            <div id=content>
                <${RollType}/>
            </div>
            <${Result}/>
        </${CharacterProvider}>
    `
}

readCharacters().then((data) => {
    const app = html`<${AtHack} characters=${data}/>`
    render(app, document.querySelector('#app'));
})
