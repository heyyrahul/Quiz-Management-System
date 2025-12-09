import apiClient from "./apiClient";

// READ: all quizzes (for admin + home)
export const fetchQuizzes = async () => {
  const { data } = await apiClient.get("/api/quizzes");
  return data.map((q) => ({ ...q, id: q._id }));
};

// READ: single quiz
export const fetchQuizById = async (id) => {
  const { data } = await apiClient.get(`/api/quizzes/${id}`);
  return { ...data, id: data._id };
};

// CREATE
export const createQuizApi = async (payload) => {
  const { data } = await apiClient.post("/api/quizzes", payload);
  return { ...data, id: data._id };
};

// UPDATE
export const updateQuizApi = async (id, payload) => {
  const { data } = await apiClient.put(`/api/quizzes/${id}`, payload);
  return { ...data, id: data._id };
};

// DELETE
export const deleteQuizApi = async (id) => {
  const { data } = await apiClient.delete(`/api/quizzes/${id}`);
  return data;
};
