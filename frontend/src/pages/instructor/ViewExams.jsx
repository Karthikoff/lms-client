import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../components/Layout";

const ViewExams = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (courseId) {
      fetchExams(courseId);
    }
  }, [courseId]); // Trigger whenever courseId changes

  const fetchExams = async (selectedCourseId) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://lms-server-production-4d02.up.railway.app/api/exams/course/${selectedCourseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setExams(res.data.exams);
      } else {
        setExams([]);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  return (  
    <Layout>  
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white shadow-lg rounded-lg">  
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#9f48f2] border-b pb-2">View Exams</h2>  
  
        {/* Course Selection with improved styling */}  
        <div className="mb-6">  
          <label className="block text-[#9f48f2] text-sm font-medium mb-2">Select Course:</label>  
          <div className="relative">  
            <select  
              value={courseId}  
              onChange={(e) => setCourseId(e.target.value)}  
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 px-3 py-2.5 pr-10 rounded-lg focus:ring-2 focus:ring-[#9f48f2] focus:border-[#9f48f2] appearance-none"  
            >  
              <option value="">Select Course</option>  
              {courses.map((course) => (  
                <option key={course._id} value={course._id}>  
                  {course.name}  
                </option>  
              ))}  
            </select>  
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">  
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">  
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>  
              </svg>  
            </div>  
          </div>  
        </div>  
         {/* Buttons Row */}
         {courseId && (
              <div className="mb-6 flex flex-col sm:flex-row justify-between gap-3">
                <button
                  onClick={() => navigate(`/create-exam`)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Final Exam
                </button>
                
                <button
                  onClick={() => navigate(`/exam-result`)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Exam Results
                </button>
              </div>
            )}
  
        {/* Loading state with animation */}  
        {loading && (  
          <div className="flex justify-center my-8">  
            <div className="animate-pulse flex space-x-2">  
              <div className="h-2.5 w-2.5 bg-[#9f48f2] rounded-full"></div>  
              <div className="h-2.5 w-2.5 bg-[#9f48f2] rounded-full"></div>  
              <div className="h-2.5 w-2.5 bg-[#9f48f2] rounded-full"></div>  
            </div>  
          </div>  
        )}  
  
        {/* Empty state with icon */}  
        {!loading && exams.length === 0 && courseId && (  
          <div className="text-center py-8">  
            <svg className="mx-auto h-12 w-12 text-[#9f48f2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">  
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>  
            </svg>  
            <p className="mt-2 text-[#9f48f2]">No exams found for this course.</p>  
          </div>  
        )}  
  
        {/* Exams list with card-based layout */}  
        {!loading && exams.length > 0 && (  
          <div className="space-y-4 mt-4">  
            {exams.map((exam) => (  
              <div key={exam._id} className="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">  
                <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">  
                  <div className="flex-grow">  
                    <div className="flex items-center mb-1">  
                      <span className="bg-[#9f48f2] text-white text-xs font-medium py-0.5 px-2 rounded-full mr-2">  
                        #{exam.examNumber}  
                      </span>  
                      <h3 className="font-medium text-[#9f48f2] line-clamp-1">{exam.instructions}</h3>  
                    </div>  
                    <div className="flex items-center text-sm text-gray-600">  
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">  
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>  
                      </svg>  
                      {exam.timer} minutes  
                    </div>  
                  </div>  
                </div>  
              </div>  
            ))}  
          </div>  
        )}  
      </div>  
    </Layout>  
  );
  
};

export default ViewExams;
