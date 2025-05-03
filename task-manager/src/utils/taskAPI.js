const API_BASE_URL = "http://127.0.0.1:5000"; // Replace with your Flask server's URL if different

// Fetch all tasks
export const fetchTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching tasks: ${response.statusText}`);
    }

    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error("Error in fetchTasks:", error);
    throw error;
  }
};

// Add a new task
export const addTask = async (taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/add_task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Error adding task: ${response.statusText}`);
    }

    const newTask = await response.json();
    return newTask;
  } catch (error) {
    console.error("Error in addTask:", error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId, updatedData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`Error updating task: ${response.statusText}`);
    }

    const updatedTask = await response.json();
    return updatedTask;
  } catch (error) {
    console.error("Error in updateTask:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting task: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in deleteTask:", error);
    throw error;
  }
};