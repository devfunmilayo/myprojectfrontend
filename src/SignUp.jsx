import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "./AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      title: "",
      password: "",
      confirmpassword: "",
    },

    validationSchema: yup.object({
      firstname: yup.string().required("First name is required"),
      lastname: yup.string().required("Last name is required"),
      title: yup.string().required("Title is required"),
      email: yup
        .string()
        .required("Email is required")
        .email("Invalid email format"),
      password: yup
        .string()
        .required("Password is required")
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
          "Password is not strong enough"
        ),
      confirmpassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
    }),

    // ✅ NOW calls your Node backend
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await signup({
          firstname: values.firstname,
          lastname: values.lastname,
          email: values.email,
          title: values.title,
          password: values.password,
        });
        navigate("/buyer"); 
      } catch (err) {
        setErrors({ email: err.message }); // show server error under email field
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-[#f8f9fa] w-full min-h-screen">
      <div className="flex flex-col items-center justify-center gap-3 pt-10">
        <h1 className="text-[#013cbf] text-xl font-bold">MERCOVA</h1>
        <h1 className="text-[#2c2e2f] text-2xl font-bold">Join Mercova</h1>
        <h1 className="text-[#9194a2] text-sm font-normal">
          The premium infrastructure for digital visionaries
        </h1>

        {/* Form Card */}
        <div className="flex justify-center items-center pt-3 pb-6">
          <div className="w-full max-w-lg bg-white p-8 rounded-[0.5rem] shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create Account
            </h2>

            {/* ✅ Single form tag, connected to formik.handleSubmit */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">

              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={formik.values.firstname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#003ec7]"
                  />
                  {formik.touched.firstname && formik.errors.firstname && (
                    <small className="text-red-500">{formik.errors.firstname}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#003ec7]"
                  />
                  {formik.touched.lastname && formik.errors.lastname && (
                    <small className="text-red-500">{formik.errors.lastname}</small>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#003ec7]"
                />
                {formik.touched.email && formik.errors.email && (
                  <small className="text-red-500">{formik.errors.email}</small>
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 mb-1">
                  Title / Profession
                </label>
                <select
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-1 focus:ring-[#003ec7]"
                >
                  <option value="">Select your title</option>
                  <option value="Content Creator">Content Creator</option>
                  <option value="Writer">Writer</option>
                  <option value="Song Writer">Song Writer</option>
                  <option value="Social Media Manager">Social Media Manager</option>
                  <option value="Tutor">Tutor</option>
                </select>
                {formik.touched.title && formik.errors.title && (
                  <small className="text-red-500">{formik.errors.title}</small>
                )}
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#003ec7]"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <small className="text-red-500">{formik.errors.password}</small>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmpassword"
                    value={formik.values.confirmpassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#003ec7]"
                  />
                  {formik.touched.confirmpassword && formik.errors.confirmpassword && (
                    <small className="text-red-500">{formik.errors.confirmpassword}</small>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-[#0045dc] text-white py-3 px-5 rounded-xl font-bold mt-4 hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? "Creating account..." : "Sign Up"}
              </button>

              <p className="mt-5 text-sm">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-[#144aca] cursor-pointer hover:underline"
                >
                  Log in
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#f8f9fa] p-20 mt-1">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold text-[#0369a1]">Mercova</h1>
          <div className="flex flex-row gap-5 text-[#a3adbc]">
            {["Explore", "Sell", "Learn", "Privacy"].map((item) => (
              <span
                key={item}
                className="cursor-pointer transition-colors duration-200 hover:text-[#0369a1]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <p className="text-[#64748b] mt-2">
          © 2026 Mercova. Built for the Digital Curator.
        </p>
      </div>
    </div>
  );
};

export default SignUp;