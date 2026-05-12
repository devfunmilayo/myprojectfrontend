import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import { useState, useEffect } from "react";

// ── Hardcoded products (same as Buyer.jsx) ────────────────────────────────────
const HARDCODED_PRODUCTS = [
  {
    id: "1",
    thumbClass: "from-slate-900 to-blue-800",
    badge: "COURSE",
    badgeClass: "bg-blue-100 text-blue-700",
    icon: "💵",
    rating: "4.9",
    reviews: "312",
    title: "From Grass to Grace",
    desc: "How to make 1 million in 1 month",
    fullDesc:
      "This comprehensive course walks you through proven strategies used by top entrepreneurs to scale their income from zero to seven figures. Packed with real-world case studies, actionable frameworks, and step-by-step blueprints you can apply immediately.",
    price: "$50.00",
    priceNum: 50,
    seller: "Tunde Adeniji",
    sellerTitle: "Business Coach",
    includes: [
      "12 hours of video content",
      "Downloadable workbook (PDF)",
      "Private community access",
      "Certificate of completion",
    ],
  },
  {
    id: "2",
    thumbClass: "from-blue-900 to-sky-600",
    badge: "EBOOK",
    badgeClass: "bg-yellow-100 text-yellow-800",
    icon: "📘",
    rating: "5.0",
    reviews: "89",
    title: "The Solopreneur Playbook",
    desc: "A 150-page blueprint for building a solo empire on your own terms",
    fullDesc:
      "A 150-page deep-dive into building a one-person business that generates consistent income. Covers productizing your skills, finding clients, pricing, marketing, and scaling — all without hiring a team.",
    price: "$39.00",
    priceNum: 39,
    seller: "Amaka Obi",
    sellerTitle: "Content Creator & Strategist",
    includes: [
      "150-page PDF eBook",
      "Bonus: Pricing calculator template",
      "Bonus: 30-day action plan",
    ],
  },
  {
    id: "3",
    thumbClass: "from-gray-900 to-gray-700",
    badge: "ASSETS",
    badgeClass: "bg-purple-100 text-purple-700",
    icon: "🎨",
    rating: "4.8",
    reviews: "204",
    title: "Elite UI Component Kit",
    desc: "500+ React & Figma components optimized for production use",
    fullDesc:
      "A premium collection of 500+ production-ready React and Figma components. Includes design tokens, dark mode support, and detailed documentation for every component.",
    price: "$89.00",
    priceNum: 89,
    seller: "Seun Adeyemi",
    sellerTitle: "UI/UX Designer",
    includes: [
      "500+ React components",
      "Figma source file",
      "Dark mode variants",
      "Documentation site access",
      "Lifetime updates",
    ],
  },
  {
    id: "4",
    thumbClass: "from-teal-700 to-emerald-800",
    badge: "GUIDE",
    badgeClass: "bg-green-100 text-green-700",
    icon: "✍️",
    rating: "4.9",
    reviews: "541",
    title: "Million Dollar Copywriting",
    desc: "Learn psychological triggers that make your copy convert like crazy",
    fullDesc:
      "Master the art of persuasive writing with this battle-tested guide. Learn the exact psychological triggers, headline formulas, and storytelling frameworks used by the world's highest-paid copywriters.",
    price: "$27.00",
    priceNum: 27,
    seller: "Chioma Nwosu",
    sellerTitle: "Copywriter & Marketing Consultant",
    includes: [
      "120-page PDF guide",
      "50 proven headline templates",
      "Email swipe file",
      "Sales page checklist",
    ],
  },
];

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
    icon: "📦",
  },
};

