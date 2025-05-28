import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) return <p className="text-center text-lg text-gray-600 py-6">Loading enrolled courses...</p>;
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-purple-200 opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-pink-200 opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-blue-200 opacity-20 animate-pulse"></div>
        <div className="hidden lg:block absolute -left-10 top-1/3 w-40 h-40 rounded-full bg-indigo-200 opacity-10"></div>
        <div className="hidden lg:block absolute -right-20 top-2/3 w-64 h-64 rounded-full bg-purple-200 opacity-10"></div>
      </div>
  
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Header with animated underline */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            My Enrolled Courses
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mx-auto rounded-full animate-pulse"></div>
        </div>
    
        {enrolledCourses.length === 0 ? (
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-md p-10 text-center max-w-md mx-auto">
            <div className="text-purple-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">You haven't enrolled in any courses yet.</p>
            <button className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 font-medium">
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {enrolledCourses.map((course) => (
              <div 
                key={course._id} 
                className="flex flex-col bg-white bg-opacity-90 backdrop-blur-sm rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Course Image with overlay gradient */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
    
                {/* Course Details */}
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{course.name}</h3>
                    <div className="bg-purple-100 rounded-full p-1 text-purple-600">
                      {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg> */}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p>Instructor: <span className="font-medium text-gray-700">{course.instructorName}</span></p>
                  </div>
                  
                  
                </div>
    
                {/* View Details Button */}
                <Link
                  to={`/viewcourse/${course._id}`}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 text-center font-medium hover:from-purple-700 hover:to-indigo-700 transition-all group"
                >
                  <span className="flex items-center justify-center">
                    View Course Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
};

export default EnrolledCourses;
