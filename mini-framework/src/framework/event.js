const button = {
  tag: "button",
  attrs: {
    className: "button",
    onClick: () => alert("Button clicked!"),
  },
  children: ["Click"],
};

const handlers = new Map();
const eventHandlers = new Map();

/// List of Events
const Events = [
    'click', 'dblclick', 'keydown', 'keyup', 'keypress', 
    'input', 'change', 'focus', 'blur',
    'submit', 'reset', 'scroll', 'resize'
];


/*************🌟 input Component 🌟*************/
const inputComponent = {
  tag: "input",
  attrs: {
    type: "text",
    placeholder: "Typing...",
    onInput: (e) => console.log("Typing:", e.target.value),
    onKeyPress: (e) => {
      if (e.key === "Enter") {
        console.log("Enter pressed!");
      }
    },
  },
};

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








// Function to attach events to multiple elements
function attachToElements(selector, eventType, handler) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function(element) {
        on(element, eventType, handler);
    });
}


