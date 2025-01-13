import { deleteTask } from "../services/tasks";
import { attachTemplate, html, getTargetElements } from "../shared/templates";

class Task extends HTMLElement {
  static targets = ["deleteBtn"];

  static get observedAttributes() {
    return ["label", "expired"];
  }

  constructor() {
    super();
    this.elements = {};
  }

  connectedCallback() {
    attachTemplate(this, this.template());
    this.elements = getTargetElements(this.shadowRoot, Task.targets);

    this.elements.deleteBtn.onclick = () => {
      this.deleteTask();
    };
  }

  async deleteTask() {
    const label = this.getAttribute("label");
    await deleteTask(label);

    // Dispatch a custom event to notify the parent component that the task was deleted
    this.shadowRoot.dispatchEvent(
      new CustomEvent("task-deleted", {
        detail: label,
        bubbles: true,
        composed: true,
      }),
    );
  }

  template() {
    const label = this.getAttribute("label");

    return html`
      <div style="display: inline-block">
        <span>${label}</span>
        <x-link to="/tasks/${label}">View</x-link>
        <x-link to="/tasks/${label}/edit">Edit</x-link>
        <button data-target="deleteBtn">Delete</button>
      </div>
    `;
  }
}

customElements.define("x-task", Task);
