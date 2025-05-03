const API_BASE = 'http://127.0.0.1:5000'; // Flask default port

export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching tasks: ${response.statusText}`);
  }
  const data = await response.json();
  console.log('Fetched tasks data:', data); // Log the parsed JSON data
  return data;
};

// export const addTask = async (task_name, date, parent = null) => {
//   const response = await fetch(`${API_BASE}/add_task`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ task_name, date, parent }),
//   });

//   if (!response.ok) {
//     throw new Error(`Error adding task: ${response.statusText}`);
//   }

//   return await response.json();
// };

// export const updateTask = async (task_id, updates) => {
//   const response = await fetch(`${API_BASE}/tasks/${task_id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(updates),
//   });

//   if (!response.ok) {
//     throw new Error(`Error updating task: ${response.statusText}`);
//   }

//   return await response.json();
// };

// export const deleteTask = async (task_id) => {
//   const response = await fetch(`${API_BASE}/tasks/${task_id}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`Error deleting task: ${response.statusText}`);
//   }

//   return await response.json();
// };