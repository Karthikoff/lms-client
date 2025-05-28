import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";

const CreateExam = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [instructions, setInstructions] = useState("");
  const [timer, setTimer] = useState(60);
  const [examNumber, setExamNumber] = useState(1);
  const [isCertificateEnabled, setIsCertificateEnabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        const res = await axios.get("https://lms-server-production-4d02.up.railway.app/api/courses/instructor", {
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
        "https://lms-server-production-4d02.up.railway.app/api/exams",
        { courseId, instructions, timer, examNumber, questions, isCertificateEnabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setSuccessMessage("Exam created successfully!");
        setTimeout(() => navigate("/view-exam"), 1500);
      } else {
        setSuccessMessage("Failed to create exam.");
      }
    } catch (error) {
      console.error("Error creating exam:", error);
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
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg my-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#9f48f2] border-b pb-4 border-[#9f48f2]">Create Exam</h2>
  
        {successMessage && (
          <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <p className="font-medium">{successMessage}</p>
          </div>
        )}
  
        <form onSubmit={handleSubmit}>
          {/* Course Selection */}
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">Select Course:</label>
            <select 
              value={courseId} 
              onChange={(e) => setCourseId(e.target.value)} 
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#9f48f2] focus:border-[#9f48f2] transition-all"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Exam Instructions */}
          <div className="mb-4">
            <label className="block text-gray-800 font-medium mb-2">Exam Name:</label>
            <input 
              type="text"
              value={instructions} 
              onChange={(e) => setInstructions(e.target.value)} 
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#9f48f2] focus:border-[#9f48f2] transition-all"
              placeholder="Enter exam name..."
            />
          </div>
  
          {/* Exam Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Timer */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">Exam Duration (Minutes):</label>
              <input 
                type="number" 
                value={timer} 
                onChange={(e) => setTimer(e.target.value)} 
                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#9f48f2] focus:border-[#9f48f2] transition-all" 
                placeholder="60"
              />
            </div>
  
            {/* Exam Number */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">Exam Number:</label>
              <input 
                type="number" 
                value={examNumber} 
                onChange={(e) => setExamNumber(e.target.value)} 
                className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#9f48f2] focus:border-[#9f48f2] transition-all" 
                placeholder="1"
              />
            </div>
  
            {/* Certificate Enable Toggle */}
            <div className="flex items-center">
              <label className="inline-flex items-center bg-gray-50 p-3 rounded-md border border-gray-300 w-full">
                <input 
                  type="checkbox" 
                  checked={isCertificateEnabled} 
                  onChange={(e) => setIsCertificateEnabled(e.target.checked)} 
                  className="h-5 w-5 text-[#9f48f2] focus:ring-[#9f48f2]" 
                />
                <span className="ml-2 text-gray-800 font-medium">Enable Certificate</span>
              </label>
            </div>
          </div>
  
          {/* Questions Section */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-4 text-[#9f48f2]">Exam Questions</h3>
  
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-gray-800 font-semibold">Question {qIndex + 1}</label>
                  <span className="text-sm bg-[#ede1fa] text-[#9f48f2] font-medium px-2 py-1 rounded-full">{question.marks} Marks</span>
                </div>
  
                <input 
                  type="text" 
                  value={question.questionText} 
                  onChange={(e) => handleQuestionChange(qIndex, e)} 
                  name="questionText" 
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#9f48f2] focus:border-[#9f48f2] transition-all mb-3" 
                  placeholder="Enter your question here..."
                />
  
                <div className="grid grid-cols-6 gap-2 mb-2">
                  <label className="block text-gray-800 font-medium col-span-5">Options</label>
                  <label className="block text-gray-800 font-medium text-center">Correct</label>
                </div>
  
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="grid grid-cols-6 gap-2 mb-2 items-center">
                    <input 
                      type="text" 
                      value={option.text} 
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e)} 
                      className="col-span-5 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#9f48f2] focus:border-[#9f48f2] transition-all" 
                      placeholder={`Option ${oIndex + 1}`}
                    />
                    <div className="flex justify-center">
                      <input 
                        type="radio" 
                        checked={option.isCorrect} 
                        onChange={() => handleCorrectAnswerChange(qIndex, oIndex)} 
                        className="h-5 w-5 text-[#9f48f2] focus:ring-[#9f48f2]" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
  
            <button 
              type="button" 
              onClick={handleAddQuestion} 
              className="w-full bg-[#f3ecfd] hover:bg-[#e4d2fb] text-[#9f48f2] font-medium py-3 px-4 rounded-md border border-[#9f48f2] flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Question
            </button>
          </div>
  
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-[#9f48f2] hover:bg-[#8733da] text-white font-bold py-3 px-4 rounded-md transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Exam...
              </span>
            ) : "Create Exam"}
          </button>
        </form>
      </div>
    </Layout>
  );
  
};

export default CreateExam;
