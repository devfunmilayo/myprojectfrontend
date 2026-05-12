import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

// ── Convert USD to NGN (rough rate — update as needed) ────────────────────────
// Or just price your products in NGN directly
const USD_TO_NGN = 1600;

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);

  // ✅ Fix: navigate in useEffect not during render
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems]);

  // ── Total in NGN kobo (Paystack requirement) ───────────────────────────────
  const totalInNGN = cartTotal * USD_TO_NGN;
  const totalInKobo = Math.round(totalInNGN * 100);

  // ── Paystack config ────────────────────────────────────────────────────────
  const config = {
    reference: `mercova_${Date.now()}`,
    email: user?.email || "",
    amount: totalInKobo,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
    currency: "NGN",
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: `${user?.firstname} ${user?.lastname}`,
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  // ── Payment success ────────────────────────────────────────────────────────
  const onSuccess = async (reference) => {
    setPaying(true);
    try {
      const token = localStorage.getItem("mercova_token");
      for (const item of cartItems) {
        await fetch(import.meta.env.VITE_API_URL/orders, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: item.id,
            amount: item.priceNum,
            paystackReference: reference.reference,
          }),
        });
      }
      clearCart();
      navigate("/order-success");
    } catch (err) {
      console.error("Order save error:", err);
    } finally {
      setPaying(false);
    }
  };

  const onClose = () => console.log("Payment closed");

  // ── Guard: show nothing while redirecting ─────────────────────────────────
  if (cartItems.length === 0) return null;

  console.log("Key:", import.meta.env.VITE_PAYSTACK_PUBLIC_KEY);
  console.log("Amount:", totalInKobo);
  console.log("Email:", user?.email);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate("/cart")}
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
          Back to Cart
        </button>
        <h1 className="text-xl font-extrabold text-blue-600">Mercova</h1>
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold uppercase">
          {user?.firstname?.[0]}
          {user?.lastname?.[0]}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Checkout
        </h2>

        <div className="grid grid-cols-3 gap-8">
          {/* Left */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* Contact info */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-base font-extrabold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-500 mb-1">
                    First Name
                  </label>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm text-gray-700 font-medium">
                    {user?.firstname}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-500 mb-1">
                    Last Name
                  </label>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm text-gray-700 font-medium">
                    {user?.lastname}
                  </div>
                </div>
              </div>
              <div className="flex flex-col mt-4">
                <label className="text-xs font-semibold text-gray-500 mb-1">
                  Email Address
                </label>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm text-gray-700 font-medium">
                  {user?.email}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Your receipt and download links will be sent to this email.
              </p>
            </div>

            {/* Order items */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-base font-extrabold text-gray-900 mb-4">
                Order Items
              </h3>
              <div className="flex flex-col gap-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.thumbClass} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        {item.title}
                      </p>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeClass}`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-gray-900">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: "🔒",
                  title: "Secure Payment",
                  desc: "256-bit SSL encryption",
                },
                {
                  icon: "⚡",
                  title: "Instant Access",
                  desc: "Get your files immediately",
                },
                {
                  icon: "🔄",
                  title: "Lifetime Updates",
                  desc: "Free updates forever",
                },
              ].map((badge) => (
                <div
                  key={badge.title}
                  className="bg-white border border-gray-200 rounded-xl p-4 text-center"
                >
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <h4 className="text-xs font-extrabold text-gray-900 mb-1">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-gray-400">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — order summary */}
          <div className="col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 sticky top-24">
              <h3 className="text-base font-extrabold text-gray-900">
                Order Summary
              </h3>

              <div className="flex flex-col gap-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-gray-500 line-clamp-1 flex-1 mr-2">
                      {item.title}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Total (USD)</span>
                  <span className="text-sm font-bold text-gray-900">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Total (NGN)</span>
                  <span className="text-xl font-extrabold text-blue-600">
                    ₦{totalInNGN.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* ✅ Fixed Paystack button */}
              <button
                onClick={() => initializePayment({ onSuccess, onClose })}
                disabled={paying || !import.meta.env.VITE_PAYSTACK_PUBLIC_KEY}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {paying ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Pay ₦{totalInNGN.toLocaleString()} with Paystack</>
                )}
              </button>

              {/* Show warning if key is missing */}
              {!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY && (
                <p className="text-xs text-red-500 text-center font-semibold">
                  ⚠️ Paystack key missing in .env
                </p>
              )}

              <p className="text-xs text-gray-400 text-center">
                By completing this purchase you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
