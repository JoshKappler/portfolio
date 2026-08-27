// JK mark geometry for the globe loader, replacing the GT mark the engine
// shipped with. Same contract as the studio's extractor output: elements are
// centerline polylines with per-point half-widths in the 1198-unit space.
// Slab letterforms so the melt chunks read as typewriter ink.

const jStem = {
  name: 'J-stem',
  homePts: [
    [430, 300], [430, 560], [430, 720], [428, 775], [416, 828], [394, 870],
    [360, 898], [318, 910], [274, 904], [236, 880], [210, 844], [197, 800],
  ],
  homeHw: [48, 48, 48, 47, 45, 43, 41, 39, 36, 34, 32, 30],
};

export const MARK_GEOMETRY = {
  mark: { x0: 150, x1: 1085, y0: 242, y1: 958, mcx: 617, mcy: 600, img: null, imgW: 1198 },
  e0Face: null,
  elements: [
    { name: 'J-top', homePts: [[190, 296], [352, 296], [515, 296]], homeHw: [36, 36, 36] },
    jStem,
    { name: 'K-stem', homePts: [[668, 262], [668, 600], [668, 938]], homeHw: [48, 48, 48] },
    { name: 'K-arm', homePts: [[1010, 268], [860, 424], [700, 590]], homeHw: [40, 40, 42] },
    { name: 'K-leg', homePts: [[712, 568], [870, 748], [1035, 932]], homeHw: [42, 44, 46] },
    { name: 'K-top-serif', homePts: [[610, 268], [668, 268], [730, 268]], homeHw: [26, 26, 26] },
    { name: 'K-bot-serif', homePts: [[610, 932], [668, 932], [730, 932]], homeHw: [26, 26, 26] },
  ],
  apps: [],
};
