//  Framework entry point (exports all modules)

import { makeElement, render } from "./dom.js";

let count = 0;

function App() {
  return makeElement('div', { class: 'container' }, [
    makeElement('h1', {}, `Count: ${count}`),
    makeElement('button', { id: 'btn' }, 'Increment'),
  ]);
}

render(App(), document.getElementById('app'));

// Simulate a manual update (later tied to events/state)
setTimeout(() => {
  count++;
  render(App(), document.getElementById('app'));
}, 2000);