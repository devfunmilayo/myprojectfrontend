import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

const Cart = () => {
  const { cartItems, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate("/buyer")}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Continue Shopping
        </button>
        <h1 className="text-xl font-extrabold text-blue-600">Mercova</h1>
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold">
          {user?.firstname?.[0]}{user?.lastname?.[0]}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Your Cart {cartItems.length > 0 && <span className="text-blue-600">({cartItems.length})</span>}
        </h2>

        {cartItems.length === 0 ? (
          // ── Empty state ──
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-6xl">🛒</div>
            <h3 className="text-lg font-extrabold text-gray-900">Your cart is empty</h3>
            <p className="text-sm text-gray-500">Browse the marketplace and add products you love</p>
            <button
              onClick={() => navigate("/buyer")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">

            {/* Cart items — left */}
            <div className="col-span-2 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${item.thumbClass} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-3xl">{item.icon}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.desc}</p>
                  </div>

                  {/* Price + remove */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-base font-extrabold text-gray-900">{item.price}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary — right */}
            <div className="col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 sticky top-24">
                <h3 className="text-base font-extrabold text-gray-900">Order Summary</h3>

                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 line-clamp-1 flex-1 mr-2">{item.title}</span>
                      <span className="text-xs font-bold text-gray-900">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-blue-600">${cartTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-sm transition-colors"
                >
                  Proceed to Checkout →
                </button>

                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>🔒</span> Secure checkout
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>⚡</span> Instant access after payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;