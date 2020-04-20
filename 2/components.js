import { h, Component, render, createContext } from 'https://unpkg.com/preact@latest?module';
import { useState, useMemo, useContext } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';
import htm from 'https://unpkg.com/htm?module'

const html = htm.bind(h)
const map = (obj, func) => Object.entries(obj).map(([k, v]) => func(k, v))

const GROUPS = {
    "Tomb of Annihilation": {
        "Airnel": {},
        "Areni": {},
        "Grondrath": {},
    },
    "West Marches": {
        "Jerem": {},
        "The Count": {},
    },
}

const CharacterContext = createContext();

function getCharacter() {
  const context = useContext(CharacterContext)
  if (!context) {
    throw new Error(`getCharacter must be used within a CharacterProvider`)
  }
  return context
}


function CharacterProvider(props) {
  const [group, setGroup] = useState(null);
  const [name, setName] = useState(null);
  const data = group ? GROUPS[group][name] || {} : {};
  const contextValue = {
      group: group,
      name: name,
      data: data,
      setGroup: setGroup,
      setName: setName,
  }
  return html`<${CharacterContext.Provider} value=${contextValue} ...${props} />`
}

const CharacterSelector = function() {
    let {group, name, setGroup, setName} = getCharacter()

    const set = (e) => {
        setName(e.target.value)
        setGroup(e.target.selectedOptions[0].parentNode.label)
    }

    let optionGroups = [html`<option value="">Choose character...</option>`];
    for (let [group, characters] of Object.entries(GROUPS)) {
        let options = map(characters, (k, v) => html`<option value="${k}">${k}</option>`)
        optionGroups.push(html`<optgroup label=${group}>Campaign: ${options}</optgroup>`)
    }

    return html`
        <section id="selector">
            <select value=${name} onChange=${set}>${optionGroups}</select>
        </section>
    `
}

const Character = function() {
    let {name} = getCharacter()
    if (!name) {
        return null;
    }
    return html`
        <section id="character">
            <${Status}/>
            <${Attacks}/>
            <${Result}/>
        </section>
    `
}

const Status = function() {
    return html`
        <section id=status>
            Status
        </section>
    `
}


const Attacks = function() {
    return html`
        <section id=attacks>
            Attacks here
        </section>
    `
}

const Result = function() {
    return html`
        <section id=result>
            Result Here
        </section>
    `
}

const AtHack = function() {
    return html`
        <${CharacterProvider}>
            <${CharacterSelector}/>
            <${Character}/>
        </${CharacterProvider}>
    `
}

const app = html`<${AtHack}/>`

render(app, document.body);
