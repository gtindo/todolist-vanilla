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

  if (response.status !== 200) {
    throw new ApiError("Failed to fetch tasks", response.status);
  }

  const tasks = await response.json();

  return tasks;
}

/**
 * @param {string} label
 * @returns {Promise<Task>}
 */
export async function getTaskByLabel(label) {
  const response = await fetch(`${BASE_URL}/tasks/${label}`);

  if (response.status !== 200) {
    throw new ApiError("Failed to fetch task", response.status);
  }

  const task = await response.json();

  return task;
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
    throw new ApiError("Failed to create task", response.status);
  }
}

/**
 * @typedef {Object} UpdateTask
 * @property {string} label
 * @property {string} description
 * @property {string} start_date
 * @property {string} end_date
 */

/**
 * Update a task
 * @param {UpdateTask} task
 */
export async function updateTask(task) {
  const response = await fetch(`${BASE_URL}/tasks/${task.label}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (response.status !== 200) {
    throw new ApiError("Failed to update task", response.status);
  }
}

/**
 *
 * @param {string} taskLabel
 */
export async function deleteTask(taskLabel) {
  const response = await fetch(`${BASE_URL}/tasks/${taskLabel}`, {
    method: "DELETE",
  });

  if (response.status !== 200) {
    throw new ApiError("Failed to delete task", response.status);
  }
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);

    switch (status) {
      case 400:
        this.name = "BadRequest";
        break;
      case 404:
        this.name = "NotFound";
        break;
      case 500:
        this.name = "InternalServerError";
        break;
      default:
        this.name = "ApiError";
    }

    this.status = status;
  }
}
