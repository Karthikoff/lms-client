import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";


const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("role");
  const studentName = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let url = "https://lms-server-production-4028.up.railway.app/api/courses";
        if (userRole === "instructor") {
          url += `?instructorName=${encodeURIComponent(studentName)}`;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setCourses(data.courses);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [userRole, studentName, token]);

  // ✅ Enroll Course Function
  const enrollCourse = async (courseId) => {
    if (!token) {
      alert("You must be logged in to enroll in a course.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Enrolled successfully!");
      } else {
        alert(data.message || "Failed to enroll.");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("An error occurred while enrolling.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-1 text-sm font-medium mb-3">
            Learn at your own pace
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            <span className="inline-block">Explore Our</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 ml-2">Courses</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expand your skills with expert-led courses across various domains
          </p>
        </div>
  
        
  
        {/* Courses Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {courses.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-xl text-gray-600">No courses available yet</p>
              <p className="text-gray-500 mt-2">Check back soon for new content</p>
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="group bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]"
              >
                {/* Course Image with Overlay */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={course.imageUrl}
                    alt={course.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Course Category Badge */}
                  {course.category && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700">
                      {course.category}
                    </div>
                  )}
  
                  {/* View Details Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
  <Button
    className="bg-white text-black font-semibold rounded-full px-5 py-2 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-50 shadow-lg"
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/course/${course._id}`);
    }}
  >
    <Eye size={16} className="text-black" /> 
  </Button>
</div>

                  
                  {/* Discount Badge */}
                  {course?.offerPrice && course?.offerPrice < course?.price && (
                    <div className="absolute top-3 right-3 flex items-center">
                      <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-l-md">
                        SAVE
                      </div>
                      <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-r-md">
                        {Math.round(((course.price - course.offerPrice) / course.price) * 100)}%
                      </div>
                    </div>
                  )}
                </div>
  
                {/* Course Content */}
                <div className="p-5">
                  {/* Course Title */}
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                    {course.name}
                  </h3>
                  
                  {/* Course Description */}
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2 h-10">
                    {course.description || "Learn from industry experts and advance your career."}
                  </p>
                  
                  {/* Instructor with Avatar */}
                  <div className="flex items-center mt-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {course.instructorName?.charAt(0) || "?"}
                    </div>
                    <p className="text-gray-600 text-sm ml-2">
                      {course.instructorName}
                    </p>
                  </div>
                  
                
                  
                  {/* Price Section */}
                  <div className="flex items-end justify-between">
                    <div>
                      {course?.offerPrice && course?.offerPrice < course?.price ? (
                        <>
                          <span className="text-gray-400 text-sm line-through">₹{course.price}</span>
                          <span className="text-xl font-bold text-gray-900 ml-2">₹{course.offerPrice}</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">₹{course.price}</span>
                      )}
                    </div>
                    
                    {/* Enroll Button for Students */}
                    {userRole === "student" && (
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          enrollCourse(course._id);
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          <span>Enroll Now</span>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesList;
