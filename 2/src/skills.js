import '/web_modules/preact/debug.js';
import { html, map } from '/src/core.js'
import { useCharacter, Modal, useRoll, RollProvider, Vantage} from '/src/components.js'


const SkillConditions = function() {
    const roll = useRoll()
    return html`
        <div class=conditions>
            <${Vantage} extra=Guidance/>
        </div>
    `
}


const Skill = function({name, bonus}) {
    const {reset} = useRoll()
    const button = (show) => html`<span class=button onClick=${show}>${bonus}</span>`
    const modal = (hide) => {
        return html`
            <div class=skill-details>
                <div class="title skill-name">${name} Check</div>
                <div class="detail skill-bonus">
                    <span class=header>Bonus: </span>
                    <span class=value>${bonus}</span>
                </div>
                <${SkillConditions}/>
            </div>
        `
    }

    return html`
        <div class=skill>
            <span class=name>${name}</span>
            <${Modal} class=skill-menu button=${button} modal=${modal} reset=${reset}/>
        </div>
    `

}


const Skills = function() {
    const character = useCharacter()
    const skills = map(character.skills, (name, skill) => {
        return html`
            <${RollProvider} type=skill>
                <${Skill} name=${name} bonus=${skill.bonus}/>
            </${RollProvider}>
        `
    })

    return html`<section id=skills>${skills}</section>`
}


export { Skills }
