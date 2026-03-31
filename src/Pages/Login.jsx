import React, { useState } from "react";
import api from "../Api/Api";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Login handler
  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await api.post("/shona/login", form);

      // ✅ Save token & full user info in localStorage
   // Login ke response se
localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data));

      // ✅ Alert with user name
      alert(`Welcome back ${res.data.name} 😎`);

      // Redirect to home/dashboard
      navigate("/chat");
    } catch (err) {
      console.log(err.response?.data); // debug purpose
      alert(err.response?.data?.msg || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        
        <h2 className="text-2xl font-bold text-center text-white mb-6">
         Lets'GOO
        </h2>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition duration-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-gray-300 text-sm text-center mt-6">
          Account Nhi hai To bana bhi nhi skte Get Lost
         
        </p>
      </div>
    </div>
  );
};

export default Login;