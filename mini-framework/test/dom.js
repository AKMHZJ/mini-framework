/*************** Make Element ************/
function makeElement(tag, attrs = {}, children = []) {
  children = Array.isArray(children) ? children : [children];

  children = children.map((child) =>
    typeof child === "string" || typeof child === "number"
      ? { tag: "#text", attrs: {}, children: [], text: child }
      : child
  );

  return {
    tag,
    attrs,
    children,
    element: null,
  };
}

function render(vnode, container) {
  container.innerHTML = ""
  container.appendChild(makeElement(vnode));
}


// test1
const el1 = makeElement("div");
console.log(el1, 'el1');

// test2
const el2 = makeElement("span", { id: "monId", class: "maClasse" });
console.log(el2, 'el2');
console.log(el2.attrs.id === "monId" && el2.attrs.class === "maClasse"); // true

// test3
const el3 = makeElement("p", {}, "Hello");
console.log(el3);

console.log(el3.children.length === 1); // true
console.log(el3.children[0].tag === "#text"); // true
console.log(el3.children[0].text === "Hello"); // true

// test4
const el4 = makeElement("p", {}, 123);
console.log(el4, 'el2');
console.log(el4.children.length === 1); // true
console.log(el4.children[0].text === 123); // true

// test5
const childObj = makeElement("b", {}, "bold");
const el5 = makeElement("div", {}, ["Text", childObj]);
console.log(el5, 'el5');

console.log(el5.children.length === 2); // true
console.log(el5.children[0].tag === "#text"); // true
console.log(el5.children[1] === childObj); // true

// test6
const singleChild = makeElement("i", {}, "italic");
const el6 = makeElement("div", {}, singleChild);
console.log(el6, 'el6');

console.log(el6.children.length === 1); // true
console.log(el6.children[0] === singleChild); // true
