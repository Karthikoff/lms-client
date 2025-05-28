import React, { useState, useEffect } from "react";  
import { useParams, useNavigate } from "react-router-dom";  
import axios from "axios";  

const EditCourse = () => {  
  const { id } = useParams();  
  const navigate = useNavigate();  
  const [course, setCourse] = useState({  
    name: "",  
    price: "",  
    // offerprice: "",  
    description: "",  
    keyPoints: "",  
    // highlights: "",  
    category: "",  
    instructorName: "",  
    image: null,  
  });  

  const [previewImage, setPreviewImage] = useState(null);  
  const [instructors, setInstructors] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [submitting, setSubmitting] = useState(false);  
  const categories = [  
    "Web Development",  
    "App Development",  
    "Data Science",  
    "Machine Learning",  
    "Programming Language",  
    "Artificial Intelligence",  
  ];  

  useEffect(() => {  
    const fetchCourseDetails = async () => {  
      try {  
        const token = localStorage.getItem("token");  
        if (!token) {  
          console.error("No token found!");  
          return;  
        }  

        const res = await axios.get(`https://lms-server-production-4d02.up.railway.app/api/courses/${id}`, {  
          headers: { Authorization: `Bearer ${token}` },  
        });  

        if (res.data.success && res.data.course) {  
          const courseData = res.data.course;  
          setCourse({  
            name: courseData.name,  
            price: courseData.price,  
            // offerprice: courseData.offerprice || "",  
            description: courseData.description,  
            keyPoints: courseData.keyPoints || "",  
            // highlights: courseData.highlights || "",  
            category: courseData.category,  
            instructorName: courseData.instructorName || "",  
            image: null,  
          });  
          setPreviewImage(courseData.imageUrl);  
        }  
      } catch (error) {  
        console.error("Error fetching course details:", error);  
      } finally {  
        setLoading(false);  
      }  
    };  

    const fetchInstructors = async () => {  
      try {  
        const token = localStorage.getItem("token");  
        const res = await axios.get("https://lms-server-production-4d02.up.railway.app/api/admin/all-users", {  
          headers: { Authorization: `Bearer ${token}` },  
        });  

        if (res.data?.instructors) {  
          setInstructors(res.data.instructors);  
        }  
      } catch (error) {  
        console.error("Error fetching instructors:", error);  
      }  
    };  

    fetchCourseDetails();  
    fetchInstructors();  
  }, [id]);  

  const handleChange = (e) => {  
    setCourse({ ...course, [e.target.name]: e.target.value });  
  };  

  const handleImageChange = (e) => {  
    const file = e.target.files[0];  
    setCourse({ ...course, image: file });  

    if (file) {  
      const reader = new FileReader();  
      reader.onload = (e) => setPreviewImage(e.target.result);  
      reader.readAsDataURL(file);  
    }  
  };  

  const handleSubmit = async (e) => {  
    e.preventDefault();  
    setSubmitting(true);  

    const formData = new FormData();  
    Object.keys(course).forEach((key) => {  
      formData.append(key, course[key]);  
    });  

    try {  
      const token = localStorage.getItem("token");  
      const res = await axios.put(`https://lms-server-production-4d02.up.railway.app/api/courses/update/${id}`, formData, {  
        headers: {  
          "Content-Type": "multipart/form-data",  
          Authorization: `Bearer ${token}`,  
        },  
      });  

      if (res.data.success) {  
        alert("Course updated successfully!");  
        navigate(`/course/${id}`);  
      } else {  
        alert("Error updating course: " + res.data.message);  
      }  
    } catch (error) {  
      console.error("Error updating course:", error);  
      alert("Failed to update course.");  
    } finally {  
      setSubmitting(false);  
    }  
  };  

  if (loading) return <div className="text-center py-6 text-sm font-semibold">Loading...</div>;  

  return (  
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">  
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">EDIT COURSE</h2>  

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">  
        <div>  
          <label className="block text-sm font-medium text-gray-600">Course Name</label>  
          <input  
            type="text" name="name" value={course.name} onChange={handleChange} required  
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"  
          />  
        </div>  

        <div className="grid grid-cols-2 gap-4">  
          <div>  
            <label className="block text-sm font-medium text-gray-600">Price</label>  
            <input  
              type="number" name="price" value={course.price} onChange={handleChange} required  
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"  
            />  
          </div>  
          {/* <div>  
            <label className="block text-sm font-medium text-gray-600">Offer Price</label>  
            <input  
              type="number" name="offerprice" value={course.offerprice} onChange={handleChange}  
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"  
            />  
          </div>   */}

          <div>  
            <label className="block text-sm font-medium text-gray-600">Category</label>  
            <select  
              name="category" value={course.category} onChange={handleChange} required  
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"  
            >  
              <option value="">Select Category</option>  
              {categories.map((category) => (  
                <option key={category} value={category}>  
                  {category}  
                </option>  
              ))}  
            </select>  
          </div>  

          <div>  
            <label className="block text-sm font-medium text-gray-600">Instructor Name</label>  
            <select  
              name="instructorName" value={course.instructorName} onChange={handleChange} required  
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"  
            >  
              <option value="">Select Instructor</option>  
              {instructors.map((instructor) => (  
                <option key={instructor._id} value={instructor.name}>  
                  {instructor.name}  
                </option>  
              ))}  
            </select>  
          </div>  
        </div>  

        <div>  
          <label className="block text-sm font-medium text-gray-600">Description</label>  
          <textarea  
            name="description" value={course.description} onChange={handleChange} required  
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"  
          />  
        </div>  

        <div>  
          <label className="block text-sm font-medium text-gray-600">Key Points</label>  
          <textarea  
            name="keyPoints" value={course.keyPoints} onChange={handleChange}  
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"  
          />  
        </div>  

        {/* <div>  
          <label className="block text-sm font-medium text-gray-600">Highlights</label>  
          <textarea  
            name="highlights" value={course.highlights} onChange={handleChange}  
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500"  
          />  
        </div>   */}

        <div className="flex items-center space-x-4">  
          <label className="block text-sm font-medium text-gray-600">Course Image</label>  
          <div className="w-32 h-32 border rounded-lg overflow-hidden">  
            {previewImage && <img src={previewImage} alt="Course" className="w-full h-full object-cover" />}  
          </div>  
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="hidden" />  
        </div>  

        <button  
          type="submit"  
          className={`w-full py-2 text-white font-semibold rounded-lg transition ${  
            submitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-700"  
          }`}  
          disabled={submitting}  
        >  
          {submitting ? "Updating..." : "Save Changes"}  
        </button>  
      </form>  
    </div>  
  );  
};  

export default EditCourse;  
