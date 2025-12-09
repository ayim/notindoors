import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList, Customized } from 'recharts';
import { burstData as data } from './data/powerbanks/models';

const maxStackedValue = Math.max(...data.map(item => item.totalValue));

const truncate = (value, max = 32) => {
  if (!value) return '';
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
};

const TableOverlay = ({ xAxisMap, height, margin }) => {
  const xAxisKey = Object.keys(xAxisMap || {})[0];
  const xAxis = xAxisMap?.[xAxisKey];
  const scale = xAxis?.scale;
  const bandwidth = scale?.bandwidth ? scale.bandwidth() : 0;
  if (!scale || !bandwidth) return null;

  const baseY = height - (margin?.bottom ?? 0) + 10;
  const range = scale.range();
  const rangeStart = Array.isArray(range) ? range[0] : 0;
  const rangeEnd = Array.isArray(range) ? range[1] : 0;
  const headerWidth = 120; // keep header width fixed so we don't add phantom columns
  const tableHeight = 120;
  const rows = [0, 26, 50, 74, 98, tableHeight];
  const rowHeights = rows.slice(1).map((r, i) => rows[i + 1] - rows[i]);
  const rowLabels = ['Model', 'Peak In', '@Max', '@140W', 'Sustain / Profile'];
  const headerX = rangeStart - headerWidth + 4;

  return (
    <g>
      {/* row header column (keep inside plot area to avoid clipping) */}
      <rect
        x={headerX}
        y={baseY}
        width={headerWidth}
        height={tableHeight}
        fill="rgba(255,255,255,0.04)"
        stroke="#1f1f1f"
        strokeWidth="1"
      />
      {rows.map((r, idx) => (
        <line
          key={`row-header-${idx}`}
          x1={headerX}
          x2={rangeEnd}
          y1={baseY + r}
          y2={baseY + r}
          stroke="#1f1f1f"
          strokeWidth={1}
        />
      ))}
      <foreignObject x={headerX} y={baseY} width={headerWidth} height={tableHeight}>
        <div className="w-full h-full flex flex-col font-mono text-[10px] leading-tight text-gray-300 px-2 py-1">
          {rowLabels.map((label, i) => (
            <div
              key={label}
              style={{ height: `${rowHeights[i]}px` }}
              className="flex items-center justify-start"
            >
              <span className={i === 0 ? 'text-white text-xs font-bold' : i === 4 ? 'text-gray-500' : ''}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </foreignObject>

      {data.map(item => {
        const x = scale(item.name);
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
          x1={rangeStart}
          x2={rangeEnd}
          y1={baseY + r}
          y2={baseY + r}
          stroke="#1f1f1f"
          strokeWidth={1}
        />
      ))}

      {data.map(item => {
        const x = scale(item.name);
        return (
          <foreignObject key={item.name} x={x} y={baseY} width={bandwidth} height={tableHeight}>
            <div className="w-full h-full font-mono text-[10px] leading-tight text-gray-300 px-1 py-1">
              {[
                <div
                  key="name"
                  className="text-white font-bold text-xs truncate text-center"
                  title={item.subtitle || ''}
                >
                  {item.name.replace(/ \(.*?\)/, '')}
                </div>,
                <div key="maxW" className="text-neon-yellow font-bold text-center">
                  {item.maxW}W
                </div>,
                <div key="atMax" className="text-neon-yellow font-bold text-center">
                  {item.atMax}Wh
                </div>,
                <div key="at140" className="text-neon-cyan font-bold text-center">
                  {item.at140W}Wh
                </div>,
                item.maxProfile ? (
                  <div key="note" className="text-gray-600 truncate text-center">
                    {truncate(item.maxProfile, 42)}
                  </div>
                ) : null,
              ]
                .filter(Boolean)
                .map((node, i) => (
                  <div
                    key={i}
                    style={{ height: `${rowHeights[i] || rowHeights[rowHeights.length - 1]}px` }}
                    className="flex items-center justify-center"
                  >
                    {node}
                  </div>
                ))}
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
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: 140, bottom: 150 }}
            barCategoryGap="25%"
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
              height={0}
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

            <Customized component={TableOverlay} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
