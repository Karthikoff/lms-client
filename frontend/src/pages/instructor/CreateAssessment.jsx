import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

const CreateAssessment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [instructions, setInstructions] = useState("");
  const [timer, setTimer] = useState(60);
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      marks: 5,
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ]);
  const [isCertificateEnabled, setIsCertificateEnabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses/instructor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (error) {
        console.error("Error fetching instructor courses:", error);
      }
    };

    fetchInstructorCourses();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Validation: Ensure at least one correct and one incorrect option per question
    for (const question of questions) {
      const correctOptions = question.options.filter((opt) => opt.isCorrect).length;
      const incorrectOptions = question.options.filter((opt) => !opt.isCorrect).length;
  
      if (correctOptions === 0 || incorrectOptions === 0) {
        setSuccessMessage("Each question must have at least one correct and one incorrect option.");
        setIsLoading(false);
        return;
      }
    }
  
    try {
      const res = await axios.post(
        "http://localhost:5000/api/assessments",
        { courseId, instructions, timer, questions, isCertificateEnabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (res.data.success) {
        setSuccessMessage("Assessment created successfully!");
        setTimeout(() => navigate("/view-assessment"), 1500);
      } else {
        setSuccessMessage("Failed to create assessment.");
      }
    } catch (error) {
      console.error("Error creating assessment:", error);
      setSuccessMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][e.target.name] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex].text = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, correctIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.map((opt, index) => ({
      ...opt,
      isCorrect: index === correctIndex,
    }));
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        marks: 5,
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto p-4 md:p-6 w-full">
          <div className="bg-white rounded-xl shadow-lg p-5 md:p-8 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-800 border-b pb-3">Create Assessment</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Course Selection */}
                <div className="transition-all duration-200 hover:shadow-md p-4 rounded-lg border border-purple-100">
                  <label className="block text-sm font-semibold text-purple-900 mb-2">Select Course</label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
  
                {/* Assessment Name */}
                <div className="transition-all duration-200 hover:shadow-md p-4 rounded-lg border border-purple-100">
                  <label className="block text-sm font-semibold text-purple-900 mb-2">ASSESSMENT NAME AND NUMBER</label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    rows="3"
                  />
                </div>
  
                {/* Timer */}
                <div className="transition-all duration-200 hover:shadow-md p-4 rounded-lg border border-purple-100">
                  <label className="block text-sm font-semibold text-purple-900 mb-2">Timer (minutes)</label>
                  <input
                    type="number"
                    value={timer}
                    onChange={(e) => setTimer(Number(e.target.value))}
                    className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    min="1"
                  />
                </div>
  
                {/* Questions */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-purple-900 mb-4">Questions</h3>
                  
                  {questions.map((question, qIndex) => (
                    <div key={qIndex} className="mb-6 p-5 border border-purple-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-purple-800">Question {qIndex + 1}</h3>
                        <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {question.marks} mark{question.marks > 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <input
                        type="text"
                        name="questionText"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(qIndex, e)}
                        className="w-full p-3 border border-purple-200 rounded-lg mb-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter question"
                        required
                      />
  
                      <div className="mt-3">
                        <label className="block text-sm font-semibold text-purple-900 mb-2">Marks</label>
                        <input
                          type="number"
                          name="marks"
                          value={question.marks}
                          onChange={(e) => handleQuestionChange(qIndex, e)}
                          className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                          min="1"
                        />
                      </div>
  
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-purple-900 mb-2">Options</h4>
                        <div className="space-y-3">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-3 p-3 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors duration-200">
                              <span className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                                {String.fromCharCode(65 + oIndex)}
                              </span>
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                                className="flex-1 p-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder={`Option ${oIndex + 1}`}
                              />
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id={`correct-${qIndex}-${oIndex}`}
                                  name={`correct-${qIndex}`}
                                  checked={option.isCorrect}
                                  onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                                />
                                <label htmlFor={`correct-${qIndex}-${oIndex}`} className="ml-2 text-sm text-purple-900">
                                  Correct
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  type="button" 
                  onClick={handleAddQuestion} 
                  className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Question
                </button>
  
                <button 
                  type="submit" 
                  className="mt-8 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Assessment...
                    </div>
                  ) : (
                    "Create Assessment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAssessment;
