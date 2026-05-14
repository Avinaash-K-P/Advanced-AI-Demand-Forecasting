import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Register() {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

   const handleChange = (e) => {

    setFormData(
      {
        ...formData,[e.target.name]: e.target.value
      }
    );
  };

  const handleSubmit = async (e) => {

  e.preventDefault();

    try {

      await axios.post(
        "http://127.0.0.1:8000/auth/register",
        formData
      );

      toast.success("Registration successful!");

      navigate("/");

    } catch (error) {

      console.error(error);

      toast.error("Registration failed");

    }
  };

return (

  <div className="min-h-screen flex">

    {/* Left Section */}
    <div className="hidden md:flex w-1/2 bg-gradient-to-br from-black to-gray-800 text-white items-center justify-center p-12">

      <div>

        <h1 className="text-5xl font-bold mb-6">
          AI Demand Forecasting
        </h1>

        <p className="text-lg text-gray-300 leading-8">

          Create your account and start
          generating AI-driven forecasting
          insights for smarter business decisions.

        </p>

      </div>

    </div>

    {/* Right Section */}
    <div className="flex-1 flex items-center justify-center bg-gray-100 p-6">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">

        <h2 className="text-4xl font-bold mb-2 text-center">
          Create Account
        </h2>

        <p className="text-gray-500 text-center mb-8">
          Register to continue
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            className="
              w-full
              p-4
              border
              rounded-xl
              mb-5
              focus:outline-none
              focus:ring-2
              focus:ring-black
            "
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="
              w-full
              p-4
              border
              rounded-xl
              mb-5
              focus:outline-none
              focus:ring-2
              focus:ring-black
            "
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="
              w-full
              p-4
              border
              rounded-xl
              mb-6
              focus:outline-none
              focus:ring-2
              focus:ring-black
            "
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="
              w-full
              bg-green-500
              text-white
              p-4
              rounded-xl
              hover:bg-green-600
              transition
            "
          >
            Register
          </button>

        </form>

        <p className="mt-6 text-center text-gray-600">

          Already have an account?

          <Link
            to="/"
            className="text-black font-semibold ml-1"
          >
            Login
          </Link>

        </p>

      </div>

    </div>

  </div>
);
  
}

export default Register;