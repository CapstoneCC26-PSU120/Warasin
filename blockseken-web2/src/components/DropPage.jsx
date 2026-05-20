import { useState } from 'react';

const PRODUCTS = [
  {
    id: 1,
    name: '90s Graphic Tee',
    price: '$45.00',
    category: 'VINTAGE',
    size: 'SIZE L',
    desc: 'Single Stitch',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ujl8madM5tqbNYFZQpj-o3aeNvyNUxo1du6mzGDejtacpKrdcFz4c-UsC54-37G74Uiwo6y2j3syevWog-rjF4ftGVphDmWCVLhknvoU5HF95eLa5jY60ULJzQ4a-MyCyUdiehTZsKOU5Rb17PAHWCDxZ4Dyl7aqJZA8o6YWfs5FU6PEHfEQ-vEP07r-bcXoQirvqlxeruW7qb2sk6EaDfZY1iH2rilkF6wc3JYAsGQSPPFAhInfn1_LSw'
  },
  {
    id: 2,
    name: 'Vintage Bomber',
    price: '$120.00',
    category: 'BRANDED',
    size: 'SIZE M',
    desc: 'Military Surplus',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ui6AfTurFk3bGCrhnw0CwexjjobMUnbwD83M7GjVvqyQ27EbFr8ii919c41pk3jaN0SH6wFQITeDlb0GwNZTHr6VZa2JFgosqisoBE2wJWzRy1oDr43MZhAOLIKTMP8mDaDrcFnYEjLjROzJqobSHNHR_FnUp2c8k23rkn7xzl2Yp-739UxDCIjT87g9c-rZZjSdLAKR1C7qG2HYnpCajKbXd48o-37wgQD4fPiNnSrJCystnBR0zPhNgs'
  },
  {
    id: 3,
    name: 'Heavy Sweatshirt',
    price: '$75.00',
    category: 'UPCYCLED',
    size: 'SIZE XL',
    desc: 'Organic Cotton',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-o8FDwtChP_YkZwpCZO7lQjsLpDzAmykDJmESltryPFkq3zxeX7eNkPy9JR95Ej0u5eP9S5RdPZa0c9O5wS07KxJtXvAyWcyJV7WKTZR0MZWf_v5q5bygNW_V4cMWnen37f42NIxRmMnet19vIcyWmK3eqbJMfjOts-S-NydFLVcGQmT3BmHeM_gk_13k0ADjZJzm6cOt-F297aLgRI5GyKvc0w0csRogBy5XyNaINeLotruunxiMwuXZTRVZ2GVHgItFtWo3Htw'
  },
  {
    id: 4,
    name: 'Heritage Kicks',
    price: '$110.00',
    category: 'VINTAGE',
    size: 'SIZE 10',
    desc: 'Restored Classics',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_6rxqEVnGvIPKYwFOXdyN027du1jpyU_8aYD9wEXqO-GhckRWezcVJm2Lt9YICJWzwev_CiC1cdRIFHcgaMfKVB2IeiCKbPW6MawFSxIhJiJiVxavFRb3nESKzcisCYEUjv8dy0tAvjhyuhSJcc4-bt3OsBWINK1jrflrtfHJdfZFbPN1ypyuQxDiT4_Rbeko-EsLLVYjUh2HLai6nLSaYwiRr29RVjJturQh-ni_ZhwzEM8NqqU1E0Ri_dlHCGSft-1Y8XT4VPU'
  }
];

