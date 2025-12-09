import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList } from 'recharts';
import { burstData as data } from './data/powerbanks/models';

const maxStackedValue = Math.max(...data.map(item => item.totalValue));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = data.find(d => d.name === label);
    return (
      <div className="bg-gray-900 border border-gray-700 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(234,255,0,1)]">
        <p className="text-white font-bold mb-2 font-display uppercase tracking-wider">{label}</p>
        <p className="text-gray-400 text-xs mb-3 font-mono">{item?.subtitle}</p>
        <p className="text-neon-cyan mb-1 font-mono text-sm">@140W: <strong>{item?.at140W}Wh</strong></p>
        <p className="text-neon-yellow mb-2 font-mono text-sm">@Max: <strong>{item?.atMax}Wh</strong></p>
        <div className="border-t border-gray-800 pt-2 mt-2">
           <p className="text-gray-500 text-xs font-mono">{item?.maxProfile}</p>
        </div>
      </div>
    );
  }
  return null;
};

const BaseValueLabel = ({ x, y, width, value, payload }) => {
  const name = payload?.name || '';
  if (payload?.hideBottomLabel || name.includes('Edge X100') || name.includes('Anker 737') || name.includes('AOHi') || value === 0) return null;
  
  const isPrime300W = name.includes('Prime 300W');
  const labelX = x + width / 2;
  const labelY = y + 20;
  return (
    <text
      x={labelX}
      y={labelY}
      fill={isPrime300W ? '#000000' : '#fff'}
      fontSize="12"
      fontWeight="bold"
      textAnchor="middle"
      fontFamily="monospace"
    >
      {value}Wh
    </text>
  );
};

const TotalValueLabel = ({ x, y, width, value, payload }) => {
  const name = payload?.name || '';
  const isPrime300W = name.includes('Prime 300W');
  const labelX = x + width / 2;
  const labelY = y - 8;
  return (
    <text
      x={labelX}
      y={labelY}
      fill={isPrime300W ? '#000000' : '#ffffff'}
      fontSize="12"
      fontWeight="bold"
      textAnchor="middle"
      fontFamily="monospace"
    >
      {value}Wh
    </text>
  );
};

