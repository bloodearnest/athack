import '/web_modules/preact/debug.js';
import { useState } from '/web_modules/preact/hooks.js';
import { html, map, getCharacter, Modal} from '/src/core.js'


const Skill = function({name, bonus}) {
    const button = (show) => html`<span class=button onClick=${show}>${bonus}</span>`
    const modal = (hide) => {
        return html`
            <div class=skill-details>
                <div class="title skill-name">${name} Check</div>
                <div class="detail skill-bonus">
                    <span class=header>Bonus: </span>
                    <span class=value>${bonus}</span>
                </div>
            </div>
        `
    }

    return html`
        <div class=skill>
            <span class=name>${name}</span>
            <${Modal} class=skill-menu button=${button} modal=${modal}/>
        </div>
    `

}


const Skills = function() {
    const character = getCharacter()
    const skills = map(character.skills, (name, skill) => html`<${Skill} name=${name} bonus=${skill.bonus}/>`)
    return html`<section id=skills>${skills}</section>`
}


export { Skills }
