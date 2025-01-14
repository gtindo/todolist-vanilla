import { getTasks } from "../services/tasks";
import { createEffect, createSignal } from "../shared/signals";
import { attachTemplate, getTargetElements, html } from "../shared/templates";

class TasksPage extends HTMLElement {
  static targets = [
    "tasksList",
    "loader",
    "searchBar",
    "startDate",
    "endDate",
    "filterForm",
    "mobileFiltersBtn",
  ];

  constructor() {
    super();
    // tasks list fetched from the server
    this.tasks = [];

    // tasks list displayed on the page
    this.displayedTasks = createSignal([]);

    this.loading = createSignal(true);

    this.elements = {};
  }

  connectedCallback() {
    attachTemplate(this, this.template());
    this.elements = getTargetElements(this.shadowRoot, TasksPage.targets);

    // detect changes on displayed list and displays new list
    createEffect(this.displayedTasks, (tasks) => {
      this.elements.tasksList.innerHTML = "";
      const list = document.createElement("ul");

      list.setAttribute("class", "m-4");

      tasks.forEach((task) => {
        let item = document.createElement("li");
        list.appendChild(item);

        item.setAttribute("class", "m-2");

        const taskElement = document.createElement("x-task");
        taskElement.setAttribute("label", task.label);

        // flag task as expired if end date is in the past
        if (task.end_date && new Date(task.end_date) < new Date()) {
          taskElement.setAttribute("expired", "true");
        }

        item.appendChild(taskElement);
      });

      this.elements.tasksList.appendChild(list);
    });

    // Detect changes on loading state and display / hide loader
    createEffect(this.loading, (loading) => {
      this.elements.loader.style.display = loading ? "block" : "none";
    });

    this.shadowRoot.addEventListener("task-deleted", (e) => {
      const label = e.detail;
      this.deleteTask(label);
    });

    this.elements.filterForm.onsubmit = (e) => {
      e.preventDefault();
      this.filterTasks();
    };

    this.elements.filterForm.onreset = () => {
      this.resetFilters();
    };

    this.elements.mobileFiltersBtn.onclick = () => {
      this.elements.filterForm.classList.toggle("visible-mobile");
      const isVisible =
        this.elements.filterForm.classList.contains("visible-mobile");
      if (isVisible) {
        this.elements.mobileFiltersBtn.textContent = "Hide filters";
      } else {
        this.elements.mobileFiltersBtn.textContent = "Display filters";
      }
    };

    this.load();
  }

  deleteTask(label) {
    this.tasks = this.tasks.filter((task) => task.label !== label);
    const labels = this.tasks.map((task) => task.label);

    // update displayed tasks, it preserves the order and applied filters when deleting a task
    this.displayedTasks.update((tasks) =>
      tasks.filter((task) => labels.includes(task.label)),
    );
  }

  resetFilters() {
    this.displayedTasks.set(this.tasks);
  }

  filterTasks() {
    const search = this.elements.searchBar.value;
    const startDate = this.elements.startDate.value;
    const endDate = this.elements.endDate.value;

    let filteredTasks = this.tasks;

    if (search) {
      filteredTasks = filteredTasks.filter((task) =>
        task.label.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (startDate) {
      filteredTasks = filteredTasks.filter(
        (task) => new Date(task.start_date) >= new Date(startDate),
      );
    }

    if (endDate) {
      filteredTasks = filteredTasks.filter(
        (task) => new Date(task.end_date) <= new Date(endDate),
      );
    }

    this.displayedTasks.set(filteredTasks);
  }

  async load() {
    this.loading.set(true);
    this.tasks = await getTasks();
    this.displayedTasks.set(this.tasks);
    this.loading.set(false);
  }

  template() {
    return html`
      <section class="is-flex is-justify-content-center">
        <div>
          <form data-target="filterForm" class="flex-responsive hidden-mobile">
            <div class="field mx-2">
              <label for="task-name" class="label">Task Name</label>
              <input
                id="task-name"
                class="input is-normal"
                data-target="searchBar"
                type="text"
                placeholder="Search tasks"
              />
            </div>

            <div class="field mx-2">
              <label for="start-date" class="label">Start Date</label>
              <input
                data-target="startDate"
                id="start-date"
                class="input is-normal"
                type="date"
              />
            </div>

            <div class="field mx-2">
              <label for="end-date" class="label">End Date</label>
              <input
                data-target="endDate"
                id="end-date"
                class="input is-normal"
                type="date"
              />
            </div>
            <div class="field mx-2">
              <input
                type="submit"
                class="button is-link inline-block mr-3"
                value="Filter"
              />
              <input type="reset" class="button" value="Reset" />
            </div>

            <div class="field"></div>
          </form>
          <button data-target="mobileFiltersBtn" class="is-link visible-mobile">
            Display filters
          </button>
        </div>
      </section>

      <section class="is-flex is-justify-content-center m-4">
        <x-link to="/tasks/new">Create new task</x-link>
      </section>

      <hr />

      <section class="is-flex is-justify-content-center">
        <div data-target="tasksList" class="w-700"></div>
        <p data-target="loader">Loading...</p>
      </section>
    `;
  }
}

customElements.define("x-tasks-page", TasksPage);
