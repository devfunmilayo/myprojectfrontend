import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useFormik } from "formik";
import * as yup from "yup";

const BASE_URL = import.meta.env.VITE_API_URL;

const navItems = [
  {
    label: "Discover",
    icon: (
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  //   {
  //     label: "My Library",
  //     icon: (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>),
  //   },
  {
    label: "Orders",
    icon: (
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
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  },
  {
    label: "Profile",
    icon: (
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

const Toast = ({ message, type }) => {
  if (!message) return null;
  return (
    <div
      className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-lg ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {type === "success" ? "✅" : "❌"} {message}
    </div>
  );
};

const Settings = () => {
  const { user, logout, becomeSeller, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState("Profile");
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [logoutModal, setLogoutModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3500);
  };

  const handleNav = (label) => {
    setActiveNav(label);
    if (label === "Discover") navigate("/buyer");
    // if (label === "My Library") navigate("/library");
    if (label === "Orders") navigate("/orders");
  };

  const profileFormik = useFormik({
    initialValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      title: user?.title || "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      firstname: yup.string().required("First name is required"),
      lastname: yup.string().required("Last name is required"),
      title: yup.string().required("Title is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setProfileLoading(true);
      try {
        const token = localStorage.getItem("mercova_token");
        const res = await fetch(`${BASE_URL}/users/profile`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        const updated = { ...user, ...values };
        localStorage.setItem("mercova_user", JSON.stringify(updated));
        showToast("Profile updated successfully!");
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setProfileLoading(false);
        setSubmitting(false);
      }
    },
  });

  // ── Password form ─────────────────────────────────────────────────────────
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      currentPassword: yup.string().required("Current password is required"),
      newPassword: yup
        .string()
        .required("New password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
          "Must be 8+ chars with uppercase, number & special character",
        ),
      confirmPassword: yup
        .string()
        .required("Please confirm your new password")
        .oneOf([yup.ref("newPassword")], "Passwords must match"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const token = localStorage.getItem("mercova_token");
        const res = await fetch(`${BASE_URL}/auth/change-password`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        resetForm();
        showToast("Password changed successfully!");
      } catch (err) {
        setErrors({ currentPassword: err.message });
        showToast(err.message, "error");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ── Delete account ────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleteLoading(true);
    try {
      await deleteAccount();
      navigate("/");
    } catch (err) {
      showToast(err.message, "error");
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Toast message={toast.message} type={toast.type} />

      {/* ── Sidebar ── */}
      <aside className="w-48 min-w-[192px] bg-white border-r border-gray-200 flex flex-col py-6">
        <div className="px-5 pb-6 text-xl font-extrabold text-blue-600 tracking-tight">
          Mercova
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => handleNav(label)}
              className={`flex items-center gap-2.5 px-5 py-2.5 text-sm text-left transition-all border-r-2 ${
                activeNav === label
                  ? "bg-blue-50 text-blue-600 border-blue-600 font-semibold"
                  : "text-gray-500 border-transparent font-medium hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto px-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-7 py-3 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-extrabold text-gray-900">Settings</h2>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold">
            {user?.firstname?.[0]}
            {user?.lastname?.[0]}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            {/* Tab switcher */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
              {["profile", "security"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "profile" ? "👤 Profile" : "🔒 Security"}
                </button>
              ))}
            </div>

            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 mb-1">
                    Profile Information
                  </h3>
                  <p className="text-xs text-gray-500">
                    Update your name and title
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-extrabold">
                    {user?.firstname?.[0]}
                    {user?.lastname?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {user?.firstname} {user?.lastname}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    {user?.isSeller && (
                      <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
                        ✓ Seller
                      </span>
                    )}
                  </div>
                </div>

                <form
                  onSubmit={profileFormik.handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-600 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        value={profileFormik.values.firstname}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {profileFormik.touched.firstname &&
                        profileFormik.errors.firstname && (
                          <small className="text-red-500 mt-1">
                            {profileFormik.errors.firstname}
                          </small>
                        )}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-600 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        value={profileFormik.values.lastname}
                        onChange={profileFormik.handleChange}
                        onBlur={profileFormik.handleBlur}
                        className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {profileFormik.touched.lastname &&
                        profileFormik.errors.lastname && (
                          <small className="text-red-500 mt-1">
                            {profileFormik.errors.lastname}
                          </small>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="border border-gray-100 rounded-xl p-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                    <small className="text-gray-400 mt-1">
                      Email cannot be changed
                    </small>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">
                      Title / Profession
                    </label>
                    <select
                      name="title"
                      value={profileFormik.values.title}
                      onChange={profileFormik.handleChange}
                      onBlur={profileFormik.handleBlur}
                      className="border border-gray-200 rounded-xl p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select your title</option>
                      <option value="Content Creator">Content Creator</option>
                      <option value="Writer">Writer</option>
                      <option value="Song Writer">Song Writer</option>
                      <option value="Social Media Manager">
                        Social Media Manager
                      </option>
                      <option value="Tutor">Tutor</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={profileFormik.isSubmitting || profileLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
                  >
                    {profileLoading ? "Saving..." : "Save Changes"}
                  </button>
                </form>

                {!user?.isSeller && (
                  <div className="border border-dashed border-green-300 bg-green-50 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900 mb-1">
                        Want to sell on Mercova?
                      </h4>
                      <p className="text-xs text-gray-500">
                        Start earning by uploading your digital products.
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          await becomeSeller();
                          showToast("You are now a seller! 🎉");
                        } catch (err) {
                          showToast(err.message, "error");
                        }
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
                    >
                      Become a Seller
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 mb-1">
                      Change Password
                    </h3>
                    <p className="text-xs text-gray-500">
                      Choose a strong password to keep your account safe
                    </p>
                  </div>
                  <form
                    onSubmit={passwordFormik.handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    {[
                      {
                        name: "currentPassword",
                        label: "Current Password",
                        placeholder: "Enter current password",
                      },
                      {
                        name: "newPassword",
                        label: "New Password",
                        placeholder: "Enter new password",
                      },
                      {
                        name: "confirmPassword",
                        label: "Confirm New Password",
                        placeholder: "Confirm new password",
                      },
                    ].map((field) => (
                      <div key={field.name} className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">
                          {field.label}
                        </label>
                        <input
                          type="password"
                          name={field.name}
                          value={passwordFormik.values[field.name]}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                          placeholder={field.placeholder}
                          className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {passwordFormik.touched[field.name] &&
                          passwordFormik.errors[field.name] && (
                            <small className="text-red-500 mt-1">
                              {passwordFormik.errors[field.name]}
                            </small>
                          )}
                      </div>
                    ))}
                    <button
                      type="submit"
                      disabled={passwordFormik.isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
                    >
                      {passwordFormik.isSubmitting
                        ? "Changing..."
                        : "Change Password"}
                    </button>
                  </form>
                </div>

                {/* Log out */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 mb-1">
                      Log Out
                    </h3>
                    <p className="text-xs text-gray-500">
                      Sign out of your Mercova account on this device
                    </p>
                  </div>
                  <button
                    onClick={() => setLogoutModal(true)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
                  >
                    Log Out
                  </button>
                </div>

                {/* ── Danger Zone ── */}
                <div className="bg-white border-2 border-red-200 rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                        Permanently delete your account and all associated data.
                        This cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={() => setDeleteModal(true)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap ml-4"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Logout Modal ── */}
      {logoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">👋</div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                Log out of Mercova?
              </h3>
              <p className="text-sm text-gray-500">
                You'll need to log back in to access your account.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setLogoutModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl text-sm transition-colors"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Account Modal ── */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                Delete your account?
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                This will permanently delete your account and all data.{" "}
                <strong>This cannot be undone.</strong>
              </p>
            </div>
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-600 block mb-2">
                Type <span className="text-red-500 font-extrabold">DELETE</span>{" "}
                to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE here"
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || deleteLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
