import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";

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

// ── Hardcoded featured products (always visible) ──────────────────────────────
const FEATURED_PRODUCTS = [
  {
    id: "1",
    isHardcoded: true,
    thumbClass: "from-slate-900 to-blue-800",
    badge: "COURSE",
    badgeClass: "bg-blue-100 text-blue-700",
    icon: "💵",
    rating: "4.9",
    reviews: "312",
    title: "From Grass to Grace",
    desc: "How to make 1 million in 1 month",
    price: "$50.00",
    priceNum: 50,
  },
  {
    id: "2",
    isHardcoded: true,
    thumbClass: "from-blue-900 to-sky-600",
    badge: "EBOOK",
    badgeClass: "bg-yellow-100 text-yellow-800",
    icon: "📘",
    rating: "5.0",
    reviews: "89",
    title: "The Solopreneur Playbook",
    desc: "A 150-page blueprint for building a solo empire on your own terms",
    price: "$39.00",
    priceNum: 39,
  },
  {
    id: "3",
    isHardcoded: true,
    thumbClass: "from-gray-900 to-gray-700",
    badge: "ASSETS",
    badgeClass: "bg-purple-100 text-purple-700",
    icon: "🎨",
    rating: "4.8",
    reviews: "204",
    title: "Elite UI Component Kit",
    desc: "500+ React & Figma components optimized for production use",
    price: "$89.00",
    priceNum: 89,
  },
  {
    id: "4",
    isHardcoded: true,
    thumbClass: "from-teal-700 to-emerald-800",
    badge: "GUIDE",
    badgeClass: "bg-green-100 text-green-700",
    icon: "✍️",
    rating: "4.9",
    reviews: "541",
    title: "Million Dollar Copywriting",
    desc: "Learn psychological triggers that make your copy convert like crazy",
    price: "$27.00",
    priceNum: 27,
  },
];

// ── Category styles for DB products ──────────────────────────────────────────
const categoryStyles = {
  ebook: {
    badge: "bg-yellow-100 text-yellow-800",
    thumb: "from-blue-900 to-sky-600",
    icon: "📘",
  },
  course: {
    badge: "bg-blue-100 text-blue-700",
    thumb: "from-slate-900 to-blue-800",
    icon: "🎓",
  },
  template: {
    badge: "bg-purple-100 text-purple-700",
    thumb: "from-gray-900 to-gray-700",
    icon: "🎨",
  },
  guide: {
    badge: "bg-green-100 text-green-700",
    thumb: "from-teal-700 to-emerald-800",
    icon: "✍️",
  },
  assets: {
    badge: "bg-pink-100 text-pink-700",
    thumb: "from-gray-900 to-gray-700",
    icon: "🎨",
  },
};

