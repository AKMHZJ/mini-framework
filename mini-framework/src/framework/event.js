const button = {
  tag: "button",
  attrs: {
    className: "button",
    onClick: () => alert("Button clicked!"),
  },
  children: ["Click"],
};

const handlers = new Map();
///
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

/*************🌟 Attach Listener 🌟*************/
// function attachLister(element, eventType, handler) {
//   if (!element || !eventType || !handler) return;
//   const elementId = element.id || crypto.randomUUID()
//   element.id = elementId

//   registry.register(elementId, eventType, handler)

//   element.addEventLister
// }

function getHandler(elementId, eventType) {
  return handlers[elementId]?.[eventType];
}

/*************🌟 Init Event System 🌟*************/
function initEventSystem(container = document) {
  const supportedEvents = ["click", "input", "keydown", "sbmit"]
  supportedEvents.forEach((eventType) => {
    container.addEventListener(eventType, (event) => {  // il faut changer addEvent par attach...
      const match = findRegisteredElement(event);
      if (match) match.handler(event);
    })
  })
}

/*************🌟 Find Registered Element 🌟*************/
function findRegisteredElement(event) {
  let target = event.target;
  while (target && target !== document) {
     
  }
  return null
}



function registry() {
   
}


// https://youtu.be/X0rqPfRfEfU?si=7AgLcVYIQQ-Y_rod


const eventHandlers = new Map();
// List of supported events
const supportedEvents = [
    'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout',
    'keydown', 'keyup', 'keypress', 'input', 'change', 'focus', 'blur',
    'submit', 'reset', 'scroll', 'resize', 'load', 'unload'
];

// Function to initialize the event system
function initEventSystem() {
    supportedEvents.forEach(function(eventType) {
        document.addEventListener(eventType, handleDocumentEvent, true);
    });
}

// Main function to attach event handlers
function on(element, eventType, handler) {
    // Validate parameters
    if (!element || !element.nodeType) {
        console.error('Invalid element provided');
        return;
    }
    
    if (!eventType || typeof eventType !== 'string') {
        console.error('Invalid event type provided');
        return;
    }
    
    if (!handler || typeof handler !== 'function') {
        console.error('Invalid handler provided');
        return;
    }
    
    // Register the handler
    registerHandler(element, eventType, handler);
    
    // Initialize system if not already done
    if (!window.eventSystemInitialized) {
        initEventSystem();
        window.eventSystemInitialized = true;
    }
}

// Simple helper function to find elements and attach events
function attachToElement(selector, eventType, handler) {
    const element = document.querySelector(selector);
    if (element) {
        on(element, eventType, handler);
    } else {
        console.warn('Element not found:', selector);
    }
}

// Simple helper function to attach events to multiple elements
function attachToElements(selector, eventType, handler) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(function(element) {
        on(element, eventType, handler);
    });
}


// Function to remove event handlers
function off(element, eventType, specificHandler) {
    const elementId = element.dataset.eventId;
    
    if (!elementId || !eventHandlers.has(elementId)) {
        return;
    }
    
    const elementEvents = eventHandlers.get(elementId);
    
    if (!elementEvents.has(eventType)) {
        return;
    }
    
    if (specificHandler) {
        // Remove specific handler
        const handlers = elementEvents.get(eventType);
        const index = handlers.indexOf(specificHandler);
        if (index > -1) {
            handlers.splice(index, 1);
        }
        
        // Clean up empty arrays
        if (handlers.length === 0) {
            elementEvents.delete(eventType);
        }
    } else {
        // Remove all handlers for this event type
        elementEvents.delete(eventType);
    }
    
    // Clean up empty element entries
    if (elementEvents.size === 0) {
        eventHandlers.delete(elementId);
    }
}

