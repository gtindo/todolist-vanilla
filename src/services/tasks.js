const BASE_URL = "http://localhost:9000/v1";

/**
 * @typedef {Object} Task
 * @property {string} label
 * @property {string} description
 * @property {string} start_date
 * @property {string} end_date
 */

/**
 * Fetch tasks from the api
 * @returns {Promise<Array<Task>>}
 */
export async function getTasks() {
  const response = await fetch(`${BASE_URL}/tasks`);
  if (!response.body) return [];
  const tasks = await response.json();

  return tasks;
}

/**
 * @typedef {Object} AddTask
 * @property {string} label
 * @property {string} description
 * @property {string} start_date
 */

/**
 * Create a task
 * @param {AddTask} task
 */
export async function createTask(task) {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (response.status !== 201) {
    throw new Error("Failed to create task");
  }
}
