/**
 * This module contains functions to work with templates
 * /



/**
 * Attach template in the shadow root of custom element
 *
 * @param {HTMLElement} element
 * @param {string} element
 */
export function attachTemplate(element, content) {
  const template = document.createElement("template");
  template.innerHTML = content;
  element.attachShadow({ mode: "open" });
  element.shadowRoot.appendChild(template.content.cloneNode(true));
}

/**
 * @param {ShadowRoot} root
 * @param {Array<string>} targets
 * @returns {Record<string, HTMLElement>}
 */
export function getTargetElements(root, targets) {
  const elements = {};

  targets.forEach(
    (target) =>
      (elements[target] = root.querySelector(`[data-target="${target}"]`)),
  );

  return elements;
}

/**
 * It does nothing special, just returns the string
 * It's helpfull for syntax highlighting of html strings.
 * There are IDE extensions that can highlight html tagged template strings
 *
 * @param {string} strings
 * @param  {...any} values
 * @returns
 */
export function html(strings, ...values) {
  let output = "";

  strings.forEach((string, i) => {
    output += string + (values[i] || ""); // values[i] is undefined if there is no value
  });

  return output;
}
