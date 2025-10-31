const Home = () => {
  return (
    <div className="min-h-screen -mt-4">
      {/* Hero Section with Responsive Banner */}
      <section className="relative w-full">
        {/* Desktop Banner - Hidden on mobile */}
        <div className="hidden md:block w-full">
          <img 
            src="/src/assets/DesktopViewbannerHeroSection.png" 
            alt="SareeSansaar - Premium Saree Collection"
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Mobile Banner - Hidden on desktop */}
        <div className="md:hidden w-full">
          <img 
            src="/src/assets/MobileViewbannerHeroSection.png" 
            alt="SareeSansaar - Premium Saree Collection"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-12 bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Silk Sarees', 'Cotton Sarees', 'Designer Sarees'].map((collection, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="aspect-w-3 aspect-h-4 bg-gradient-to-br from-pink-200 to-amber-200 h-96">
                  <div className="flex items-center justify-center">
                    <span className="text-6xl">👗</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{collection}</h3>
                  <p className="text-white/90 text-sm">Explore our exquisite collection</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gradient-to-br from-rose-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-12 bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">
            Why Choose SareeSansaar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '✨', title: 'Premium Quality', desc: 'Handpicked finest fabrics' },
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
              { icon: '💎', title: 'Authentic', desc: '100% genuine products' },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
