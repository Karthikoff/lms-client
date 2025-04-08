import axios from "axios";

const API_URL = "https://lms-server-production-4028.up.railway.app/api/assessments"; // Use localhost:5000

// Get all assessments for the student
const getStudentAssessments = () => {
  return axios.get(`${API_URL}/student`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
};

// Get the questions for a specific assessment
const getAssessmentQuestions = (assessmentId) => {
  return axios.get(`${API_URL}/student/exam/${assessmentId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
};

// Submit the exam answers
const submitExam = (assessmentId, answers) => {
  return axios.post(`${API_URL}/student/exam/${assessmentId}/submit`, { answers }, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
};

export { getStudentAssessments, getAssessmentQuestions, submitExam };
