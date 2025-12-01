import axios from 'axios';

const API_URL = 'http://localhost:8000/interview';

export const fetchQuestions = async (role, category = null) => {
  try {
    const params = { role };
    if (category) params.category = category;
    const response = await axios.get(`${API_URL}/questions`, { params });
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};



/**
 * NEW: Function to send a question/answer to the backend for an AI-generated explanation.
 * @param {string} role - The user's selected role.
 * @param {string} questionTitle - The title of the question.
 * @param {string} modelAnswerExplanation - The model answer's explanation text.
 * @returns {Promise<string>} The AI-generated explanation as an HTML string.
 */
export const generateAIExplanation = async (role, questionTitle, modelAnswerExplanation) => {
    try {
        const response = await axios.post(`${API_URL}/ai-explain`, {
            role: role,
            question_title: questionTitle,
            model_answer: modelAnswerExplanation,
        });
        // Assuming the backend returns the explanation in the 'explanation' field
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



































