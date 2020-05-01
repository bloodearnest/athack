import '/web_modules/preact/debug.js';
import { h } from '/web_modules/preact.js'
import { useState, useEffect, useCallback, useRef } from '/web_modules/preact/hooks.js'
import htm from '/web_modules/htm.js'

const html = htm.bind(h)
const map = (obj, func) => Object.entries(obj).map(([k, v]) => func(k, v))

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
const CONDITIONS = {
    "Bless":            {hitbonus: '1d4', savebonus: '1d4'},
    "Bane":             {hitbonus: '-1d4', savebonus: '-1d4'},
    "Invisible":        {attacks: 'A'},
    "Synaptic Static":  {hitbonus: '-1d6', checkbonus: '-1d6'},
    "Enlarge":          {damage: '1d4'},
    "Reduce":           {damage: '-1d4'},
    "Poisoned":         {attacks: 'D', checks: 'D'},
    "Restrained":       {attacks: 'D', saves: {dex: 'D'}},
    "Prone":            {attacks: 'D'},
    "Frightened":       {attacks: 'D', checks: 'D'},
    "Exhausted 1":      {checks: 'D'},
    "Exhausted 3":      {attacks: 'D', saves: 'D'},
}

// calculate the current vantage from character conditions
function GetVantage(conditions) {
    let attacks = {advantage: 0, disadvantage: 0}
    let checks = {advantage: 0, disadvantage: 0}
    let saves = {
        str: {advantage: 0, disadvantage: 0},
        dex: {advantage: 0, disadvantage: 0},
        con: {advantage: 0, disadvantage: 0},
        'int': {advantage: 0, disadvantage: 0},
        wis: {advantage: 0, disadvantage: 0},
        cha: {advantage: 0, disadvantage: 0},
    }
    let hitbonus = {}
    let damagebonus = {}
    let savebonus = {}
    let checkbonus = {}

    let toCheck = Object.entries(CONDITIONS).filter(([k, v]) => conditions.includes(k))
    for (const [k, v] of toCheck) {
        if (v.attacks == 'A') { attacks.advantage += 1 }
        else if (v.attacks == 'D') { attacks.disadvantage += 1 }

        if (v.checks == 'A') { checks.advantage += 1 }
        else if (v.checks == 'D') { checks.disadvantage += 1 }

        if (v.saves) {
            if (v.saves === 'A') {
                for (const [attr, save] of Object.entries(saves)) {
                    saves[attr].advantage += 1
                }
            } else if (v.saves === 'D') {
                for (const [attr, save] of Object.entries(saves)) {
                    saves[attr].disadvantage += 1
                }
            } else {
                for (const [attr, save] of Object.entries(v.saves)) {
                    if (attr == 'all')
                    if (save == 'A') { saves[attr].advantage += 1 }
                    else if (save == 'D') { saves[attr].disadvantage += 1 }
                }
            }
        }
        if (v.hitbonus) { hitbonus[k] = v.hitbonus }
        if (v.savebonus) { savebonus[k] = v.savebonus }
        if (v.damage) { damagebonus[k] = v.damage }
        if (v.checkbonus) { checkbonus[k] = v.checkbonus }
    }
    const calculate = obj => {
        return {
            advantage: obj.advantage > 0 && obj.disadvantage == 0,
            disadvantage: obj.disadvantage > 0 && obj.advantage == 0,
        }
    }
    const check_skill = calculate(checks)
    return {
        attack: calculate(attacks),
        check: check_skill,
        skill: check_skill,
        save: {
            str: calculate(saves['str']),
            dex: calculate(saves['dex']),
            con: calculate(saves['con']),
            'int': calculate(saves['int']),
            wis: calculate(saves['wis']),
            cha: calculate(saves['cha']),
        },
        hitbonus: hitbonus,
        savebonus: savebonus,
        damagebonus: damagebonus,
        checkbonus: checkbonus,
    }
}

function computeSwipeDirection (gesture, tolerance) {
    const dx = gesture.x.pop() - gesture.x[0]
    const dy = gesture.y.pop() - gesture.y[0]
    const absdx = Math.abs(dx)
    const absdy = Math.abs(dy)

    console.log(absdx, absdy)

    if (absdx < tolerance && dy > tolerance) {
        return 'up'
    } else if (dy < tolerance && absdx < tolerance && absdy > tolerance) {
        return 'down'
    } else if (dx < tolerance && absdx > tolerance && absdy < tolerance) {
        return 'right'
    } else if (dx > tolerance && absdy < tolerance) {
        return 'left'
    }
    return null
}


const useEventListener = (eventName, handler, ref) => {
    const savedHandler = useRef()

    useEffect(() => { savedHandler.current = handler }, [handler])

    useEffect(
        () => {
            if (!ref.current) {
                console.log('useSwipe: no element')
                return
            }

            const listener = e => savedHandler.current(e)
            ref.current.addEventListener(eventName, listener)
            return () => {
                ref.current.removeEventListener(eventName, listener)
            }
        },
        [eventName, ref.current]
    )
}

const useSwipe = (handler, ref, tolerance = 100) => {
    const [gesture, setGesture] = useState({ x: [], y: [] })
    const savedHandler = useRef()

    useEffect(() => { savedHandler.current = handler }, [handler])

    const trace = useCallback(
        (ev) => {
            console.log(ev.type)
            if (ev.touches) {
                gesture.x.push(ev.touches[0].clientX)
                gesture.y.push(ev.touches[0].clientY)
            } else {
                gesture.x.push(ev.clientX)
                gesture.y.push(ev.clientY)
            }
            setGesture(gesture)
        },
        [gesture, setGesture]
    )

    const addListeners = useCallback(ref => {
        //ref.current.addEventListener('touchmove', trace)
        ref.current.addEventListener('mousemove', trace)
        ref.current.addEventListener('pointermove', trace)
        //ref.current.addEventListener('touchend', compute)
        ref.current.addEventListener('mouseup', compute)
        ref.current.addEventListener('pointerup', compute)
    }, [gesture, setGesture])

    const removeListeners = useCallback(ref => {
        //ref.current.removeEventListener('touchmove', trace)
        ref.current.removeEventListener('mousemove', trace)
        ref.current.removeEventListener('pointermove', trace)
        //ref.current.removeEventListener('touchend', compute)
        ref.current.removeEventListener('mouseup', compute)
        ref.current.removeEventListener('pointerup', compute)
    }, [gesture, setGesture])


    const compute = useCallback(ev => {
        console.log(ev.type)
        ev.preventDefault()
        if (ref.current) {
            removeListeners(ref)
            console.log(gesture)
            const direction = computeSwipeDirection(gesture, tolerance)
            if (direction !== null) { savedHandler.current(direction) }
            setGesture({ x: [], y: [] })
        }
    }, [gesture, setGesture])

    const start = useCallback(ev => {
        console.log(ev.type)
        ev.preventDefault()
        setGesture({x: [], y: []})
        addListeners(ref)
    }, [gesture, setGesture])

    //useEventListener('touchstart', start, ref)
    useEventListener('mousedown', start, ref)
    useEventListener('pointerdown', start, ref)
    useEventListener('pointercancel', e => console.log(e.type), ref)
}


export {
    html,
    map,
    ATTRIBUTES,
    GetVantage,
    useSwipe,
    useEventListener,
}
