import { attachTemplate, html } from "../shared/templates";

class Home extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    attachTemplate(this, this.template());
  }

  template() {
    return html`
      <h1>Search</h1>
      <p>List Tasks</p>
      <p>Filter Tasks</p>

      <p>
        Button to create a new task
        <x-link to="/tasks/new">Create new task</x-link>
      </p>
    `;
  }
}

customElements.define("x-home-page", Home);
