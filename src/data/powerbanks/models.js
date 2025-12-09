import ecoFlowRapidPro20k from './eco-flow-rapid-pro-276k.json';
import prime300W from './prime-300w-26k.json';
import prime250W from './prime-250w-276k.json';
import anker737 from './anker-737-24k.json';
import cuktech15Ultra from './cuktech-15-ultra-20k.json';
import iniu140W from './iniu-140w.json';
import anker165W from './anker-165w.json';
import ugreen165W from './ugreen-165w.json';
import anker87W from './anker-87w.json';
import asperx165W from './asperx-165w.json';

import rechargeAnker737 from './45min/anker-737-24k.json';
import rechargeCuktech15Ultra from './45min/cuktech-15-ultra-20k.json';
import rechargeAohi310 from './45min/aohi-310w-20k.json';
import rechargePrime250W from './45min/prime-250w-276k.json';
import rechargeEcoFlowPro from './45min/eco-flow-rapid-pro-276k.json';
import rechargePrime300W from './45min/prime-300w-26k.json';
import rechargeEdgeX100 from './45min/edge-x100-27k.json';

import chargingSheets from './charging';

const chargingBySlug = new Map(chargingSheets.map(item => [item.slug, item]));

const combined = [
  {
    slug: 'eco-flow-rapid-pro-276k',
    name: ecoFlowRapidPro20k.name,
    subtitle: ecoFlowRapidPro20k.subtitle || '',
    burst: ecoFlowRapidPro20k,
    recharge: rechargeEcoFlowPro,
    chargingSheet: chargingBySlug.get('eco-flow-rapid-pro-276k') || null,
  },
  {
    slug: 'prime-300w-26k',
    name: prime300W.name,
    subtitle: prime300W.subtitle || '',
    burst: prime300W,
    recharge: rechargePrime300W,
    chargingSheet: chargingBySlug.get('prime-300w-26k') || null,
  },
  {
    slug: 'prime-250w-276k',
    name: prime250W.name,
    subtitle: prime250W.subtitle || '',
    burst: prime250W,
    recharge: rechargePrime250W,
    chargingSheet: chargingBySlug.get('prime-250w-276k') || null,
  },
  {
    slug: 'anker-737-24k',
    name: anker737.name,
    subtitle: anker737.subtitle || '',
    burst: anker737,
    recharge: rechargeAnker737,
    chargingSheet: chargingBySlug.get('anker-737-24k') || null,
  },
  {
    slug: 'cuktech-15-ultra-20k',
    name: cuktech15Ultra.name,
    subtitle: cuktech15Ultra.subtitle || '',
    burst: cuktech15Ultra,
    recharge: rechargeCuktech15Ultra,
    chargingSheet: chargingBySlug.get('cuktech-15-ultra-20k') || null,
  },
  {
    slug: 'iniu-140w',
    name: iniu140W.name,
    subtitle: iniu140W.subtitle || '',
    burst: iniu140W,
    recharge: null,
    chargingSheet: chargingBySlug.get('iniu-140w') || null,
  },
  {
    slug: 'anker-165w',
    name: anker165W.name,
    subtitle: anker165W.subtitle || '',
    burst: anker165W,
    recharge: null,
    chargingSheet: null,
  },
  {
    slug: 'ugreen-165w',
    name: ugreen165W.name,
    subtitle: ugreen165W.subtitle || '',
    burst: ugreen165W,
    recharge: null,
    chargingSheet: chargingBySlug.get('ugreen-165w') || null,
  },
  {
    slug: 'anker-87w',
    name: anker87W.name,
    subtitle: anker87W.subtitle || '',
    burst: anker87W,
    recharge: null,
    chargingSheet: null,
  },
  {
    slug: 'asperx-165w',
    name: asperx165W.name,
    subtitle: asperx165W.subtitle || '',
    burst: asperx165W,
    recharge: null,
    chargingSheet: chargingBySlug.get('asperx-165w') || null,
  },
  {
    slug: 'aohi-310w-20k',
    name: rechargeAohi310.name,
    subtitle: rechargeAohi310.subtitle || '',
    burst: null,
    recharge: rechargeAohi310,
    chargingSheet: chargingBySlug.get('aohi-310w-20k') || null,
  },
  {
    slug: 'edge-x100-27k',
    name: rechargeEdgeX100.name,
    subtitle: rechargeEdgeX100.subtitle || '',
    burst: null,
    recharge: rechargeEdgeX100,
    chargingSheet: chargingBySlug.get('edge-x100-27k') || null,
  },
];

export const burstRawList = combined
  .filter(item => item.burst)
  .map(item => ({
    ...item.burst,
    name: item.name,
    subtitle: item.subtitle,
    slug: item.slug,
  }));

export const rechargeRawList = combined
  .filter(item => item.recharge)
  .map(item => ({
    ...item.recharge,
    name: item.name,
    subtitle: item.subtitle,
    slug: item.slug,
  }));

export const burstData = [...burstRawList]
  .sort((a, b) => b.atMax - a.atMax)
  .map(item => {
    const hideBottomLabel = item.atMax === item.at140W;
    const hideBottomBar = item.atMax === item.at140W;

    if (item.atMax >= item.at140W) {
      return {
        ...item,
        baseValue: hideBottomBar ? 0 : item.at140W,
        topValue: hideBottomBar ? item.atMax : item.atMax - item.at140W,
        totalValue: item.atMax,
        hideBottomLabel,
      };
    }
    return {
      ...item,
      baseValue: hideBottomBar ? 0 : item.atMax,
      topValue: hideBottomBar ? item.at140W : item.at140W - item.atMax,
      totalValue: item.at140W,
      reversed: true,
      hideBottomLabel,
    };
  });

export const rechargeData = [...rechargeRawList]
  .sort((a, b) => a.atMax - b.atMax)
  .map(item => {
    const hideBottomLabel = item.name.includes('Edge X100') || item.name.includes('Anker 737') || item.name.includes('AOHi');
    const hideBottomBar = hideBottomLabel;
    if (item.atMax <= item.at140W) {
      return {
        ...item,
        baseValue: hideBottomBar ? 0 : item.atMax,
        topValue: hideBottomBar ? item.at140W : item.at140W - item.atMax,
        totalValue: item.at140W,
        hideBottomLabel,
      };
    }
    return {
      ...item,
      baseValue: hideBottomBar ? 0 : item.at140W,
      topValue: hideBottomBar ? item.atMax : item.atMax - item.at140W,
      totalValue: item.atMax,
      reversed: true,
      hideBottomLabel,
    };
  });

export default combined;

