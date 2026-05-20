import { useState } from 'react';
import DropPage from './components/DropPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="antialiased min-h-screen flex flex-col font-body-md overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b-2 border-primary flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
            <span className="material-symbols-outlined text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
          <button onClick={() => navigateTo('home')} className="font-headline-lg-mobile md:font-headline-md text-headline-lg-mobile md:text-headline-md tracking-tighter text-primary bg-transparent border-none cursor-pointer">
            BLOKSEKEN
          </button>
        </div>
        <nav className="hidden md:flex gap-gutter items-center">
          <button
            onClick={() => navigateTo('drop')}
            className={`font-label-md text-label-md hover:text-on-tertiary-container transition-colors duration-200 bg-transparent border-none cursor-pointer ${
              currentPage === 'drop' ? 'text-on-tertiary-container font-bold' : 'text-primary font-medium'
            }`}
          >
            The Drop
          </button>
          <button
            onClick={() => navigateTo('home')}
            className={`font-label-md text-label-md hover:text-on-tertiary-container transition-colors duration-200 bg-transparent border-none cursor-pointer ${
              currentPage === 'home' ? 'text-on-tertiary-container font-bold' : 'text-primary font-medium'
            }`}
          >
            Vintage
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="text-primary font-medium font-label-md text-label-md hover:text-on-tertiary-container transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            Upcycled
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="text-primary font-medium font-label-md text-label-md hover:text-on-tertiary-container transition-colors duration-200 bg-transparent border-none cursor-pointer"
          >
            Sustainability
          </button>
        </nav>
        <button className="text-primary hover:text-on-tertiary-container transition-colors duration-200 bg-transparent border-none cursor-pointer">
          <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-0 w-full z-40 bg-surface border-b-2 border-primary md:hidden animate-[fade-in_0.2s_ease-out]">
          <nav className="flex flex-col p-6 gap-4">
            <button
              onClick={() => navigateTo('drop')}
              className={`text-left font-label-md text-label-md hover:text-on-tertiary-container transition-colors duration-200 bg-transparent border-none cursor-pointer ${
                currentPage === 'drop' ? 'text-on-tertiary-container font-bold' : 'text-primary font-medium'
              }`}
            >
              The Drop
            </button>
            <button
              onClick={() => navigateTo('home')}
              className={`text-left font-label-md text-label-md hover:text-on-tertiary-container transition-colors duration-200 bg-transparent border-none cursor-pointer ${
                currentPage === 'home' ? 'text-on-tertiary-container font-bold' : 'text-primary font-medium'
              }`}
            >
              Vintage
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="text-left text-primary font-medium font-label-md text-label-md hover:text-on-tertiary-container transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Upcycled
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="text-left text-primary font-medium font-label-md text-label-md hover:text-on-tertiary-container transition-colors duration-200 bg-transparent border-none cursor-pointer"
            >
              Sustainability
            </button>
          </nav>
        </div>
      )}

      {/* Conditional Rendering of Page View */}
      {currentPage === 'home' ? (
        <main className="flex-grow pt-20">
          {/* Hero Section */}
          <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 py-32 grid grid-cols-1 md:grid-cols-12 gap-12 items-center bg-surface">
            <div className="md:col-span-6 flex flex-col gap-8">
              <h1 className="font-display-xl text-[48px] md:text-display-xl text-primary uppercase leading-[1.1] md:leading-none tracking-tighter">
                Find Your Style,<br />
                <span className="text-on-tertiary-container">Sustain</span> the<br />
                Planet <span className="text-secondary">🌱</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md border-l-2 border-outline pl-6">
                Trendy thrift fashion that's affordable, unique, and eco-friendly. Conscious hype for the new generation.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <button onClick={() => navigateTo('drop')} className="bg-on-tertiary-container text-primary font-label-md text-label-md uppercase px-8 py-4 shadow-hard transition-all duration-200 inline-block text-center border border-primary cursor-pointer">Shop Now</button>
                <button onClick={() => navigateTo('drop')} className="border-2 border-primary text-primary hover:bg-secondary-container font-label-md text-label-md uppercase px-8 py-4 transition-all duration-200 inline-block text-center bg-surface cursor-pointer">View the Drop</button>
              </div>
            </div>
            <div className="md:col-span-6 relative">
              <div className="absolute inset-0 bg-secondary-container transform translate-x-4 translate-y-4 border-2 border-primary"></div>
              <img alt="Hero Streetwear Model" className="relative z-10 w-full h-[400px] md:h-[600px] object-cover border-2 border-primary grayscale hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida/ADBb0uhgJcZDXUNG81wYfR0fSxTCAhmMVuC8olOs3ALwOladO6KNJz2dE9YTEXk3x6F9JrhAXC4rhYX-i6zV6QYjhadqoUWygvjQBlLzq9AY6Yr8S9RVZNKHRMTsSydGSw84x6xTMSSz6smXhpDPmD8D8gmkSb_yu87iLhEyZHDCkTNyE_rz9caTAYiv1luEFfosU7rYfpgtrE7TNlfHMdNnQ2-n66PUpG1javhT_koc2oTH0U28DYKzYtj_Yxo" />
            </div>
          </section>

          {/* Value Propositions */}
          <section className="border-y-2 border-primary bg-surface-container py-12 overflow-hidden">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
              <div className="flex flex-wrap justify-between items-center gap-8">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[32px] text-on-tertiary-container">payments</span>
                  <span className="font-label-md text-label-md uppercase text-primary tracking-widest">Affordable</span>
                </div>
                <div className="hidden md:block w-2 h-2 bg-primary rotate-45"></div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[32px] text-on-tertiary-container">star</span>
                  <span className="font-label-md text-label-md uppercase text-primary tracking-widest">Unique &amp; Limited</span>
                </div>
                <div className="hidden md:block w-2 h-2 bg-primary rotate-45"></div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[32px] text-on-tertiary-container">recycling</span>
                  <span className="font-label-md text-label-md uppercase text-primary tracking-widest">Eco-Friendly</span>
                </div>
                <div className="hidden md:block w-2 h-2 bg-primary rotate-45"></div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[32px] text-on-tertiary-container">verified</span>
                  <span className="font-label-md text-label-md uppercase text-primary tracking-widest">Curated Quality</span>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-40 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center bg-surface">
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-primary transform -translate-x-4 -translate-y-4"></div>
              <img alt="Thrift Store Rack" className="relative z-10 w-full h-[400px] md:h-[550px] object-cover border-2 border-primary" src="https://lh3.googleusercontent.com/aida/ADBb0ujl8madM5tqbNYFZQpj-o3aeNvyNUxo1du6mzGDejtacpKrdcFz4c-UsC54-37G74Uiwo6y2j3syevWog-rjF4ftGVphDmWCVLhknvoU5HF95eLa5jY60ULJzQ4a-MyCyUdiehTZsKOU5Rb17PAHWCDxZ4Dyl7aqJZA8o6YWfs5FU6PEHfEQ-vEP07r-bcXoQirvqlxeruW7qb2sk6EaDfZY1iH2rilkF6wc3JYAsGQSPPFAhInfn1_LSw" />
              <div className="absolute bottom-4 left-4 z-20 bg-surface border-2 border-primary p-2 font-label-sm text-label-sm uppercase text-primary shadow-hard">EST. 2024</div>
            </div>
            <div className="flex flex-col gap-8 order-1 md:order-2">
              <h2 className="font-headline-lg text-headline-lg text-primary uppercase leading-tight">The Future is<br /><span className="text-outline">Reworn</span></h2>
              <p className="font-body-md text-body-lg text-on-surface-variant leading-relaxed">
                BlokSeken is a curated thrift fashion store offering high-quality secondhand clothing with unique style and affordable prices. We believe that high-energy streetwear shouldn't come at the cost of the planet.
              </p>
              <a className="font-label-md text-label-md text-primary uppercase border-b-2 border-on-tertiary-container pb-1 w-max hover:text-on-tertiary-container transition-colors" href="#">Read Our Manifesto</a>
            </div>
          </section>

          {/* Collection Showcase (Bento Grid) */}
          <section className="bg-surface-container-low py-24 md:py-32 border-y-2 border-primary">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
              <div className="flex justify-between items-end mb-16 border-b-2 border-primary pb-6">
                <h2 className="font-headline-lg text-headline-lg text-primary uppercase">Curated Drops</h2>
                <button onClick={() => navigateTo('drop')} className="hidden md:block font-label-md text-label-md text-on-tertiary-container uppercase hover:underline underline-offset-8 bg-transparent border-none cursor-pointer">View All Archive</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                {/* Large Feature Card */}
                <div onClick={() => navigateTo('drop')} className="md:col-span-8 group relative cursor-pointer">
                  <div className="relative h-[500px] md:h-[650px] w-full border-2 border-primary overflow-hidden">
                    <img alt="Vintage Grails" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida/ADBb0ui6AfTurFk3bGCrhnw0CwexjjobMUnbwD83M7GjVvqyQ27EbFr8ii919c41pk3jaN0SH6wFQITeDlb0GwNZTHr6VZa2JFgosqisoBE2wJWzRy1oDr43MZhAOLIKTMP8mDaDrcFnYEjLjROzJqobSHNHR_FnUp2c8k23rkn7xzl2Yp-739UxDCIjT87g9c-rZZjSdLAKR1C7qG2HYnpCajKbXd48o-37wgQD4fPiNnSrJCystnBR0zPhNgs" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 flex flex-col gap-4">
                      <span className="bg-on-tertiary-container text-primary font-label-sm text-label-sm uppercase px-3 py-1 w-max border border-primary shadow-[2px_2px_0px_0px_#26170c]">CATEGORY</span>
                      <h3 className="font-headline-md text-headline-md text-on-primary uppercase font-bold">Vintage Grails</h3>
                      <p className="font-body-md text-body-md text-surface-variant max-w-sm">Rare finds and iconic silhouettes from the archives.</p>
                    </div>
                  </div>
                </div>
                {/* Smaller Accent Card */}
                <div onClick={() => navigateTo('drop')} className="md:col-span-4 flex flex-col gap-gutter cursor-pointer">
                  <div className="group relative h-full">
                    <div className="relative h-[400px] md:h-full w-full border-2 border-primary overflow-hidden">
                      <img alt="Essential Accents" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida/ADBb0uhBmk-sdjOT6UF7nfIsxKGaXZRzs7hwW-P0AgZFZKkFEhnafOLYrlE512nb_pOBzqhKM2lP8RtQRFqCn9ok0nrO3vBqF7IS2bPJvrr7EHkwvRDvKCphKfTo_R2DfuieahcMs9I8V3nSy-lA6_X2uznusCIuHhJ1QXa9Ad2Q66IN5--iomghX_gj-KQ2P8GNfTJwjPjEhEdCw1meyxpz1nIAs6TVKHkgcAXu-hv_BimGblTSh1WFKcvPXK0" />
                      {/* Receipt-style metadata */}
                      <div className="absolute top-6 right-6 bg-surface border-2 border-primary p-4 shadow-hard transform rotate-2">
                        <div className="font-label-sm text-label-sm uppercase text-primary flex flex-col gap-1">
                          <span className="border-b border-dashed border-outline pb-1">Essential</span>
                          <span>Accents</span>
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-surface border-2 border-primary p-4">
                        <span className="font-label-md text-label-md text-primary uppercase">Shop Accents</span>
                        <span className="material-symbols-outlined text-primary">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-32 md:py-48 text-center bg-surface">
            <h2 className="font-display-xl text-[48px] md:text-display-xl text-primary uppercase tracking-tighter mb-12">Upgrade Your<br />Style Today</h2>
            <button onClick={() => navigateTo('drop')} className="bg-on-tertiary-container text-primary font-label-md text-label-md uppercase px-12 py-5 shadow-hard transition-all duration-200 inline-block border border-primary text-lg hover:bg-primary hover:text-on-tertiary-container cursor-pointer">Browse Collection</button>
          </section>
        </main>
      ) : (
        <DropPage setCurrentPage={navigateTo} />
      )}

      {/* Footer */}
      <footer className="w-full bg-primary py-20 px-margin-mobile md:px-margin-desktop border-t-2 border-primary">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col gap-6">
            <button onClick={() => navigateTo('home')} className="font-headline-lg text-headline-lg text-on-tertiary-container bg-transparent border-none text-left cursor-pointer font-bold">
              BLOKSEKEN
            </button>
            <p className="font-body-md text-body-md text-on-primary/70">© 2024 BLOKSEKEN.<br />CONSCIOUS HYPE.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-label-md text-on-primary uppercase mb-2">Explore</h4>
            <button onClick={() => navigateTo('drop')} className="font-label-sm text-label-sm text-on-primary/80 hover:text-on-tertiary-container uppercase tracking-widest transition-colors bg-transparent border-none text-left cursor-pointer">Archives</button>
            <button onClick={() => navigateTo('drop')} className="font-label-sm text-label-sm text-on-primary/80 hover:text-on-tertiary-container uppercase tracking-widest transition-colors bg-transparent border-none text-left cursor-pointer">Shipping</button>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-label-md text-on-primary uppercase mb-2">Legal</h4>
            <a className="font-label-sm text-label-sm text-on-primary/80 hover:text-on-tertiary-container uppercase tracking-widest transition-colors" href="#">Privacy</a>
            <a className="font-label-sm text-label-sm text-on-primary/80 hover:text-on-tertiary-container uppercase tracking-widest transition-colors" href="#">Sustainability Report</a>
          </div>
          <div className="flex gap-6 items-start md:justify-end">
            <a className="text-on-primary/80 hover:text-on-tertiary-container transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
            <a className="text-on-primary/80 hover:text-on-tertiary-container transition-colors" href="#"><span className="material-symbols-outlined">mail</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
