import '/web_modules/preact/debug.js';
import { useState } from '/web_modules/preact/hooks.js';
import { html, getCharacter, Modal, ATTRIBUTES, Vantage, useRoll, RollProvider} from '/src/core.js'



const SaveConditions = function({name}) {
    const roll = useRoll()
    return html`
        <div class=conditions>
            <${Vantage} save=${name}/>
            <span class="button vantage-extra ${roll.resistance ? 'on': 'off'}"
                  onClick=${roll.toggleResistance}>Resistance</span>
        </div>
    `
}



const Save = function({id, name, save}) {
    const {reset} = useRoll()
    const button = (show) => html`<span class=button onClick=${show}>${save}</span`
    const modal = (hide) => {
        return html`
            <div class=save-details>
                <div class="title save-name">${name} Saving Throw</div>
                <div class="detail save-bonus">
                    <span class=header>Bonus: </span>
                    <span class=value>${save}</span>
                </div>
                <${SaveConditions} name=${id}/>
            </div>
        `
    }

    return html`
        <div class=save>
            <span class=name>${name}</div>
            <${Modal} class=save-menu button=${button} modal=${modal} reset=${reset}/>
        </div>
    `
}


const Saves = function() {
    const character = getCharacter()
    let saves = []
    const options = []
    for (const [id, name] of Object.entries(ATTRIBUTES)) {
        const save = character.saves[id]
        saves.push(html`
            <${RollProvider} type=save save=${id}options=${options}>
                <${Save} id=${id} name=${name} save=${save}/>
            </${RollProvider}>
        `)
    }
    return html`<section id=saves>${saves}</section>`
}


export { Saves }
