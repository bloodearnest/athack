import '/web_modules/preact/debug.js';
import { useState } from '/web_modules/preact/hooks.js';
import { html, map, getCharacter, Modal, ATTRIBUTES} from '/src/core.js'

const Check = function({id, name, check}) {
    const button = (show) => html`<span class=button onClick=${show}>${check}</span`
    const modal = (hide) => {
        return html`
            <div class=check-details>
                <div class="check-name title">${name} Check</div>
                <div class="detail check-bonus">
                    <span class=header>Bonus: </span>
                    <span class=value>${check}</span>
                </div>
            </div>
        `
    }

    return html`
        <div class=check>
            <span class=name>${name}</div>
            <${Modal} class=check-menu button=${button} modal=${modal}/>
        </div>
    `
}


const Checks = function() {
    const character = getCharacter()
    let checks = []
    for (const [id, name] of Object.entries(ATTRIBUTES)) {
        const check = character.abilities[id].bonus
        checks.push(html`<${Check} name=${name} check=${check}/>`)
    }
    return html`<section id=checks>${checks}</section>`
}


export { Checks }
