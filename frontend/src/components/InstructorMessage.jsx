import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import moment from "moment-timezone";

const InstructorMessage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://lms-server-production-4d02.up.railway.app/api/courses/instructor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [token]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("https://lms-server-production-4d02.up.railway.app/api/messages/instructor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setMessageHistory(res.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [token]);

  const handleSendMessage = async () => {
    if (!selectedCourse || !message.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        "https://lms-server-production-4d02.up.railway.app/api/messages/send",
        { courseId: selectedCourse, content: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("");

      const res = await axios.get("https://lms-server-production-4d02.up.railway.app/api/messages/instructor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setMessageHistory(res.data.messages);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="flex h-screen bg-[#f5f3ff]">
        {/* Sidebar */}
        <div className="hidden md:block w-64 bg-white shadow-xl border-r border-purple-100 fixed h-full">
          <div className="p-5 border-b border-purple-100">
            <h2 className="text-2xl font-bold text-[#9f48f2]">Courses</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-70px)]">
            {courses.map((course) => (
              <div
                key={course._id}
                className={`p-4 cursor-pointer hover:bg-purple-50 transition-all duration-150 ${
                  selectedCourse === course._id ? "bg-[#f0e7fe] border-l-4 border-[#9f48f2]" : ""
                }`}
                onClick={() => setSelectedCourse(course._id)}
              >
                <p className="font-medium truncate">{course.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="w-full md:ml-64 flex flex-col">
          {/* Header */}
          <div className="bg-white p-4 shadow-md flex justify-between items-center border-b">
            <h2 className="text-xl font-semibold text-[#9f48f2]">
              {selectedCourse
                ? courses.find((c) => c._id === selectedCourse)?.name || "Send Message"
                : "Send Message to Students"}
            </h2>
            <select
              className="p-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#9f48f2]"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Messages */}
          <div className="flex-grow p-6 overflow-y-auto bg-[#fdfcff]">
            {messageHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 bg-white p-6 rounded-lg shadow-md">
                  No messages sent yet. Select a course and start sending messages.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {messageHistory.map((msg) => (
                  <div
                    key={msg._id}
                    className="max-w-[80%] ml-auto bg-[#9f48f2] text-white p-4 rounded-2xl shadow-md relative"
                  >
                    <p className="text-sm font-semibold text-white mb-1">{msg.courseName}</p>
                    <p className="text-base">{msg.text}</p>
                    <div className="flex justify-end items-center mt-2 text-xs text-purple-100">
                      {moment(msg.sentAt).format("MMM D, h:mm A")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white p-4 border-t flex items-center gap-3">
            <textarea
              className="flex-grow p-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#9f48f2] text-gray-700"
              rows="1"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            ></textarea>
            <button
              className="bg-[#9f48f2] text-white px-5 py-2 rounded-full hover:bg-[#873de0] transition-all duration-150 disabled:bg-purple-300"
              onClick={handleSendMessage}
              disabled={loading || !message.trim() || !selectedCourse}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InstructorMessage;
