// DOM abstraction and manipulation logic

export function makeElement(tag, attrs = {}, children = []) {
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

function createDOM(vnode) {
  if (vnode.tag === "#text") {
    const textNode = document.createTextNode(vnode.text);
    vnode.element = textNode;
    return textNode;
  }

  const element = document.createElement(vnode.tag);
  vnode.element = element;

  // handlling attributes
  for (const [key, value] of Object.entries(vnode.attrs)) {
    if (key.startsWith("on")) {
      // event handlers
    } else {
      element.setAttribute(key, value);
    }
  }

  // render children
  vnode.children.forEach((child) => {
    const childElement = createDOM(child);
    element.appendChild(childElement);
  });

  return element;
}

export function render(vnode, container) {
  const dom = createDOM(vnode);
  container.innerHTML = "";
  container.appendChild(dom);
}
