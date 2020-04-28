import '/web_modules/preact/debug.js';
import { html, getCharacter, ATTRIBUTES, Modal, RollProvider, Vantage, useRoll} from '/src/core.js'

const CheckConditions = function() {
    const roll = useRoll()
    return html`
        <div class=conditions>
            <${Vantage}/>
            <span class="button vantage-extra ${roll.guidance ? 'on': 'off'}"
                  onClick=${roll.toggleGuidance}>Guidance</span>
        </div>
    `
}

const Check = function({id, name, check}) {
    const {reset} = useRoll()
    const button = (show) => html`<span class=button onClick=${show}>${check}</span`
    const modal = (hide) => {
        return html`
            <div class=check-details>
                <div class="check-name title">${name} Check</div>
                <div class="detail check-bonus">
                    <span class=header>Bonus: </span>
                    <span class=value>${check}</span>
                </div>
                <${CheckConditions}/>
            </div>
        `
    }

    return html`
        <div class=check>
            <span class=name>${name}</div>
            <${Modal} class=check-menu button=${button} modal=${modal} reset=${reset}/>
        </div>
    `
}


const Checks = function() {
    const character = getCharacter()
    let checks = []
    for (const [id, name] of Object.entries(ATTRIBUTES)) {
        const check = character.abilities[id].bonus
        checks.push(html`
            <${RollProvider} type=check>
                <${Check} name=${name} check=${check}/>
            </${RollProvider}>
        `)
    }
    return html`<section id=checks>${checks}</section>`
}


export { Checks }
