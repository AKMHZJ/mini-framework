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

let prevVNode = null;

export function render(vnode, container) {
  if (prevVNode) {
    updateDOM(prevVNode, vnode, container);
  } else {
    const dom = createDOM(vnode);
    container.innerHTML = "";
    container.appendChild(dom);
  }
  prevVNode = vnode;
}


function updateDOM(oldVNode, newVNode, parent) {
  if (!oldVNode || oldVNode.tag != newVNode.tag) {
    const newElement = createDOM(newVNode);
    parent.replaceChild(newElement, oldVNode.element)
    newVNode.element = newElement
    return
  }

  newVNode.element = oldVNode.element
  const oldAttrs = oldVNode.attrs
  const newAttrs = newVNode.attrs

  for (const key of Object.keys(oldAttrs)) {
    if (!(key in newAttrs)) {
      newVNode.element.removeAttribute(key);
    }
  }

  for (const [key, value] of Object.entries(newAttrs)) {
    if (oldAttrs[key] !== value) {
      newVNode.element.setAttribute(key, value);
    }
  }

  const oldChildren = oldVNode.children || [];
  const newChildren = newVNode.children || [];
  const maxLenght = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < length; i++) {
    if (i < oldChildren.length && i < newChildren.length) {
      (oldChildren[i], newChildren[i], newVNode.element);
    } else if (i < oldChildren.length) {
      newVNode.element.removeChild(oldChildren[i].element);
    } else {
      const newChildElement = createDOM(newChildren[i]);
      newVNode.element.appendChild(newChildElement);
      newChildren[i].element = newChildElement;
    }
  }

}