const Productdetail = () => {
  const { toggleCart, isInCart, addToCart, cartCount } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDb, setIsDb] = useState(false);

  useEffect(() => {
    // ── First check hardcoded products ────────────────────────────────────────
    const hardcoded = HARDCODED_PRODUCTS.find((p) => p.id === id);
    if (hardcoded) {
      setProduct(hardcoded);
      setIsDb(false);
      setLoading(false);
      return;
    }

    // ── Otherwise fetch from MongoDB by _id ───────────────────────────────────
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("mercova_token");
        const res = await fetch(
          `import.meta.env.VITE_API_URL/seller/product/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
          setIsDb(true);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Could not fetch product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">⏳</div>
          <p className="text-sm text-gray-500 font-semibold">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Product not found
          </h2>
          <button
            onClick={() => navigate("/buyer")}
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            ← Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  // ── Normalise fields between hardcoded and DB products ─────────────────────
  const style = isDb
    ? categoryStyles[product.category] || categoryStyles.guide
    : null;
  const thumbClass = isDb ? style.thumb : product.thumbClass;
  const badgeClass = isDb ? style.badge : product.badgeClass;
  const badgeLabel = isDb ? product.category.toUpperCase() : product.badge;
  const icon = isDb ? style.icon : product.icon;
  const fullDesc = isDb ? product.description : product.fullDesc;
  const sellerName = isDb ? product.sellerName : product.seller;
  const sellerTitle = isDb ? product.category : product.sellerTitle;
  const priceNum = isDb ? product.price : product.priceNum;
  const priceStr = isDb ? `$${product.price.toFixed(2)}` : product.price;
  const includes = isDb
    ? [
        `Access to ${product.type === "course" ? "all course videos" : "download file"}`,
        "Lifetime access",
        "Instant delivery",
      ]
    : product.includes;

  // Cart item format
  const cartItem = {
    id: isDb ? product._id : product.id,
    title: product.title,
    desc: isDb ? product.description : product.desc,
    price: priceStr,
    priceNum,
    icon,
    badge: badgeLabel,
    badgeClass,
    thumbClass,
  };

  const inCart = isInCart(cartItem.id);

  const handleBuyNow = () => {
    addToCart(cartItem);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate("/buyer")}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-semibold transition-colors"
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
          Back to Marketplace
        </button>

        <h1 className="text-xl font-extrabold text-blue-600">Mercova</h1>

        <div className="flex items-center gap-3">
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
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold uppercase">
            {user?.firstname?.[0]}
            {user?.lastname?.[0]}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-10">
        <div className="grid grid-cols-3 gap-8">
          {/* Left */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* Thumbnail */}
            <div
              className={`w-full h-64 bg-gradient-to-br ${thumbClass} rounded-2xl flex items-center justify-center relative overflow-hidden`}
            >
              <span
                className={`absolute top-4 left-4 text-xs font-extrabold px-3 py-1 rounded-full ${badgeClass}`}
              >
                {badgeLabel}
              </span>
              {isDb && product.thumbnailUrl ? (
                <img
                  src={product.thumbnailUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-7xl">{icon}</span>
              )}
            </div>

            {/* Title + meta */}
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold">
                  {sellerName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {sellerName}
                  </p>
                  <p className="text-xs text-gray-500">{sellerTitle}</p>
                </div>
              </div>

              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="text-amber-400 text-sm">
                      ★
                    </span>
                  ))}
                  <span className="text-sm font-bold text-gray-900">
                    {product.rating}
                  </span>
                  <span className="text-sm text-gray-400">
                    · {product.reviews} reviews
                  </span>
                </div>
              )}

              <p className="text-sm text-gray-600 leading-relaxed">
                {fullDesc}
              </p>
            </div>

            {/* What's included */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-base font-extrabold text-gray-900 mb-4">
                What's included
              </h3>
              <div className="flex flex-col gap-3">
                {includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — purchase card */}
          <div className="col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 sticky top-24">
              <div>
                <span className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
                  Price
                </span>
                <div className="text-3xl font-extrabold text-gray-900 mt-1">
                  {priceStr}
                </div>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-sm transition-colors"
              >
                Buy Now
              </button>

              <button
                onClick={() => toggleCart(cartItem)}
                className={`w-full font-extrabold py-3.5 rounded-xl text-sm transition-all border-2 ${
                  inCart
                    ? "bg-red-50 border-red-400 text-red-500 hover:bg-red-100"
                    : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
                }`}
              >
                {inCart ? "✕ Remove from Cart" : "+ Add to Cart"}
              </button>

              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  🔒 Secure checkout
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  ⚡ Instant access after purchase
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  🔄 Lifetime updates
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productdetail;
