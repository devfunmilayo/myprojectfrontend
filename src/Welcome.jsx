import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const TRENDING = [
  {
    thumbClass: "from-slate-900 to-blue-800",
    badge: "COURSE", badgeClass: "bg-blue-100 text-blue-700",
    icon: "💵", rating: "4.9", reviews: "312",
    title: "From Grass to Grace",
    desc: "How to make 1 million in 1 month",
    price: "$50.00",
  },
  {
    thumbClass: "from-blue-900 to-sky-600",
    badge: "EBOOK", badgeClass: "bg-yellow-100 text-yellow-800",
    icon: "📘", rating: "5.0", reviews: "89",
    title: "The Solopreneur Playbook",
    desc: "A 150-page blueprint for building a solo empire on your own terms",
    price: "$39.00",
  },
  {
    thumbClass: "from-gray-900 to-gray-700",
    badge: "ASSETS", badgeClass: "bg-purple-100 text-purple-700",
    icon: "🎨", rating: "4.8", reviews: "204",
    title: "Elite UI Component Kit",
    desc: "500+ React & Figma components optimized for production use",
    price: "$89.00",
  },
  {
    thumbClass: "from-teal-700 to-emerald-800",
    badge: "GUIDE", badgeClass: "bg-green-100 text-green-700",
    icon: "✍️", rating: "4.9", reviews: "541",
    title: "Million Dollar Copywriting",
    desc: "Learn psychological triggers that make your copy convert like crazy",
    price: "$27.00",
  },
];

const Welcome = () => {
  const { user, finishOnboarding, becomeSeller } = useAuth();
  const navigate = useNavigate();

  const [wantToSell, setWantToSell] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartExploring = async () => {
    setLoading(true);
    try {
   
     if (wantToSell) {
  navigate("/seller");
} else {
  navigate("/buyer");
}
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">

      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-blue-600 tracking-tight">Mercova</h1>
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold">
          {user?.firstname?.[0]}{user?.lastname?.[0]}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-10">

        {/* Welcome Message */}
        <div className="text-center">
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Welcome to Mercova, <span className="text-blue-600">{user?.firstname}!</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
            You're joining 50,000+ creators and learners. <br /> Tell us how you'd like to use Mercova <br />
             You can always change this later.
          </p>
        </div>

        {/* Intent Cards */}
        <div className="grid grid-cols-2 gap-4">

          {/* Buy Card — always selected, can't deselect */}
          <div className="bg-white border-2 border-blue-600 rounded-2xl p-6 flex flex-col gap-3 relative">
            {/* Selected checkmark */}
            <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">🛒</div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 mb-1">I want to Buy</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Browse and purchase premium digital products — eBooks, courses, templates and more.
              </p>
            </div>
            <span className="text-xs text-blue-600 font-bold">Always included ✓</span>
          </div>

          {/* Sell Card — toggle */}
          <div
            onClick={() => setWantToSell(!wantToSell)}
            className={`bg-white border-2 rounded-2xl p-6 flex flex-col gap-3 relative cursor-pointer transition-all ${
              wantToSell
                ? "border-green-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* Checkmark when selected */}
            {wantToSell && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${wantToSell ? "bg-green-50" : "bg-gray-50"}`}>
              💰
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 mb-1">I want to Sell</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Upload and sell your own digital products — eBooks, courses, templates and more.
              </p>
            </div>
            <span className={`text-xs font-bold ${wantToSell ? "text-green-600" : "text-gray-400"}`}>
              {wantToSell ? "Selected ✓" : "Click to add"}
            </span>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-xs text-gray-400">
          You can always enable selling later from your profile settings.
        </p>

        {/* Trending Products */}
        <div>
            <div className="flex flex-row">
                <img src="/trending.png" alt="" width={30} className="mb-2"/>
            <h2 className="text-base font-extrabold text-gray-900 mt-2 tracking-tight">
            &nbsp;Trending right now
            </h2>
            </div>
            

          <div className="grid grid-cols-4 gap-3">
            {TRENDING.map((p) => (
              <div
                key={p.title}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
              >
                <div className={`h-24 bg-gradient-to-br ${p.thumbClass} flex items-center justify-center relative`}>
                  <span className={`absolute top-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${p.badgeClass}`}>
                    {p.badge}
                  </span>
                  <span className="text-3xl">{p.icon}</span>
                </div>
                <div className="p-3">
                  <div className="text-amber-400 text-xs font-bold mb-1">
                    ★ {p.rating} <span className="text-gray-400 font-normal">· {p.reviews}</span>
                  </div>
                  <div className="text-xs font-bold text-gray-900 mb-1 leading-snug line-clamp-1">{p.title}</div>
                  <div className="text-xs text-gray-500 mb-2 line-clamp-1">{p.desc}</div>
                  <span className="text-sm font-extrabold text-gray-900">{p.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStartExploring}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Setting up your account..." : "Start Exploring Mercova →"}
        </button>

      </div>
    </div>
  );
};

export default Welcome;