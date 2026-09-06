
// ---- WORLD ----
const CHUNK_SIZE = 16;
const WORLD_HEIGHT = 64;
const SEA_LEVEL = 32;
const RENDER_DISTANCE = 3;

// ---- SEEDED NOISE ----
class Noise {
  constructor(seed=42) {
    this.s = seed;
    const p = new Uint8Array(256);
    for(let i=0;i<256;i++) p[i]=i;
    let s=seed;
    for(let i=255;i>0;i--){
      s=(s*1664525+1013904223)>>>0;
      const j=s%(i+1);
      [p[i],p[j]]=[p[j],p[i]];
    }
    this.p=new Uint8Array(512);
    for(let i=0;i<512;i++) this.p[i]=p[i&255];
  }
  fade(t){return t*t*t*(t*(t*6-15)+10);}
  lerp(a,b,t){return a+t*(b-a);}
  g(h,x,y){h&=3;return((h&1)?-x:x)+((h&2)?-y:y);}
  n(x,y){
    const X=Math.floor(x)&255, Y=Math.floor(y)&255;
    x-=Math.floor(x); y-=Math.floor(y);
    const u=this.fade(x),v=this.fade(y);
    const a=this.p[X]+Y, b=this.p[X+1]+Y;
    return this.lerp(
      this.lerp(this.g(this.p[a],x,y),this.g(this.p[b],x-1,y),u),
      this.lerp(this.g(this.p[a+1],x,y-1),this.g(this.p[b+1],x-1,y-1),u),v);
  }
  oct(x,y,o=4,p=0.5){
    let v=0,f=1,a=1,m=0;
    for(let i=0;i<o;i++){v+=this.n(x*f,y*f)*a;m+=a;a*=p;f*=2;}
    return v/m;
  }
}

// ---- SEEDED PSEUDO-RANDOM for textures ----
function seededRand(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xFFFFFFFF;
  };
}

// ---- THREE.JS globals ----
let canvas, scene, camera, renderer;
let selectionBox, sunLight, ambientLight, skyColor;

// ---- GAME STATE ----
let gameStarted = false;
let gamePaused = false;
let menuOpen = null;
let pointerLocked = false;
let dayTime = 0.25; // 0=midnight, 0.25=sunrise, 0.5=noon, 0.75=sunset
const DAY_DURATION = 600; // seconds

// ---- WORLD ----
const noise1 = new Noise(12345);
const noise2 = new Noise(67890);
const world = new Map();
const generatedChunks = new Set();
const chunkMeshes = new Map();
const dirtyChunks = new Set();

// ---- PLAYER ----
const player = {
  x:0, y:SEA_LEVEL+5, z:0,
  vx:0, vy:0, vz:0,
  yaw:0, pitch:0,
  onGround:false, flying:false, sprinting:false,
  health:20, maxHealth:20, food:20, maxFood:20,
  xp:0, xpLevel:0,
  selectedSlot:0,
  invOpen:false,
};

// ---- INVENTORY ----
const inventory = new Array(36).fill(null);
const armorSlots = new Array(4).fill(null);
const invCraft  = new Array(4).fill(null);  // 2x2
const tableSlots= new Array(9).fill(null);  // 3x3

// ---- INPUT ----
const keys = {};
let isBreaking = false;
let breakStart = 0;
let breakBlock = null;
let breakProgress = 0;
let lookingAt = null;
let lastFrameTime = performance.now();
let frameDt = 16;

// ---- DRAG ----
let dragItem = null;

