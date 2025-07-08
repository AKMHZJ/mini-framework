// ======================================================
//  DOM abstraction and diff / patch logic  (final)
// ======================================================

import { on } from "./event.js";

/*-------------------------------------------------------
 * create virtual element
 *-----------------------------------------------------*/
export function makeElement(tag, attrs = {}, children = []) {
  // ── extract special "key" ---------------------------------
  let key = undefined;
  if ("key" in attrs) {
    key = attrs.key;
    delete attrs.key;           // do not output it as HTML attr
  }

  // ── normalise children ------------------------------------
  children = (Array.isArray(children) ? children : [children]).filter(
    (c) => c !== null && c !== undefined
  );
  children = children.map((child) =>
    typeof child === "string" || typeof child === "number"
      ? { tag: "#text", attrs: {}, children: [], text: child }
      : child
  );

  return { tag, attrs, children, element: null, key };
}

/*-------------------------------------------------------
 * convert VNode → real DOM  (initial render)
 *-----------------------------------------------------*/
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

/*-------------------------------------------------------
 * master render entry
 *-----------------------------------------------------*/
let prevVNode = null;

export function render(vnode, container) {
  if (prevVNode) {
    updateDOM(prevVNode, vnode, container);
  } else {
    container.innerHTML = "";
    container.appendChild(createDOM(vnode));
  }
  prevVNode = vnode;
}

/*-------------------------------------------------------
 * diff & patch
 *-----------------------------------------------------*/
function updateDOM(oldVNode, newVNode, parent) {
  // handle null or replaced node
  if (!oldVNode || !oldVNode.element) {
    const fresh = createDOM(newVNode);
    if (parent && fresh) parent.appendChild(fresh);
    newVNode.element = fresh;
    return;
  }

  /* ---------- text-node diff ---------- */
  if (oldVNode.tag === "#text" && newVNode.tag === "#text") {
    if (oldVNode.text !== newVNode.text) {
      oldVNode.element.nodeValue = newVNode.text;
    }
    newVNode.element = oldVNode.element;
    return;
  }

  /* ---------- same tag? if not, full replace ---------- */
  if (oldVNode.tag !== newVNode.tag) {
    const fresh = createDOM(newVNode);
    parent.replaceChild(fresh, oldVNode.element);
    newVNode.element = fresh;
    return;
  }

  newVNode.element = oldVNode.element;

  /* ---------- attributes ---------- */
  const oldA = oldVNode.attrs;
  const newA = newVNode.attrs;

  // removed attrs
  for (const k of Object.keys(oldA)) {
    if (!(k in newA)) {
      if (k.startsWith("on")) {
        on(k.toLowerCase().slice(2), newVNode.element, () => {});
      } else {
        newVNode.element.removeAttribute(k);
      }
    }
  }

  // added / changed attrs
  for (const [k, v] of Object.entries(newA)) {
    if (oldA[k] !== v) {
      if (k.startsWith("on")) {
        on(k.toLowerCase().slice(2), newVNode.element, v);
      } else if (k === "checked") {
        if (v) {
          newVNode.element.setAttribute("checked", "");
          newVNode.element.checked = true;
        } else {
          newVNode.element.removeAttribute("checked");
          newVNode.element.checked = false;
        }
      } else {
        newVNode.element.setAttribute(k, v);
      }
    }
  }

  /* ---------- keyed children diff ---------- */
  const oldKids = oldVNode.children || [];
  const newKids = newVNode.children || [];

  const keyedOld = new Map();
  oldKids.forEach((c) => {
    if (c && c.key !== undefined) keyedOld.set(c.key, c);
  });

  const parentEl = newVNode.element;
  const usedOld = new Set();

  newKids.forEach((newChild, idx) => {
    const oldMatch =
      newChild.key !== undefined ? keyedOld.get(newChild.key) : oldKids[idx];

    if (oldMatch) {
      usedOld.add(oldMatch);
      updateDOM(oldMatch, newChild, parentEl);

      // keep correct order
      const desired = parentEl.childNodes[idx];
      if (desired !== newChild.element) {
        parentEl.insertBefore(newChild.element, desired);
      }
    } else {
      // brand-new node
      const fresh = createDOM(newChild);
      parentEl.insertBefore(fresh, parentEl.childNodes[idx] || null);
      newChild.element = fresh;
    }
  });

  // remove old nodes that disappeared
  oldKids.forEach((oldChild) => {
    if (!usedOld.has(oldChild)) {
      parentEl.removeChild(oldChild.element);
    }
  });
}