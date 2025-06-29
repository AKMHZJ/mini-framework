//  Framework entry point (exports all modules)

import { initEventSystem } from './event.js';
import { defineRoutes, navigate, initRouter } from './router.js';
// import { makeElement, render } from './dom.js';
import { makeElement, updateDOM, render } from './dom.js';
import { Dispatcher } from './state.js'


//  ###############test dom abstruction###################

// let count = 0;

// function App() {
//   return makeElement('div', { class: 'container' }, [
//     makeElement('h1', {}, `Count: ${count}`),
//     makeElement('button', { id: 'btn' }, 'Increment'),
//   ]);
// }

// render(App(), document.getElementById('app'));




// ##########testing event handling#############

// let count = 0;

// function App() {
//   return makeElement('div', { class: 'container' }, [
//     makeElement('h1', {}, `Count: ${count}`),
//     makeElement('button', { onClick: () => {
//       count++;
//       render(App(), document.getElementById('app'));
//     } }, 'Increment'),
//     makeElement('input', { onInput: e => console.log(e.target.value) }, []),
//   ]);
// }

// const container = document.getElementById('app');
// initEventSystem(container);
// render(App(), container);




// ###########test routing#################

const container = document.getElementById('app');
initEventSystem(container);

function Nav() {
  return makeElement('nav', {}, [
    makeElement('a', { href: '#all', onClick: () => navigate('/all') }, 'All'),
    makeElement('a', { href: '#active', onClick: () => navigate('/active') }, 'Active'),
    makeElement('a', { href: '#completed', onClick: () => navigate('/completed') }, 'Completed'),
  ]);
}

const routes = [
  {
    path: '/all',
    view: () => makeElement('div', { class: 'view' }, [
      Nav(),
      makeElement('h1', {}, 'All Todos'),
    ]),
  },
  {
    path: '/active',
    view: () => makeElement('div', { class: 'view' }, [
      Nav(),
      makeElement('h1', {}, 'Active Todos'),
    ]),
  },
  {
    path: '/completed',
    view: () => makeElement('div', { class: 'view' }, [
      Nav(),
      makeElement('h1', {}, 'Completed Todos'),
    ]),
  },
];

defineRoutes(routes);
initRouter();

export function createApp({ state, reducers = {} }) {
  let parentEl = null
  let vdom = null

  const dispatcher = new Dispatcher()
  //Re-renders the application after every command
  const subscriptions = [dispatcher.afterEveryCommand(renderApp)]

  function emit(eventName, payload) {
    dispatcher.dispatch(eventName, payload)
  }

  for (const actionName in reducers) {
    const reducer = reducers[actionName]
    const subs = dispatcher.subscribe(actionName, (payload) => {
      //Updates the state calling the reducer function
      state = reducer(state, payload)
    })
    //Adds each command subscription to the subscriptions array
    subscriptions.push(subs)

  }
  // function renderApp() {
  //   if (vdom) {
  //     updateDOM(vdom)
  //   }
  //   vdom = view(state, emit)
  //   createDOM(vdom, parentEl)
  // }
  render(vdom, parentEl)
  return {
    //Method to mount the application in the DOM
    mount(_parentEl) {
      parentEl = _parentEl
      render(vdom, parentEl)
    },
    unmount() {
      updateDOM(vdom)
      vdom = null
      subscriptions.forEach((unsubscribe) => unsubscribe())
    }
  }
}