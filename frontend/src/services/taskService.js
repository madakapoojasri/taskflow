import api from "./api";

export async function getTasks() {
  const response = await api.get("/tasks");
  return response.data;
}

export async function createTask(data) {
  const response = await api.post("/tasks", data);
  return response.data;
}

export async function updateTask(id, data) {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
}

export async function toggleTask(id) {
  const response = await api.patch(`/tasks/${id}/complete`);
  return response.data;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}