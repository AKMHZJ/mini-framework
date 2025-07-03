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