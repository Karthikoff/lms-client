import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";


const StudentViewExams = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://lms-server-production-4d02.up.railway.app/api/users/enrolled-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setEnrolledCourses(res.data.enrolledCourses);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    fetchEnrolledCourses();
  }, []);

  useEffect(() => {
    if (!courseId) return;

    const fetchExams = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://lms-server-production-4d02.up.railway.app/api/exams/student/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          if (res.data.exams.length === 0) {
            setError("No exams created for this course.");
          }
          setExams(res.data.exams);
        } else {
          setError("No exams found.");
          setExams([]);
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
        setError("Something went wrong while fetching exams.");
        setExams([]);
      }
      setLoading(false);
    };

    fetchExams();
  }, [courseId]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg animate-fade-in">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 border-b pb-3 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          View Exams
        </h2>
  
        {/* Course Selection with improved styling */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <label className="block text-gray-700 text-sm font-medium mb-2">Select Course:</label>
          <div className="relative">
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-300"
            >
              <option value="">Select Course</option>
              {enrolledCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
  
        {/* Loading animation */}
        {loading && (
          <div className="flex justify-center py-12 animate-fade-in">
            <div className="loader">
              <div className="dot-pulse"></div>
            </div>
          </div>
        )}
  
        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-shake">
            <div className="flex">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}
  
        {/* No exams state */}
        {!loading && exams.length === 0 && courseId && !error && (
          <div className="text-center py-10 animate-fade-in">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="mt-4 text-gray-500">No exams available for this course.</p>
          </div>
        )}
  
        {/* Exams list */}
        {!loading && exams.length > 0 && (
          <div className="space-y-3 sm:space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {exams.map((exam, index) => (
              <div 
                key={exam._id} 
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100 + 300}ms` }}
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                        #{exam.examNumber}
                      </span>
                      <h3 className="font-semibold text-gray-900">{exam.instructions}</h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {exam.timer} minutes
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <button
                      onClick={() => navigate(`/std-take-exam/${exam._id}`)}
                      className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors duration-300"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                      </svg>
                      Attempt Exam
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <style jsx>{`
          /* Animations */
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
          
          .animate-slide-up {
            animation: slideUp 0.6s ease-out forwards;
          }
          
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
          
          /* Loading animation */
          .dot-pulse {
            position: relative;
            left: -9999px;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background-color: #3b82f6;
            color: #3b82f6;
            box-shadow: 9999px 0 0 -5px;
            animation: dot-pulse 1.5s infinite linear;
            animation-delay: 0.25s;
          }
          
          .dot-pulse::before, .dot-pulse::after {
            content: '';
            display: inline-block;
            position: absolute;
            top: 0;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background-color: #3b82f6;
            color: #3b82f6;
          }
          
          .dot-pulse::before {
            box-shadow: 9984px 0 0 -5px;
            animation: dot-pulse-before 1.5s infinite linear;
            animation-delay: 0s;
          }
          
          .dot-pulse::after {
            box-shadow: 10014px 0 0 -5px;
            animation: dot-pulse-after 1.5s infinite linear;
            animation-delay: 0.5s;
          }
          
          @keyframes dot-pulse-before {
            0% { box-shadow: 9984px 0 0 -5px; }
            30% { box-shadow: 9984px 0 0 2px; }
            60%, 100% { box-shadow: 9984px 0 0 -5px; }
          }
          
          @keyframes dot-pulse {
            0% { box-shadow: 9999px 0 0 -5px; }
            30% { box-shadow: 9999px 0 0 2px; }
            60%, 100% { box-shadow: 9999px 0 0 -5px; }
          }
          
          @keyframes dot-pulse-after {
            0% { box-shadow: 10014px 0 0 -5px; }
            30% { box-shadow: 10014px 0 0 2px; }
            60%, 100% { box-shadow: 10014px 0 0 -5px; }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default StudentViewExams;
