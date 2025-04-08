import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const StudentAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [absentRecords, setAbsentRecords] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch enrolled courses & attendance data
  useEffect(() => {
    const fetchCoursesAndAttendance = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/users/enrolled-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const enrolledCourses = res.data.enrolledCourses;
          setCourses(enrolledCourses);

          // Fetch attendance for each course
          const attendanceResults = await Promise.all(
            enrolledCourses.map(async (course) => {
              const attendanceRes = await axios.get(`http://localhost:5000/api/attendance/percentage/${course._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (attendanceRes.data.success) {
                return {
                  courseId: course._id,
                  name: course.name,
                  percentage: attendanceRes.data.percentage,
                  totalClasses: attendanceRes.data.totalClasses,
                  attendedClasses: attendanceRes.data.attendedClasses,
                  absentDates: attendanceRes.data.absentDates,
                };
              }

              return null;
            })
          );

          setAttendanceData(Object.fromEntries(attendanceResults.filter(Boolean).map((att) => [att.courseId, att])));
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndAttendance();
  }, [token]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-white rounded-lg shadow-sm">
        <h2 className="text-lg sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-purple-800">My Attendance</h2>
  
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="ml-3 text-purple-500">Loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-purple-100">
                  <th className="border-b-2 border-purple-200 px-3 sm:px-4 py-3 text-left font-semibold text-purple-800">Course Name</th>
                  <th className="border-b-2 border-purple-200 px-3 sm:px-4 py-3 text-left font-semibold text-purple-800">Total Classes</th>
                  <th className="border-b-2 border-purple-200 px-3 sm:px-4 py-3 text-left font-semibold text-purple-800">Attended</th>
                  <th className="border-b-2 border-purple-200 px-3 sm:px-4 py-3 text-left font-semibold text-purple-800">Attendance %</th>
                  <th className="border-b-2 border-purple-200 px-3 sm:px-4 py-3 text-left font-semibold text-purple-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => {
                  const attendance = attendanceData[course._id] || {};
                  const percentage = attendance.percentage || 0;
                  const bgColor = index % 2 === 0 ? "bg-white" : "bg-purple-50";
                  
                  return (
                    <tr key={course._id} className={`border-b border-purple-100 hover:bg-purple-100 transition-colors duration-150 ${bgColor}`}>
                      <td className="px-3 sm:px-4 py-3 font-medium">{course.name}</td>
                      <td className="px-3 sm:px-4 py-3">{attendance.totalClasses || 0}</td>
                      <td className="px-3 sm:px-4 py-3">{attendance.attendedClasses || 0}</td>
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center">
                          <div className="relative w-12 h-12 mr-2">
                            {/* Circle background */}
                            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                            {/* Progress circle with stroke-dasharray animation */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                              <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="none" 
                                stroke={getAttendanceColor(percentage)} 
                                strokeWidth="8"
                                strokeDasharray={`${percentage * 2.51} 251`}
                                className="transition-all duration-700 ease-out"
                              />
                            </svg>
                            {/* Percentage text */}
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                              {percentage}%
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3">
                        <button
                          className="bg-purple-500 text-white text-xs sm:text-sm py-1.5 px-3 rounded-md hover:bg-purple-600 transition-colors duration-300 shadow-sm w-full sm:w-auto"
                          onClick={() => {
                            setAbsentRecords(attendance.absentDates || []);
                            setModalOpen(true);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
  
        {/* Modal for Absent Dates */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md transform transition-all duration-300 animate-fadeIn">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-md sm:text-lg font-semibold ml-2">Absent Dates</h3>
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                {absentRecords.length > 0 ? (
                  <ul className="space-y-2">
                    {absentRecords.map((date, index) => (
                      <li key={index} className="bg-red-50 p-2 rounded-md flex items-center animate-slideIn" style={{animationDelay: `${index * 0.05}s`}}>
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                        <span className="text-gray-700">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 bg-green-50 rounded-md">
                    <svg className="w-12 h-12 mx-auto text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-700 font-medium">Perfect Attendance!</p>
                    <p className="text-green-600 text-sm">No absences recorded.</p>
                  </div>
                )}
              </div>
  
              <button
                className="mt-6 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors duration-300 w-full flex items-center justify-center shadow-sm"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
  
  // Helper function to determine color based on attendance percentage
  function getAttendanceColor(percentage) {
    if (percentage >= 90) return '#10B981'; // Green for excellent
    if (percentage >= 75) return '#3B82F6'; // Blue for good
    if (percentage >= 60) return '#F59E0B'; // Yellow for average
    return '#EF4444'; // Red for poor
  }
  
  // Add these keyframes to your CSS or style tag
  // @keyframes fadeIn {
  //   from { opacity: 0; }
  //   to { opacity: 1; }
  // }
  // @keyframes slideIn {
  //   from { opacity: 0; transform: translateY(10px); }
  //   to { opacity: 1; transform: translateY(0); }
  // }
  // .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  // .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
  
};

export default StudentAttendance;
