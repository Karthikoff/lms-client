import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";

const StudentViewAssessments = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/enrolled-courses", {
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

  const fetchAssessments = async () => {
    if (!courseId) return;

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/assessments/student/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setAssessments(res.data.assessments);
      } else {
        setError("No assessments found.");
        setAssessments([]);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setError("Failed to fetch assessments.");
      setAssessments([]);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-4 sm:p-6 animate-fade-in motion-safe:transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg sm:text-xl font-bold mb-6 text-center relative">
            <span className="relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-1 after:bg-purple-400 after:bottom-0 after:left-1/4 after:rounded-full">View Assessments</span>
          </h2>
  
          {/* Course Selection Dropdown */}
          <div className="mb-4 transform hover:scale-[1.01] transition-transform duration-200">
            <label className="block text-sm font-semibold mb-2">Select Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300"
              required
            >
              <option value="">Select a course</option>
              {enrolledCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Fetch Assessments Button with Loading Animation */}
          <button
            onClick={fetchAssessments}
            disabled={loading}
            className="bg-[#9f48f2] text-white py-3 px-4 rounded-md w-full hover:bg-[#8c3ed9] transition-all duration-300 transform hover:translate-y-px focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-sm hover:shadow"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading...</span>
              </div>
            ) : (
              "Fetch Assessments"
            )}
          </button>
  
          {/* Error Message with Animation */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-pulse">
              <p className="text-center">{error}</p>
            </div>
          )}
  
          {/* Assessments List with Animation */}
          {assessments.length > 0 && (
            <div className="mt-8 animate-fade-in">
              <h3 className="text-lg font-semibold mb-4 text-center">
                <span className="relative inline-block after:content-[''] after:absolute after:w-1/3 after:h-0.5 after:bg-purple-300 after:bottom-0 after:left-1/3">Assessments</span>
              </h3>
              <ul className="border border-gray-300 rounded-lg p-0 bg-gray-50 divide-y divide-gray-200 overflow-hidden">
                {assessments.map((assessment, index) => (
                  <li
                    key={assessment._id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-gray-100 transition-colors duration-200 animate-slide-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Assessment Details */}
                    <div className="text-center sm:text-left w-full sm:w-3/4">
                      <p className="font-semibold text-md mb-2">{assessment.instructions}</p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {assessment.timer} minutes
                        </span>
                        {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assessment.isCertificateEnabled 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {assessment.isCertificateEnabled ? (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              Certificate Enabled
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              Certificate Disabled
                            </>
                          )}
                        </span> */}
                      </div>
                    </div>
  
                    {/* Take Exam Button with Animation */}
                    <button
                      onClick={() => navigate(`/take-assessment/${assessment._id}`)}
                      className="bg-[#9f48f2] text-white py-2 px-6 rounded-md hover:bg-[#8c3ed9] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-sm hover:shadow w-full sm:w-auto"
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                        Take Exam
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* No Assessments Message */}
          {!loading && courseId && assessments.length === 0 && (
            <div className="mt-8 p-6 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg animate-fade-in">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p>No assessments available for this course</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );

};

export default StudentViewAssessments;
