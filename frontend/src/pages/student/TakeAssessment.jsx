import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";

const TakeAssessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await axios.get(
          `https://lms-server-production-4028.up.railway.app/api/assessments/student/exam/${assessmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setQuestions(res.data.assessment.questions);
          setTimer(res.data.assessment.timer * 60); // Convert minutes to seconds
        }
      } catch (error) {
        console.error("Error fetching exam questions:", error);
      } finally {
        setLoading(false);
      }
    };
    //try

    fetchAssessment();
  }, [assessmentId, token]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !submitted) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timer, submitted]);

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    const formattedAnswers = Object.entries(answers).map(([questionId, optionId]) => ({
      questionId,
      optionId,
    }));

    try {
      const res = await axios.post(
        `https://lms-server-production-4028.up.railway.app/api/assessments/student/exam/${assessmentId}/submit`,
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        navigate(`/exam-success?score=${encodeURIComponent(res.data.message)}`);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      setSubmitted(false);
    }
  };
  return (
    <Layout>
      {/* Background Animation Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="animate-float-slow absolute w-16 h-16 rounded-full bg-purple-500 opacity-10 top-1/4 left-1/4"></div>
        <div className="animate-float absolute w-24 h-24 rounded-full bg-blue-500 opacity-5 top-3/4 right-1/3"></div>
        <div className="animate-float-reverse absolute w-12 h-12 rounded-full bg-green-500 opacity-10 bottom-1/4 right-1/4"></div>
        <div className="animate-pulse absolute w-20 h-20 rounded-full bg-yellow-500 opacity-5 top-1/2 left-10"></div>
      </div>
  
      <div className="max-w-3xl mx-auto p-4 sm:p-6 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-t-4 border-purple-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Assessment</h2>
            
            {/* Timer with Animation */}
            <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center shadow-inner">
              <div className={`w-3 h-3 rounded-full mr-2 ${timer <= 300 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
              <div className="font-mono text-lg font-semibold">
                {Math.floor(timer / 60)}:
                <span className={timer <= 60 ? 'text-red-600 animate-pulse' : ''}>
                  {String(timer % 60).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
  
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 animate-pulse">Loading exam questions...</p>
            </div>
          ) : (
            <>
              <div className="bg-purple-50 p-3 mb-6 rounded-md border border-purple-100 animate-fade-in">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-sm text-purple-700">
                    Please answer all questions. Once submitted, you cannot change your answers.
                  </p>
                </div>
              </div>
  
              <form>
                <div className="space-y-6">
                  {questions.map((q, qIndex) => (
                    <div 
                      key={q._id} 
                      className="p-4 sm:p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
                      style={{ 
                        animationDelay: `${qIndex * 100}ms`,
                        animationName: 'fadeSlideIn',
                        animationDuration: '0.5s',
                        animationFillMode: 'both'
                      }}
                    >
                      <h3 className="text-md sm:text-lg font-semibold mb-3 pb-2 border-b">
                        <span className="inline-block bg-purple-100 text-purple-800 w-6 h-6 rounded-full text-center mr-2 text-sm">
                          {qIndex + 1}
                        </span>
                        {q.questionText}
                      </h3>
                      <div className="space-y-2 mt-3">
                        {q.options.map((opt) => (
                          <label 
                            key={opt._id} 
                            className={`block p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                              answers[q._id] === opt._id 
                                ? 'bg-purple-50 border-purple-300' 
                                : 'hover:bg-gray-50 border-gray-200'
                            } ${submitted ? 'opacity-80' : ''}`}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                answers[q._id] === opt._id 
                                  ? 'border-purple-500' 
                                  : 'border-gray-300'
                              }`}>
                                {answers[q._id] === opt._id && (
                                  <div className="w-3 h-3 rounded-full bg-purple-500 animate-scale"></div>
                                )}
                              </div>
                              <input
                                type="radio"
                                name={`question-${q._id}`}
                                value={opt._id}
                                checked={answers[q._id] === opt._id}
                                onChange={() => handleAnswerChange(q._id, opt._id)}
                                disabled={submitted}
                                className="sr-only" // Hide default radio but keep functionality
                              />
                              <span className="text-gray-800">{opt.text}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
  
                <div className="mt-8 sticky bottom-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitted}
                    className={`w-full py-3 px-4 rounded-md shadow transition-all duration-300 font-medium text-white flex items-center justify-center ${
                      submitted 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:scale-[1.01]'
                    }`}
                  >
                    {submitted ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Exam Submitted
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Submit Exam
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
  
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        @keyframes float-slow {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(40px, 40px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        @keyframes float-reverse {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-30px, 30px) rotate(-180deg); }
          100% { transform: translate(0, 0) rotate(-360deg); }
        }
        
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .animate-float {
          animation: float 20s infinite ease-in-out;
        }
        
        .animate-float-slow {
          animation: float-slow 25s infinite ease-in-out;
        }
        
        .animate-float-reverse {
          animation: float-reverse 18s infinite ease-in-out;
        }
        
        .animate-scale {
          animation: scale 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeSlideIn 0.5s ease-out forwards;
        }
      `}</style>
    </Layout>
  );
};

export default TakeAssessment;
