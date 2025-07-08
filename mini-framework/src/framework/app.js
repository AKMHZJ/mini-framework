import {initEventSystem} from `./event`
const container = document.getElementById("app");
initEventSystem(container);

initState({
  todos: [],
  filter: "all",
  hooks: [], // Required for useState
});

// function TodoApp() {
//   const state = getState();
//   const [inputValue, setInputValue] = useState("");
//   console.log("TodoApp render:", { inputValue, todos: state.todos });
//   const filteredTodos = state.todos.filter((todo) => {
//     if (state.filter === "active") return !todo.completed;
//     if (state.filter === "completed") return todo.completed;
//     return true;
//   });

//   return makeElement("div", { class: "todoapp" }, [
//     makeElement("header", { class: "header" }, [
//       makeElement("h1", {}, "todos"),
//       makeElement(
//         "input",
//         {
//           class: "new-todo",
//           placeholder: "What needs to be done?",
//           value: inputValue,
//           onInput: (e) => {
//             console.log("Input:", e.target.value);
//             setInputValue(e.target.value);
//           },
//           onKeyPress: (e) => {
//             console.log("KeyPress:", e.key, inputValue);
//             if (e.key === "Enter" && inputValue) {
//               console.log("Adding todo:", inputValue);
//               setState({
//                 ...state,
//                 todos: [
//                   ...state.todos,
//                   { id: Date.now(), text: inputValue, completed: false },
//                 ],
//               });
//               setInputValue("");
//             }
//           },
//         },
//         []
//       ),
//     ]),
//     makeElement("section", { class: "main" }, [
//       makeElement(
//         "ul",
//         { class: "todo-list" },
//         filteredTodos.map((todo) =>
//           makeElement(
//             "li",
//             { key: todo.id, class: todo.completed ? "completed" : "" },
//             [
//               makeElement(
//                 "input",
//                 {
//                   class: "toggle",
//                   type: "checkbox",
//                   checked: todo.completed,
//                   onChange: () => {
//                     console.log("Toggling todo:", todo.id); // Log toggle
//                     setState({
//                       ...state,
//                       todos: state.todos.map((t) =>
//                         t.id === todo.id ? { ...t, completed: !t.completed } : t
//                       ),
//                     });
//                   },
//                 },
//                 []
//               ),
//               makeElement("label", {}, todo.text),
//             ]
//           )
//         )
//       ),
//     ]),
//     makeElement("footer", { class: "footer" }, [
//       makeElement("ul", { class: "filters" }, [
//         makeElement("li", {}, [
//           makeElement(
//             "a",
//             {
//               href: "#all",
//               class: state.filter === "all" ? "selected" : "",
//               onClick: () => navigate("/all"),
//             },
//             "All"
//           ),
//         ]),
//         makeElement("li", {}, [
//           makeElement(
//             "a",
//             {
//               href: "#active",
//               class: state.filter === "active" ? "selected" : "",
//               onClick: () => navigate("/active"),
//             },
//             "Active"
//           ),
//         ]),
//         makeElement("li", {}, [
//           makeElement(
//             "a",
//             {
//               href: "#completed",
//               class: state.filter === "completed" ? "selected" : "",
//               onClick: () => navigate("/completed"),
//             },
//             "Completed"
//           ),
//         ]),
//       ]),
//     ]),
//   ]);
// }
function App() {
  const [count, setCount] = useState(0);

  return makeElement("div", { class: "counter" }, [
    makeElement("h1", {}, `Count: ${count}`),
    makeElement("button", {
      onClick: () => setCount(count + 1)
    }, "Increment"),
  ]);
}

subscribe(() => {
  resetHookIndex();
  render(App(), document.getElementById("app"));
});
subscribe(() => {
  console.log('Subscriber triggered');
  resetHookIndex(); // Reset for useState
  render(App(), container);
});

const routes = [
  { path: "/all", view: App },
  { path: "/active", view: TodoApp },
  { path: "/completed", view: TodoApp },
];

defineRoutes(routes);
initRouter();