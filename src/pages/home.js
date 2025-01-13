import { getTasks } from "../services/tasks";
import { createEffect, createSignal } from "../shared/signals";
import { attachTemplate, getTargetElements, html } from "../shared/templates";

class Home extends HTMLElement {
  static targets = [
    "tasksList",
    "loader",
    "searchBar",
    "startDate",
    "endDate",
    "filterForm",
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
    this.elements = getTargetElements(this.shadowRoot, Home.targets);

    // detect changes on displayed list and displays new list
    createEffect(this.displayedTasks, (tasks) => {
      this.elements.tasksList.innerHTML = "";
      const list = document.createElement("ul");

      tasks.forEach((task) => {
        let item = document.createElement("li");
        list.appendChild(item);

        const taskElement = document.createElement("x-task");
        taskElement.setAttribute("label", task.label);
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
      <section>
        <form data-target="filterForm">
          <input
            data-target="searchBar"
            type="text"
            placeholder="Search tasks"
          />
          <input data-target="startDate" type="date" />
          <input data-target="endDate" type="date" />
          <input type="submit" value="Filter" />
          <input type="reset" value="Reset" />
        </form>
      </section>

      <section>
        <x-link to="/tasks/new">Create new task</x-link>
      </section>

      <section>
        <div data-target="tasksList"></div>
        <p data-target="loader">Loading...</p>
      </section>
    `;
  }
}

customElements.define("x-home-page", Home);
