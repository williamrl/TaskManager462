
const API_BASE_URL = "http://127.0.0.1:5000"; // Replace with your Flask server URL if different

export const getTasks = async () => {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getTasks:", error);
    throw error;
  }
};

// Function to add a new task
export async function addTask(taskName, date, parentTaskId = null) {
  const url = `${API_BASE_URL}/add_task`; // Use API_BASE_URL for the base URL
  
  const formattedDate = new Date(date).toLocaleDateString('en-CA'); // Converts to YYYY-MM-DD  
  const taskData = {
      task_name: taskName,
      date: formattedDate,
      parent_task_id: parentTaskId, // Optional for subtasks
  };

  try {
      const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.message);
      return result;
  } catch (error) {
      console.error("Error adding task:", error);
      throw error;
  }
}

export const getTaskTree = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/task_tree`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching task tree: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getTaskTree:", error);
    throw error;
  }
};