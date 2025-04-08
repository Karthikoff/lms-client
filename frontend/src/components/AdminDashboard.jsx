import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalInstructors: 0, totalStudents: 0 });
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const resStats = await fetch("http://localhost:5000/api/admin/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await resStats.json();
        setStats(statsData);

        const resUsers = await fetch("http://localhost:5000/api/admin/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await resUsers.json();

        setInstructors(
          usersData.instructors.sort((a, b) => a.name.localeCompare(b.name))
        );
        setStudents(
          usersData.students.sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <Layout>
      <div className="min-h-screen text-black p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h2>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-purple-100 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold">Total Instructors</h3>
            <p className="text-2xl font-bold text-purple-700">{stats.totalInstructors}</p>
          </div>
          <div className="bg-purple-100 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold">Total Students</h3>
            <p className="text-2xl font-bold text-purple-700">{stats.totalStudents}</p>
          </div>
        </div>

        {/* Instructors Table */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Instructors</h3>
          {instructors.length === 0 ? (
            <p className="text-gray-600">No instructors found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full max-w-2xl mx-auto bg-purple-50 rounded-lg shadow-lg">
                <thead className="bg-purple-200">
                  <tr>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((instructor) => (
                    <tr key={instructor._id} className="border-b border-purple-300 hover:bg-purple-100">
                      <td className="py-3 px-6">{instructor.name}</td>
                      <td className="py-3 px-6">{instructor.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Students Table */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Students</h3>
          {students.length === 0 ? (
            <p className="text-gray-600">No students found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full max-w-2xl mx-auto bg-purple-50 rounded-lg shadow-lg">
                <thead className="bg-purple-200">
                  <tr>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id} className="border-b border-purple-300 hover:bg-purple-100">
                      <td className="py-3 px-6">{student.name}</td>
                      <td className="py-3 px-6">{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
