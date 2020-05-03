import '/web_modules/preact/debug.js';
import { h } from '/web_modules/preact.js'
import { useState, useEffect, useCallback, useRef } from '/web_modules/preact/hooks.js'
import htm from '/web_modules/htm.js'

const html = htm.bind(h)
const map = (obj, func) => Object.entries(obj).map(([k, v]) => func(k, v))

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
    useSwipe,
    useEventListener,
}
