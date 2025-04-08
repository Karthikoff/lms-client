import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";
import CoursesList from "./CourseList";

const CreateCourse = () => {
  const [courseData, setCourseData] = useState({
    name: "",
    price: "",
    offerprice: "",
    description: "",
    keyPoints: "",
    highlights: "",
    category: "",
    instructorName: "",
    image: null,
    video: null, // ✅ Added video state
  });

  const { role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const userRole = localStorage.getItem("userRole");

  const categories = [
    "Web Development",
    "App Development",
    "Data Science",
    "Machine Learning",
    "Programming Language",
    "Artificial Intelligence",
  ];

  useEffect(() => {
    if (!role) return;

    if (role !== "admin" && role !== "instructor") {
      navigate("/");
      return;
    }

    const fetchInstructors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found!");
          return;
        }

        const response = await axios.get("https://lms-server-production-4028.up.railway.app/api/admin/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allUsers = response.data;
        if (allUsers?.instructors) {
          setInstructors(allUsers.instructors);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [role, navigate]);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCourseData({ ...courseData, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Handle Video Upload
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setCourseData({ ...courseData, video: file });

    if (file) {
      console.log("Selected Video:", file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    Object.keys(courseData).forEach((key) => {
      if (courseData[key]) {
        formData.append(key, courseData[key]);
      }
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://lms-server-production-4028.up.railway.app/api/courses/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Course uploaded successfully!");
      navigate("/inst-createcourse");
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload course.");
    } finally {
      setSubmitting(false);
    }
  };



  if (loading) return <div className="text-center py-6 text-sm font-semibold">Loading...</div>;
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-purple-800 relative">
          <span className="relative inline-block after:content-[''] after:absolute after:w-1/2 after:h-1 after:bg-purple-400 after:-bottom-2 after:left-1/4">
            CREATE NEW COURSE
          </span>
        </h2>
        
        <div className="w-full bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Header Bar */}
          <div className="bg-purple-700 py-4 px-6">
            <h3 className="text-lg sm:text-xl font-medium text-white">Course Information</h3>
            <p className="text-purple-200 text-sm">Fill in all details to create your course</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-5 sm:p-8" encType="multipart/form-data">
            {/* Basic Course Information */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="inline-block w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mr-2">1</span>
                Basic Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Course Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter course title"
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Regular Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Regular price"
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Offer Price (₹)</label>
                  <input
                    type="number"
                    name="offerprice"
                    placeholder="Discounted price"
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Instructor</label>
                  <select
                    name="instructorName"
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor._id} value={instructor.name}>{instructor.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Course Content */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="inline-block w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mr-2">2</span>
                Course Content
              </h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    placeholder="Provide a detailed description of your course"
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Key Points</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="keyPoints"
                      placeholder="Separate key points with commas"
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-10"
                    />
                    <div className="absolute left-3 top-3 text-purple-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Example: Advanced techniques, Certification included, 24/7 support</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Highlights</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="highlights"
                      placeholder="Separate highlights with commas"
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-10"
                    />
                    <div className="absolute left-3 top-3 text-purple-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Example: 10 hours of content, 5 downloadable resources, Mobile access</p>
                </div>
              </div>
            </div>
            
            {/* Media Upload */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <span className="inline-block w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mr-2">3</span>
                Course Media
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Course Thumbnail</label>
                  <div 
                    className="w-full h-64 border-2 border-dashed rounded-xl overflow-hidden flex flex-col items-center justify-center bg-gray-50 cursor-pointer transition-all hover:bg-gray-100 group"
                    onClick={() => document.getElementById("imageUpload").click()}
                  >
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white font-medium">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 py-8">
                        <FaCloudUploadAlt className="text-5xl mb-3 text-purple-400" />
                        <span className="text-sm font-medium mb-1">Click to upload thumbnail</span>
                        <span className="text-xs text-gray-500">Recommended: 1280×720px, 16:9 ratio</span>
                      </div>
                    )}
                  </div>
                  <input id="imageUpload" type="file" name="image" accept="image/*" onChange={handleImageChange} required className="hidden" />
                </div>
                
                {/* Video Upload */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Course Preview Video</label>
                  <div className="border-2 border-dashed rounded-xl p-6 bg-gray-50">
                    <div className="flex flex-col items-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <label htmlFor="videoUpload" className="cursor-pointer">
                        <span className="bg-white hover:bg-gray-100 transition-colors text-purple-600 font-medium py-2 px-4 rounded-lg border border-purple-600 inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Select Video
                        </span>
                      </label>
                      <input
                        id="videoUpload"
                        type="file"
                        name="video"
                        accept="video/*"
                        onChange={handleVideoChange}
                        required
                        className="hidden"
                      />
                      {courseData.video && (
                        <div className="mt-4 text-center">
                          <p className="text-sm text-gray-600">Selected: {courseData.video.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(courseData.video.size / 1024 / 1024 * 10) / 10} MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 text-base sm:text-lg shadow-lg ${
                  submitting 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl"
                }`}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading Course...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Publish Course
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Courses List with some styling updates */}
        <div className="mt-12 w-full">
          <div className="flex items-center justify-between mb-6">
            
          </div>
          <CoursesList userRole={userRole} />
        </div>
      </div>
    </div>
  );
  
};

export default CreateCourse;
