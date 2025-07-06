// const button = {
//   tag: "button",
//   attrs: {
//     className: "button",
//     onClick: () => alert("Button clicked!"),
//   },
//   children: ["Click"],
// };

// const handlers = new Map();
// function attachListener(root, eventType) {
//   root.addEventListener(eventType, (event) => {
//     const target = findRegisteredElement(event.target, eventType);
//     if (target) {
//       handlers.get(target).get(eventType)(event);
//     }
//   });
// }

// // const but = attachListener('home', 'click')
// // console.log(but);

// const inputComponent = {
//   tag: "input",
//   attrs: {
//     type: "text",
//     placeholder: "Typing...",
//     onInput: (e) => console.log("Typing:", e.target.value),
//     onKeyPress: (e) => {
//       if (e.key === "Enter") {
//         console.log("Enter pressed!");
//       }
//     },
//   },
// };


// const fakeEventInput = { target: { value: "hello" } }; // Typing: hello
// inputComponent.attrs.onInput(fakeEventInput); 

// const fakeEventKeyPressEnter = { key: "Enter" };
// inputComponent.attrs.onKeyPress(fakeEventKeyPressEnter); // Enter pressed!

// const fakeEventKeyPressOther = { key: "a" };
// inputComponent.attrs.onKeyPress(fakeEventKeyPressOther); // rien


// const input = document.createElement(inputComponent.tag);
//   Object.entries(inputComponent.attrs).forEach(([key, value]) => {
//     if (key.startsWith("on")) {
//       input.addEventListener(key.slice(2).toLowerCase(), value);
//     } else {
//       input.setAttribute(key, value);
//     }
//   });

//   document.body.appendChild(input);

//   // --- TESTS SIMPLES ---
//   console.log("Test 1 - Type :", input.type === "text" ? "✅ Pass" : "❌ Fail");
//   console.log("Test 2 - Placeholder :", input.placeholder === "Typing..." ? "✅ Pass" : "❌ Fail");

//   // Simuler une saisie
//   input.value = "Hello Hasnae";
//   input.dispatchEvent(new Event("input")); // Affiche: Typing: Hello world

//   // Simuler appui sur Enter
//   input.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" })); // Affiche: Enter pressed!

//   // Simuler appui sur une autre touche
//   input.dispatchEvent(new KeyboardEvent("keypress", { key: "a" })); // Aucun message

// DOM abstraction and manipulation logic



// Importe ici ton code si tu utilises un module
// const { on, initEventSystem } = require('./event');

//////////////////////////
// ⚙️ Setup
//////////////////////////

// DOM abstraction and manipulation logic

// function makeElement(tag, attrs = {}, children = []) {
//   children = Array.isArray(children) ? children : [children];

//   children = children.map((child) =>
//     typeof child === "string" || typeof child === "number"
//       ? { tag: "#text", attrs: {}, children: [], text: child }
//       : child
//   );

//   return {
//     tag,
//     attrs,
//     children,
//     element: null,
//   };
// }

function createDOM(vnode) {
  if (vnode.tag === "#text") {
    const textNode = document.createTextNode(vnode.text);
    vnode.element = textNode;
    return textNode;
  }

  const element = document.createElement(vnode.tag);
  vnode.element = element;

  // handlling attributes
  for (const [key, value] of Object.entries(vnode.attrs)) {
    if (key.startsWith("on")) {
      // event handlers
      const eventName = key.toLowerCase().slice(2)
      on(eventName, element, value)
    } else {
      element.setAttribute(key, value);
    }
  }

  // render children
  vnode.children.forEach((child) => {
    const childElement = createDOM(child);
    element.appendChild(childElement);
  });

  return element;
}



let prevVNode = null;

function render(vnode, container) {
  if (prevVNode) {
    updateDOM(prevVNode, vnode, container);
  } else {
    const dom = createDOM(vnode);
    container.innerHTML = "";
    container.appendChild(dom);
  }
  prevVNode = vnode;
}


function updateDOM(oldVNode, newVNode, parent) {
  if (!oldVNode || oldVNode.tag != newVNode.tag) {
    const newElement = createDOM(newVNode);
    parent.replaceChild(newElement, oldVNode.element)
    newVNode.element = newElement
    return
  }

  newVNode.element = oldVNode.element
  const oldAttrs = oldVNode.attrs
  const newAttrs = newVNode.attrs

  for (const key of Object.keys(oldAttrs)) {
    if (!(key in newAttrs)) {
      newVNode.element.removeAttribute(key);
    }
  }

  for (const [key, value] of Object.entries(newAttrs)) {
    if (oldAttrs[key] !== value) {
      newVNode.element.setAttribute(key, value);
    }
  }

  const oldChildren = oldVNode.children || [];
  const newChildren = newVNode.children || [];
  const maxLenght = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < length; i++) {
    if (i < oldChildren.length && i < newChildren.length) {
      (oldChildren[i], newChildren[i], newVNode.element);
    } else if (i < oldChildren.length) {
      newVNode.element.removeChild(oldChildren[i].element);
    } else {
      const newChildElement = createDOM(newChildren[i]);
      newVNode.element.appendChild(newChildElement);
      newChildren[i].element = newChildElement;
    }
  }

}



const handlers = new Map();
const eventHandlers = new Map();

/// List of Events
const Events = [
    'click', 'dblclick', 'keydown', 'keyup', 'keypress', 
    'input', 'change', 'focus', 'blur',
    'submit', 'reset', 'scroll', 'resize'
];
/*************🌟 1. Registry 🌟*************/
function registry(element, eventType, handler) {
    if (!handlers.has(element)) {
        handlers.set(element, new Map());
    }

    const eventMap = handlers.get(element);
    if (!eventMap.has(eventType)) {
        eventMap.set(eventType, []);
    }

    eventMap.get(eventType).push(handler);
}

