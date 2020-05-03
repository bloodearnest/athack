// names and order of attributes
const ATTRIBUTES = {
    'str': 'Strength',
    'dex': 'Dexterity',
    'con': 'Constitution',
    'int': 'Intelligence',
    'wis': 'Wisdom',
    'cha': 'Charisma',
}

// conditions that can affect a roll
const CHARACTER_MODIFIERS = {
    "Bless":            {attackmod: '1d4', savemod: '1d4'},
    "Bane":             {attackmod: '-1d4', savemod: '-1d4'},
    "Invisible":        {attacks: 'A'},
    "Synaptic Static":  {attackmod: '-1d6', checkmod: '-1d6'},
    "Enlarge":          {damage: '1d4'},
    "Reduce":           {damage: '-1d4'},
    "Poisoned":         {attacks: 'D', checks: 'D'},
    "Restrained":       {attacks: 'D', saves: {dex: 'D'}},
    "Prone":            {attacks: 'D'},
    "Frightened":       {attacks: 'D', checks: 'D'},
    "Exhausted 1":      {checks: 'D'},
    "Exhausted 3":      {attacks: 'D', saves: 'D'},
}

const ROLL_MODIFIERS = {
    "Guidance": {checkmod: '1d4'},
    "Resistance": {savemod: '1d4'},
}

// calculate the current vantage from character conditions
function calculateModifiers(active, modifiers) {
    const empty = () => {
        return {
            advantage: false,
            disadvantage: false,
            advantageSources: [],
            disadvantageSources: [],
            modifiers: {},
        }
    }
    let attacks = empty()
    let checks = empty()
    let saves = {
        'str': empty(),
        'dex': empty(),
        'con': empty(),
        'int': empty(),
        'wis': empty(),
        'cha': empty(),
    }
    let saveModifiers = {}
    let damage = {mods: {}}
    let saveList = Object.keys(saves)

    let setVantage = (vantage, obj, source) => {
        obj[vantage] = true
        obj[vantage + 'Sources'].push(source)
    }

    for (const name of active) {
        const modifier = modifiers[name]
        if (!modifier) {
            console.log('could not find modifier', name)
            continue
        }

        if (modifier.attacks === 'A') { setVantage('advantage', attacks, name) }
        else if (modifier.attacks === 'D') { setVantage('disadvantage', attacks, name) }

        if (modifier.checks === 'A') { setVantage('advantage', checks, name) }
        else if (modifier.checks === 'D') { setVantage('disadvantage', checks, name) }

        if (modifier.saves === 'A') {
            savesList.forEach(s => setVantage('advantage', saves[s], name))
        } else if (modifier.saves === 'D') {
            savesList.forEach(s => setVantage('disadvantage', saves[s], name))
        } else if (modifier.saves) {
            savesList.forEach(s => {
                const sv = saves[s]
                if (sv.saves === 'A') { setVantage('advantage', sv, name) }
                else if (sv.saves === 'D') { setVantage('disadvantage', sv, name) }
            })
        }

        if (modifier.attackmod) { attacks.modifiers[name] = modifier.attackmod  }
        if (modifier.savemod)   { saveModifiers[name]    = modifier.savemod    }
        if (modifier.checkmod)  { checks.modifiers[name]  = modifier.checkmod }
        if (modifier.damagemod) { damage.modifiers[name]  = modifier.damagemod  }
    }

    const calculate = obj => {
        obj.advantage = obj.advantage && !obj.disadvantage
        obj.disadvantage = obj.disadvantage && !obj.advantage
    }
    calculate(attacks)
    calculate(checks)
    saveList.forEach(s => calculate(saves[s]))
    saves.modifiers = saveModifiers

    return {
        attack: attacks,
        check: checks,
        skill: checks,
        save: saves,
        damage: damage,
    }
}


function getCharacterModifiers(active) {
    return calculateModifiers(active, CHARACTER_MODIFIERS)
}


function getRollModifiers(active, modifiers) {
    const allModifiers = Object.assign({}, ROLL_MODIFIERS, modifiers)
    return calculateModifiers(active, allModifiers)
}

function die(size) {
  return Math.floor(Math.random() * (size)) + 1
}


function d20Roll(bonus, advantage, disadvantage, extras, rules) {

    // do base d20 roll first
    let roll = die(20)
    let rolls = [roll]
    let description = null
    if (advantage) {
        rolls.push(die(20))
        if (rules['Elven Accuracy'] || false) {
            rolls.push(die(20))
        }
        roll = Math.max(...rolls)
        description = `${rolls.length}d20 adv (${rolls.map(r => r == roll ? r : "~~" + r + "~~").join()})`
    } else if (disadvantage) {
        rolls.push(die(20))
        roll = Math.min(...rolls)
        description = `${rolls.length}d20 dis (${rolls.map(r => r == roll ? r : "~~" + r + "~~").join()})`
    } else {
        description = `1d20 (${rolls.join()})`
    }

    const iBonus = parseInt(bonus)
    let total = roll + iBonus
    let record = [
        {name: 'd20', description: description, amount: roll},
        {name: 'bonus', description: bonus, amount: iBonus},
    ]
    // add extras
    for (const [name, diceStr] of Object.entries(extras || {})) {
        const [amount, description] = rollDiceStr(diceStr)
        total += amount
        record.push({name: name, description: description, amount: amount})
    }

    record.total = total

    return {
        "total": total,
        "record": record,
    }
}


function *parseDiceStr(diceStr) {
  let tokens = diceStr.split(/\+-/).map((s) => s.trim())

  for (let token of tokens) {
    let parts = token.split('d')

    if (parts.length === 1) {
      yield {
        n: 0,
        size: parseInt(parts[0])
      }
    } else {
      yield {
        n: parts[0] === "" ? 1 : (parts[0] === "-" ? -1 : parseInt(parts[0])),
        size: parseInt(parts[parts.length-1]),
      }
    }
  }
}

function rollDiceStr(diceStr, reroll) {

    let rolls = []
    let total = 0
    let record = ""

    for (const {n, size} of parseDiceStr(diceStr)) {
        if (n === 0) {
            // static bonus
            total += size
            record += `${size}`
        } else {
            let real_n = n
            let sign = n / (Math.abs(n))
            for (let i = 0; i < Math.abs(n); i++) {
                let roll = die(size)
                if (reroll && reroll(roll)) {
                    rolls.push(`~~${roll}~~`)
                    roll = die(size)
                }
                rolls.push(roll)
                total += sign * roll
            }
            record += `${real_n}d${size} (${rolls.join()})`
        }
    }
    return [total, record]
}




export {
    ATTRIBUTES,
    d20Roll,
    getCharacterModifiers,
    getRollModifiers,
}
