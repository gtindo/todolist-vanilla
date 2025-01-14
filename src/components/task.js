import { deleteTask } from "../services/tasks";
import { attachTemplate, html, getTargetElements } from "../shared/templates";
import { toDateString } from "../utils/date";

class Task extends HTMLElement {
  static targets = ["deleteBtn"];

  static get observedAttributes() {
    return ["label", "end-date", "expired"];
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
    const isExpired = this.getAttribute("expired", "true");
    const endDate = this.getAttribute("end-date");

    return html`
      <div
        class="card p-4 w-700 is-flex is-justify-content-space-between is-align-items-center"
      >
        <div>
          <span class="${isExpired ? "red" : ""}">${label}</span>
        </div>

        <div>
          <span class="mr-4">Due ${toDateString(new Date(endDate))}</span>
          <x-link to="/tasks/${label}">
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 1.99632H3C2.46957 1.99632 1.96086 2.20704 1.58579 2.58211C1.21071 2.95718 1 3.46589 1 3.99632V17.9963C1 18.5268 1.21071 19.0355 1.58579 19.4105C1.96086 19.7856 2.46957 19.9963 3 19.9963H17C17.5304 19.9963 18.0391 19.7856 18.4142 19.4105C18.7893 19.0355 19 18.5268 19 17.9963V10.9963"
                stroke="#007AFF"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.375 1.62132C16.7728 1.2235 17.3124 1 17.875 1C18.4376 1 18.9771 1.2235 19.375 1.62132C19.7728 2.01914 19.9963 2.55871 19.9963 3.12132C19.9963 3.68393 19.7728 4.2235 19.375 4.62132L10.362 13.6353C10.1245 13.8726 9.83118 14.0462 9.50897 14.1403L6.63597 14.9803C6.54992 15.0054 6.45871 15.0069 6.37188 14.9847C6.28505 14.9624 6.2058 14.9173 6.14242 14.8539C6.07904 14.7905 6.03386 14.7112 6.01162 14.6244C5.98937 14.5376 5.99087 14.4464 6.01597 14.3603L6.85597 11.4873C6.9505 11.1654 7.12451 10.8724 7.36197 10.6353L16.375 1.62132Z"
                stroke="#007AFF"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </x-link>
          <button class="delete" data-target="deleteBtn"></button>
        </div>
      </div>
    `;
  }
}

customElements.define("x-task", Task);
