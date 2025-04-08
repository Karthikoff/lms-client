import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Layout from "../../components/Layout";

const TakeExam = () => {
  const { examId } = useParams();
  const token = localStorage.getItem("token");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const certificateRef = useRef(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/exams/student/exam/${examId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setQuestions(res.data.exam.questions || []);
          setTimer(res.data.exam.timer ? res.data.exam.timer * 60 : 0);
        }
      } catch (error) {
        console.error("Error fetching exam questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId, token]);

  useEffect(() => {
    if (timer !== null && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !submitted) {
      handleSubmit();
    }
  }, [timer, submitted]);

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const navigateQuestion = (direction) => {
    if (direction === 'next' && currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (typeof direction === 'number' && direction >= 0 && direction < questions.length) {
      setCurrentQuestion(direction);
    }
  };

  const getTimerColor = () => {
    const totalTime = questions.length > 0 ? questions.length * 60 : 3600;
    const percentageLeft = (timer / totalTime) * 100;
    
    if (percentageLeft > 50) return 'text-green-600';
    if (percentageLeft > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
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
        `http://localhost:5000/api/exams/student/exam/${examId}/submit`,
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setScore(res.data.certificateData?.score || 0);
        if (res.data.certificateData) {
          setCertificateData(res.data.certificateData);
        }
      } else {
        setScore(0);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      setSubmitted(false);
    }
  };

  const downloadCertificateAsPDF = () => {
    if (!certificateData) return;

    const doc = new jsPDF({
      orientation: "landscape", 
      unit: "mm", 
      format: "a4"
    });

    // Add fancy border
    doc.setDrawColor(128, 0, 128); // Purple border
    doc.setLineWidth(1);
    doc.rect(10, 10, 277, 190);
    
    // Add second fancy border
    doc.setDrawColor(75, 0, 130); // Indigo border
    doc.setLineWidth(0.5);
    doc.rect(15, 15, 267, 180);

    // Certificate title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.setTextColor(75, 0, 130);
    doc.text("CERTIFICATE OF EXCELLENCE", 148, 40, { align: "center" });

    // BrainBoost Logo placeholder
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(128, 0, 128);
    doc.text("BRAIN BOOST", 148, 30, { align: "center" });

    // Add wavy line decoration
    doc.setDrawColor(128, 0, 128);
    doc.setLineWidth(0.5);
    let startX = 70;
    const endX = 230;
    const y = 50;
    while (startX < endX) {
      doc.line(startX, y, startX + 5, y + 2);
      doc.line(startX + 5, y + 2, startX + 10, y);
      startX += 10;
    }

    // Presented to
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("This certificate is proudly presented to:", 148, 70, { align: "center" });

    // Student name (Ensure it's not undefined/null)
    const studentName = certificateData.studentName || "Student Name";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text(studentName, 148, 85, { align: "center" });

    // Underline for name
    doc.setDrawColor(128, 0, 128);
    doc.setLineWidth(0.5);
    const nameWidth = doc.getStringUnitWidth(studentName) * 24 / doc.internal.scaleFactor;
    doc.line(148 - nameWidth / 2, 88, 148 + nameWidth / 2, 88);

    // Message
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("For successfully completing the course", 148, 100, { align: "center" });

    // Course name (Ensure it's not undefined/null)
    const courseName = certificateData.courseName || "Course Name";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(75, 0, 130);
    doc.text(courseName, 148, 110, { align: "center" });

    // Score (Ensure it's valid)
    const score = certificateData.score ?? "N/A"; // Using Nullish Coalescing (??) to avoid issues with 0
    const percentage = certificateData.percentage ?? "N/A";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`With a remarkable score of ${score} (${percentage}%)`, 148, 125, { align: "center" });

    // Issue date
    const currentDate = new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
    doc.setFontSize(12);
    doc.text(`Issued on: ${currentDate}`, 148, 140, { align: "center" });

    // Appreciation
    doc.setFontSize(12);
    doc.setTextColor(75, 0, 130);
    doc.text("We appreciate your dedication and hard work.", 148, 155, { align: "center" });
    
    // Best wishes
    doc.setFontSize(11);
    doc.text("Best wishes for your future endeavors,", 148, 170, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text("BrainBoost and Team", 148, 178, { align: "center" });

    doc.save("BrainBoost_Certificate.pdf");
};


  // Progress calculation
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <Layout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen animate-fadeIn">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="spinner"></div>
            <p className="mt-4 text-purple-700">Loading your exam...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="mt-4 text-gray-700 text-lg">No questions available for this exam.</p>
          </div>
        ) : submitted ? (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 animate-slideUp">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Exam Completed</h2>
              <p className="text-gray-600 mt-2">Thank you for completing the exam.</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 mb-6 text-center">
              <h3 className="text-xl font-bold text-purple-800">Your Results</h3>
              <div className="text-5xl font-bold text-purple-700 my-4">{score}</div>
              <p className="text-gray-700">
                {certificateData?.percentage >= 70 
                  ? "Excellent job! You've passed with flying colors." 
                  : "Keep practicing. You'll do better next time!"}
              </p>
            </div>

            {certificateData && certificateData.eligible ? (
              <div className="mt-8 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
                <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">Your Certificate</h3>
                
                <div 
                  ref={certificateRef} 
                  className="border-8 border-double border-purple-200 p-8 bg-gradient-to-br from-white to-purple-50 rounded-lg text-center max-w-3xl mx-auto shadow-md"
                >
                  <div className="text-purple-800 text-3xl font-bold mb-2">BRAIN BOOST</div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider text-purple-900 mb-4">Certificate of Excellence</h3>
                  
                  <div className="my-8">
                    <p className="text-gray-700 mb-4">This certificate is proudly presented to:</p>
                    <p className="text-2xl font-bold text-gray-900 border-b-2 border-purple-300 inline-block px-4 pb-1">{certificateData.studentName}</p>
                    
                    <p className="text-gray-700 mt-6 mb-2">For successfully completing the course</p>
                    <p className="text-xl font-semibold text-purple-800">{certificateData.courseName}</p>
                    
                    <p className="text-gray-700 mt-6">
                      With a remarkable score of <span className="font-bold">{certificateData.score}</span> (<span className="font-bold">{certificateData.percentage}%</span>)
                    </p>
                    
                    <p className="text-sm text-gray-600 mt-6">
                      Issued on: {new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
                    </p>
                  </div>
                  
                  <div className="mt-8 text-gray-700">
                    <p>We appreciate your dedication and hard work.</p>
                    <p className="mt-6 text-sm font-medium">Best wishes for your future endeavors,</p>
                    <p className="font-bold text-purple-800">BrainBoost and Team</p>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <button
                    className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center mx-auto transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={downloadCertificateAsPDF}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Download Certificate
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 bg-red-50 rounded-lg">
                <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-red-800 mt-4 font-medium">You need to score at least 70% to receive a certificate.</p>
                <p className="text-gray-700 mt-2">Keep learning and try again!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Take Exam</h2>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className={`flex items-center ${getTimerColor()} bg-white bg-opacity-20 px-3 py-1 rounded-lg`}>
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="font-mono font-medium">{formatTime(timer)}</span>
                  </div>
                  
                  <div className="mt-2 sm:mt-0 text-white">
                    <span className="font-medium">Progress: </span>
                    <span>{answeredCount}/{questions.length} questions answered</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 h-1">
                <div 
                  className="bg-purple-600 h-1 transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="p-4 md:p-6">
                {/* Question Navigator */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigateQuestion(idx)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        currentQuestion === idx 
                          ? 'bg-purple-700 text-white' 
                          : answers[questions[idx]?._id] 
                            ? 'bg-green-100 text-green-800 border-2 border-green-500' 
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                
                {/* Current Question */}
                {questions[currentQuestion] && (
                  <div className="mb-6 animate-fadeIn">
                    <div className="flex items-center mb-4">
                      <span className="bg-purple-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                    </div>
                    
                    <p className="text-lg font-medium text-gray-800 mb-4">
                      {questions[currentQuestion].text}
                    </p>
                    
                    <div className="space-y-3 mt-6">
                      {questions[currentQuestion].options.map((option) => (
                        <label 
                          key={option._id} 
                          className={`block p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                            answers[questions[currentQuestion]._id] === option._id 
                              ? 'bg-purple-50 border-purple-300' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${
                              answers[questions[currentQuestion]._id] === option._id 
                                ? 'border-purple-600' 
                                : 'border-gray-400'
                            }`}>
                              {answers[questions[currentQuestion]._id] === option._id && (
                                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                              )}
                            </div>
                            <span className="ml-3 text-gray-700">{option.text}</span>
                          </div>
                          <input
                            type="radio"
                            name={`question-${questions[currentQuestion]._id}`}
                            value={option._id}
                            checked={answers[questions[currentQuestion]._id] === option._id}
                            onChange={() => handleAnswerChange(questions[currentQuestion]._id, option._id)}
                            className="sr-only"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => navigateQuestion('prev')}
                    disabled={currentQuestion === 0}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      currentQuestion === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Previous
                  </button>
                  
                  {currentQuestion < questions.length - 1 ? (
                    <button
                      onClick={() => navigateQuestion('next')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700"
                    >
                      Next
                      <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-green-700"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Submit Exam
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Submit Button at bottom for convenience */}
            <div className="text-center mb-8">
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                Submit Exam
              </button>
              <p className="text-sm text-gray-500 mt-2">Submit when you've completed all questions</p>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #9333ea;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
};

export default TakeExam;