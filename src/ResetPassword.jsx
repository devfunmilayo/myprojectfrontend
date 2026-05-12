import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmpassword: "",
    },

    validationSchema: yup.object({
      password: yup
        .string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
          "Password must be 8+ chars with uppercase, number & special character",
        ),
      confirmpassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
    }),

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await fetch(
          `import.meta.env.VITE_API_URL/auth/reset-password/${id}/${token}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: values.password }),
          },
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setSuccess(true);

        // Redirect to login after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setErrors({ password: err.message });
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
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white py-12 px-8 rounded-xl shadow-lg">
          {success ? (
            // ── Success state ──
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">
                ✅
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Password Reset!
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your password has been reset successfully. Redirecting you to
                login...
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-[#0045dc] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors mt-2"
              >
                Go to Login
              </button>
            </div>
          ) : (
            // ── Form state ──
            <>
              <div className="flex flex-col items-center gap-2 mb-8">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
                  🔑
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Set New Password
                </h2>
                <p className="text-gray-500 text-sm text-center">
                  Choose a strong password for your Mercova account
                </p>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-5">
                {/* New Password */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter new password"
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#003ec7] transition-all"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <small className="text-red-500 mt-1">
                      {formik.errors.password}
                    </small>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-600 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmpassword"
                    value={formik.values.confirmpassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Confirm new password"
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#003ec7] transition-all"
                  />
                  {formik.touched.confirmpassword &&
                    formik.errors.confirmpassword && (
                      <small className="text-red-500 mt-1">
                        {formik.errors.confirmpassword}
                      </small>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full bg-[#0045dc] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formik.isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
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

export default ResetPassword;
