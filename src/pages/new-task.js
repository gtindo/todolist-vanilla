import { createTask } from "../services/tasks";
import { navigateTo } from "../shared/router";
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
    navigateTo("/");
  }

  template() {
    return html`
      <x-link to="/">Back to tasks</x-link>
      <hr />

      <h1 class="is-size-4 my-4">New Task</h1>
      <div class="w-700">
        <x-task-form data-target="taskForm"></x-task-form>
      </div>
    `;
  }
}

customElements.define("x-new-task-page", NewTasksPage);
