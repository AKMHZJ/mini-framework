// DOM abstraction and manipulation 

function createDOM(vnode) {
  if (!vnode || !vnode.tag) {
    console.warn("Invalid vnode passed to createDOM:", vnode);
    return document.createComment("invalid");
  }

  /* text node */
  if (vnode.tag === "#text") {
    const t = document.createTextNode(vnode.text);
    vnode.element = t;
    return t;
  }

  /* regular element */
  const el = document.createElement(vnode.tag);
  vnode.element = el;

  // attrs / props
  for (const [key, value] of Object.entries(vnode.attrs)) {
    if (key.startsWith("on")) {
      on(key.toLowerCase().slice(2), el, value);
    } else if (key === "checked") {
      if (value) {
        el.setAttribute("checked", "");
        el.checked = true;
      }
    } else {
      el.setAttribute(key, value);
    }
  }

  // children
  vnode.children.forEach((c) => el.appendChild(createDOM(c)));
  return el;
}


export function render(vnode, container) {
  if (prevVNode) {
    updateDOM(prevVNode, vnode, container);
  } else {
    container.innerHTML = "";
    container.appendChild(createDOM(vnode));
  }
  prevVNode = vnode;
}