import packs from './packs';

const combined = packs.map(item => ({
  ...item,
  chargingSheet: item.charging || null,
}));

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

