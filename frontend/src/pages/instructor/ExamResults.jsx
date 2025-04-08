import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";

const ExamResults = () => {
  const token = localStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
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

    fetchCourses();
  }, [token]);

  const fetchResults = async (selectedCourseId) => {
    if (!selectedCourseId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://lms-server-production-4028.up.railway.app/api/exams/instructor/course/${selectedCourseId}/exam-results`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        setResults(res.data.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching exam results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:block w-64 h-screen fixed" />
        <div className="w-full md:ml-64 p-0 transition-all duration-300">
          <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Student Exam Results
            </h2>

            <div className="bg-white rounded-lg shadow-md p-5 mb-6 max-w-md">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Select Course</label>
              <div className="relative">
                <select
                  value={courseId}
                  onChange={(e) => {
                    setCourseId(e.target.value);
                    fetchResults(e.target.value);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none pr-10"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <span className="ml-3 text-gray-600">Loading results...</span>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800">Exam Results</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {results.length} Results
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                        <th className="p-3 font-semibold">#</th>
                        <th className="p-3 font-semibold">Student Name</th>
                       
                        <th className="p-3 font-semibold">Score</th>
                        <th className="p-3 font-semibold">Total</th>
                        <th className="p-3 font-semibold">Percentage</th>
                        <th className="p-3 font-semibold">Certificate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => {
                        const percentage = ((result.score / result.totalMarks) * 100).toFixed(2);
                        return (
                          <tr
                            key={result._id}
                            className={`border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <td className="p-3 text-sm">{index + 1}</td>
                            <td className="p-3 font-medium text-gray-800">{result.studentId?.name}</td>
                            
                            <td className="p-3 text-gray-800">{result.score}</td>
                            <td className="p-3 text-gray-600">{result.totalMarks}</td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div
                                    className={`h-2.5 rounded-full ${
                                      percentage >= 70
                                        ? "bg-green-500"
                                        : percentage >= 50
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{percentage}%</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  result.certificateEligible
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {result.certificateEligible ? "Eligible" : "Not Eligible"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!loading && courseId && results.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-md">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Results Found</h3>
                <p className="text-gray-500">There are no exam results available for this course.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExamResults;
