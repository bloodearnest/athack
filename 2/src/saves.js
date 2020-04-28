import '/web_modules/preact/debug.js';
import { useState } from '/web_modules/preact/hooks.js';
import { html, map, getCharacter, Modal, ATTRIBUTES} from '/src/core.js'

const Save = function({id, name, save}) {
    const button = (show) => html`<span class=button onClick=${show}>${save}</span`
    const modal = (hide) => {
        return html`
            <div class=save-details>
                <div class="title save-name">${name} Saving Throw</div>
                <div class="detail save-bonus">
                    <span class=header>Bonus: </span>
                    <span class=value>${save}</span>
                </div>
            </div>
        `
    }

    return html`
        <div class=save>
            <span class=name>${name}</div>
            <${Modal} class=save-menu button=${button} modal=${modal}/>
        </div>
    `
}


const Saves = function() {
    const character = getCharacter()
    let saves = []
    for (const [id, name] of Object.entries(ATTRIBUTES)) {
        const save = character.saves[id]
        saves.push(html`<${Save} name=${name} save=${save}/>`)
    }
    return html`<section id=saves>${saves}</section>`
}


export { Saves }
