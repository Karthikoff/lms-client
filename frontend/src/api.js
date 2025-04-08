import axios from "axios";

const API_URL = "http://localhost:5000/api/assessments";

// Fetch assessments for a specific course
export const getAssessmentsByCourse = async (courseId, token) => {
    try {
        const response = await axios.get(`${API_URL}/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching assessments", error);
        throw error;
    }
};

// Fetch a student's submission for an assessment
export const getSubmissionByStudent = async (assessmentId, token) => {
    try {
        const response = await axios.get(`${API_URL}/submissions/${assessmentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching submission", error);
        throw error;
    }
};

// Submit an assessment
export const submitAssessment = async (data, token) => {
    try {
        const response = await axios.post(`${API_URL}/submit`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error submitting assessment", error);
        throw error;
    }
};

// Create a new assessment (Instructor Only)
export const createAssessment = async (data, token) => {
    try {
        const response = await axios.post(`${API_URL}/create`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating assessment", error);
        throw error;
    }
};
