import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // https://lms-server-production-4028.up.railway.app/api/courses
        const res = await axios.get(`https://lms-server-production-4028.up.railway.app/api/courses/${id}`);
        if (res.data.success && res.data.course) {
          setCourse(res.data.course);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    setUserRole(localStorage.getItem("role") || "");
    fetchCourseDetails();
  }, [id]);

  const handleDeleteCourse = async () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const res = await axios.delete(`https://lms-server-production-4028.up.railway.app/api/courses/delete/${id}`);
        if (res.data.success) {
          alert("Course deleted successfully!");
          navigate("/"); // Redirect to home or courses page
        } else {
          alert("Failed to delete the course.");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Error deleting the course. Try again.");
      }
    }
  };

  if (!course)
    return <p className="text-center text-lg text-gray-600 py-6">Loading course details...</p>;

  return (
    <div className="max-w-1xl mx-auto bg-white  overflow-hidden my-8">
      {/* Back button with improved styling */}
      <button
        onClick={() => navigate("/inst-createcourse")}
        className="group mb-6 flex items-center text-sm font-semibold text-gray-700 hover:text-purple-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      {/* Hero Section with Overlay */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
        <img src={course.imageUrl} alt={course.name} className="w-full h-64 md:h-96 object-cover" />
        
        {/* Course Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-8">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">{course.name}</h2>
          {/* Instructor Info */}
          <div className="flex items-center mb-2">
            <div className="bg-white/20 backdrop-blur-sm py-1 px-3 rounded-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-0.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.666 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <span className="text-white text-sm ml-2">{course.instructorName || "Expert Instructor"}</span>
            </div>
            
            {/* Category Tag */}
            {course.category && (
              <div className="ml-3 bg-blue-500/80 py-1 px-3 rounded-full">
                <span className="text-white text-xs font-medium">{course.category}</span>
              </div>
            )}
          </div>
        </div>
      </div>
  
      <div className="p-4 md:p-8">
        {/* Price Card - Floating on medium+ screens */}
        <div className="md:float-right md:w-64 md:ml-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-4 border border-blue-100">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-1">Course Price</p>
            {course?.offerprice && course?.offerprice < course?.price ? (
              <>
                <div className="flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-400 line-through mr-2">
                    ₹{course.price}
                  </span>
                  <span className="text-2xl font-extrabold text-blue-600">₹{course.offerprice}</span>
                </div>
                <div className="mt-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full inline-block">
                  Save {Math.round(((course.price - course.offerprice) / course.price) * 100)}%
                </div>
              </>
            ) : (
              <span className="text-2xl font-extrabold text-blue-600">₹{course.price}</span>
            )}
            
            {/* Enroll Button */}
            <button
              className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 transform hover:scale-105"
              onClick={() => alert("Enrollment functionality to be added")}
            >
              Enroll Now
            </button>
            
           
          </div>
        </div>
  
        {/* Description with styled first letter */}
        <div className="mt-4">
          <h3 className="text-xl font-bold text-gray-800 mb-3">About This Course</h3>
          <p className="text-gray-700 first-letter:text-3xl first-letter:font-bold first-letter:text-blue-600 first-letter:mr-1 first-letter:float-left">
            {course.description}
          </p>
        </div>
  
        {/* What You'll Learn Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">What You'll Learn</h3>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* Highlights Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Course Highlights</h3>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex flex-wrap gap-2">
              {course.highlights.map((highlight, index) => (
                <span key={index} className="bg-white px-3 py-1.5 rounded-full text-sm border border-gray-200 text-gray-700">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
  
        {/* Preview Video Card */}
        {course.videoUrl && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Course Preview</h3>
            <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-gray-900">
              <video 
                className="absolute inset-0 w-full h-full object-cover"
                controls
                poster={course.imageUrl}
              >
                <source src={course.videoUrl} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            </div>
          </div>
        )}
  
        {/* Admin Controls */}
        {userRole === "instructor" && (
          <div className="mt-8 border-t pt-6 flex flex-wrap gap-3 justify-center">
            
            <button
              onClick={handleDeleteCourse}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Course
            </button>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
