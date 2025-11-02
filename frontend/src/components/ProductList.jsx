import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRupeeSign, FaSpinner } from 'react-icons/fa';
import { fetchSarees } from '../services/api';

const ProductList = ({ defaultCategory } = {}) => {
  const { categoryName, subCategoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normalize slug -> friendly string (replace hyphens)
  const normalize = (s) => {
    if (!s) return '';
    const t = s.replace(/-/g, ' ').toLowerCase();
    return t.replace(/\b\w/g, (c) => c.toUpperCase());
  };
  // Prefer subCategoryName for filtering when present (most DBs store subcategory as the product category)
  const effectiveCategory = subCategoryName
    ? normalize(subCategoryName)
    : (categoryName || defaultCategory) ? normalize(categoryName || defaultCategory) : '';

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        // If there's no category defined, fetch all products (backend will return all)
        const data = await fetchSarees(effectiveCategory || '');
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [categoryName, subCategoryName, defaultCategory]);

  // Scroll to top whenever category changes so the heading/top section is visible
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryName, subCategoryName]);

  const handleCardClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  // No blocking loading screen; we keep showing current content

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      {loading && (
        <div className="fixed left-0 right-0 top-[64px] md:top-[80px] z-50">
          <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500 animate-pulse"></div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {subCategoryName
              ? normalize(subCategoryName)
              : (categoryName || defaultCategory
                  ? normalize(categoryName || defaultCategory)
                  : 'All Sarees')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#7A2A2A] via-[#A56E2C] to-[#C89D4B] mx-auto mt-2 rounded-full"></div>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {products.map((p) => (
              <div
                key={p._id || p.title}
                className="group bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-pink-100"
                onClick={() => handleCardClick(p)}
              >
                <div className="relative w-full aspect-[3/4] bg-gray-50">
                  <img
                    src={p.images?.image1 || 'https://via.placeholder.com/300x400?text=Image+Not+Available'}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x400?text=Image+Not+Available';
                    }}
                  />
                  {(p.discountPercent > 0 || p.discount) && (
                    <span className="absolute top-3 right-3 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {p.discountPercent || p.discount}% OFF
                    </span>
                  )}
                </div>

                <div className="relative p-4">
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7A2A2A] via-[#A56E2C] to-[#C89D4B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"></div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-medium text-gray-600 line-clamp-1">
                      {p.product_info?.manufacturer || 'VARNICRAFTS'}
                    </h3>
                    <span className="text-xs text-gray-400">Sponsored</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">{p.title || 'Untitled Product'}</p>
                  {p.color && <p className="text-xs text-gray-500 mb-2">Color: {p.color}</p>}

                  <div className="flex items-baseline gap-1.5 mt-2">
                    <div className="flex items-center">
                      <FaRupeeSign className="h-3.5 w-3.5 text-gray-900" />
                      <span className="text-lg font-bold text-gray-900 ml-0.5">
                        {p.price?.toLocaleString() || Math.round(p.mrp - p.mrp * ((p.discountPercent || 0) / 100)).toLocaleString()}
                      </span>
                    </div>
                    {p.mrp && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{p.mrp.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
