import api from "../api/axiosClient";

export const getRecommendations = (skill) =>
  api.get("/recommend", { params: { skill } });
