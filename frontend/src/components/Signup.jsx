import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: Password
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  // ✅ 1. Send OTP to Email
  const sendOtp = async () => {
    const response = await fetch("https://lms-server-production-4028.up.railway.app/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("OTP sent to your email! 📩");
      setOtpSent(true);
      setStep(2);
    } else {
      setMessage(data.message || "Error sending OTP.");
    }
  };

  // ✅ 2. Verify OTP
  const verifyOtp = async () => {
    const response = await fetch("https://lms-server-production-4028.up.railway.app/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("OTP verified! 🎉 Now set your password.");
      setOtpVerified(true);
      setStep(3);
    } else {
      setMessage(data.message || "Invalid OTP. Please try again.");
    }
  };

  // ✅ 3. Complete Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    const response = await fetch("https://lms-server-production-4028.up.railway.app/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Account created successfully! 🎉 Redirecting...");
      setTimeout(() => {
        navigate("/login");
        window.location.reload();
      }, 2000);
    } else {
      setMessage(data.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-500 hover:scale-[1.02]">
        {/* Decorative header */}
        <div className="bg-gradient-to-r from-[#9f48f2] to-[#6d28d9] p-4 relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-white animate-ping" style={{ animationDuration: '3s', animationDelay: '0.2s' }}></div>
            <div className="absolute top-3/4 left-2/3 w-8 h-8 rounded-full bg-white animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-6 h-6 rounded-full bg-white animate-ping" style={{ animationDuration: '5s', animationDelay: '0.5s' }}></div>
          </div>
          
          {/* Logo & Branding */}
          <div className="relative z-10 py-6 flex flex-col items-center">
            <div className="flex items-center mb-2">
              <svg className="w-8 h-8 text-white animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM12 10.5a3.75 3.75 0 116.5 2.5 3.75 3.75 0 01-6.5-2.5zm8.25-4.125a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zm5.5 4.125a3.75 3.75 0 116.5 2.5 3.75 3.75 0 01-6.5-2.5z" />
              </svg>
              <h1 className="text-3xl font-extrabold text-white ml-2 tracking-tight">Brain Boost</h1>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-1 backdrop-blur-sm">
              <h2 className="text-white font-medium">Create an Account</h2>
            </div>
          </div>
        </div>
  
        <div className="p-6 space-y-5">
          {/* Progress Indicator */}
          <div className="flex justify-between mb-4 relative">
            <div className="absolute h-1 bg-gray-200 top-3 left-0 right-0 z-0"></div>
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                    step >= stepNum ? 'bg-[#9f48f2] scale-110' : 'bg-gray-200'
                  }`}
                >
                  {step > stepNum ? (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={`text-xs font-bold ${step >= stepNum ? 'text-white' : 'text-gray-500'}`}>{stepNum}</span>
                  )}
                </div>
                <div className="text-xs mt-1 font-medium text-gray-500">
                  {stepNum === 1 ? 'Email' : stepNum === 2 ? 'Verify' : 'Details'}
                </div>
              </div>
            ))}
          </div>
  
          {/* Alert Message */}
          {message && (
            <div 
              className={`text-sm font-medium p-3 rounded-lg transition-all duration-300 animate-fadeIn flex items-center ${
                message.includes("Success") || message.includes("verified")
                  ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                  : "bg-red-50 text-red-700 border-l-4 border-red-500"
              }`}
            >
              <span className="mr-2">
                {message.includes("Success") || message.includes("verified") ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </span>
              {message}
            </div>
          )}
  
          {/* Step 1: Enter Email */}
          {step === 1 && (
            <div className="space-y-4 animate-slideUp">
              <div className="relative">
                <label className="block text-gray-700 font-medium text-sm mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9f48f2] focus:border-transparent text-sm transition-all duration-300"
                  />
                </div>
              </div>
              <button
                onClick={sendOtp}
                className="w-full py-2.5 bg-gradient-to-r from-[#9f48f2] to-[#7928ca] text-white font-bold rounded-lg hover:shadow-lg hover:from-[#892ee6] hover:to-[#6824ae] transition-all duration-300 flex items-center justify-center"
              >
                <span>Send OTP</span>
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
  
          {/* Step 2: Enter OTP */}
          {step === 2 && otpSent && (
            <div className="space-y-4 animate-slideUp">
              <div className="text-center mb-4">
                <div className="inline-block p-3 bg-purple-100 rounded-full mb-2">
                  <svg className="w-6 h-6 text-[#9f48f2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">We've sent a verification code to</p>
                <p className="text-sm font-medium text-gray-800">{email}</p>
              </div>
              
              <div className="relative">
                <label className="block text-gray-700 font-medium text-sm mb-1">Enter OTP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9f48f2] focus:border-transparent text-sm transition-all duration-300"
                  />
                </div>
              </div>
              
              <button
                onClick={verifyOtp}
                className="w-full py-2.5 bg-gradient-to-r from-[#9f48f2] to-[#7928ca] text-white font-bold rounded-lg hover:shadow-lg hover:from-[#892ee6] hover:to-[#6824ae] transition-all duration-300 flex items-center justify-center"
              >
                <span>Verify OTP</span>
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          )}
  
          {/* Step 3: Enter Name & Password */}
          {step === 3 && otpVerified && (
            <form onSubmit={handleSignup} className="space-y-4 animate-slideUp">
              <div className="relative">
                <label className="block text-gray-700 font-medium text-sm mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9f48f2] focus:border-transparent text-sm transition-all duration-300"
                  />
                </div>
              </div>
  
              <div className="relative">
                <label className="block text-gray-700 font-medium text-sm mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9f48f2] focus:border-transparent text-sm transition-all duration-300"
                  />
                </div>
              </div>
  
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#9f48f2] to-[#7928ca] text-white font-bold rounded-lg hover:shadow-lg hover:from-[#892ee6] hover:to-[#6824ae] transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Create Account</span>
                <div className="absolute top-0 left-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            </form>
          )}
  
          {/* Navigation to Login */}
          <div className="pt-2 text-center">
            <p className="text-gray-600 text-sm">
              Already a user?{" "}
              <Link to="/login" className="text-[#9f48f2] font-bold hover:text-[#892ee6] transition-colors duration-300 relative group">
                Login
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9f48f2] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Add this style tag to your component or CSS file */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
        
        .animate-ping {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;
