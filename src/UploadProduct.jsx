import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useFormik } from "formik";
import * as yup from "yup";

const UploadProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      type: "download",
      category: "ebook",
      fileUrl: "",
      thumbnailUrl: "",
    },
    validationSchema: yup.object({
      title: yup.string().required("Title is required"),
      description: yup
        .string()
        .required("Description is required")
        .min(20, "At least 20 characters"),
      price: yup
        .number()
        .required("Price is required")
        .min(1, "Price must be at least $1"),
      type: yup.string().required(),
      category: yup.string().required(),
      fileUrl: yup.string().required("File URL is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setServerError("");
      try {
        const token = localStorage.getItem("mercova_token");
        const res = await fetch(
          import.meta.env.VITE_API_URL/seller/products,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(values),
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setSuccess(true);
        resetForm();
        setTimeout(() => navigate("/seller/products"), 2000);
      } catch (err) {
        setServerError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate("/seller")}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-semibold"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-xl font-extrabold text-blue-600">Mercova</h1>
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold uppercase">
          {user?.firstname?.[0]}
          {user?.lastname?.[0]}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Upload New Product
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below to list your product on Mercova
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-sm font-bold text-green-700">
                Product uploaded successfully!
              </p>
              <p className="text-xs text-green-600">
                Redirecting to your products...
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-sm font-bold text-red-600">❌ {serverError}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-gray-900">
              Product Information
            </h3>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. The Ultimate Copywriting Guide"
                className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.title && formik.errors.title && (
                <small className="text-red-500 mt-1">
                  {formik.errors.title}
                </small>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-1">
                Seller Name
              </label>
              <input
                type="text"
                value={`${user?.firstname} ${user?.lastname}`}
                disabled
                className="border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Describe your product in detail — what's included, who it's for, what they'll learn..."
                rows={5}
                className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {formik.touched.description && formik.errors.description && (
                <small className="text-red-500 mt-1">
                  {formik.errors.description}
                </small>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">
                  Price (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="0.00"
                    min="1"
                    className="border border-gray-200 rounded-xl p-3 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  />
                </div>
                {formik.touched.price && formik.errors.price && (
                  <small className="text-red-500 mt-1">
                    {formik.errors.price}
                  </small>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  className="border border-gray-200 rounded-xl p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ebook">eBook</option>
                  <option value="course">Course</option>
                  <option value="template">Template</option>
                  <option value="guide">Guide</option>
                  <option value="assets">Design Assets</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-2">
                Product Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "download",
                    label: "📄 Downloadable File",
                    desc: "PDF, ZIP, etc.",
                  },
                  {
                    value: "course",
                    label: "🎓 Online Course",
                    desc: "Video lessons",
                  },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => formik.setFieldValue("type", opt.value)}
                    className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${
                      formik.values.type === opt.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-sm font-bold text-gray-900">
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* File URLs */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-gray-900">
              Files & Media
            </h3>
            <p className="text-xs text-gray-400 -mt-2">
              Upload your files to Google Drive and paste the link here.
            </p>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-1">
                Product File URL *
              </label>
              <input
                type="url"
                name="fileUrl"
                value={formik.values.fileUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://drive.google.com/..."
                className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.fileUrl && formik.errors.fileUrl && (
                <small className="text-red-500 mt-1">
                  {formik.errors.fileUrl}
                </small>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-1">
                Thumbnail Image URL{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                name="thumbnailUrl"
                value={formik.values.thumbnailUrl}
                onChange={formik.handleChange}
                placeholder="https://your-image-url.com/thumbnail.jpg"
                className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <small className="text-gray-400 mt-1">
                Recommended: 1200×630px.
              </small>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? "Uploading..." : " Publish Product"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/seller")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl text-sm transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;
