import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList, Customized } from 'recharts';
import { rechargeData as data } from './data/powerbanks/models';

const maxStackedValue = Math.max(...data.map(item => item.totalValue));

const truncate = (value, max = 32) => {
  if (!value) return '';
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
};

const TableOverlay = ({ xAxisMap, height, margin, offset }) => {
  const xAxisKey = Object.keys(xAxisMap || {})[0];
  const xAxis = xAxisMap?.[xAxisKey];
  const scale = xAxis?.scale;
  const bandwidth = scale?.bandwidth ? scale.bandwidth() : 0;
  if (!scale || !bandwidth) return null;

  const baseY = height - (margin?.bottom ?? 0) + 10;
  const left = offset?.left ?? 0;
  const tableHeight = 125;
  const rows = [0, 24, 48, 72, 96, tableHeight];
  const rowLabels = ['Model', 'Max In', '@Max', '@140W', 'Sustain / Notes'];

  return (
    <g>
      {/* row header column */}
      <rect
        x={left - bandwidth}
        y={baseY}
        width={bandwidth}
        height={tableHeight}
        fill="rgba(255,255,255,0.04)"
        stroke="#1f1f1f"
        strokeWidth="1"
      />
      {rows.map((r, idx) => (
        <line
          key={`row-header-${idx}`}
          x1={left - bandwidth}
          x2={left}
          y1={baseY + r}
          y2={baseY + r}
          stroke="#1f1f1f"
          strokeWidth={1}
        />
      ))}
      <foreignObject x={left - bandwidth} y={baseY} width={bandwidth} height={tableHeight}>
        <div className="w-full h-full flex flex-col justify-between text-left font-mono text-[10px] leading-tight text-gray-300 px-1 py-1">
          <div className="text-xs font-bold text-white">{rowLabels[0]}</div>
          <div>{rowLabels[1]}</div>
          <div>{rowLabels[2]}</div>
          <div>{rowLabels[3]}</div>
          <div className="text-gray-500">{rowLabels[4]}</div>
        </div>
      </foreignObject>

      {data.map(item => {
        const x = left + scale(item.name);
        return (
          <rect
            key={`${item.name}-bg`}
            x={x}
            y={baseY}
            width={bandwidth}
            height={tableHeight}
            fill="rgba(255,255,255,0.02)"
            stroke="#1f1f1f"
            strokeWidth="1"
          />
        );
      })}
      {rows.map((r, idx) => (
        <line
          key={`row-${idx}`}
          x1={left}
          x2={left + scale.range()[1]}
          y1={baseY + r}
          y2={baseY + r}
          stroke="#1f1f1f"
          strokeWidth={1}
        />
      ))}

      {data.map(item => {
        const x = left + scale(item.name);
        const sustainLabel = item.sustains && item.sustains !== 'Full' ? item.sustains : 'Full';
        return (
          <foreignObject key={item.name} x={x} y={baseY} width={bandwidth} height={tableHeight}>
            <div className="w-full h-full text-center font-mono text-[10px] leading-tight text-gray-300 px-1 py-1">
              <div className="text-white font-bold text-xs truncate">{item.name.replace(/ \(.*?\)/, '')}</div>
              {item.subtitle && <div className="text-gray-500 truncate">{truncate(item.subtitle, 40)}</div>}
              <div>Max In: <span className="text-neon-magenta font-bold">{item.maxW}W</span></div>
              <div>@Max: <span className="text-neon-magenta font-bold">{item.atMax}m</span></div>
              <div>@140W: <span className="text-neon-cyan font-bold">{item.at140W}m</span></div>
              <div>Sustain: <span className="text-neon-yellow font-bold">{sustainLabel}</span></div>
              {item.outputThrottling && <div className="text-gray-600 truncate">{truncate(item.outputThrottling, 42)}</div>}
            </div>
          </foreignObject>
        );
      })}
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = data.find(d => d.name === label);
    return (
      <div className="bg-gray-900 border border-gray-700 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(255,0,255,1)]">
        <p className="text-white font-bold mb-2 font-display uppercase tracking-wider">{label}</p>
        <p className="text-gray-400 text-xs mb-3 font-mono">{item?.subtitle}</p>
        <p className="text-neon-cyan mb-1 font-mono text-sm">@140W: <strong>{payload[0]?.value} min</strong></p>
        <p className="text-neon-magenta mb-2 font-mono text-sm">@{item?.maxW}W: <strong>{payload[1]?.value} min</strong></p>
        <div className="border-t border-gray-800 pt-2 mt-2">
           <p className="text-gray-500 text-xs font-mono">Sustains max: {item?.sustains}</p>
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
      {value}
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
      {value}
    </text>
  );
};

export default function PowerBankChart() {
  return (
    <div className="bg-black border-2 border-gray-800 p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(3,4,10,1)] relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 mb-8 pl-4 border-l-4 border-neon-magenta">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 uppercase tracking-tight">
          Full recharge time
        </h2>
        <p className="text-gray-400 text-lg md:text-xl font-light">
          It’s 45 minutes to boarding and your laptop emptied your power bank. How quickly can it refill?
        </p>
      </div>

      <div className="flex gap-6 mb-8 items-center text-sm font-mono uppercase tracking-wider pl-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-neon-magenta"></div>
          <span className="text-white">Max Input</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-neon-cyan opacity-50"></div>
          <span className="text-gray-400">140W Input</span>
        </div>
      </div>
      
      <div className="relative z-10 pr-4">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: 0, bottom: 160 }}
            barCategoryGap="25%"
          >
            <defs>
              <linearGradient id="neonCyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FFFF" stopOpacity={0.6}/>
                <stop offset="100%" stopColor="#00FFFF" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="neonMagentaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF00FF" />
                <stop offset="100%" stopColor="#D900D9" />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={false}
              axisLine={{ stroke: '#333333' }}
              tickLine={false}
              height={0}
            />
            <YAxis 
              tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#333333' }}
              tickLine={{ stroke: '#333333' }}
              label={{ 
                value: 'TIME (MIN)', 
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
            <ReferenceLine y={45} stroke="#EAFF00" strokeDasharray="4 4" label={{ value: '45 MIN TARGET', fill: '#EAFF00', fontSize: 10, position: 'right', fontFamily: 'monospace' }} />

            <Bar 
              dataKey="baseValue" 
              name="@Max Input Wattage" 
              fill="url(#neonMagentaGradient)"
              stackId="chargeTime"
              stroke="#000"
              strokeWidth={0}
            >
              {data.map((entry, index) => {
                const fillColor = entry.reversed ? "url(#neonCyanGradient)" : "url(#neonMagentaGradient)";
                return <Cell key={`cell-base-${index}`} fill={fillColor} />;
              })}
              <LabelList dataKey="baseValue" position="top" content={<BaseValueLabel />} />
            </Bar>

            <Bar 
              dataKey="topValue" 
              name="@140W (Apple charger)" 
              fill="url(#neonCyanGradient)"
              stackId="chargeTime"
              stroke="#000"
              strokeWidth={0}
            >
              {data.map((entry, index) => {
                const fillColor = entry.reversed ? "url(#neonMagentaGradient)" : "url(#neonCyanGradient)";
                return <Cell key={`cell-top-${index}`} fill={fillColor} />;
              })}
              <LabelList dataKey="totalValue" position="top" content={<TotalValueLabel />} />
            </Bar>

            <Customized component={TableOverlay} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
