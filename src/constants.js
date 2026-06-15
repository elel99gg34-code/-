'use strict';

// Canvas / scale
const W = 960, H = 540;
const S = 3;          // pixel scale: 1 logical px = 3×3 real px
const LW = W / S;     // 320 logical cols
const LH = H / S;     // 180 logical rows

// World layout
const ROOM_COUNT = 5;
const ROOM_W = LW;    // each room = 320 logical px wide

// Vertical zones (logical pixels)
const CEIL_Y  = 18;   // top of visible wall
const WALL_Y  = 26;   // where wallpaper starts
const FLOOR_Y = 145;  // floor line (player stands here)
const GND_Y   = 148;  // top of floor surface drawing

const PLAYER_W = 10;
const PLAYER_H = 22;

// Room indices
const RM = { BED:0, HALL:1, LIVE:2, KITCHEN:3, BATH:4 };

// Color palette
const C = {
  // Ceilings
  ceil:       '#D8D0C8',
  ceilMold:   '#C0B8A8',  // day2+

  // Walls
  bedWall:    '#B4C6D8',
  hallWall:   '#CBBFA8',
  liveWall:   '#CCB898',
  kitWall:    '#D8D0BC',
  bathWall:   '#BED4CC',

  // Floors
  wood1:      '#8C7248',
  wood2:      '#7A5E38',
  wood3:      '#9A8054',
  tile1:      '#C8C8C4',
  tile2:      '#B8B8B4',
  carpet1:    '#8A6060',
  carpet2:    '#7A5050',
  lino1:      '#C8BC98',
  lino2:      '#B8AC88',

  // Player
  skin:       '#EFAD7A',
  hair:       '#2E1A08',
  shirt:      '#6888BB',
  pants:      '#3A4258',
  shoe:       '#2A1808',
  arm:        '#EFAD7A',

  // Furniture tones
  woodF:      '#8B6030',
  woodFD:     '#5A3C18',
  woodFL:     '#C09050',
  white:      '#ECECE8',
  offwhite:   '#D8D4C8',
  gray:       '#909090',
  darkGray:   '#585858',
  black:      '#101010',
  metalD:     '#707880',
  metalL:     '#A8B0B8',
  pillowBlue: '#8898C0',
  pillowBlu2: '#6878A0',
  bedSheet:   '#C0CCDC',
  bedSheet2:  '#A8B8CC',
  lampYellow: '#F8E070',
  tvScreen:   '#102030',
  tvGlow:     '#203848',
  bookRed:    '#8B2020',
  bookBlue:   '#203868',
  bookGreen:  '#205838',
  potGreen:   '#506840',
  potSoil:    '#4A3020',
  cupboard:   '#AA8845',
  cupboardD:  '#886633',
  fridgeCol:  '#D4D8D4',

  // Sky / window
  skyDay:     '#87CEEB',
  skyDusk:    '#E88040',
  skyNight:   '#0A0E1A',
  skyNight2:  '#060810',
  grassDay:   '#3A8830',
  treeD:      '#184818',

  // Horror
  ghost:      '#060609',
  ghostEdge:  '#0E0E14',
  shadowOverlay: 'rgba(0,0,0,',
  bloodRed:   '#600010',
  redFlicker: 'rgba(80,0,0,',
};
