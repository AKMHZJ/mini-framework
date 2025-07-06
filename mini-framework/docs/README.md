<!-- Framework documentation (how to use, features, examples) -->

# <span style="color:magenta">*Mini-Framework*</span>

## What is a JavaScript Framework?

A JavaScript framework is a pre-written collection of code that simplifies common tasks in web development. 
It provides a structured way to build web applications, enforce best practices, and manage complex functionalities. Key components of a JavaScript framework include data binding, routing, and a component-based architecture.

## Key Concepts: 

- *Routing:* Routing is the process of determining which view or component should be displayed based on the current URL. We will create a basic routing system that handles navigation between different pages of our single-page application.

- *Data Binding:* Data binding is a mechanism that establishes a connection between the data in your application and the user interface. This allows changes in the data to automatically update the UI and vice versa.

- *Event Listeners:* A javascript event listener is essentially a JavaScript function that waits for a specific event to occur and then executes a callback function to respond to that event. Event listeners and event handlers are often considered the same thing. However, in essence, they work together to respond to an event.


- registry(element, eventType, handler) – Maps elements to their event types and handlers.

- findRegisteredElement(event) – Implements event delegation by finding the closest element with a registered handler

- attachListener(element, eventType, handler) – Uses onclick properties instead of addEventListener

- initEventSystem() – Sets up listeners for all supported events at the document level

- on(element, eventType, handler) – Main function to register an event handler
