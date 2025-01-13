import { createTask } from "../services/tasks";
import { attachTemplate, html, getTargetElements } from "../shared/templates";

class NewTasksPage extends HTMLElement {
  static targets = ["taskForm"];

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this.elements = {};
  }

  connectedCallback() {
    attachTemplate(this, this.template());
    this.elements = getTargetElements(this.shadowRoot, NewTasksPage.targets);

    this.elements.taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmition(e.detail);
    });
  }

  async handleSubmition(task) {
    await createTask(task);
  }

  template() {
    return html`
      <h1>New Task</h1>
      <x-link to="/">Back to tasks</x-link>
      <x-task-form></x-task-form>
    `;
  }
}

customElements.define("x-new-task-page", NewTasksPage);
