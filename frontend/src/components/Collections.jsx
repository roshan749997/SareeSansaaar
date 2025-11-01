import React from 'react';

const Collections = () => {
  const collections = [
    { title: 'Festive Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761997162/unnamed_m26syz.jpg' },
    { title: 'Banarasi Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996662/unnamed_nweur7.jpg' },
    { title: 'Kalamkari Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761994621/Gemini_Generated_Image_ypuu4gypuu4gypuu_jgplbq.png' },
    { title: 'Kanjivaram Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761990540/kanjivaram_sarees_pva3cp.png' },
    { title: 'Block Printed Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761993746/Block_Printed_Cotton_Saree_zrlik4.png' },
    { title: 'Kalamkari Print Saree', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761991964/Kalamkari_print_saree_uvhwhn.png' },
    { title: 'Jaipur Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761993092/Jaipur_Cotton_Saree_c4ccke.png' },
    { title: 'Banarasi Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761990705/banarasi_Silk_sarees_epyjj6.png' },
    { title: 'Maheshwari Silk', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761991095/dark_green_maheshwarisilk_j9ucs1.png' },
    { title: 'Raw Silk Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761991311/raw_silk_saree_gtxu2q.png' },
    { title: 'Mysore Silk Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761991488/Mysore_silk_saree_zwuo1o.png' },
    { title: 'Sambalpuri Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761991818/Sambalpuri_silk_saree_sezvhm.png' },
    { title: 'Bengali Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761992179/Bengali_cotton_saree_ghyp46.png' },
    { title: 'Maheshwari Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761992993/Maheshwari_Cotton_Saree_hhsdzs.png' },
    { title: 'South Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761993328/South_Cotton_Saree_gmvokv.png' },
    { title: 'Soft Silk Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761990337/Gemini_Generated_Image_3yz9wj3yz9wj3yz9_jr5cy8.png' },
    { title: 'Dr.Khadi Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761993662/Dr._Khadi_Cotton_Saree_iif3wn.png' },
    { title: 'Office Wear Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761993480/office_wear_cotton_saree_pzlnyb.png' },
    { title: 'Bagru Print Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761994151/Bagru_Print_Cotton_Saree_ibrwzw.png' },
    { title: 'Ajrakh Print Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761994342/Ajrakh_Print_Cotton_Saree_vcfkoa.png' },
    { title: 'Ikkat Cotton Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761994418/Ikkat_Cotton_Saree_w6emmp.png' },
    { title: 'Chanderi Cotton Silks', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761994468/Chanderi_Cotton_Silk_Saree_rcx5uv.png' },
    { title: 'Sambalpuri Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761994816/unnamed_l4uhvn.jpg' },
    { title: 'Kanjivaram Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761995049/unnamed_uomk5c.jpg' },
    { title: 'Bengali Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761995480/unnamed_ay9pzh.jpg' },
    { title: 'Mysore Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761995976/unnamed_zspfo7.jpg' },
    { title: 'Maheshwari Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996225/unnamed_y9lset.jpg' },
    { title: 'Karnataka Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996282/unnamed_jbpm5m.jpg' },
    { title: 'Tamilnadu Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996401/unnamed_f2zbf0.jpg' },
    { title: 'Banarasi Regional Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996513/unnamed_nhbaqo.jpg' },
    { title: 'Banarasi Regional Dupatta', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996591/unnamed_raauh8.jpg' },
    { title: 'Banarasi Dupatta', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996738/unnamed_pbqdiz.jpg' },
    { title: 'Banarasi Dress Material', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996926/unnamed_bx15sw.jpg' },
    { title: 'Party Wear Saree', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761996980/unnamed_somess.jpg' },
    { title: 'Bollywood Style Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761997249/unnamed_y1gor8.jpg' },
    { title: 'Heavy Embroidered Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761997328/unnamed_lltvbe.jpg' },
    { title: 'Floral Printed Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761997427/unnamed_taunb5.jpg' },
    { title: 'Digital Printed Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761997506/unnamed_s493zy.jpg' },
    { title: 'Block Printed Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761999851/unnamed_kpla93.jpg' },
    { title: 'Abstract Printed Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761999860/unnamed_hv6m97.jpg' },
    { title: 'Geometric Printed Sarees', image: 'https://res.cloudinary.com/duc9svg7w/image/upload/v1761999983/unnamed_q6ef6r.jpg' },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-light text-gray-800 tracking-wide mb-3">
            CHOOSE YOUR SAREE ONLINE
          </h2>
          <p className="text-gray-500 text-sm">Discover our exclusive collection of handpicked sarees</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <button className="bg-white text-gray-800 p-2 shadow-lg hover:bg-gray-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-white">
                <h3 className="text-sm font-medium tracking-wide text-gray-800 text-center">
                  {item.title}
                </h3>
              </div>
              
             <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7A2A2A] via-[#A56E2C] to-[#C89D4B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
