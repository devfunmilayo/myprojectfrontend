import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Ordersuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">

        {/* Success animation */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Payment Successful! 🎉
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Thank you, <strong>{user?.firstname}</strong>! Your purchase is complete.
        </p>
        <p className="text-gray-400 text-xs mb-8">
          A receipt has been sent to <strong>{user?.email}</strong>
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/library")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-sm transition-colors"
          >
            Go to My Library →
          </button>
          <button
            onClick={() => navigate("/buyer")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl text-sm transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ordersuccess;