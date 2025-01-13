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
    return ["label", "description", "start-date", "end-date", "edit"];
  }

  constructor() {
    super();
    this.elements = {};
  }

  connectedCallback() {
    attachTemplate(this, this.template());
    this.elements = getTargetElements(this.shadowRoot, TaskForm.targets);

    if (!this.hasAttribute("edit")) {
      this.elements.endDate.style.display = "none";
    }

    if (this.hasAttribute("edit")) {
      this.elements.submitBtn.value = "Update Task";
      this.elements.label.setAttribute("disabled", "");
      this.elements.startDate.setAttribute("disabled", "");
      this.elements.description.setAttribute("disabled", "");
    }

    this.elements.form.onsubmit = (e) => {
      e.preventDefault();

      const task = {
        label: this.elements.label.value,
        description: this.elements.description.value,
        start_date: new Date(this.elements.startDate.value).toISOString(),
      };

      if (this.elements.endDate.value) {
        task.end_date = new Date(this.elements.endDate.value).toISOString();
      }

      const submitEvent = new CustomEvent("submit", {
        detail: task,
      });

      this.dispatchEvent(submitEvent);
    };
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "label":
        this.elements.label.value = newValue;
        break;
      case "description":
        this.elements.description.value = newValue;
        break;
      case "start-date":
        this.elements.startDate.value = newValue;
        break;
      case "end-date":
        this.elements.endDate.value = newValue;
        break;
    }
  }

  template() {
    return html`
      <form data-target="form" method="post" action "/">
        <input data-target="label" type="text" value="${this.getAttribute("label")}" placeholder="Task label" required/>
        <textarea
          data-target="description"
          required
        >${this.getAttribute("description")}</textarea>
        <input data-target="startDate" value="${this.getAttribute("start-date")}" type="date" required />
        <input data-target="endDate" value="${this.getAttribute("end-date")}" required type="date" />
        <input data-target="submitBtn" type="submit" value="Create Task" />
      </form>
    `;
  }
}

customElements.define("x-task-form", TaskForm);
