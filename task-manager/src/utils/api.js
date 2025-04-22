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