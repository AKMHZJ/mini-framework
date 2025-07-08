/* ========= framework/router.js – final, with hook-reset ========= */

import { render } from "./dom.js";
import { getState, setState, resetHookIndex } from "./state.js";

let routes = [];
const container = document.getElementById("app");

/* helper: pick the route that matches the current #hash */
function matchRoute(hash) {
  const clean = hash.replace(/^#\/?/, "");           // "#/active" → "active"
  return (
    routes.find((r) => r.path.slice(1) === clean) || routes[0]  // default /all
  );
}

/* central render function */
function renderRoute() {
  const hash  = window.location.hash || "#/all";
  const route = matchRoute(hash);
  if (!route) return;

  /* keep state.filter in sync with the URL */
  const state      = getState();
  const newFilter  = route.path.slice(1) || "all";
  if (state.filter !== newFilter) {
    setState({ ...state, filter: newFilter });
  }

  resetHookIndex();                 // ←  make hooks start from 0
  const vnode = route.view();
  render(vnode, container);
}

/* public API */
export function defineRoutes(rs) {
  routes = rs;
}

export function navigate(path /* "/all" | "/active" | "/completed" */) {
  window.location.hash = `#${path}`;
  /* hashchange listener will call renderRoute() */
}

export function initRouter() {
  window.addEventListener("hashchange", renderRoute);
  renderRoute();                     // initial render
}