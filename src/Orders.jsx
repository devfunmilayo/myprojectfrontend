import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Same products list so we can match productId to product details
const ALL_PRODUCTS = [
  {
    id: "1",
    icon: "💵",
    title: "From Grass to Grace",
    badge: "COURSE",
    badgeClass: "bg-blue-100 text-blue-700",
    thumbClass: "from-slate-900 to-blue-800",
    price: "$50.00",
  },
  {
    id: "2",
    icon: "📘",
    title: "The Solopreneur Playbook",
    badge: "EBOOK",
    badgeClass: "bg-yellow-100 text-yellow-800",
    thumbClass: "from-blue-900 to-sky-600",
    price: "$39.00",
  },
  {
    id: "3",
    icon: "🎨",
    title: "Elite UI Component Kit",
    badge: "ASSETS",
    badgeClass: "bg-purple-100 text-purple-700",
    thumbClass: "from-gray-900 to-gray-700",
    price: "$89.00",
  },
  {
    id: "4",
    icon: "✍️",
    title: "Million Dollar Copywriting",
    badge: "GUIDE",
    badgeClass: "bg-green-100 text-green-700",
    thumbClass: "from-teal-700 to-emerald-800",
    price: "$27.00",
  },
];

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
  // {
  //   label: "My Library",
  //   icon: (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>),
  // },
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

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNav = (label) => {
    setActiveNav(label);
    if (label === "Discover") navigate("/buyer");
    // if (label === "My Library") navigate("/library");
    if (label === "Profile") navigate("/settings");
  };

  // ── Fetch orders from backend ─────────────────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("mercova_token");
        const res = await fetch(
  `${import.meta.env.VITE_API_URL}/orders/my-purchases`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Could not fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Match order productId to full product details
  const getProduct = (productId) =>
    ALL_PRODUCTS.find((p) => p.id === productId) || null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
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
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-7 py-3 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">My Orders</h2>
            <p className="text-xs text-gray-400">
              {loading
                ? "Loading..."
                : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/settings")}
              className="w-9 h-9 border border-gray-200 rounded-xl bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              ⚙️
            </button>
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold uppercase">
              {user?.firstname?.[0]}
              {user?.lastname?.[0]}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-7">
          {/* Loading state */}
          {loading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="text-6xl">📭</div>
              <h3 className="text-lg font-extrabold text-gray-900">
                No orders yet
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-xs">
                You haven't purchased anything yet. Browse the marketplace and
                find something you love!
              </p>
              <button
                onClick={() => navigate("/buyer")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Browse Marketplace
              </button>
            </div>
          )}

          {/* Orders list */}
          {!loading && orders.length > 0 && (
            <div className="flex flex-col gap-4 max-w-3xl">
              {orders.map((order) => {
                const product = getProduct(order.productId);
                return (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-5"
                  >
                    {/* Product thumbnail */}
                    {product ? (
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${product.thumbClass} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="text-2xl">{product.icon}</span>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📦</span>
                      </div>
                    )}

                    {/* Order info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {product && (
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${product.badgeClass}`}
                          >
                            {product.badge}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 font-mono">
                          {order.id}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">
                        {product
                          ? product.title
                          : `Product #${order.productId}`}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Amount + status */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-base font-extrabold text-gray-900">
                        ${order.amount.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                        ✓ Completed
                      </span>
                    </div>

                    {/* View product button */}
                    {/* {product && (
                      // <button
                      //   onClick={() => navigate(`/product/${product.id}`)}
                      //   className="ml-2 text-xs text-blue-600 font-bold hover:underline whitespace-nowrap"
                      // >
                      //   View →
                      // </button>
                    )} */}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
