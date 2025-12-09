import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import PowerBankChart from './PowerBankChart.jsx';
import PowerBankChart20Min from './PowerBankChart20Min.jsx';
import ProductScores from './ProductScores.jsx';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/recharge-time', label: 'Recharge Time' },
  { to: '/burst-recharge', label: 'Burst Recharge' },
  { to: '/products', label: 'Products' },
];

function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-24">
      {/* Hero Section */}
      <section className="pt-12 md:pt-20">
        <div className="inline-block px-3 py-1 mb-4 border border-neon-cyan text-neon-cyan font-mono text-xs uppercase tracking-widest">
          r/chargingsheet lab
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white uppercase leading-[0.9] tracking-tighter mb-8">
          r/chargingsheet<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-yellow to-neon-lime">Power banks ranked</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl font-light leading-relaxed mb-4 border-l-4 border-neon-magenta pl-6">
          Ever wonder why your power bank died faster than expected, couldn't keep up with your MacBook, or got hot and stopped charging mid-flight?
        </p>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl font-light leading-relaxed mb-4">
          The spec sheet said 20,000mAh and 65W — so what happened? We test what the box won't tell you: usable capacity, sustained wattage under load, how output splits across multiple ports, and whether passthrough and UPS modes actually work. Plus the practical stuff — weight, size, and whether it fits in your bag.
        </p>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl font-light leading-relaxed mb-10">
          Raw testing data comes from u/N8falke and the Charging Sheet. We build on that foundation with field testing for mobile and outdoor use.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/products" className="inline-flex items-center justify-center px-8 py-4 bg-neon-yellow text-black font-bold uppercase tracking-wide border-2 border-neon-yellow hover:bg-transparent hover:text-neon-yellow hover:shadow-[4px_4px_0px_0px_#EAFF00] transition-all transform hover:-translate-y-1">
            View Scoreboard ⚡
          </Link>
          <Link to="/recharge-time" className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white font-bold uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_#ffffff] transition-all transform hover:-translate-y-1">
            See Lab Tests →
          </Link>
        </div>
      </section>

      {/* Value Props Strip */}
      <section className="grid md:grid-cols-3 gap-6 border-y border-gray-800 py-12">
        <div className="group">
          <span className="block text-neon-lime font-mono text-xs mb-2">01 / BURST</span>
          <div className="text-2xl font-bold text-white mb-2 group-hover:text-neon-lime transition-colors">Burst Wattage</div>
          <p className="text-gray-500 mb-4">20-minute max-energy delivery tests.</p>
          <Link to="/burst-recharge" className="text-sm font-mono uppercase border-b border-transparent group-hover:border-neon-lime group-hover:text-neon-lime transition-all">
            View Data →
          </Link>
        </div>
        <div className="group">
          <span className="block text-neon-magenta font-mono text-xs mb-2">02 / SUSTAIN</span>
          <div className="text-2xl font-bold text-white mb-2 group-hover:text-neon-magenta transition-colors">Sustained Power</div>
          <p className="text-gray-500 mb-4">How long packs hold MacBook-ready wattage.</p>
          <Link to="/recharge-time" className="text-sm font-mono uppercase border-b border-transparent group-hover:border-neon-magenta group-hover:text-neon-magenta transition-all">
            View Data →
          </Link>
        </div>
        <div className="group">
          <span className="block text-neon-cyan font-mono text-xs mb-2">03 / SCORE</span>
          <div className="text-2xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">Scoreboard</div>
          <p className="text-gray-500 mb-4">Clear rankings for travel workflows.</p>
          <Link to="/products" className="text-sm font-mono uppercase border-b border-transparent group-hover:border-neon-cyan group-hover:text-neon-cyan transition-all">
            View Data →
          </Link>
        </div>
      </section>

      {/* Product Test Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        <Link to="/recharge-time" className="relative p-8 border-2 border-gray-800 bg-gray-900/30 hover:border-neon-magenta hover:bg-gray-900/80 transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 bg-neon-magenta text-black text-xs font-bold px-2 py-1 font-mono transform translate-x-full group-hover:translate-x-0 transition-transform">
            V3 DATA
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-neon-magenta transition-colors">Recharge Time</h3>
          <p className="text-gray-400 mb-6">How fast each pack refuels using Apple-grade chargers.</p>
          <span className="inline-block border border-gray-700 px-4 py-2 text-xs font-mono uppercase text-gray-300 group-hover:border-neon-magenta group-hover:text-neon-magenta transition-colors">
            Enter Lab →
          </span>
        </Link>
        
        <Link to="/burst-recharge" className="relative p-8 border-2 border-gray-800 bg-gray-900/30 hover:border-neon-yellow hover:bg-gray-900/80 transition-all group overflow-hidden">
          <div className="absolute top-0 right-0 bg-neon-yellow text-black text-xs font-bold px-2 py-1 font-mono transform translate-x-full group-hover:translate-x-0 transition-transform">
            NEW
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-neon-yellow transition-colors">Burst Energy</h3>
          <p className="text-gray-400 mb-6">Which packs dump the most watts in the first 20 minutes.</p>
          <span className="inline-block border border-gray-700 px-4 py-2 text-xs font-mono uppercase text-gray-300 group-hover:border-neon-yellow group-hover:text-neon-yellow transition-colors">
            Enter Lab →
          </span>
        </Link>

        <Link to="/products" className="relative p-8 border-2 border-gray-800 bg-gray-900/30 hover:border-neon-cyan hover:bg-gray-900/80 transition-all group overflow-hidden">
           <div className="absolute top-0 right-0 bg-neon-cyan text-black text-xs font-bold px-2 py-1 font-mono transform translate-x-full group-hover:translate-x-0 transition-transform">
            RANKED
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-neon-cyan transition-colors">Scoreboard</h3>
          <p className="text-gray-400 mb-6">A simple ranking of which power banks can actually keep laptops alive.</p>
          <span className="inline-block border border-gray-700 px-4 py-2 text-xs font-mono uppercase text-gray-300 group-hover:border-neon-cyan group-hover:text-neon-cyan transition-colors">
            View Ranks →
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-gray-800 mb-12">
          <div>
            <p className="font-mono text-neon-magenta text-xs tracking-[0.2em] uppercase mb-1">r/chargingsheet lab</p>
            <h2 className="text-2xl font-bold text-white font-display tracking-tight">Portable gear, tested</h2>
          </div>
          <nav className="flex flex-wrap gap-3">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `
                  px-4 py-2 font-mono text-xs uppercase tracking-wider border transition-all duration-200
                  ${isActive 
                    ? 'bg-neon-lime text-black border-neon-lime shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] font-bold' 
                    : 'text-gray-400 border-gray-800 hover:text-neon-lime hover:border-neon-lime hover:shadow-[2px_2px_0px_0px_#00FF66] bg-black'}
                `}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>
        
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recharge-time" element={<PowerBankChart />} />
            <Route path="/burst-recharge" element={<PowerBankChart20Min />} />
            <Route path="/products" element={<ProductScores />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        
        <footer className="mt-24 py-8 border-t border-gray-800 text-center text-gray-600 text-xs font-mono uppercase tracking-widest">
          <p>Charts powered by Recharts · Hand-curated Data</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
