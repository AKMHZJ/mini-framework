// Custom event handling system

const handlers = new Map();

/* attach a single delegated listener to the root container */
function attachListener(root, eventType) {
  root.addEventListener(eventType, (event) => {
    const target = findRegisteredElement(event.target, eventType);
    if (target) {
      handlers.get(target).get(eventType)(event);
    }
  });
}

/* walk up the DOM tree to find the first element that registered this event */
function findRegisteredElement(node, eventType) {
  let current = node;
  while (current) {
    if (handlers.has(current) && handlers.get(current).has(eventType)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

// export function initEventSystem(container){
//   const eventTypes = ['click', 'keypress', 'scroll', 'input', 'change'];

//   eventTypes.forEach(eventType => {
//     attachListener(container, eventType, event => {
//       const registeredElement = findRegisteredElement(event.target, event);
//       if(registeredElement){
//         const handler = handlers.get(registeredElement).get(eventType);
//         handler(event)
//       }
//     })
//   })
// }


/* public: register an event handler on any element */
export function on(eventType, element, handler) {
  if (!handlers.has(element)) handlers.set(element, new Map());
  handlers.get(element).set(eventType, handler);
}


/* public: one-time bootstrapping on the root container */
export function initEventSystem(container) {
  const eventTypes = [
    "click",
    "input",
    "dblclick",      // ← NEW: needed for label editing
    "change",
    "keypress",  // still needed for edit-Enter handler
    "keydown",   // <— needed for add-todo Enter + Esc in edit field
    "keyup",
    "scroll",
  ];

  eventTypes.forEach((type) => attachListener(container, type));
}