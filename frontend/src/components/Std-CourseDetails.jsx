import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

const StdCourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`https://lms-server-production-4d02.up.railway.app/api/courses/${id}`);
        if (res.data.success && res.data.course) {
          setCourse(res.data.course);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    const fetchEnrollmentStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://lms-server-production-4d02.up.railway.app/api/enrollment/status/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.enrolled) {
          setIsEnrolled(true);
        }
      } catch (error) {
        console.error("Error fetching enrollment status:", error);
      }
    };

    fetchCourseDetails();
    fetchEnrollmentStatus();
  }, [id]);

  const handleEnroll = async () => {
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://lms-server-production-4d02.up.railway.app/api/wallet/enroll",
        { courseId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage("Course enrolled successfully!");
        setIsEnrolled(true);
      } else {
        setError(res.data.message || "Failed to enroll in the course.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  if (!course) return <p className="text-center text-sm text-gray-600 py-4">Loading course details...</p>;

return (
  <Layout>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Decorative elements */}
      <div className="hidden md:block absolute top-0 left-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute w-full h-full rounded-full bg-purple-200 opacity-30 animate-pulse"></div>
      </div>
      <div className="hidden md:block absolute bottom-0 right-0 w-64 h-64 translate-x-1/4 translate-y-1/4">
        <div className="absolute w-full h-full rounded-full bg-indigo-200 opacity-20 animate-pulse"></div>
      </div>
      
      {/* Back button with improved styling */}
      <button
        onClick={() => navigate("/enrolled-courses")}
        className="group mb-6 flex items-center text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to My Courses
      </button>
      
      {/* Course header with responsive layout */}
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="md:flex">
          <div className="md:w-1/2">
          <video
  src={course.videoUrl} 
  className="w-full h-[250px] md:h-full object-cover"
  controls
  autoPlay
  muted
/>

          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{course.name}</h2>
            <p className="mt-3 text-base text-gray-700 font-medium">{course.description}</p>
            
            {/* Price display with animation */}
            <div className="mt-6 flex items-center space-x-3">
              {course?.offerprice && course?.offerprice < course?.price ? (
                <>
                  <span className="text-lg font-semibold text-gray-500 line-through">₹{course.price}</span>
                  <span className="text-2xl font-extrabold text-green-600 animate-bounce">₹{course.offerprice}</span>
                  <span className="ml-2 px-2 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full">
                    {Math.round(((course.price - course.offerprice) / course.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-2xl font-extrabold text-black">₹{course.price}</span>
              )}
            </div>
            
            {/* Enroll button moved here for better mobile experience */}
            <div className="mt-6">
              <button
                className={`w-full sm:w-auto px-6 py-3 text-base font-bold rounded-lg shadow-lg transition transform hover:scale-105 ${
                  isEnrolled 
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed" 
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                }`}
                onClick={() => setShowModal(true)}
                disabled={isEnrolled || isLoading}
              >
                {isEnrolled ? "Already Enrolled" : isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : "Enroll Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Course content in cards with hover effects */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Key Points Card */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-bl-full -mt-2 -mr-2"></div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Key Points
          </h3>
          <p className="text-gray-700 font-medium">{course.keyPoints}</p>
        </div>
        
        {/* Curriculum Card */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100 rounded-bl-full -mt-2 -mr-2"></div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Curriculum
          </h3>
          <p className="text-gray-700 font-medium">{course.highlights}</p>
        </div>
      </div>
      
      {/* Enrollment Confirmation Modal with improved styling */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fadeIn">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center">Confirm Enrollment</h2>
              <p className="text-gray-700 text-center mt-2">
                You're about to enroll in <span className="font-semibold">{course.name}</span>. 
                {course?.offerprice && course?.offerprice < course?.price ? (
                  <span className="block mt-2">
                    Your total is <span className="font-bold text-green-600">₹{course.offerprice}</span> 
                    <span className="text-sm text-gray-500 line-through ml-1">₹{course.price}</span>
                  </span>
                ) : (
                  <span className="block mt-2">Your total is <span className="font-bold">₹{course.price}</span></span>
                )}
              </p>
              
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                  onClick={handleEnroll}
                >
                  Confirm & Enroll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </Layout>
);
};

export default StdCourseDetails;
