import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react"; // ✅ Import Cart Icon
// import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Wallet, X } from "lucide-react";
import { Settings } from "lucide-react"; // ✅ Import Settings Icon
import { Eye } from "lucide-react"; // ✅ Import Eye Icon

import { FaInfoCircle } from 'react-icons/fa'; // Import the InfoCircle icon




const bannerImages = [
  "/images/banner-1.png",
  "/images/banner-1.png",
  "/images/banner-1.png",
];

const categories = [
  "All Courses",
  "Web Development",
  "App Development",
  "Data Science",
  "Machine Learning",
  "Programming Language",
  "Artificial Intelligence",
];


const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Courses");
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();
  const [cartMessage, setCartMessage] = useState("");

  
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });
  

  const userRole = localStorage.getItem("role");
  const studentName = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Auto-change banner images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let url = "https://lms-server-production-4028.up.railway.app/api/courses";
        if (userRole === "instructor") {
          url += `?instructorName=${encodeURIComponent(studentName)}`;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [userRole, studentName, token]);

  // Enroll Course Function
  const enrollCourse = async (courseId) => {
    if (!token) {
      alert("You must be logged in to enroll in a course.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://lms-server-production-4028.up.railway.app/api/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Enrolled successfully!");
      } else {
        alert(data.message || "Failed to enroll.");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("An error occurred while enrolling.");
    } finally {
      setLoading(false);
    }
  };

  // Filter courses by category
  const filteredCourses =
    activeCategory === "All Courses"
      ? courses
      : courses.filter((course) => course.category === activeCategory);


      const addToCart = (course) => {
        const updatedCart = [...cart, course];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      
        setCartMessage("Course added to cart!"); // Show message
        setTimeout(() => setCartMessage(""), 7000); // Hide after 2 seconds
      };
      
      
      const logout = () => {
        localStorage.clear();  // Clears local storage
        sessionStorage.clear(); // Clears session storage (if used)
        navigate("/login", { replace: true }); // Replaces the history entry, preventing back navigation
        window.location.reload(); // Ensures any cached data is removed
    };
    

      // ✅ Wallet State
  const [walletBalance, setWalletBalance] = useState(0);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [addAmount, setAddAmount] = useState("");


  // ✅ Fetch Wallet Balance on Load
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const res = await fetch("https://lms-server-production-4028.up.railway.app/api/wallet/balance", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) setWalletBalance(data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    if (token) fetchWalletBalance();
  }, [token]);

  // ✅ Add Money to Wallet
  const handleAddMoney = async () => {
    const amount = parseInt(addAmount);
    if (!amount || amount <= 0) {
      alert("Enter a valid amount.");
      return;
    }

    try {
      const res = await fetch("https://lms-server-production-4028.up.railway.app/api/wallet/add-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (res.ok) {
        setWalletBalance(data.balance);
        setAddAmount("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error adding money:", error);
    }
  };

  {cartMessage && (
    <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-md transition-all">
      {cartMessage}
    </div>
  )}
  
    

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* ✨ Enhanced Header Navigation with Animated Gradient */}
      <header className="flex justify-between items-center bg-white backdrop-blur-sm bg-opacity-90 shadow-lg px-4 py-3 md:px-8 sticky top-0 z-50 border-b border-purple-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white font-bold">BB</span>
          </div>
          <h1
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => navigate("/")}
          >
            Brain Boost
          </h1>
        </div>
  
        <div className="flex items-center gap-4">
          {userRole === "student" ? (
            <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{studentName.charAt(0)}</span>
              </div>
              <span className="text-sm font-semibold text-purple-700">
                Welcome, {studentName}
              </span>
            </div>
          ) : (
            <Button
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
  
          {userRole && (
            <div className="flex items-center gap-4">
              <button
                className="relative bg-white p-2 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => setIsWalletOpen(true)}
              >
                <Wallet size={20} className="text-purple-600" />
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                  ₹{walletBalance}
                </span>
              </button>
  
              <button
                className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => navigate("/transactions")}
              >
                <FaInfoCircle size={20} className="text-blue-500" />
              </button>
  
              <button
                className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transform hover:rotate-12 transition-all duration-300"
                onClick={() => {
                  if (window.confirm("Are you sure you want to log out?")) {
                    logout();
                  }
                }}
              >
                <LogOut size={20} className="text-red-500" />
              </button>
            </div>
          )}
        </div>
      </header>
  
      {/* ✨ Enhanced Banner Section with Overlay and Text */}
      <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
        <img
          src={bannerImages[currentBanner]}
          alt="Banner"
          className="w-full h-full object-cover transition-all duration-1000 transform scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center drop-shadow-lg animate-fade-in">
            Elevate Your Learning Journey
          </h2>
          <p className="text-sm md:text-lg max-w-lg text-center drop-shadow-md px-4 animate-fade-in-delay">
            Discover expert-led courses designed to boost your skills and transform your future
          </p>
          <div className="mt-6 animate-fade-in-delay-2">
            <button className="bg-white text-purple-600 font-bold px-6 py-2 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-lg">
              Explore Now
            </button>
          </div>
        </div>
        {/* Animated decorative elements */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-10 h-16">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,218.7C960,192,1056,128,1152,117.3C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
  
      {/* ✨ Enhanced Categories Navigation with Animated Indicator */}
      <div className="bg-white py-4 shadow-md relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 px-4">
            {categories.map((category) => (
              <span
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`cursor-pointer text-sm font-medium pb-1 px-3 transition-all duration-300 relative ${
                  activeCategory === category ? "text-purple-600" : "text-gray-600 hover:text-purple-500"
                }`}
              >
                {category}
                {activeCategory === category && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transform animate-pulse"></span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
  
      {/* ✨ Enhanced Course List with animations and better cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center mb-12">
          <div className="inline-block relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-2 text-center tracking-wide">
              Explore Our Courses
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-600 max-w-2xl text-center">
            Unlock your potential with our carefully curated selection of high-quality courses
          </p>
        </div>
  
        {/* Decorative floating elements */}
        <div className="absolute top-1/4 left-10 w-16 h-16 rounded-full bg-purple-100 opacity-50 animate-float hidden lg:block"></div>
        <div className="absolute bottom-1/3 right-10 w-20 h-20 rounded-full bg-blue-100 opacity-50 animate-float-delay hidden lg:block"></div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-500 text-4xl">🔍</span>
              </div>
              <p className="text-gray-600 text-lg text-center">No courses available in this category yet.</p>
              <button 
                className="mt-4 px-6 py-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-all"
                onClick={() => setActiveCategory("All")}
              >
                View all courses
              </button>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer overflow-hidden group"
                onClick={() => navigate(`/viewcourse/${course._id}`)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={course.imageUrl}
                    alt={course.name}
                    className="w-full h-[180px] sm:h-[200px] object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end justify-start p-4">
                    <span className="text-white flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Eye size={16} /> View Details
                    </span>
                  </div>
                  {course?.offerprice && course?.offerprice < course?.price && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      {Math.round(((course.price - course.offerprice) / course.price) * 100)}% OFF
                    </div>
                  )}
                </div>
  
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{course.name}</h3>
                    <div className="flex items-center text-yellow-500">
                      <span className="text-xs mr-1">4.8</span>
                      <span>⭐</span>
                    </div>
                  </div>
                  
                  <p className="text-purple-600 text-xs font-semibold mt-1 flex items-center">
                    <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center mr-1">
                      <span className="text-purple-600 text-xs">👤</span>
                    </span>
                    {course.instructorName}
                  </p>
  
                  <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                    <div>
                      {course?.offerprice && course?.offerprice < course?.price ? (
                        <div>
                          <span className="text-xs font-medium text-gray-500 line-through">
                            ₹{course.price}
                          </span>
                          <span className="text-xl font-bold text-black ml-2">₹{course.offerprice}</span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-black">₹{course.price}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.floor(Math.random() * 100) + 20} students
                    </div>
                  </div>
  
                  {userRole === "student" && (
                    <button
                      className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/viewcourse/${course._id}`);
                      }}
                    >
                      <span>Enroll Now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Decorative bottom wave */}
        <div className="w-full overflow-hidden mt-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#9f48f2"
              fillOpacity="0.1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float-delay {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes slow-zoom {
          0% { transform: scale(1.05); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1.05); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          0% { opacity: 0; transform: translateY(20px); }
          30% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay-2 {
          0% { opacity: 0; transform: translateY(20px); }
          60% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }
        
        .animate-slow-zoom {
          animation: slow-zoom 15s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 1.5s ease-out forwards;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in-delay-2 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;
