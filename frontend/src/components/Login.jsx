import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // Password toggle icons

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("🔍 Login API Response:", result);

      if (!response.ok) {
        setError(result.message || "Invalid email or password");
      } else {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.role);
        localStorage.setItem("username", result.username);
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("email", result.email);

        console.log("✅ User successfully stored in localStorage");

        // Redirect to home after login
        // ✅ Redirect based on role
        if (result.role === "admin") navigate("/admin-dashboard");
        else if (result.role === "instructor") navigate("/inst-createcourse");
        else if (result.role === "student") navigate("/home");
        else navigate("/login");
      }
    } catch (err) {
      console.error("❌ Error during login:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 p-4">
      {/* Brain Boost Branding with fade-in animation */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-extrabold text-[#9f48f2] mb-2 hover:scale-105 transition-transform">Brain Boost</h1>
        <h2 className="text-2xl font-bold text-black">Welcome Back</h2>
        <p className="text-gray-600 font-medium mb-4 text-sm">Log in to access your account</p>
      </div>
  
      {error && (
        <p className="text-red-500 text-center font-medium text-sm animate-pulse">
          {error}
        </p>
      )}
  
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-xs">
        {/* Email Field with focus animation */}
        <div className="transform transition-all duration-300 hover:translate-y-1">
          <label className="block text-gray-800 font-medium text-sm">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9f48f2] text-sm transition-all duration-300 focus:shadow-md"
            placeholder="Enter email"
            required
          />
        </div>
  
        {/* Password Field with Toggle and focus animation */}
        <div className="relative transform transition-all duration-300 hover:translate-y-1">
          <label className="block text-gray-800 font-medium text-sm">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9f48f2] text-sm transition-all duration-300 focus:shadow-md"
            placeholder="Enter password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-7 right-3 text-gray-500 hover:text-[#9f48f2] transition-colors duration-300"
          >
            {showPassword ? <EyeOffIcon size={18} className="hover:rotate-12 transition-transform" /> : <EyeIcon size={18} className="hover:rotate-12 transition-transform" />}
          </button>
        </div>
  
        {/* Submit Button with pulse and scale animation */}
        <button
          type="submit"
          className="w-full py-2 bg-[#9f48f2] text-white font-bold rounded-md hover:bg-[#892ee6] transition text-sm transform hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : (
            "Log In"
          )}
        </button>
      </form>
  
      <p className="mt-3 text-gray-700 text-sm animate-fade-in">
        Don't have an account?{" "}
        <Link to="/signup" className="text-[#9f48f2] font-bold hover:underline hover:text-[#892ee6] transition-all duration-300">
          Sign up
        </Link>
      </p>
  
      {/* Add this to your CSS or in a style tag */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
