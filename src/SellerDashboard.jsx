import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    productsLive: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !user.isSeller) {
      navigate("/buyer");
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("mercova_token");
        const res = await fetch("import.meta.env.VITE_API_URL/seller/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data.stats);
          setRecentSales(data.recentSales);
        }
      } catch (err) {
        console.error("Could not fetch seller stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const navItems = [
    {
      label: "Dashboard",
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
    {
      label: "My Products",
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      label: "Upload Product",
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      label: "Marketplace",
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
      label: "Settings",
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const handleNav = (label) => {
    setActiveNav(label);
    if (label === "Marketplace") navigate("/buyer");
    if (label === "Settings") navigate("/settings");
    if (label === "Upload Product") navigate("/seller/upload");
    if (label === "My Products") navigate("/seller/products");
  };

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: "💰",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Total Sales",
      value: stats.totalSales,
      icon: "🛒",
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Products Live",
      value: stats.productsLive,
      icon: "📦",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-52 min-w-[208px] bg-white border-r border-gray-200 flex flex-col py-6">
        <div className="px-5 pb-2 text-xl font-extrabold text-blue-600 tracking-tight">
          Mercova
        </div>
        <div className="px-5 pb-5">
          <span className="text-[10px] font-extrabold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            ✓ Seller Account
          </span>
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
        <div className="mt-auto px-4 flex flex-col gap-2">
          <button
            onClick={() => navigate("/seller/upload")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
          >
            + Upload Product
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-7 py-3 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              Good day, {user?.firstname}! 👋
            </h2>
            <p className="text-xs text-gray-400">
              Here's what's happening with your store
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/settings")}
              className="w-9 h-9 border border-gray-200 rounded-xl bg-white flex items-center justify-center hover:bg-gray-50 transition-colors text-base"
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
        <div className="flex-1 overflow-y-auto p-7 flex flex-col gap-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}
                >
                  {card.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">
                    {card.label}
                  </p>
                  <p className={`text-2xl font-extrabold ${card.text}`}>
                    {loading ? "—" : card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Recent sales */}
            <div className="col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-extrabold text-gray-900">
                  Recent Sales
                </h3>
                <span className="text-xs text-gray-400">
                  Last 10 transactions
                </span>
              </div>

              {loading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-12 bg-gray-50 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : recentSales.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="text-4xl">📊</div>
                  <p className="text-sm font-bold text-gray-900">
                    No sales yet
                  </p>
                  <p className="text-xs text-gray-400 text-center">
                    Upload your product and start earning!
                  </p>
                  <button
                    onClick={() => navigate("/seller/upload")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors mt-1"
                  >
                    Upload Product →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Table header */}
                  <div className="grid grid-cols-4 gap-4 px-3 py-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Product
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Amount
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Date
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      Status
                    </span>
                  </div>
                  {recentSales.map((sale, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-4 gap-4 px-3 py-3 bg-gray-50 rounded-xl items-center"
                    >
                      <span className="text-sm font-bold text-gray-900 truncate">
                        {sale.productTitle}
                      </span>
                      <span className="text-sm font-extrabold text-blue-600">
                        ${sale.amount}
                      </span>
                      <span className="text-xs text-gray-500">{sale.date}</span>
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full w-fit">
                        ✓ Completed
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="col-span-1 flex flex-col gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-base font-extrabold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => navigate("/seller/upload")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <span>+</span> Upload Product
                  </button>
                  <button
                    onClick={() => navigate("/seller/products")}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors"
                  >
                    View My Products
                  </button>
                  <button
                    onClick={() => navigate("/buyer")}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors"
                  >
                    Browse Marketplace
                  </button>
                </div>
              </div>

              {/* Seller tip */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5">
                <div className="text-2xl mb-3">💡</div>
                <h4 className="text-white font-extrabold text-sm mb-2">
                  Seller Tip
                </h4>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Products with detailed descriptions and clear thumbnails sell
                  3x more. Take time to write a great description!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
