import { attachTemplate, html } from "../shared/templates";

class TaskDetailPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    attachTemplate(this, this.template());
  }

  template() {
    return html`
      <h1>Task Detail</h1>
      <p>Task Detail</p>

      <x-link to="/">Back to tasks</x-link>

      <button>Delete Task</button>
      <button>Edit Task</button>
    `;
  }
}

customElements.define("x-task-detail-page", TaskDetailPage);