const Buyer = () => {
  const { addToCart, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [dbProducts, setDbProducts] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [subEmail, setSubEmail] = useState("");
  const [subMsg, setSubMsg] = useState("");

  useEffect(() => {
    if (user?.isNewUser) navigate("/welcome");
  }, [user]);

  // ── Fetch seller-uploaded products from MongoDB ────────────────────────────
  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const token = localStorage.getItem("mercova_token");
        const res = await fetch(
          "import.meta.env.VITE_API_URL/seller/all-products",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        setDbProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Could not fetch products:", err);
      } finally {
        setLoadingDb(false);
      }
    };
    fetchDbProducts();
  }, []);

  // ── Combine hardcoded + DB products for search ────────────────────────────
  const allProducts = [
    ...FEATURED_PRODUCTS.map((p) => ({ ...p, _type: "hardcoded" })),
    ...dbProducts.map((p) => ({ ...p, _type: "db" })),
  ];

  const searchResults = searchQuery.trim()
    ? allProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.desc || p.description || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (p.badge || p.category || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
    : [];

  // ── Newsletter ─────────────────────────────────────────────────────────────
  const handleSubscribe = async () => {
    if (!subEmail) return;
    const res = await fetch(
      "import.meta.env.VITE_API_URL/newsletter/subscribe",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail }),
      },
    );
    const data = await res.json();
    setSubMsg(data.message);
    setSubEmail("");
  };

  // ── Convert DB product to cart item format ─────────────────────────────────
  const dbToCartItem = (p) => ({
    id: p._id,
    title: p.title,
    desc: p.description,
    price: `$${p.price.toFixed(2)}`,
    priceNum: p.price,
    icon: categoryStyles[p.category]?.icon || "📦",
    badge: p.category.toUpperCase(),
    badgeClass:
      categoryStyles[p.category]?.badge || "bg-gray-100 text-gray-600",
    thumbClass:
      categoryStyles[p.category]?.thumb || "from-gray-700 to-gray-900",
  });

  // ── Render a single product card (works for both hardcoded and DB) ─────────
  const ProductCard = ({ p }) => {
    const isDb = p._type === "db";
    const style = isDb
      ? categoryStyles[p.category] || categoryStyles.guide
      : null;
    const cartItem = isDb ? dbToCartItem(p) : p;
    const productId = isDb ? p._id : p.id;
    const thumbClass = isDb ? style.thumb : p.thumbClass;
    const badgeClass = isDb ? style.badge : p.badgeClass;
    const badgeLabel = isDb ? p.category.toUpperCase() : p.badge;
    const icon = isDb ? style.icon : p.icon;
    const title = p.title;
    const desc = isDb ? p.description : p.desc;
    const price = isDb ? `$${p.price.toFixed(2)}` : p.price;
    const rating = p.rating || null;
    const reviews = p.reviews || null;

    return (
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all">
        <div
          onClick={() => navigate(`/product/${productId}`)}
          className={`h-28 bg-gradient-to-br ${thumbClass} flex items-center justify-center relative overflow-hidden`}
        >
          <span
            className={`absolute top-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${badgeClass}`}
          >
            {badgeLabel}
          </span>
          {isDb && p.thumbnailUrl ? (
            <img
              src={p.thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl">{icon}</span>
          )}
        </div>
        <div className="p-3">
          {rating && (
            <div className="text-amber-400 text-xs font-bold mb-1">
              ★ {rating}{" "}
              <span className="text-gray-400 font-normal">
                · {reviews} reviews
              </span>
            </div>
          )}
          <div className="text-sm font-bold text-gray-900 mb-1 leading-snug">
            {title}
          </div>
          <div className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">
            {desc}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold block">
                Price
              </span>
              <span className="text-base font-extrabold text-gray-900">
                {price}
              </span>
            </div>
            <button
              onClick={() => addToCart(cartItem)}
              className="w-8 h-8 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center justify-center text-sm transition-colors"
            >
              🛒
            </button>
          </div>
        </div>
      </div>
    );
  };

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
              onClick={() => {
                setActiveNav(label);
                if (label === "Profile") navigate("/settings");
                if (label === "Orders") navigate("/orders");
              }}
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

          {/* ✅ Seller Dashboard link — only shows if user is a seller */}
          {user?.isSeller && (
            <button
              onClick={() => navigate("/seller")}
              className="flex items-center gap-2.5 px-5 py-2.5 text-sm text-left transition-all border-r-2 border-transparent text-green-600 font-semibold hover:bg-green-50"
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Seller Dashboard
            </button>
          )}
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
        <header className="bg-white border-b border-gray-200 px-7 py-3 flex items-center gap-3 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search products by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-800 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="w-9 h-9 border border-gray-200 rounded-xl bg-white flex items-center justify-center relative hover:bg-gray-50 transition-colors"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="w-9 h-9 border p-1 border-gray-200 rounded-xl bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
              <img src="/notify.png" alt="notifications" />
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="w-9 h-9 p-1 border border-gray-200 rounded-xl bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <img src="/setting.png" alt="settings" />
            </button>
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold cursor-pointer uppercase">
              {user?.firstname?.[0]}
              {user?.lastname?.[0]}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-7">
          {/* ── SEARCH RESULTS VIEW ── */}
          {searchQuery.trim() ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-extrabold text-gray-900">
                  Results for "
                  <span className="text-blue-600">{searchQuery}</span>"
                  <span className="text-gray-400 font-normal ml-2 text-sm">
                    ({searchResults.length} found)
                  </span>
                </h2>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-gray-400 hover:text-gray-700 font-semibold"
                >
                  Clear ✕
                </button>
              </div>
              {searchResults.length === 0 ? (
                <div className="flex flex-col items-center py-20 gap-3">
                  <div className="text-5xl">🔍</div>
                  <p className="text-base font-bold text-gray-900">
                    No products found
                  </p>
                  <p className="text-sm text-gray-500">
                    Try a different search term
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {searchResults.map((p, i) => (
                    <ProductCard key={p.id || p._id || i} p={p} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // ── NORMAL DISCOVER VIEW ──
            <>
              {/* Hero */}
              <div
                className="rounded-2xl p-9 flex items-center relative overflow-hidden min-h-[300px]"
                style={{
                  background:
                    "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)",
                }}
              >
                <div className="py-6">
                  <h1 className="text-3xl font-extrabold text-white leading-tight mb-3 tracking-tight">
                    Level up with{" "}
                    <span className="text-amber-400">Premium</span>
                    <br />
                    Digital Assets
                  </h1>
                  <p className="text-slate-400 text-sm mb-6 max-w-sm leading-relaxed">
                    Access high-converting PDF templates, expert-led video
                    courses, and exclusive eBooks curated by the world's top 1%
                    creators.
                  </p>
                  {/* <div className="flex gap-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
                      Browse Library
                    </button>
                    <button className="bg-transparent text-white text-sm font-semibold px-5 py-2.5 rounded-xl border border-white/25 hover:bg-white/10 transition-colors">
                      See Trending
                    </button>
                  </div> */}
                </div>
              </div>

              {/* Browse Categories */}
              <div>
                <h2 className="text-base font-extrabold text-gray-900 tracking-tight mb-1">
                  Browse Categories
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                  Curated collections for every growth stage
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    className="rounded-2xl p-4 cursor-pointer flex flex-col justify-end min-h-[120px] hover:-translate-y-1 transition-transform"
                    style={{
                      background: "linear-gradient(135deg, #134E4A, #0F766E)",
                    }}
                  >
                    <img src="/masterclass.png" alt="" width={60} />
                    <h3 className="text-white text-sm font-extrabold mb-1">
                      Masterclass Courses
                    </h3>
                    <p className="text-white/70 text-xs">
                      240+ Interactive Modules
                    </p>
                  </div>
                  <div
                    className="rounded-2xl p-6 cursor-pointer flex flex-col justify-end min-h-[120px] hover:-translate-y-1 transition-transform"
                    style={{
                      background: "linear-gradient(135deg, #1E3A5F, #1D4ED8)",
                    }}
                  >
                    <img src="/ebook.png" alt="" width={70} />
                    <h3 className="text-white text-sm font-extrabold mt-1 mb-1">
                      Premium eBooks
                    </h3>
                    <p className="text-white/70 text-xs">
                      1,200+ Best-selling titles
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="bg-[#004ef4] rounded-2xl p-4 cursor-pointer flex flex-col items-start flex-1 hover:-translate-y-1 transition-transform">
                      <img src="/pdf.png" alt="" width={30} />
                      <h3 className="text-white text-xs pt-1 font-extrabold">
                        PDF Resources
                      </h3>
                      <p className="text-white/70 text-xs mt-0.5">
                        Cheat sheets &amp; guides
                      </p>
                    </div>
                    <div className="bg-[#ffc32a] rounded-2xl p-4 cursor-pointer flex flex-col items-start flex-1 hover:-translate-y-1 transition-transform">
                      <img src="/uiux.png" alt="" width={30} />
                      <h3 className="text-amber-900 text-xs font-extrabold">
                        UI Templates
                      </h3>
                      <p className="text-amber-900/70 text-xs mt-0.5">
                        Figma &amp; Web assets
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Featured Products (hardcoded, always visible) ── */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <img src="/trending.png" alt="" width={26} />
                  <h2 className="text-base font-extrabold text-gray-900">
                    Trending Now
                  </h2>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {FEATURED_PRODUCTS.map((p) => (
                    <ProductCard key={p.id} p={{ ...p, _type: "hardcoded" }} />
                  ))}
                </div>
              </div>

              {/* ── New from Sellers (from MongoDB) ── */}
              {!loadingDb && dbProducts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-extrabold text-gray-900">
                      🆕 New from Creators
                      <span className="text-gray-400 font-normal text-sm ml-2">
                        ({dbProducts.length})
                      </span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {dbProducts.map((p) => (
                      <ProductCard key={p._id} p={{ ...p, _type: "db" }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Loading skeleton for DB products */}
              {loadingDb && (
                <div>
                  <h2 className="text-base font-extrabold text-gray-900 mb-4">
                    🆕 New from Creators
                  </h2>
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse"
                      >
                        <div className="h-28 bg-gray-100" />
                        <div className="p-3 flex flex-col gap-2">
                          <div className="h-3 bg-gray-100 rounded w-3/4" />
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 flex items-center gap-8">
                <div className="flex-1">
                  <h2 className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    Join 50,000+ creators getting our weekly digest
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Get the latest trends, free digital assets, and exclusive
                    discounts every Monday.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      onClick={handleSubscribe}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
                    >
                      Subscribe
                    </button>
                  </div>
                  {subMsg && (
                    <p className="text-green-600 text-xs mt-2 font-semibold">
                      {subMsg}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Buyer;
