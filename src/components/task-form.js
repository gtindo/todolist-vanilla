import { attachTemplate, getTargetElements, html } from "../shared/templates";

class TaskForm extends HTMLElement {
  static targets = [
    "form",
    "label",
    "description",
    "submitBtn",
    "startDate",
    "endDate",
    "endDateField",
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
      this.elements.endDateField.style.display = "none";
    }

    if (this.hasAttribute("edit")) {
      this.elements.submitBtn.value = "Update Task";
      this.elements.endDate.setAttribute("required", "");
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

        <div classs="field mt-2">
          <label class="label" for="label">Task label</label>
          <input data-target="label" id="label" class="input is-normal" type="text" value="${this.getAttribute("label")}" placeholder="Task label" required/>
        </div>
        <div class="field mt-2">
          <label class="label" for="description">Description</label>
          <textarea
            id="description"
            data-target="description"
            class="textarea"
            required
          >${this.getAttribute("description")}</textarea>
        </div>
        
        <div class="field mt-2">
          <label class="label" for="start-date">Start date</label>
          <input data-target="startDate" class="input is-normal" id="start-date" placeholder="Start date" value="${this.getAttribute("start-date")}" type="date" required />
        </div>

        <div class="field mt-2" data-target="endDateField">
          <label class="label" for="end-date">End date</label>
          <input data-target="endDate" class="input is-normal" id="end-date" value="${this.getAttribute("end-date")}" placeholder="End date" type="date" />
        </div>

        <div class="field mt-2">
          <input data-target="submitBtn" class="button is-link" type="submit" value="Create Task" />
        </div>
      </form>
    `;
  }
}

customElements.define("x-task-form", TaskForm);