export default function PowerBankChart20Min() {
  return (
    <div className="bg-black border-2 border-gray-800 p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(3,4,10,1)] relative overflow-hidden">
       {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 mb-8 pl-4 border-l-4 border-neon-yellow">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 uppercase tracking-tight">
          20 Min Burst Check
        </h2>
        <p className="text-gray-400 text-lg md:text-xl font-light">
          Can top power banks recharge enough while I eat a Big Mac to recharge a Macbook Air?
        </p>
      </div>

      <div className="flex flex-wrap gap-6 mb-8 items-center text-sm font-mono uppercase tracking-wider pl-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-neon-magenta"></div>
          <span className="text-white text-xs">MacBook Pro 16 (50Wh)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-neon-cyan"></div>
          <span className="text-white text-xs">MacBook Air 15 (66.5Wh)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-neon-yellow"></div>
          <span className="text-neon-yellow font-bold">Max Input</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-600"></div>
          <span className="text-gray-400">140W Ref</span>
        </div>
      </div>
      
      <div className="relative z-10 pr-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="neonYellowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EAFF00" />
                <stop offset="100%" stopColor="#AACC00" />
              </linearGradient>
              <linearGradient id="neonCyanGradient20" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FFFF" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#00FFFF" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={false}
              axisLine={{ stroke: '#333333' }}
              tickLine={false}
              height={10}
            />
            <YAxis 
              tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#333333' }}
              tickLine={{ stroke: '#333333' }}
              label={{ 
                value: 'Wh GAINED (20 MIN)', 
                angle: -90, 
                position: 'insideLeft',
                fill: '#666',
                fontSize: 10,
                fontFamily: 'monospace',
                offset: 10
              }}
              domain={[0, Math.ceil(maxStackedValue / 10) * 10]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
            
            <ReferenceLine y={50} stroke="#FF00FF" strokeDasharray="4 4" label={{ value: 'MBP 50%', fill: '#FF00FF', fontSize: 10, position: 'right', fontFamily: 'monospace' }} />
            <ReferenceLine y={66.5} stroke="#00FFFF" strokeDasharray="4 4" label={{ value: 'MBA FULL', fill: '#00FFFF', fontSize: 10, position: 'right', fontFamily: 'monospace' }} />

            <Bar 
              dataKey="baseValue" 
              name="@Max Input Wattage" 
              fill="url(#neonYellowGradient)"
              stackId="chargeTime"
              stroke="#000"
              strokeWidth={0}
            >
              {data.map((entry, index) => {
                const isCUKTECH = entry.name.includes('CUKTECH');
                let fillColor;
                if (isCUKTECH) {
                  fillColor = entry.reversed ? "url(#neonYellowGradient)" : "url(#neonCyanGradient20)";
                } else {
                  fillColor = entry.reversed ? "url(#neonCyanGradient20)" : "url(#neonYellowGradient)";
                }
                return <Cell key={`cell-base-${index}`} fill={fillColor} />;
              })}
              <LabelList dataKey="baseValue" position="top" content={<BaseValueLabel />} />
            </Bar>

            <Bar 
              dataKey="topValue" 
              name="@140W (Apple charger)" 
              fill="url(#neonCyanGradient20)"
              stackId="chargeTime"
              stroke="#000"
              strokeWidth={0}
            >
              {data.map((entry, index) => {
                const isCUKTECH = entry.name.includes('CUKTECH');
                let fillColor;
                if (isCUKTECH) {
                  fillColor = entry.reversed ? "url(#neonCyanGradient20)" : "url(#neonYellowGradient)";
                } else {
                  fillColor = entry.reversed ? "url(#neonYellowGradient)" : "url(#neonCyanGradient20)";
                }
                return <Cell key={`cell-top-${index}`} fill={fillColor} />;
              })}
              <LabelList dataKey="totalValue" position="top" content={<TotalValueLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 overflow-x-auto relative">
        <table className="w-full text-left border-collapse min-w-[600px] font-mono text-sm">
          <colgroup>
            <col className="w-48 bg-gray-900/50" />
            {data.map((item, index) => (
              <col key={index} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b-2 border-gray-700">
              <th className="p-4 text-neon-yellow uppercase tracking-widest text-xs font-bold">Model</th>
              {data.map((item, index) => (
                <th key={index} className="p-4 text-center align-top">
                  <div className="text-white font-bold text-xs">{item.name.replace(/ \(.*?\)/, '')}</div>
                  <div className="text-gray-600 text-[10px] mt-1 font-normal">{item.subtitle}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800 hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-gray-400 text-xs uppercase">Peak Input</td>
              {data.map((item, index) => (
                <td key={index} className="p-4 text-center font-bold text-white">{item.maxW}W</td>
              ))}
            </tr>
            <tr className="border-b-2 border-neon-yellow bg-neon-yellow/10">
              <td className="p-4 font-bold text-neon-yellow text-xs uppercase">Wh Gained (Max)</td>
              {data.map((item, index) => (
                <td key={index} className="p-4 text-center font-bold text-neon-yellow">{item.atMax}Wh</td>
              ))}
            </tr>
            <tr className="border-b border-gray-800 bg-neon-cyan/5">
              <td className="p-4 font-bold text-neon-cyan text-xs uppercase">Wh Gained (140W)</td>
              {data.map((item, index) => (
                <td key={index} className="p-4 text-center font-bold text-neon-cyan">{item.at140W}Wh</td>
              ))}
            </tr>
             <tr className="hover:bg-white/5 transition-colors">
              <td className="p-4 font-bold text-gray-500 text-xs uppercase">Input Profile</td>
              {data.map((item, index) => (
                <td key={index} className="p-4 text-center text-[10px] text-gray-500 leading-tight">
                   {item.maxProfile}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