/*************🌟 2. Attach Listener 🌟*************/ /*👍*/
function attachListener(element, eventType, handler) {
     if (!element || !eventType || !handler) return
     if (!Events.includes(eventType)) return

    //initEventSystem(); // if we need to
    
    // Register the handler
    registry(element, eventType, handler);
}


/*************🌟 4. Init Event System 🌟*************/ /*👍*/
function initEventSystem(container = document) {
  Events.forEach((eventType) => {
    container.addEventListener(eventType, (event) => {
      const match = findRegisteredElement(event);
      if (match) {
        match.handlers.forEach(handler => handler(event));
      } 
    })
  })
}


/*************🌟 3. Find Registered Element 🌟*************/
function findRegisteredElement(event) {
  let target = event.target;
    while (target && target !== document) {
        if (handlers.has(target)) {
            const eventMap = handlers.get(target);
            if (eventMap.has(event.type)) {
                return {
                    element: target,
                    handlers: eventMap.get(event.type)
                };
            }
        }
        target = target.parentNode;
    }
    return null;
}


/*************🌟 5. ON  🌟*************/  /*👍*/
function on(element, eventType, handler) {
    attachListener(element, eventType, handler);
}


/// Supposé que toutes tes fonctions sont définies ici (ou importées si module)
// registry, attachListener, findRegisteredElement, initEventSystem, on

// Reset state before each test
// handlers.clear();

// // Simule un DOM simple
// const div = document.createElement("div");
// div.id = "test-div";
// document.body.appendChild(div);

// ///////////////////////
// // 🔹 Test 1: registry
// ///////////////////////
// let called1 = false;
// function handler1() { called1 = true }

// registry(div, "click", handler1);

// const map = handlers.get(div);
// console.log(map.has("click"), map.get("click").includes(handler1));

// console.assert(map.has("click"), "❌ Test 1.1: Event type not registered");
// console.assert(map.get("click").includes(handler1), "❌ Test 1.2: Handler not registered");
// console.log("✅ Test 1 Passed: registry");

// ////////////////////////////
// // 🔹 Test 2: attachListener
// ////////////////////////////
// let called2 = false;
// function handler2() { called2 = true }

// attachListener(div, "click", handler2);
// const map2 = handlers.get(div);
// console.assert(map2.has("click"), "❌ Test 2.1: attachListener failed to register event");
// console.assert(map2.get("click").includes(handler2), "❌ Test 2.2: Handler not attached");
// console.log("✅ Test 2 Passed: attachListener");

// /////////////////////////////////////////
// // 🔹 Test 3: findRegisteredElement
// /////////////////////////////////////////
// let called3 = false;
// function handler3() { called3 = true }

// const btn = document.createElement("button");
// div.appendChild(btn);
// registry(btn, "click", handler3);

// const fakeEvent = new MouseEvent("click", { bubbles: true });
// console.log(fakeEvent);

// Object.defineProperty(fakeEvent, "target", { value: btn });

// const found = findRegisteredElement(fakeEvent);
// console.assert(found && found.element === btn, "❌ Test 3.1: Element not found");
// console.assert(found.handlers.includes(handler3), "❌ Test 3.2: Handler not found");
// console.log("✅ Test 3 Passed: findRegisteredElement");

// /////////////////////////////////////////
// // 🔹 Test 4: initEventSystem + bubbling
// /////////////////////////////////////////
// let handlerFired = false;
// function globalHandler() { handlerFired = true }

// on(btn, "click", globalHandler);
// initEventSystem(); // sets up delegation

// btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));

// setTimeout(() => {
//   console.assert(handlerFired, "❌ Test 4 Failed: Event did not trigger delegated handler");
//   console.log("✅ Test 4 Passed: initEventSystem + delegation");
// }, 0);

// /////////////////////////////////////////
// // 🔹 Test 5: on (wrapper for attachListener)
// /////////////////////////////////////////
// let called5 = false;
// console.log(called5, '5');
// const span = document.createElement("span");
// document.body.appendChild(span);

// on(span, "click", () => { 
//   console.log(called5, '55');
//   called5 = true });
// span.dispatchEvent(new MouseEvent("click", { bubbles: true }));

// setTimeout(() => {
//   console.log(called5, '5');
  
//   console.assert(called5, "❌ Test 5 Failed: `on` did not attach or respond");
//   console.log("✅ Test 5 Passed: on()");
// }, 0);

function makeElement(tag, attrs = {}, children = []) {
  // ── extract special "key" ---------------------------------
  let key = undefined;
  if ("key" in attrs) {
    key = attrs.key;
    delete attrs.key;           // do not output it as HTML attr
  }

   children = (Array.isArray(children) ? children : [children]).filter(
    (c) => c !== null && c !== undefined
  );
  children = children.map((child) =>
    typeof child === "string" || typeof child === "number"
      ? { tag: "#text", attrs: {}, children: [], text: child }
      : child
  );

  return { tag, attrs, children, element: null, key };
}


/////////////////////////////////////////////
let count = 0;
function App() {
  return makeElement('div', { class: 'container' }, [
    makeElement('h1', {}, `Count: ${count}`),
    makeElement('button', { onClick: () => {
      console.log('heey');
      
      count++;
    
      
      render(App(), document.getElementById('frame'));
    } }, 'Increment'),
  ]);
}

const container = document.getElementById('frame');
console.log(container, "container");

initEventSystem(container);
render(App(), container);
///////////////////////////