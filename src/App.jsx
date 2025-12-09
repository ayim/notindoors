import { BrowserRouter, Routes, Route, NavLink, Link, useLocation, Navigate } from 'react-router-dom';
import PowerBankChart from './PowerBankChart.jsx';
import PowerBankChart20Min from './PowerBankChart20Min.jsx';
import ProductScores from './ProductScores.jsx';

const navLinks = [
  { to: '/', label: 'Laptop power banks' },
  { to: '/', label: 'Laptop wall chargers', tooltip: 'Coming soon', disabled: true },
  { to: '/', label: 'EVs & rental cars', tooltip: 'Coming soon', disabled: true  },
];

const secondaryLinks = [
  { to: '/burst-recharge', label: 'Burst charge' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/recharge-time', label: 'Recharge time' },
];

function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-24">
      {/* Hero Section */}
      <section className="pt-12 md:pt-20">
        <div className="inline-block px-3 py-1 mb-4 border border-neon-cyan text-neon-cyan font-mono text-xs uppercase tracking-widest">
          r/chargingsheet lab
        </div>
        <p className="text-sm text-gray-400 font-mono uppercase tracking-widest mb-3">
          Last updated · Dec 9 2025
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white uppercase leading-[0.9] tracking-tighter mb-4">
          notindoors reviews
        </h1>
        <p className="text-2xl md:text-3xl text-gray-200 font-light leading-tight mb-3">
          Keep your laptop alive anywhere.
        </p>
        <p className="text-lg md:text-xl text-gray-400 font-light leading-tight mb-6 max-w-3xl">
          176 power banks tested. Real data, no spec sheet BS.
        </p>
        <form className="w-full max-w-2xl mb-6 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="What do you need to keep running?"
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan font-mono text-sm uppercase tracking-tight"
            />
            <button
              type="button"
              className="px-6 py-3 bg-neon-cyan text-black font-bold uppercase tracking-wide border-2 border-neon-cyan hover:bg-transparent hover:text-neon-cyan hover:shadow-[4px_4px_0px_0px_#00FFFF] transition-all"
            >
              🔍
            </button>
          </div>
          <div className="text-gray-500 text-sm font-mono flex flex-wrap gap-2">
            <span className="px-2 py-1 border border-gray-800 bg-gray-900/60">Feed a hungry ThinkPad</span>
            <span className="px-2 py-1 border border-gray-800 bg-gray-900/60">MacBook all day</span>
            <span className="px-2 py-1 border border-gray-800 bg-gray-900/60">20 min before your next call</span>
          </div>
        </form>
        <div className="flex flex-wrap gap-4">
          <Link to="/products" className="inline-flex items-center justify-center px-8 py-4 bg-neon-yellow text-black font-bold uppercase tracking-wide border-2 border-neon-yellow hover:bg-transparent hover:text-neon-yellow hover:shadow-[4px_4px_0px_0px_#EAFF00] transition-all transform hover:-translate-y-1">
            See Top Picks ⚡
          </Link>
          <Link to="/recharge-time" className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-bold uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all transform hover:-translate-y-1">
            View All Data →
          </Link>
        </div>
      </section>

      {/* Product Test Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        <Link to="/recharge-time" className="relative p-8 border-2 border-gray-800 bg-gray-900/30 hover:border-neon-magenta hover:bg-gray-900/80 transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 bg-neon-magenta text-black text-xs font-bold px-2 py-1 font-mono transform translate-x-full group-hover:translate-x-0 transition-transform">
            V3 DATA
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-neon-magenta transition-colors">What charges fastest?</h3>
          <p className="text-gray-400 mb-3">Fastest 0-100% recharge time.</p>
          <p className="text-neon-magenta font-mono text-sm mb-6">🏆 EcoFlow RAPID Pro · 30 min</p>
          <span className="inline-block border border-gray-700 px-4 py-2 text-xs font-mono uppercase text-gray-300 group-hover:border-neon-magenta group-hover:text-neon-magenta transition-colors">
            See all charge times →
          </span>
        </Link>
        
        <Link to="/burst-recharge" className="relative p-8 border-2 border-gray-800 bg-gray-900/30 hover:border-neon-yellow hover:bg-gray-900/80 transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 bg-neon-yellow text-black text-xs font-bold px-2 py-1 font-mono transform translate-x-full group-hover:translate-x-0 transition-transform">
            NEW
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-neon-yellow transition-colors">What if I only have 20 min?</h3>
          <p className="text-gray-400 mb-3">Most charge absorbed in 20 minutes.</p>
          <p className="text-neon-yellow font-mono text-sm mb-6">🏆 EcoFlow RAPID Pro · 79Wh</p>
          <span className="inline-block border border-gray-700 px-4 py-2 text-xs font-mono uppercase text-gray-300 group-hover:border-neon-yellow group-hover:text-neon-yellow transition-colors">
            See burst data →
          </span>
        </Link>

        <Link to="/products" className="relative p-8 border-2 border-gray-800 bg-gray-900/30 hover:border-neon-cyan hover:bg-gray-900/80 transition-all group overflow-hidden">
           <div className="absolute top-0 right-0 bg-neon-cyan text-black text-xs font-bold px-2 py-1 font-mono transform translate-x-full group-hover:translate-x-0 transition-transform">
            RANKED
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-neon-cyan transition-colors">What&apos;s the best value?</h3>
          <p className="text-gray-400 mb-3">Best performance per dollar.</p>
          <p className="text-neon-cyan font-mono text-sm mb-6">🏆 Cuktech 15 Ultra · €79.99</p>
          <span className="inline-block border border-gray-700 px-4 py-2 text-xs font-mono uppercase text-gray-300 group-hover:border-neon-cyan group-hover:text-neon-cyan transition-colors">
            See value rankings →
          </span>
        </Link>
      </section>

      {/* Mini Section */}
      <section className="border border-gray-800 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-yellow via-neon-magenta to-neon-cyan opacity-50"></div>
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3">
             <h2 className="text-4xl font-display font-bold text-white mb-4">How We Test</h2>
             <p className="text-gray-400 mb-4">Real workflows. Real charts. No marketing claims.</p>
             <p className="text-gray-400 text-sm leading-relaxed">
               We measure usable capacity, watch how wattage holds under load, map split behavior across ports, and validate passthrough/UPS claims. Then we layer in weight, size, and packability so the data matches travel reality. Data foundations come from u/N8falke and the Charging Sheet; we extend with field tests for travel and outdoor use.
             </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-2 gap-4">
             {['20-minute burst test', 'Sustained MacBook draw', '45-minute recharge mapping', 'Sub-60-minute recovery scoring'].map((item, i) => (
               <div key={i} className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-neon-lime"></div>
                 <span className="text-sm font-mono text-gray-300 uppercase">{item}</span>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AppShell() {
  const location = useLocation();

  const isPrimaryActive = (to) => location.pathname.startsWith(to);

  const isSecondaryActive = (to) => {
    const path = location.pathname;
    if (to === '/recharge-time' && path === '/') return true;
    return path.startsWith(to);
  };

  const CarsComingSoon = () => (
    <div className="page-shell">
      <div className="hero">
        <p className="eyebrow">r/chargingsheet lab</p>
        <h1>Cars testing is coming soon</h1>
        <p className="lead">
          We’re lining up EV charging and vehicle power accessory tests. Subscribe or check back for the next drop.
        </p>
      </div>
    </div>
  );

  const LaptopChargersComingSoon = () => (
    <div className="page-shell">
      <div className="hero">
        <p className="eyebrow">r/chargingsheet lab</p>
        <h1>Laptop wall chargers · TBD</h1>
        <p className="lead">
          This section is parked. We’ll add mains-powered laptop charger testing (sustained load, thermals, travel-readiness) once the backlog clears.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-gray-800 mb-12">
        <div>
          <p className="font-mono text-neon-magenta text-xs tracking-[0.2em] uppercase mb-1">notindoors reviews</p>
          <h2 className="text-2xl font-bold text-white font-display tracking-tight">Portable gear, tested for work and life.</h2>
        </div>
        <nav className="flex flex-wrap gap-3">
          {navLinks.map(link => {
            const active = isPrimaryActive(link.to);
            const disabled = link.disabled;
            const baseInactive = disabled
              ? 'text-gray-600 border-gray-800 opacity-60 cursor-not-allowed'
              : 'text-gray-400 border-gray-800 hover:text-neon-lime hover:border-neon-lime hover:shadow-[2px_2px_0px_0px_#00FF66] bg-black';
            const baseActive = disabled
              ? 'bg-neon-lime/20 text-black/60 border-neon-lime/40 cursor-not-allowed'
              : 'bg-neon-lime text-black border-neon-lime shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] font-bold';
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                title={link.tooltip || ''}
                className={`
                    px-4 py-2 font-mono text-xs uppercase tracking-wider border transition-all duration-200
                    ${active ? baseActive : baseInactive}
                  `}
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </header>

      {/* Secondary nav for chart/product views */}
      <div className="flex flex-wrap gap-3 mb-10">
        {secondaryLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={`
              px-4 py-2 font-mono text-xs uppercase tracking-wider border transition-all duration-200
              ${isSecondaryActive(link.to)
                ? 'bg-neon-lime text-black border-neon-lime shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] font-bold'
                : 'text-gray-400 border-gray-800 hover:text-neon-lime hover:border-neon-lime hover:shadow-[2px_2px_0px_0px_#00FF66] bg-black'}
            `}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
      
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<ProductScores />} />
          <Route path="/products" element={<Navigate to="/leaderboard" replace />} />
          <Route path="/recharge-time" element={<PowerBankChart />} />
          <Route path="/burst-recharge" element={<PowerBankChart20Min />} />
          <Route path="/laptop-chargers" element={<LaptopChargersComingSoon />} />
          <Route path="/cars" element={<CarsComingSoon />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      
      <footer className="mt-24 py-8 border-t border-gray-800 text-center text-gray-600 text-xs font-mono uppercase tracking-widest">
        <p>Charts powered by Recharts · Hand-curated Data</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
