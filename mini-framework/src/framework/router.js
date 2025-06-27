// Routing system implementation

import { render } from "./dom.js";

let routes = [];
let container = document.getElementById('app');

function matchRoute(path){
    const cleanPath = path.replace(/^#\//, '');
    return routes.find(route => {
        return route.path === cleanPath || (cleanPath === '' && route.path === '/all');
    }) || routes[0];
}

function renderRoute(){
    const path = window.location.hash || '#all';
    const route = matchRoute(path);
    if (route){
        const vnode = route.view();
        render(vnode, container);
    }
}

export function defineRoutes(newRoutes) {
    routes = newRoutes;
}


export function navigate(path) {
    window.location.hash = `#${path}`
    renderRoute();
}


export function initRouter() {
    renderRoute();
    window.onhashchange = renderRoute();
}