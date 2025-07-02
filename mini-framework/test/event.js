const button = {
  tag: "button",
  attrs: {
    className: "button",
    onClick: () => alert("Button clicked!"),
  },
  children: ["Click"],
};

const handlers = new Map();
function attachListener(root, eventType) {
  root.addEventListener(eventType, (event) => {
    const target = findRegisteredElement(event.target, eventType);
    if (target) {
      handlers.get(target).get(eventType)(event);
    }
  });
}

// const but = attachListener('home', 'click')
// console.log(but);

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


const fakeEventInput = { target: { value: "hello" } }; // Typing: hello
inputComponent.attrs.onInput(fakeEventInput); 

const fakeEventKeyPressEnter = { key: "Enter" };
inputComponent.attrs.onKeyPress(fakeEventKeyPressEnter); // Enter pressed!

const fakeEventKeyPressOther = { key: "a" };
inputComponent.attrs.onKeyPress(fakeEventKeyPressOther); // rien
