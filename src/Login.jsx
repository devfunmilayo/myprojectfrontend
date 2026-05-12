import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "./AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: { email: "", password: "" },

    validationSchema: yup.object({
      email: yup.string().required("Email is required").email("Invalid email format"),
      password: yup.string().required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await login(values.email, values.password);

        // Read fresh user from localStorage right after login
        const user = JSON.parse(localStorage.getItem("mercova_user"));

        // New user → welcome page | Returning user → buyer dashboard
        if (user?.isNewUser) {
          navigate("/welcome");
        } else {
          navigate("/buyer");
        }
      } catch (err) {
        setErrors({ password: err.message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Navbar */}
      <div className="flex items-center justify-between w-full px-5 py-3 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <img src="/mercova.png" alt="Logo" width={30} className="rounded-[2rem]" />
          <h1 className="text-[#003ec7] font-bold text-2xl">Mercova</h1>
        </div>
        <button
          onClick={() => navigate("/getstarted")}
          className="bg-[#003ec7] text-white py-2 px-5 rounded-xl hover:bg-blue-800 transition-colors text-sm font-semibold"
        >
          Get Started
        </button>
      </div>

      {/* Form Card */}
      <div className="flex justify-center items-center py-16 px-4">
        <div className="w-full max-w-md bg-white py-12 px-8 rounded-[0.75rem] shadow-lg">
          <div className="flex flex-col items-center gap-2 mb-8">
            <h1 className="text-[#2c2e2f] text-2xl font-bold">Welcome Back</h1>
            <p className="text-gray-500 text-sm text-center">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Email Address</label>
              <input
                type="email" name="email"
                value={formik.values.email}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#003ec7] transition-all"
              />
              {formik.touched.email && formik.errors.email && (
                <small className="text-red-500 mt-1">{formik.errors.email}</small>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-gray-600">Password</label>
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-[#144aca] text-xs cursor-pointer hover:underline"
                >
                  Forgot Password?
                </span>
              </div>
              <input
                type="password" name="password"
                value={formik.values.password}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#003ec7] transition-all"
              />
              {formik.touched.password && formik.errors.password && (
                <small className="text-red-500 mt-1">{formik.errors.password}</small>
              )}
            </div>

            <button
              type="submit" disabled={formik.isSubmitting}
              className="w-full bg-[#0045dc] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Logging in..." : "Log In"}
            </button>

            <p className="text-sm text-center">
              Don't have an account?{" "}
              <span onClick={() => navigate("/getstarted")} className="text-[#144aca] cursor-pointer hover:underline">
                Sign up here for free
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#f8f9fa] px-20 py-10">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold text-[#0369a1]">Mercova</h1>
          <div className="flex flex-row gap-5 text-[#a3adbc]">
            {["Explore", "Sell", "Learn", "Privacy"].map((item) => (
              <span key={item} className="cursor-pointer transition-colors duration-200 hover:text-[#0369a1]">{item}</span>
            ))}
          </div>
        </div>
        <p className="text-[#64748b] mt-2">© 2026 Mercova. Built for the Digital Curator.</p>
      </div>
    </div>
  );
};

export default Login;