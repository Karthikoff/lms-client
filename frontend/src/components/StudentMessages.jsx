import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Layout from "../components/Layout";

const StudentMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://lms-server-production-4028.up.railway.app/api/messages/student", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          console.log("📩 Received Messages:", res.data.messages); // Debugging Log
          setMessages(res.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <p className="text-center text-lg text-gray-600 py-6">Loading messages...</p>;

  return (
    <div className="flex h-screen">
      <div className="flex-1 p-3 ml-0 sm:ml-64 max-h-[90vh] overflow-auto">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Notifications</h2>
    
        {messages.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-600">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div 
                key={msg._id} 
                className="bg-white shadow-sm rounded-lg border-l-4 border-purple-500 p-3 animate-fade-in-up"
              >
                <div className="flex justify-between items-start">
                  <p className="text-xs font-medium text-purple-700">{msg.courseName}</p>
                  <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
                </div>
                <p className="text-gray-800 text-sm font-medium">Instructor: {msg.instructorName}</p>
                <p className="text-gray-700 text-sm mt-1">{msg.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
  
};

export default StudentMessages;
