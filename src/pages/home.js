import { getTasks } from "../services/tasks";
import { createEffect, createSignal } from "../shared/signals";
import { attachTemplate, getTargetElements, html } from "../shared/templates";

class Home extends HTMLElement {
  static targets = ["tasksList", "loader"];

  constructor() {
    super();
    this.tasks = createSignal([]);
    this.loading = createSignal(true);

    this.elements = {};
  }

  connectedCallback() {
    attachTemplate(this, this.template());
    this.elements = getTargetElements(this.shadowRoot, Home.targets);

    // detect changes on task list and displays new list
    createEffect(this.tasks, (tasks) => {
      this.elements.tasksList.innerHTML = "";
      const list = document.createElement("ul");

      tasks.forEach((task) => {
        let item = document.createElement("li");
        item.textContent = task.label;
        list.appendChild(item);
      });

      this.elements.tasksList.appendChild(list);
    });

    // Detect changes on loading state and display / hide loader
    createEffect(this.loading, (loading) => {
      this.elements.loader.style.display = loading ? "block" : "none";
    });

    this.load();
  }

  async load() {
    this.loading.set(true);
    const tasks = await getTasks();
    this.tasks.set(tasks);
    this.loading.set(false);
  }

  template() {
    return html`
      <section>Search bar</section>

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
