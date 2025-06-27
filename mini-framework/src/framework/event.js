// Custom event handling system

const handlers = new Map();

function attachListener(element, eventType, callback) {
  element[`on${eventType}`] = callback;
}

function findRegisteredElement(target, eventType) {
  let current = target;

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


// Register a handler for an event on an element.
export function on(eventType, element, handler) {
    if (!handlers.has(element)) {
    handlers.set(element, new Map());
  }
  handlers.get(element).set(eventType, handler);
}





// Set up the root listener.
export function initEventSystem(container) {
  const eventTypes = ["click", "keypress", "scroll", "input", "change"];

  eventTypes.forEach((eventType) => {
    attachListener(container, eventType, (event) => {
      const registeredElement = findRegisteredElement(event.target, eventType);
      if (registeredElement) {
        const handler = handlers.get(registeredElement).get(eventType);
        handler(event);
      }
    });
  });
}
