import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Forgotpassword = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: { email: "" },

    validationSchema: yup.object({
      email: yup
        .string()
        .required("Email is required")
        .email("Invalid email format"),
    }),

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await fetch(
  `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: values.email }),
          },
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        // Show success message regardless — backend always returns success
        setSubmitted(true);
      } catch (err) {
        setErrors({ email: err.message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white shadow-sm">
        <h1 className="text-[#003ec7] font-bold text-2xl">Mercova</h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-[#003ec7] text-white py-2 px-5 rounded-xl hover:bg-blue-800 transition-colors text-sm font-semibold"
        >
          Back to Login
        </button>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white py-12 px-8 rounded-xl shadow-lg">
          {submitted ? (
            // ── Success state ──
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">
                📧
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Check your email
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                If an account exists for that email, we've sent a password reset
                link. Check your inbox and spam folder.
              </p>
              <p className="text-gray-400 text-xs">
                The link expires in 15 minutes.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-[#0045dc] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors mt-2"
              >
                Back to Login
              </button>
            </div>
          ) : (
            // ── Form state ──
            <>
              <div className="flex flex-col items-center gap-2 mb-8">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
                  🔒
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Forgot Password?
                </h2>
                <p className="text-gray-500 text-sm text-center">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-5">
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
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#003ec7] transition-all"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <small className="text-red-500 mt-1">
                      {formik.errors.email}
                    </small>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full bg-[#0045dc] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>

                <p className="text-sm text-center">
                  Remember your password?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-[#144aca] cursor-pointer hover:underline"
                  >
                    Log in
                  </span>
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#f8f9fa] px-20 py-8">
        <p className="text-[#64748b] text-sm">
          © 2026 Mercova. Built for the Digital Curator.
        </p>
      </div>
    </div>
  );
};

export default Forgotpassword;
