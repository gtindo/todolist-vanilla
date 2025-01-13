import { attachTemplate, getTargetElements, html } from "../shared/templates";

class TaskForm extends HTMLElement {
  static targets = [
    "form",
    "label",
    "description",
    "submitBtn",
    "startDate",
    "endDate",
  ];

  static get observedAttributes() {
    return ["label", "descripttion", "start-date", "end-date"];
  }

  constructor() {
    super();
    this.elements = {};
  }

  connectedCallback() {
    attachTemplate(this, this.template());
    this.elements = getTargetElements(this.shadowRoot, TaskForm.targets);

    const hasEndDate = this.getAttribute("end-date") !== null;
    if (!hasEndDate) {
      this.elements.endDate.style.display = "none";
    }

    this.elements.form.onsubmit = (e) => {
      e.preventDefault();

      const task = {
        label: this.elements.label.value,
        description: this.elements.description.value,
        start_date: new Date(this.elements.startDate.value).toISOString(),
      };

      if (hasEndDate) {
        task.end_date = new Date(this.elements.endDate.value).toISOString();
      }

      const submitEvent = new CustomEvent("submit", {
        detail: task,
      });

      this.dispatchEvent(submitEvent);
    };
  }

  template() {
    return html`
      <form data-target="form" method="post" action "/">
        <input data-target="label" type="text" value="${this.getAttribute("label")}" placeholder="Task label" required/>
        <input
          data-target="description"
          type="text"
          placeholder="Task description"
          value="${this.getAttribute("description")}"
          required
        />
        <input data-target="startDate" value="${this.getAttribute("start-date")}" type="date" required />
        <input data-target="endDate" value="${this.getAttribute("end-date")}" type="date" />

        <input data-target="submitBtn" type="submit" value="Create Task" />
      </form>
    `;
  }
}

customElements.define("x-task-form", TaskForm);
