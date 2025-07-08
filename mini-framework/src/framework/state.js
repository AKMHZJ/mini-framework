// // State management logic
// import { createDOM, updateDOM } from "./dom"

// //define the component
// class Component { }

// //instantiate the component
// (new Component())

// class Component {
//     render() {
//         // return the virtual DOM of the component
//     }
// }

// //
// export function defineComponent({ render }) {
//     class Component {
//         #vdom = null
//         #hostEL = null
//         #isMounted = false
//         render() {
//             return render()
//         }
//         createDOM(hostEl) {
//             if (this.#isMounted) {
//                 throw new Error('Component is already mounted')
//             }
//             this.#vdom = this.render()
//             createDOM(this.#vdom)
//             // this.#hostEl = hostEl
//             this.#isMounted = true
//         }
//         unmount() {
//             if (!this.#isMounted) {
//                 throw new Error('Component is not mounted')
//             }
//             updateDOM(this.#vdom)
//             this.#vdom = null
//             this.#isMounted = false
//             // this.#hostEl = null
//         }
//     }
//     return Component
// }






// export class Dispatcher {
//     #subs = new Map()
//     #afterHandlers = []
//     subscribe(commandName, handler) {
//         //Creates the array of subscriptions if it doesn’t exist for a given command name
//         if (!this.#subs.has(commandName)) {
//             this.#subs.set(commandName, [])
//         }
//         const handlers = this.#subs.get(commandName)
//         //Checks whether the handler is registered
//         if (handlers.includes(handler)) {
//             return () => { }
//         }
//         //Registers the handler
//         handlers.push(handler)
//         //Returns a function to unregister the handler
//         return () => {
//             const idx = handlers.indexOf(handler)
//             handlers.splice(idx, 1)
//         }
//     }

//     //Register a function that runs after every command is handled.
//     afterEveryCommand(handler) {
//         //Registers the handler
//         this.#afterHandlers.push(handler)
//         //Returns a function to unregister the handler
//         return () => {
//             const idx = this.#afterHandlers.indexOf(handler)
//             this.#afterHandlers.splice(idx, 1)
//         }
//     }
    
//     dispatch(commandName, payload) {
//         //Checks whether handlers are registered and calls them
//         if (this.#subs.has(commandName)) {
//             this.#subs.get(commandName).forEach((handler) => handler(payload))
//         } else {
//             console.warn(`No handlers for command: ${commandName}`)
//         }
//         this.#afterHandlers.forEach((handler) => handler())
//     }

// }








const stateValues = []

let state = {};
const listeners = new Set();
let callIndex = -1;   // for useState hook order

/* ---------- bootstrap ---------- */
export function initState(initialState) {
  state = { ...initialState };
}

/* ---------- basic getters / setters ---------- */
export function getState() {
  return { ...state };             // return a shallow copy
}

export function setState(newState) {
  state = { ...state, ...newState };

  /* ensure hooks array exists */
  if (!Array.isArray(stateValues)) stateValues = [];

  listeners.forEach((fn) => fn(state));
}

/* ---------- subscription API ---------- */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ---------- lightweight useState hook ---------- */

export const useState = (initialValue) => {
  callIndex++
  const currentCallIndex = callIndex
  if (stateValues[currentCallIndex] === undefined) {
    stateValues[currentCallIndex] = initialValue
  }

  const setValue = (newValue) => {
    //React allows passing a function to setState
    if (typeof newValue === 'function') {
      stateValues[currentCallIndex] = newValue(stateValues[currentCallIndex])
    } else {
      stateValues[currentCallIndex] = newValue
    }

     listeners.forEach((fn) => fn(state));
  }
  return [stateValues[currentCallIndex], setValue]
}

export function resetHookIndex() {
  callIndex = -1;
}