function DropPage({ setCurrentPage }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredProducts = activeFilter === 'ALL'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeFilter);

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen pt-24 pb-32">
      {/* Hero Header */}
      <section className="px-margin-mobile md:px-margin-desktop mb-8 md:mb-16">
        <div className="relative">
          <h2 className="font-display-xl text-[48px] md:text-display-xl leading-none uppercase text-primary italic z-10 relative">
            THE DROP
          </h2>
          <div className="absolute -top-4 -left-2 text-on-tertiary-container opacity-20 font-display-xl text-[40px] md:text-display-xl select-none pointer-events-none">
            LATEST_RELEASE
          </div>
        </div>
        <p className="md:hidden font-body-md text-body-md text-on-surface-variant mt-2 max-w-[80%]">
          Curated Grails. Sustainable Hype. Every piece tells a story.
        </p>

        {/* Desktop Filter Bar */}
        <div className="hidden md:flex mt-12 flex-wrap items-center gap-4 border-y-2 border-primary py-4">
          <span className="font-label-md text-label-md uppercase mr-4">Filter By:</span>
          {['ALL', 'VINTAGE', 'UPCYCLED', 'BRANDED'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 font-label-md text-label-md tracking-widest transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-on-primary'
                  : 'border-2 border-primary text-primary hover:bg-surface-container-high bg-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
          <div className="ml-auto text-outline font-label-sm text-label-sm">
            SHOWING {filteredProducts.length} OF {PRODUCTS.length} ITEMS
          </div>
        </div>

        {/* Mobile Chips Filter */}
        <div className="md:hidden mt-6 mb-6 overflow-x-auto -mx-margin-mobile px-margin-mobile flex gap-3 scrollbar-none">
          {['ALL', 'VINTAGE', 'UPCYCLED', 'BRANDED'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 px-4 py-2 border-[1.5px] border-primary font-label-md text-label-md uppercase transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-surface'
                  : 'bg-surface text-primary hover:bg-secondary-container'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Mobile 2-column, Desktop 4-column */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-gutter lg:gap-12">
          {filteredProducts.map((product, idx) => {
            // Desktop asymmetric shift down for columns 2 and 4 (idx 1 and 3)
            const isAsymmetric = idx === 1 || idx === 3;
            return (
              <div
                key={product.id}
                className={`group cursor-pointer flex flex-col justify-between ${
                  isAsymmetric ? 'lg:mt-12' : ''
                }`}
              >
                <div>
                  <div className="relative overflow-hidden aspect-[3/4] bg-surface-container mb-4 border border-primary/10">
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 md:group-hover:scale-110"
                      src={product.image}
                    />
                    <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-on-tertiary-container text-white px-2 py-1 md:px-3 md:py-1 font-label-sm md:font-label-md text-label-sm md:text-label-md shadow-hard border border-primary">
                      {product.price}
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-md text-base md:text-[20px] uppercase text-primary leading-tight font-bold">
                        {product.name}
                      </h3>
                      {/* Mobile sublabel vs Desktop size */}
                      <p className="md:hidden font-label-sm text-label-sm text-on-surface-variant opacity-70">
                        {product.desc}
                      </p>
                      <p className="hidden md:block text-outline font-label-sm text-label-sm mt-1">
                        {product.category} / {product.size}
                      </p>
                    </div>
                    <button className="text-primary active:scale-90 transition-all hover:text-on-tertiary-container">
                      <span className="material-symbols-outlined text-[20px] md:text-[24px]">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Editor's Choice Section (Desktop/Mobile Hybrid layout) */}
      <section className="my-16 md:my-32 bg-primary py-16 md:py-24 px-margin-mobile md:px-margin-desktop overflow-hidden relative border-y-2 border-primary">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-5 text-on-primary z-10 flex flex-col gap-6 md:gap-8">
            <p className="font-label-md text-label-md text-on-tertiary-container tracking-[0.2em]">
              EDITOR'S SELECTION_004
            </p>
            <h2 className="font-headline-lg text-[32px] md:text-headline-lg uppercase leading-none italic font-bold">
              THE RECLAIMED SET
            </h2>
            <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg opacity-80 max-w-md">
              A curated capsule of items that bridge the gap between street utility and archival preservation. Each piece is unique, authenticated, and ready for a second life.
            </p>
            <button className="bg-on-tertiary-container text-primary px-8 py-4 md:px-10 md:py-4 font-label-md text-label-md shadow-hard hover:translate-y-[-4px] transition-all uppercase tracking-widest border border-primary w-fit">
              Explore Capsule
            </button>
          </div>
          <div className="lg:col-span-7 relative mt-12 lg:mt-0 w-full">
            <div className="relative aspect-square md:aspect-video lg:aspect-[4/3] w-full overflow-hidden border-4 border-on-tertiary-container">
              <img
                alt="Streetwear accessories"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida/ADBb0uhBmk-sdjOT6UF7nfIsxKGaXZRzs7hwW-P0AgZFZKkFEhnafOLYrlE512nb_pOBzqhKM2lP8RtQRFqCn9ok0nrO3vBqF7IS2bPJvrr7EHkwvRDvKCphKfTo_R2DfuieahcMs9I8V3nSy-lA6_X2uznusCIuHhJ1QXa9Ad2Q66IN5--iomghX_gj-KQ2P8GNfTJwjPjEhEdCw1meyxpz1nIAs6TVKHkgcAXu-hv_BimGblTSh1WFKcvPXK0"
              />
            </div>
            {/* Zine Offset Element (Desktop only) */}
            <div className="hidden md:block absolute -bottom-12 -right-12 w-64 h-80 bg-surface border-2 border-primary p-6 z-20 shadow-hard">
              <p className="font-label-sm text-label-sm text-primary mb-4 opacity-60">ITEM_REF: ACC_992</p>
              <h4 className="font-headline-md text-[24px] text-primary leading-none mb-4 font-bold">ARCHIVE ACCS</h4>
              <div className="w-full h-40 bg-surface-container-high overflow-hidden border border-primary">
                <img
                  alt="Detail"
                  className="w-full h-full object-cover grayscale"
                  src="https://lh3.googleusercontent.com/aida/ADBb0uhBmk-sdjOT6UF7nfIsxKGaXZRzs7hwW-P0AgZFZKkFEhnafOLYrlE512nb_pOBzqhKM2lP8RtQRFqCn9ok0nrO3vBqF7IS2bPJvrr7EHkwvRDvKCphKfTo_R2DfuieahcMs9I8V3nSy-lA6_X2uznusCIuHhJ1QXa9Ad2Q66IN5--iomghX_gj-KQ2P8GNfTJwjPjEhEdCw1meyxpz1nIAs6TVKHkgcAXu-hv_BimGblTSh1WFKcvPXK0"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Large Background Text */}
        <div className="absolute -bottom-10 -left-10 text-[100px] md:text-[200px] font-bold text-on-primary/5 select-none pointer-events-none leading-none">
          RECLAIM
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-margin-mobile md:px-margin-desktop mb-16 md:mb-32">
        <div className="bg-primary-container p-8 md:p-24 flex flex-col items-center text-center border-2 border-primary relative overflow-hidden">
          {/* Mobile Eco Icon Overlay */}
          <div className="absolute -right-8 -bottom-8 opacity-10 text-on-primary-container">
            <span className="material-symbols-outlined text-[120px] md:text-[180px]">eco</span>
          </div>

          <h3 className="font-display-xl text-[36px] md:text-[64px] text-on-primary-container leading-none mb-4 md:mb-6 font-bold">
            JOIN THE CIRCLE
          </h3>
          <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-primary-container/60 mb-8 md:mb-12 max-w-2xl">
            Get early access to drops, exclusive archival stories, and our monthly sustainability report. Conscious hype delivered directly.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col md:flex-row gap-4 w-full max-w-xl relative z-10"
          >
            <input
              className="flex-grow bg-transparent border-2 border-on-primary-container text-on-primary px-6 py-4 font-label-md text-label-md focus:outline-none focus:border-on-tertiary-container placeholder:text-on-primary-container/40"
              placeholder="YOUR@EMAIL.COM"
              type="email"
            />
            <button
              className="bg-on-tertiary-container text-primary px-8 py-4 font-label-md text-label-md tracking-widest hover:brightness-110 active:scale-95 transition-all uppercase border border-primary shadow-hard"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 bg-surface border-t-2 border-primary md:hidden shadow-soft">
        <button
          onClick={() => setCurrentPage('drop')}
          className="flex flex-col items-center justify-center text-on-tertiary-container font-bold active:translate-y-0.5 transition-all"
        >
          <span className="material-symbols-outlined fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          <span className="font-label-sm text-label-sm uppercase mt-1">DROP</span>
        </button>
        <button
          onClick={() => setCurrentPage('home')}
          className="flex flex-col items-center justify-center text-primary hover:opacity-80 active:translate-y-0.5 transition-all"
        >
          <span className="material-symbols-outlined">sell</span>
          <span className="font-label-sm text-label-sm uppercase mt-1">VINTAGE</span>
        </button>
        <button
          onClick={() => setCurrentPage('home')}
          className="flex flex-col items-center justify-center text-primary hover:opacity-80 active:translate-y-0.5 transition-all"
        >
          <span className="material-symbols-outlined">auto_fix_high</span>
          <span className="font-label-sm text-label-sm uppercase mt-1">UPCYCLED</span>
        </button>
        <button
          onClick={() => setCurrentPage('home')}
          className="flex flex-col items-center justify-center text-primary hover:opacity-80 active:translate-y-0.5 transition-all"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-label-sm uppercase mt-1">PROFILE</span>
        </button>
      </nav>
    </div>
  );
}

export default DropPage;
