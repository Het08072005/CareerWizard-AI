import api from "./axiosClient";

export const fetchQuestions = async (role, category = null) => {
  try {
    const params = { role };
    if (category) params.category = category;
    const response = await api.get("/interview/questions", { params });
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const generateAIExplanation = async (role, questionTitle, modelAnswerExplanation) => {
  try {
    const response = await api.post("/interview/ai-explain", {
      role: role,
      question_title: questionTitle,
      model_answer: modelAnswerExplanation,
    });
    return response.data.explanation;
  } catch (err) {
    console.error("Error generating AI explanation:", err);
    return "Failed to get an AI explanation. Please try again later.";
  }
};





// Add a new question (if needed)
export const addQuestion = async (questionData) => {
  try {
    const response = await api.post("/interview/add", questionData);
    return response.data;
  } catch (err) {
    console.error("Error adding question:", err);
    throw err;
  }
};



































