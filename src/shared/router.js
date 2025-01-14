/**
 * This file contains the router component and its related components.
 *
 * Basic usage:
 * ```html
 *    <x-router>
 *      <x-route path="/" component="x-page-1"></x-route>
 *      <x-route path="/about" component="x-page-2"></x-route>
 *    </x-router>
 * ```
 */

import { attachTemplate, getTargetElements } from "./templates";
import { html } from "./templates";

/**
 * The router component is responsible for displaying the correct route based on the current URL.
 * It uses the History API to change the URL without reloading the page.
 * It takes routes as slots and displays the one that matches the current URL withit the outlet element.
 */
class Router extends HTMLElement {
  static targets = ["outlet"];

  constructor() {
    super();
    this.elements = {};
  }

  connectedCallback() {
    attachTemplate(this, this.template());
    this.elements = getTargetElements(this.shadowRoot, Router.targets);
    const routes = Array.from(this.querySelectorAll("x-route"));

    this.displayMatchedRoute(routes);

    window.addEventListener("popstate", (e) => {
      this.displayMatchedRoute(routes);
    });
  }

  /**
   * Display the matched route based on the current URL
   * @param {Array<Route>} routes
   */
  displayMatchedRoute(routes) {
    const currentPath = window.location.pathname;
    const matchedRoutes = this.matchedRoutes(routes, currentPath);

    // Set the first matched route as the element to display
    if (matchedRoutes.length > 0) {
      this.elements.outlet.innerHTML = "";
      const matchedRoute = matchedRoutes[0].cloneNode(true); // To avoid moving the element from its original position in the DOM
      matchedRoute.setAttribute("is-active", "true");

      this.elements.outlet.appendChild(matchedRoute);
    }
  }

  /**
   * Takes a list of routes and the current path and returns the matched routes
   *
   * @param {Array<Route>} routes
   * @param {string} currentPath
   * @returns {Array<Route>}
   */
  matchedRoutes(routes, currentPath) {
    return routes.filter((route) => route.isMatch(currentPath));
  }

  template() {
    return html`
      <div>
        <slot></slot>
      </div>
      <div data-target="outlet"></div>
    `;
  }
}

/**
 * The route component is used to define a route for component.
 * It takes a path attribute that defines the route path.
 */
class Route extends HTMLElement {
  static get observedAttributes() {
    return ["path", "component", "is-active"];
  }

  constructor() {
    super();
  }

  connectedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "is-active":
        if (newValue === "true") {
          const component = document.createElement(
            this.getAttribute("component"),
          );
          this.appendChild(component);
        }
        break;
      default:
        break;
    }
  }

  /**
   * @typedef {Object} UrlPart
   * @property {number} index
   * @property {string} value
   * @property {boolean} isParam
   * @property {(string | undefined)} paramName
   */

  /**
   * We split the path into parts and check if each part is a parameter or a static part of the path
   *
   * @param {string} path
   * @returns {Array<UrlPart>}
   */
  parsePath(path) {
    // remove query string and split the path into parts
    const urlParts = path
      .split("?")[0]
      .split("/")
      .map((part, index) => {
        const isParam = part.startsWith(":");

        return {
          index,
          value: part,
          isParam,
          paramName: isParam ? part.replace(":", "") : undefined,
        };
      });

    return urlParts;
  }

  /**
   * Check if the route path match the parameter path
   * @param {string} pathToMatch
   * @returns
   */
  isMatch(pathToMatch) {
    const routePathParts = this.parsePath(this.getAttribute("path"));
    const pathParts = this.parsePath(pathToMatch);

    if (routePathParts.length !== pathParts.length) {
      return false;
    }

    for (let i = 1; i < routePathParts.length; i++) {
      let matched = routePathParts[i].index === pathParts[i].index;

      if (!routePathParts[i].isParam) {
        matched = matched && routePathParts[i].value === pathParts[i].value;
      }

      if (!matched) {
        return false;
      }
    }

    return true;
  }
}

class Link extends HTMLElement {
  static targets = ["link"];

  static get observedAttributes() {
    return ["to"];
  }

  constructor() {
    super();
    this.elements = {};
  }

  connectedCallback() {
    attachTemplate(this, this.template());
    this.elements = getTargetElements(this.shadowRoot, Link.targets);

    this.elements.link.addEventListener("click", (e) => {
      e.preventDefault();
      const path = this.getAttribute("to");
      window.history.pushState({}, "", path);
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  }

  template() {
    return html`
      <a data-target="link" href="${this.getAttribute("to")}">
        <slot></slot>
      </a>
    `;
  }
}

customElements.define("x-route", Route);
customElements.define("x-router", Router);
customElements.define("x-link", Link);

/**
 * @param {string} routePath
 * @param {string} currentPath
 * @returns
 */
export function getPathParams(routePath, currentPath) {
  const routePathParts = routePath.split("/");
  const currentPathParts = currentPath.split("/");

  const params = {};

  routePathParts.forEach((part, index) => {
    if (part.startsWith(":")) {
      const paramName = part.replace(":", "");
      params[paramName] = currentPathParts[index];
    }
  });

  return params;
}

export function navigateTo(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
