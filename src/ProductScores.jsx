import { burstRawList } from './data/powerbanks/models';

const MACBOOK_AIR_WH = 66.5;
const MACBOOK_PRO_50_WH = 50;
const BATTERY_CAPACITY_WH = 100;
const REFERENCE_MINUTES = 20;
const MAX_RECHARGE_WINDOW = 60;

function formatMinutes(value) {
  if (!Number.isFinite(value)) return '—';
  return `${Math.round(value)} min`;
}

export default function ProductScores() {
  const scoredProducts = [...burstRawList]
    .sort((a, b) => b.atMax - a.atMax)
    .map(product => {
      const ratePerMinute = product.atMax / REFERENCE_MINUTES;
      const fullRechargeMinutes = ratePerMinute ? BATTERY_CAPACITY_WH / ratePerMinute : Infinity;
      return {
        ...product,
        fullRechargeMinutes,
        macBookAirReady: product.atMax >= MACBOOK_AIR_WH,
        macBookProReady: product.atMax >= MACBOOK_PRO_50_WH,
        under60: fullRechargeMinutes <= MAX_RECHARGE_WINDOW,
      };
    });

  return (
    <div className="space-y-12">
      <div className="border-l-4 border-neon-cyan pl-6">
        <p className="text-neon-cyan font-mono text-xs uppercase tracking-widest mb-2">Product Scorecard</p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase leading-none">
          Do they recover enough energy for Apple work in 20 minutes?
        </h1>
        <p className="text-xl text-gray-400 font-light max-w-3xl">
          Scores depend on the burst energy (at max input) delivered during a 20-minute recharge.
          We flag MacBook Air (66.5Wh) refills, MacBook Pro 50% top-ups, and whether the whole pack
          regains 100Wh in under an hour.
        </p>
      </div>

      <div className="overflow-x-auto border-2 border-gray-800 bg-black shadow-[8px_8px_0px_0px_rgba(0,255,255,0.4)]">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-900 border-b-2 border-gray-700">
              <th className="p-4 text-neon-cyan uppercase tracking-widest text-xs font-bold font-mono">Product</th>
              <th className="p-4 text-gray-400 uppercase tracking-widest text-xs font-bold font-mono text-center">Air (20 min)</th>
              <th className="p-4 text-gray-400 uppercase tracking-widest text-xs font-bold font-mono text-center">Pro 50% (20 min)</th>
              <th className="p-4 text-gray-400 uppercase tracking-widest text-xs font-bold font-mono text-center">Full pack &lt;60 min?</th>
              <th className="p-4 text-gray-400 uppercase tracking-widest text-xs font-bold font-mono text-right">Full recharge est.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {scoredProducts.map(product => (
              <tr key={product.name} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-white font-display text-lg group-hover:text-neon-cyan transition-colors">{product.name}</div>
                  <span className="text-gray-500 text-xs font-mono uppercase">{product.subtitle}</span>
                </td>
                <td className="p-4 text-center">
                  <span className={`
                    inline-flex items-center justify-center px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider
                    ${product.macBookAirReady 
                      ? 'bg-neon-lime text-black shadow-[2px_2px_0px_0px_rgba(0,255,0,0.5)]' 
                      : 'border border-gray-700 text-gray-600 opacity-50'}
                  `}>
                    {product.macBookAirReady ? 'PASS' : 'FAIL'}
                  </span>
                </td>
                <td className="p-4 text-center">
                   <span className={`
                    inline-flex items-center justify-center px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider
                    ${product.macBookProReady 
                      ? 'bg-neon-lime text-black shadow-[2px_2px_0px_0px_rgba(0,255,0,0.5)]' 
                      : 'border border-gray-700 text-gray-600 opacity-50'}
                  `}>
                    {product.macBookProReady ? 'PASS' : 'FAIL'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`
                    inline-flex items-center justify-center px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider
                    ${product.under60 
                      ? 'bg-neon-cyan text-black shadow-[2px_2px_0px_0px_rgba(0,255,255,0.5)]' 
                      : 'border border-neon-magenta text-neon-magenta shadow-[2px_2px_0px_0px_rgba(255,0,255,0.5)]'}
                  `}>
                    {product.under60 ? 'YES' : 'NO'}
                  </span>
                </td>
                <td className="p-4 text-right font-mono text-white font-bold">
                  {formatMinutes(product.fullRechargeMinutes)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
