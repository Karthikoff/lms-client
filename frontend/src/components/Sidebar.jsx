import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Book, Wallet, ClipboardList, CheckCircle, LogOut, Menu,ListChecks,FileText,MessageSquare, Bell } from "lucide-react";
import useAuth from "../hooks/useAuth";

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const { role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menus = {
    admin: [
      { path: "/admin-dashboard", icon: <Home size={18} />, label: "Home" },
      { path: "/manage-instructors", icon: <Users size={18} />, label: "Instructors" },
    ],
    student: [
      { path: "/home", icon: <Home size={18} />, label: "Explore" }, // Home icon for Explore
  { path: "/enrolled-courses", icon: <Book size={18} />, label: "My Courses" }, // Book for enrolled courses
  { path: "/transactions", icon: <Wallet size={18} />, label: "Transactions" }, // Wallet for transactions
  { path: "/std-viewassessment", icon: <FileText size={18} />, label: "Assessments" }, // FileText for assessments
  { path: "/attendance", icon: <CheckCircle size={18} />, label: "Attendance" }, // CheckCircle for attendance
  { path: "/notification", icon: <Bell size={18} />, label: "Messages" }, // Bell for notifications/messages
  { path: "/std-view-exam", icon: <ClipboardList size={18} />, label: "View Exam" },


    ],
    instructor:[
      { path: "/message-post", icon: <MessageSquare size={18} />, label: "Messages" }, // Changed to Message icon
      { path: "/student-management", icon: <Users size={18} />, label: "Students" }, // Users icon for student management
      { path: "/inst-createcourse", icon: <Book size={18} />, label: "Courses" }, // Book icon for courses
      { path: "/mark-attendance", icon: <CheckCircle size={18} />, label: "Attendance" }, // CheckCircle for attendance
      { path: "/create-assessment", icon: <FileText size={18} />, label: "Create Assessment" }, // FileText for assessments
      { path: "/view-assessment", icon: <ListChecks size={18} />, label: "View Assessments" }, // ListChecks for assessment view
      { path: "/create-exam", icon: <ClipboardList size={18} />, label: "Create Exam" }, // ClipboardList for creating exams
      { path: "/view-exam", icon: <ClipboardList size={18} />, label: "View Exam" } // ClipboardList remains for viewing exams
    ],
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div
      className={`h-screen bg-[#9f48f2] text-white flex flex-col p-3 transition-all duration-300 fixed top-0 left-0 ${
        collapsed ? "w-16" : "w-52"
      }`}
    >
      {/* Toggle Button */}
      <button onClick={toggleSidebar} className="text-white text-lg mb-4 flex items-center">
        <Menu />
      </button>

      {/* Navigation Menu */}
      <ul className="flex-1 space-y-2">
        {menus[role]?.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-300 ${
                location.pathname === item.path ? "bg-[#822bd6]" : "hover:bg-[#7522c2]"
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <button onClick={handleLogout} className="text-white hover:text-red-500 flex items-center gap-2 mt-auto">
        <LogOut size={18} />
        {!collapsed && <span className="text-sm">Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;