const About = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">
          About SareeSansaar
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl p-8 md:p-12 shadow-lg mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Welcome to <span className="font-semibold text-rose-600">SareeSansaar</span>, your destination for exquisite traditional Indian sarees. We are passionate about preserving the rich heritage of Indian textiles while bringing you the finest collection of handcrafted sarees.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Each saree in our collection is carefully selected to ensure authenticity, quality, and timeless elegance. From traditional silk sarees to contemporary designer pieces, we offer a diverse range that celebrates the beauty of Indian craftsmanship.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission is to make every woman feel confident and beautiful in our sarees, whether it's for a special occasion or everyday elegance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h3>
              <p className="text-gray-600">Preserving tradition with modern elegance</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="text-4xl mb-3">💝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Values</h3>
              <p className="text-gray-600">Quality, authenticity, and customer satisfaction</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Promise</h3>
              <p className="text-gray-600">100% genuine handcrafted sarees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
