import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";

const StudentAssessmentResults = () => {
  const token = localStorage.getItem("token");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");

  useEffect(() => {
    // Fetch enrolled courses and student email
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/enrolled-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setEnrolledCourses(res.data.enrolledCourses);
          if (res.data.enrolledCourses.length > 0) {
            setCourseId(res.data.enrolledCourses[0]._id); // Automatically set courseId
          }
        }

        const userRes = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.data.success) {
          setStudentEmail(userRes.data.user.email);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (courseId) {
      fetchResults(courseId);
    }
  }, [courseId]); // Fetch results automatically when courseId is set

  const fetchResults = async (selectedCourseId) => {
    if (!selectedCourseId) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/assessments/instructor/course/${selectedCourseId}/results`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Filter only the logged-in student's results
        const studentResults = res.data.results.filter(
          (result) => result.student.email === studentEmail
        );
        setResults(studentResults);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching assessment results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col w-full">
        <div className="max-w-4xl mx-auto p-4 md:p-6 w-full">
          <h2 className="text-2xl font-bold mb-6 animate-fade-in">My Assessment Results</h2>

          {/* Course Selection */}
          <div className="mb-6 transition-all duration-300 hover:shadow-md rounded">
            <label className="block text-sm font-semibold mb-2">Select Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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

          {/* Results Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="border border-gray-300 rounded p-3 md:p-4 mt-4 shadow-sm animate-fade-in overflow-x-auto">
              <h3 className="text-lg font-semibold mb-3">My Results</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Assessment</th>
                    <th className="border border-gray-300 p-2">Total Marks</th>
                    <th className="border border-gray-300 p-2">Obtained Marks</th>
                    <th className="border border-gray-300 p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="text-center hover:bg-gray-50 transition-colors duration-200">
                      <td className="border border-gray-300 p-2">{result.assessment.title}</td>
                      <td className="border border-gray-300 p-2">{result.totalMarks}</td>
                      <td className="border border-gray-300 p-2">{result.obtainedMarks}</td>
                      <td className="border border-gray-300 p-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            result.obtainedMarks >= result.totalMarks * 0.6
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.obtainedMarks >= result.totalMarks * 0.6 ? "Passed" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            courseId && (
              <div className="text-red-500 mt-4 p-4 border border-red-200 rounded bg-red-50 animate-fade-in">
                No results found for this course.
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentAssessmentResults;
