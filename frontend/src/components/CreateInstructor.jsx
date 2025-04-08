import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

const CreateInstructor = () => {
  const [formData, setFormData] = useState({
    name: "",
    fathername: "",
    gender: "",
    qualification: "",
    address: "",
    city: "",
    state: "",
    country: "",
    email: "",
    password: "",
    role: "instructor",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Unauthorized! Please log in again.");
        setLoading(false);
        return;
      }

      await axios.post(
        "http://localhost:5000/api/admin/create-instructor",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Successfully onboarded! 🎉"); // Set success message
      setTimeout(() => setSuccessMessage(""), 6000); // Clear message after 6 seconds

      setFormData({
        name: "",
        fathername: "",
        gender: "",
        qualification: "",
        address: "",
        city: "",
        state: "",
        country: "",
        email: "",
        password: "",
        role: "instructor",
      });

      toast.success("Successfully onboarded! 🎉");
      navigate("/manage-instructors");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create instructor");
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="flex h-screen bg-gray-100">
        <div className="flex flex-col justify-center items-center w-full px-6">
          <h1 className="text-5xl font-bold text-black mb-10">Instructor Onboarding</h1>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 text-green-700 bg-green-200 border border-green-400 rounded-lg">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-4">
            {/* Form Fields */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Father's Name</label>
                <input
                  type="text"
                  name="fathername"
                  placeholder="Enter father's name"
                  value={formData.fathername}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  placeholder="Enter qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Instructor"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateInstructor;
