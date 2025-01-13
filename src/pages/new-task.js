import { createTask } from "../services/tasks";
import { attachTemplate, html, getTargetElements } from "../shared/templates";

class NewTasksPage extends HTMLElement {
  static targets = ["form", "label", "description", "submitBtn", "startDate"];

  constructor() {
    super();
    this.elements = {};
  }

  connectedCallback() {
    attachTemplate(this, this.template());
    this.elements = getTargetElements(this.shadowRoot, NewTasksPage.targets);

    this.elements.form.onsubmit = (e) => {
      e.preventDefault();
      this.handleSubmition();
    };
  }

  async handleSubmition() {
    console.log(this.elements);
    const task = {
      label: this.elements.label.value,
      description: this.elements.description.value,
      start_date: new Date(this.elements.startDate.value).toISOString(),
    };

    await createTask(task);
  }

  template() {
    return html`
      <h1>New Task</h1>
      <x-link to="/">Back to tasks</x-link>

      <form data-target="form" method="post" action "/">
        <input data-target="label" type="text" placeholder="Task label" required/>
        <input
          data-target="description"
          type="text"
          placeholder="Task description"
          required
        />
        <input data-target="startDate" type="date" required />
        <input data-target="submitBtn" type="submit" value="Create Task" />
      </form>
    `;
  }
}

customElements.define("x-new-task-page", NewTasksPage);
