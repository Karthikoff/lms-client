import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { FaCheckCircle } from "react-icons/fa";

const ExamSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const score = queryParams.get("score") || "No Score Available";

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6">
        {/* Animated success background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-green-100"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 50 + 10}px`,
                  height: `${Math.random() * 50 + 10}px`,
                  animation: `float-up ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: 0.5
                }}
              ></div>
            ))}
          </div>
        </div>
  
        <div className="relative z-10 bg-white rounded-xl shadow-xl p-8 sm:p-10 max-w-md w-full mx-auto animate-fade-in-up">
          <div className="animate-success-pop">
            <FaCheckCircle className="text-green-500 text-7xl sm:text-8xl mx-auto mb-6" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Exam Submitted Successfully!
          </h1>
          
          <div className="py-3 px-4 bg-green-50 rounded-lg border border-green-100 mb-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <p className="text-lg sm:text-xl text-gray-700 font-medium">
              {score}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
            {/* <button
              onClick={() => navigate("/assessment-history")}
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              View History
            </button> */}
            
            {/* <button
              onClick={() => navigate("/dashboard")}
              className="bg-white hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg border border-gray-300 font-medium transition-all duration-300 hover:shadow flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Back to Dashboard
            </button> */}
          </div>
          
          {/* Animated confetti elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={`confetti-${i}`}
                className="absolute w-3 h-8"
                style={{
                  top: '-20px',
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#9061F9', '#E879F9', '#38BDF8', '#4ADE80'][Math.floor(Math.random() * 4)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animation: `confetti-fall ${Math.random() * 3 + 2}s linear forwards`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
  
        {/* Animation styles */}
        <style jsx global>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes success-pop {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float-up {
            0% { transform: translateY(100vh) scale(1); opacity: 0.5; }
            100% { transform: translateY(-100px) scale(0); opacity: 0; }
          }
          
          @keyframes confetti-fall {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
            50% { opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
          
          .animate-success-pop {
            animation: success-pop 0.6s ease-out forwards;
          }
          
          .animate-fade-in {
            opacity: 0;
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default ExamSuccess;
