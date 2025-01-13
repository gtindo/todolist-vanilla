import { attachTemplate, html } from "../shared/templates";

class NewTasksPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    attachTemplate(this, this.template());
  }

  template() {
    return html`
      <h1>New Task</h1>
      <p>Form to create a new task</p>

      <x-link to="/">Back to tasks</x-link>
    `;
  }
}

customElements.define("x-new-task-page", NewTasksPage);
