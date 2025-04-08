import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";

const ViewAssessments = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        const res = await axios.get("https://lms-server-production-4028.up.railway.app/api/courses/instructor", {
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

  const fetchAssessments = async (selectedCourseId) => {
    if (!selectedCourseId) return;
    setLoading(true);

    try {
      const res = await axios.get(`https://lms-server-production-4028.up.railway.app/api/assessments/course/${selectedCourseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setAssessments(res.data.assessments);
      } else {
        setAssessments([]);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto p-4 md:p-6 w-full">
          <div className="bg-white rounded-xl shadow-lg p-5 md:p-8 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-800 border-b pb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Assessments
            </h2>
  
            {/* Course Selection */}
            <div className="mb-6 transition-all duration-300 hover:shadow-md p-4 rounded-lg border border-purple-100 bg-purple-50">
              <label className="block text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Select Course
              </label>
              <select
                value={courseId}
                onChange={(e) => {
                  setCourseId(e.target.value);
                  fetchAssessments(e.target.value);
                }}
                className="w-full p-3 border border-purple-200 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
  
            {/* Buttons Row */}
            {courseId && (
              <div className="mb-6 flex flex-col sm:flex-row justify-between gap-3">
                <button
                  onClick={() => navigate(`/create-assessment`)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Assessment
                </button>
                
                <button
                  onClick={() => navigate(`/assessment-result`)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Assessment Results
                </button>
              </div>
            )}
  
            {/* Assessments Table with Loading Animation */}
            {loading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-100 border-t-4 border-t-purple-600"></div>
                <p className="mt-4 text-purple-800 font-medium">Loading assessments...</p>
              </div>
            ) : assessments.length > 0 ? (
              <div className="rounded-xl overflow-hidden shadow-md animate-fade-in border border-purple-100">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Assessments
                  </h3>
                  <span className="bg-white text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                    {assessments.length} {assessments.length === 1 ? 'Assessment' : 'Assessments'}
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-purple-50 border-b border-purple-100">
                        <th className="p-3 text-left text-purple-900 font-semibold">#</th>
                        <th className="p-3 text-left text-purple-900 font-semibold">Instructions</th>
                        <th className="p-3 text-left text-purple-900 font-semibold">Timer</th>
                        <th className="p-3 text-left text-purple-900 font-semibold">Questions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((assessment, index) => (
                        <tr
                          key={assessment._id}
                          className="hover:bg-purple-50 transition-colors duration-200 border-b border-purple-50"
                        >
                          <td className="p-3 font-medium text-purple-900">{index + 1}</td>
                          <td className="p-3 text-left truncate max-w-xs">{assessment.instructions}</td>
                          <td className="p-3">
                            <div className="flex items-center text-gray-700">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {assessment.timer} min
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                              {assessment.questions.length} {assessment.questions.length === 1 ? 'question' : 'questions'}
                            </span>
                          </td>
                          
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              courseId && (
                <div className="mt-6 bg-white border border-purple-100 rounded-xl p-8 shadow-sm animate-fade-in">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="bg-red-50 p-4 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Assessments Found</h3>
                    <p className="text-gray-600 mb-6">There are no assessments available for this course yet.</p>
                    <button 
                      onClick={() => navigate(`/create-assessment`)}
                      className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create First Assessment
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewAssessments;
