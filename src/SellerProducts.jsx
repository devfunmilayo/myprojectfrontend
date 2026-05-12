import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const SellerProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── Fetch seller's products ────────────────────────────────────────────────
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = localStorage.getItem("mercova_token");
       const res = await fetch(
  `${import.meta.env.VITE_API_URL}/seller/products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  // ── Delete product ─────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("mercova_token");
      const res = await fetch(
  `${import.meta.env.VITE_API_URL}/seller/products/${id}`,
  {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  },
);
      if (!res.ok) throw new Error("Could not delete");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteId(null);
      showToast("Product deleted successfully");
    } catch (err) {
      showToast("Could not delete product");
    }
  };

  const categoryColors = {
    ebook: "bg-yellow-100 text-yellow-800",
    course: "bg-blue-100 text-blue-700",
    template: "bg-purple-100 text-purple-700",
    guide: "bg-green-100 text-green-700",
    assets: "bg-pink-100 text-pink-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-500 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg">
          ✅ {toast}
        </div>
      )}

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
        <button
          onClick={() => navigate("/seller/upload")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
        >
          + Upload New
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              My Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {loading
                ? "Loading..."
                : `${products.length} product${products.length !== 1 ? "s" : ""} listed`}
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse h-24"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-6xl">📦</div>
            <h3 className="text-lg font-extrabold text-gray-900">
              No products yet
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Upload your product and start earning on Mercova!
            </p>
            <button
              onClick={() => navigate("/seller/upload")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Upload Your First Product
            </button>
          </div>
        )}

        {/* Products list */}
        {!loading && products.length > 0 && (
          <div className="flex flex-col gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-5"
              >
                {/* Thumbnail or placeholder */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.thumbnailUrl ? (
                    <img
                      src={product.thumbnailUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">
                      {product.category === "ebook"
                        ? "📘"
                        : product.category === "course"
                          ? "🎓"
                          : product.category === "template"
                            ? "🎨"
                            : product.category === "guide"
                              ? "✍️"
                              : "📦"}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full capitalize ${categoryColors[product.category] || "bg-gray-100 text-gray-600"}`}
                    >
                      {product.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        product.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.status === "published" ? "✓ Live" : "Draft"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {product.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {product.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-extrabold text-gray-900">
                    ${product.price}
                  </div>
                  <div className="text-xs text-gray-400">
                    {product.sales || 0} sales
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => setDeleteId(product._id)}
                    className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                Delete this product?
              </h3>
              <p className="text-sm text-gray-500">
                This will permanently remove the product from the marketplace.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
