import { getTaskByLabel, updateTask } from "../services/tasks";
import { getPathParams, navigateTo } from "../shared/router";
import { createEffect, createSignal } from "../shared/signals";
import { attachTemplate, getTargetElements, html } from "../shared/templates";
import { toDateString } from "../utils/date";

class TaskDetailPage extends HTMLElement {
  static targets = [
    "deleteBtn",
    "editBtn",
    "loader",
    "taskForm",
    "formContainer",
  ];

  constructor() {
    super();
    this.task = createSignal(undefined);
    this.loading = createSignal(true);
    this.label = "";
    this.elements = {};
  }

  connectedCallback() {
    attachTemplate(this, this.template());
    this.elements = getTargetElements(this.shadowRoot, TaskDetailPage.targets);

    const routePath = this.closest("x-route").getAttribute("path");
    const currentPath = window.location.pathname;

    const params = getPathParams(routePath, currentPath);
    this.label = decodeURIComponent(params.taskLabel);

    createEffect(this.loading, (loading) => {
      this.elements.loader.style.display = loading ? "block" : "none";
    });

    createEffect(this.task, (task) => {
      if (!task) return;

      this.elements.taskForm.setAttribute("label", task.label);
      this.elements.taskForm.setAttribute("description", task.description);
      this.elements.taskForm.setAttribute(
        "start-date",
        toDateString(task.start_date),
      );
      this.elements.taskForm.setAttribute(
        "end-date",
        task.end_date ? toDateString(task.end_date) : "",
      );
    });

    this.elements.taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmition(e.detail);
    });

    this.load();
  }

  async handleSubmition(task) {
    await updateTask(task);
    navigateTo("/");
  }

  async load() {
    this.loading.set(true);
    const task = await getTaskByLabel(this.label);
    this.task.set(task);
    this.elements.formContainer.style.display = "block";
    this.loading.set(false);
  }

  template() {
    return html`
      <x-link to="/">Back to tasks</x-link>
      <hr />

      <h1 class="is-size-4 my-4">Edit Task</h1>

      <div data-target="loader">Loading...</div>
      <div data-target="formContainer" class="w-700" style="display: none">
        <x-task-form data-target="taskForm" edit></x-task-form>
      </div>
    `;
  }
}

customElements.define("x-edit-task-page", TaskDetailPage);
