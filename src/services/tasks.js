const BASE_URL = "http://localhost:9000/v1/tasks";

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
  const response = await fetch(BASE_URL);
  if (!response.body) return [];
  const tasks = await response.json();

  return tasks;
}

export async function createTask(task) {}
