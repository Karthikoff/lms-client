import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";

const InstructorMarkAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://lms-server-production-4028.up.railway.app/api/courses/instructor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setCourses(res.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [token]);

  useEffect(() => {
    if (!selectedCourse) return;
    setLoading(true);

    const fetchStudents = async () => {
      try {
        const res = await axios.get(`https://lms-server-production-4028.up.railway.app/api/courses/${selectedCourse}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setStudents(res.data.students);
          setAttendance(
            res.data.students.reduce((acc, student) => {
              acc[student._id] = "present";
              return acc;
            }, {})
          );
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedCourse, token]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmitAttendance = async () => {
    try {
      const res = await axios.post(
        "https://lms-server-production-4028.up.railway.app/api/attendance/mark",
        {
          courseId: selectedCourse,
          studentAttendances: Object.entries(attendance).map(([studentId, status]) => ({
            studentId,
            status,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage("Attendance marked successfully!");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setMessage("Failed to mark attendance.");
    }
  };

  return (
    
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:block w-64 h-screen fixed" /> {/* Placeholder for sidebar */}
        
        {/* Main content - Aligned to start directly next to sidebar */}
        <div className="w-full md:ml-64 p-0 transition-all duration-300">
          <div className="p-4 md:p-6">
            {/* Header with animation */}
            <div className="mb-6 animate-fadeIn">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Mark Attendance
              </h2>
              <p className="text-gray-600 mt-1">Select a course and mark student attendance</p>
            </div>
  
            {/* Course Selection Card */}
            <div className="bg-white rounded-lg shadow-md p-5 mb-6 transform transition-all duration-300 hover:shadow-lg max-w-md">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select Course:</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">-- Choose Course --</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Loading State with Animation */}
            {selectedCourse && loading && (
              <div className="flex items-center py-4 animate-pulse">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="ml-3 text-gray-600">Loading students...</p>
              </div>
            )}
  
            {/* Students List with Animation */}
            {selectedCourse && !loading && students.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-5 mb-6 animate-slideUp max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Students</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {students.length} enrolled
                  </span>
                </div>
                
                <div className="space-y-3">
                  {students.map((student, index) => (
                    <div 
                      key={student._id} 
                      className="flex items-center justify-between border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-medium">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-3 font-medium text-gray-800">{student.name}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id] === "present"}
                            onChange={() => handleAttendanceChange(student._id, "present")}
                            className="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                          />
                          <span className="ml-2 text-sm font-medium text-green-600">Present</span>
                        </label>
                        
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            checked={attendance[student._id] === "absent"}
                            onChange={() => handleAttendanceChange(student._id, "absent")}
                            className="form-radio h-4 w-4 text-red-600 transition duration-150 ease-in-out"
                          />
                          <span className="ml-2 text-sm font-medium text-red-600">Absent</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
  
            {/* No Students Message */}
            {selectedCourse && !loading && students.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-5 text-center animate-fadeIn max-w-md">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-gray-600">No students enrolled in this course yet.</p>
              </div>
            )}
  
            {/* Submit Button with Animation */}
            {selectedCourse && students.length > 0 && (
              <div className="animate-fadeIn max-w-md">
                <button
                  onClick={handleSubmitAttendance}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  Mark Attendance
                </button>
              </div>
            )}
  
            {/* Success Message with Animation */}
            {message && (
              <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md animate-fadeIn max-w-md">
                <div className="flex">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>{message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  
  );
};

export default InstructorMarkAttendance;