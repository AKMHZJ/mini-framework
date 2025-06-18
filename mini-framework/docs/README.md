<!-- Framework documentation (how to use, features, examples) -->

# Mini Framework Documentation

## DOM Abstraction

The DOM abstraction layer simplifies DOM manipulation by using a Virtual DOM. Users define the UI as JavaScript objects (Virtual Nodes or VNodes), and the framework efficiently updates the real DOM by comparing old and new VNodes.

### Features

- Create elements with tags, attributes, and children.
- Nest elements hierarchically.
- Update the DOM efficiently by applying only necessary changes.
- Support for text nodes and attributes (events to be added).

### API

#### `createElement(tag, attrs, children)`

Creates a Virtual DOM node.

- `tag`: String, the HTML tag (e.g., `'div'`, `'h1'`).
- `attrs`: Object, attributes like `class`, `id` (e.g., `{ class: 'container' }`).
- `children`: Array or single child, VNodes or strings for text nodes.
- Returns: A VNode object.

**Example:**

```javascript
const vnode = createElement("div", { class: "container" }, [
  createElement("h1", {}, "Hello"),
  "World", // Text node
]);
```
