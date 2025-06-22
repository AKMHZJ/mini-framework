// Custom event handling systemconst button = {
const button = {
  tag: "button",
  attrs: {
    className: "button",
    onClick: () => alert("Button clicked!"),
  },
  children: ["Click"],
};


const inputComponent = {
  tag: "input",
  attrs: {
    type: "text",
    placeholder: "Typing...😊",
    onInput: (e) => console.log("Typing:", e.target.value),
    onKeyPress: (e) => {
      if (e.key === "Enter") {
        console.log("Enter pressed!");
      }
    },
  },
};