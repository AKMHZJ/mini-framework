//  Framework entry point (exports all modules)

import { makeElement, render } from "./dom.js";

const vdom = makeElement(
  "div",
  { class: "container" },
  [makeElement("h1", {}, "hello, there"),
  makeElement("button", { id: "btn" }, "click!")]
);

render(vdom, document.getElementById("app"));
