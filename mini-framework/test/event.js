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


const input = document.createElement(inputComponent.tag);
  Object.entries(inputComponent.attrs).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      input.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      input.setAttribute(key, value);
    }
  });

  document.body.appendChild(input);

  // --- TESTS SIMPLES ---
  console.log("Test 1 - Type :", input.type === "text" ? "✅ Pass" : "❌ Fail");
  console.log("Test 2 - Placeholder :", input.placeholder === "Typing..." ? "✅ Pass" : "❌ Fail");

  // Simuler une saisie
  input.value = "Hello Hasnae";
  input.dispatchEvent(new Event("input")); // Affiche: Typing: Hello world

  // Simuler appui sur Enter
  input.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" })); // Affiche: Enter pressed!

  // Simuler appui sur une autre touche
  input.dispatchEvent(new KeyboardEvent("keypress", { key: "a" })); // Aucun message


  