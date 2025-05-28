import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const StudentList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    const fetchCoursesWithStudents = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch courses taught by the instructor
        const res = await axios.get("https://lms-server-production-4d02.up.railway.app/api/courses/instructor", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.courses.length > 0) {
          const courseData = await Promise.all(
            res.data.courses.map(async (course) => {
              try {
                // Fetch students for the course
                const studentRes = await axios.get(
                  `https://lms-server-production-4d02.up.railway.app/api/courses/${course._id}/students`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                if (!studentRes.data.success) return { ...course, students: [] };

                // Fetch attendance for each student in the course
                const studentsWithAttendance = await Promise.all(
                  studentRes.data.students.map(async (student) => {
                    try {
                      // Ensure backend expects `courseId` + `studentId`
                      const attendanceRes = await axios.get(
                        `https://lms-server-production-4d02.up.railway.app/api/attendance/percentage/${course._id}/${student._id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                      );

                      return {
                        ...student,
                        attendancePercentage: attendanceRes.data.success ? attendanceRes.data.percentage : 0,
                      };
                    } catch (attendanceError) {
                      console.warn(
                        `Error fetching attendance for ${student._id}:`,
                        attendanceError.response?.data || attendanceError.message
                      );
                      return { ...student, attendancePercentage: 0 };
                    }
                  })
                );

                return { ...course, students: studentsWithAttendance };
              } catch (studentError) {
                console.warn(`Error fetching students for course ${course._id}:`, studentError);
                return { ...course, students: [] };
              }
            })
          );

          setCourses(courseData);
        } else {
          setError("No courses found for this instructor.");
        }
      } catch (fetchError) {
        console.error("Error fetching courses:", fetchError);
        setError("Failed to fetch course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesWithStudents();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with decorative elements */}
        <div className="relative mb-10">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
          <h2 className="relative inline-block px-6 py-2 mx-auto text-2xl md:text-3xl font-bold text-center bg-white text-[#9f48f2]">
            Student List
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-[#9f48f2]"></span>
          </h2>
        </div>
  
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9f48f2]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No courses available</h3>
            <p className="mt-1 text-sm text-gray-500">There are no courses with enrolled students to display.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {courses.map((course) => (
              <div 
                key={course._id} 
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Course header with student count */}
                <div className="bg-gradient-to-r from-purple-100 to-purple-50 p-4 sm:p-6 border-b border-purple-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <span className="text-[#9f48f2] mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </span>
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Course ID: {course._id.substring(0, 8)}...</p>
                  </div>
                  <div className="mt-2 sm:mt-0 bg-white py-1 px-3 rounded-full shadow-sm border border-purple-100">
                    <span className="text-sm font-medium text-[#9f48f2]">
                      {course.students.length} {course.students.length === 1 ? 'Student' : 'Students'}
                    </span>
                  </div>
                </div>
  
                {/* Student table section */}
                <div className="p-4 sm:p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                      <thead>
                        <tr>
                          <th scope="col" className="px-4 py-3 bg-[#9f48f2] text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-lg">
                            Username
                          </th>
                          <th scope="col" className="px-4 py-3 bg-[#9f48f2] text-left text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
                            Email
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {course.students.length > 0 ? (
                          course.students.map((student, index) => (
                            <tr 
                              key={student._id}
                              className={`hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-purple-25'}`}
                            >
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-[#9f48f2]">
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-600">{student.email}</div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="2" className="px-4 py-6 text-center text-gray-500 border-b border-gray-200">
                              <div className="flex flex-col items-center">
                                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p className="mt-2 text-sm font-medium">No students enrolled in this course yet</p>
                                <p className="mt-1 text-xs text-gray-400">Students will appear here once they enroll</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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

export default StudentList;
