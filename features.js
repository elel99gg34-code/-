// ============================================================
// FEATURES: 용광로 · 상자 · 소리 · 허기 · 수영 · 하늘 · 동굴 · 몹
// game.js 의 전역을 확장한다.
// ============================================================

// ---------- 제련 레시피 ----------
const SMELT = {
  [BLOCKS.IRON_ORE]:    {id:'iron_ingot', n:1},
  [BLOCKS.GOLD_ORE]:    {id:'gold_ingot', n:1},
  [BLOCKS.SAND]:        {id:BLOCKS.GLASS, n:1},
  [BLOCKS.COBBLESTONE]: {id:BLOCKS.STONE, n:1},
  [BLOCKS.CLAY]:        {id:'brick_item', n:1},
  [BLOCKS.NETHERRACK]:  {id:'nether_brick_item', n:1},
  raw_beef:     {id:'cooked_beef', n:1},
  raw_porkchop: {id:'cooked_porkchop', n:1},
  raw_chicken:  {id:'cooked_chicken', n:1},
  raw_fish:     {id:'cooked_fish', n:1},
};

// 연료: 아이템 -> 태울 수 있는 아이템 개수
const FUEL = {
  coal: 8,
  [BLOCKS.OAK_LOG]: 1.5, [BLOCKS.BIRCH_LOG]: 1.5, [BLOCKS.SPRUCE_LOG]: 1.5,
  [BLOCKS.OAK_PLANKS]: 1, [BLOCKS.BIRCH_PLANKS]: 1, [BLOCKS.SPRUCE_PLANKS]: 1,
  [BLOCKS.CRAFTING_TABLE]: 1, [BLOCKS.BOOKSHELF]: 1, [BLOCKS.CHEST]: 1,
  stick: 0.5, lava_bucket: 100,
};

const SMELT_TIME = 6;   // 아이템 1개 굽는 데 걸리는 초

// ---------- 블록 위치별 상태 저장 ----------
const furnaces = new Map();   // "x,y,z" -> {input,fuel,output,burn,burnMax,progress}
const chests   = new Map();   // "x,y,z" -> Array(27)

function furnaceAt(k){
  if(!furnaces.has(k)) furnaces.set(k,{input:null,fuel:null,output:null,burn:0,burnMax:0,progress:0});
  return furnaces.get(k);
}
function chestAt(k){
  if(!chests.has(k)) chests.set(k,new Array(27).fill(null));
  return chests.get(k);
}

let openFurnaceKey = null;
let openChestKey   = null;

// ---------- 용광로 연소 처리 (매 프레임) ----------
function tickFurnaces(dt){
  for(const [k,f] of furnaces){
    const smeltable = f.input && SMELT[f.input.id];
    const outputOk = !f.output || (smeltable && f.output.id===smeltable.id && f.output.count<64);

    // 연료 태우기 시작
    if(f.burn<=0 && smeltable && outputOk && f.fuel){
      const power = FUEL[f.fuel.id];
      if(power){
        f.burnMax = power*SMELT_TIME;
        f.burn = f.burnMax;
        f.fuel.count--;
        if(f.fuel.count<=0) f.fuel = f.fuel.id==='lava_bucket' ? {id:'bucket',count:1} : null;
      }
    }

    if(f.burn>0){
      f.burn -= dt;
      if(smeltable && outputOk){
        f.progress += dt;
        if(f.progress>=SMELT_TIME){
          f.progress = 0;
          if(f.output) f.output.count += smeltable.n;
          else f.output = {id:smeltable.id, count:smeltable.n};
          f.input.count--;
          if(f.input.count<=0) f.input = null;
        }
      } else {
        f.progress = 0;
      }
    } else {
      f.burn = 0;
      f.progress = Math.max(0, f.progress - dt*2);
    }

  }

  // 열려 있는 용광로 UI 는 초당 10회만 갱신
  if(menuOpen==='furnace'){
    furnaceUiTimer += dt;
    if(furnaceUiTimer >= 0.1){ furnaceUiTimer = 0; buildFurnaceUI(); }
  }
}
let furnaceUiTimer = 0;

// ---------- 용광로 UI ----------
function openFurnace(x,y,z){
  openFurnaceKey = `${x},${y},${z}`;
  menuOpen = 'furnace';
  document.getElementById('furnace-screen').classList.add('active');
  document.exitPointerLock();
  buildFurnaceUI();
}
function closeFurnace(){
  openFurnaceKey = null;
  menuOpen = null;
  document.getElementById('furnace-screen').classList.remove('active');
  canvas.requestPointerLock();
  renderHotbarUI();
}

function buildFurnaceUI(){
  const f = furnaceAt(openFurnaceKey);

  const fill = (elId, item, onClick) => {
    const el = document.getElementById(elId);
    el.innerHTML='';
    const c = document.createElement('canvas');
    const sz = elId==='furnace-output' ? 42 : 32;
    c.width=sz; c.height=sz;
    drawItem(c.getContext('2d'), item, 0, 0, sz);
    el.appendChild(c);
    el.onclick = onClick;
  };

  fill('furnace-input', f.input, ()=>{ f.input = swapDrag(f.input); buildFurnaceUI(); });
  fill('furnace-fuel',  f.fuel,  ()=>{ f.fuel  = swapDrag(f.fuel);  buildFurnaceUI(); });
  // 결과 슬롯은 꺼내기만 가능
  fill('furnace-output', f.output, ()=>{
    if(f.output && !dragItem){ dragItem = f.output; f.output = null; updateDragCanvas(); buildFurnaceUI(); renderHotbarUI(); }
  });

  // 불꽃 게이지
  const fi = document.getElementById('fire-icon');
  fi.innerHTML='';
  const fc = document.createElement('canvas'); fc.width=20; fc.height=20;
  const fx = fc.getContext('2d');
  const burnFrac = f.burnMax>0 ? Math.max(0,f.burn/f.burnMax) : 0;
  fx.fillStyle='#333'; fx.fillRect(4,2,12,16);
  if(burnFrac>0){
    const h = Math.round(16*burnFrac);
    const g = fx.createLinearGradient(0,18-h,0,18);
    g.addColorStop(0,'#ffdd33'); g.addColorStop(1,'#ff5500');
    fx.fillStyle=g; fx.fillRect(4,18-h,12,h);
  }
  fi.appendChild(fc);

  // 제련 진행 화살표
  const sa = document.getElementById('smelt-arrow');
  sa.innerHTML='';
  const ac = document.createElement('canvas'); ac.width=44; ac.height=20;
  const ax = ac.getContext('2d');
  ax.fillStyle='#555'; ax.fillRect(0,7,40,6);
  ax.beginPath(); ax.moveTo(40,2); ax.lineTo(44,10); ax.lineTo(40,18); ax.closePath(); ax.fill();
  const pf = Math.min(1, f.progress/SMELT_TIME);
  if(pf>0){
    ax.fillStyle='#ffffff'; ax.fillRect(0,7,40*pf,6);
    if(pf>0.9){ ax.beginPath(); ax.moveTo(40,2); ax.lineTo(44,10); ax.lineTo(40,18); ax.closePath(); ax.fill(); }
  }
  sa.appendChild(ac);

  fillInvGrids('furnace-inv-grid','furnace-inv-hotbar');
}

// ---------- 상자 UI ----------
function openChest(x,y,z){
  openChestKey = `${x},${y},${z}`;
  menuOpen = 'chest';
  document.getElementById('chest-screen').classList.add('active');
  document.exitPointerLock();
  buildChestUI();
  playSound('chest');
}
function closeChest(){
  openChestKey = null;
  menuOpen = null;
  document.getElementById('chest-screen').classList.remove('active');
  canvas.requestPointerLock();
  renderHotbarUI();
  playSound('chest');
}

function buildChestUI(){
  const box = chestAt(openChestKey);
  const grid = document.getElementById('chest-grid');
  grid.innerHTML='';
  for(let i=0;i<27;i++){
    grid.appendChild(makeSlot(box[i], ()=>{ box[i] = swapDrag(box[i]); buildChestUI(); renderHotbarUI(); }));
  }
  fillInvGrids('chest-inv-grid','chest-inv-hotbar');
}

// ---------- 공용: 인벤토리 그리드 채우기 ----------
function fillInvGrids(gridId, hotbarId){
  const g = document.getElementById(gridId);
  g.innerHTML='';
  for(let i=9;i<36;i++){
    g.appendChild(makeSlot(inventory[i], ()=>{ inventory[i] = swapDrag(inventory[i]); refreshOpenMenu(); }));
  }
  const h = document.getElementById(hotbarId);
  h.innerHTML='';
  for(let i=0;i<9;i++){
    h.appendChild(makeSlot(inventory[i], ()=>{ inventory[i] = swapDrag(inventory[i]); refreshOpenMenu(); }));
  }
}

function refreshOpenMenu(){
  if(menuOpen==='furnace') buildFurnaceUI();
  else if(menuOpen==='chest') buildChestUI();
  renderHotbarUI();
}

// ============================================================
// 소리 (Web Audio 로 절차적 생성 — 외부 파일 없음)
// ============================================================
let audioCtx = null;
function initAudio(){
  if(!audioCtx){
    try { audioCtx = new (window.AudioContext||window.webkitAudioContext)(); } catch(e){}
  }
  if(audioCtx && audioCtx.state==='suspended') audioCtx.resume();
}

function playSound(type, pitch=1){
  if(!audioCtx) return;
  const t = audioCtx.currentTime;
  const g = audioCtx.createGain();
  g.connect(audioCtx.destination);

  if(type==='dig' || type==='step'){
    // 노이즈 버스트
    const len = type==='dig' ? 0.12 : 0.07;
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate*len, audioCtx.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i] = (Math.random()*2-1) * (1 - i/d.length);
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const flt = audioCtx.createBiquadFilter();
    flt.type='lowpass'; flt.frequency.value = 500*pitch;
    src.connect(flt); flt.connect(g);
    g.gain.setValueAtTime(type==='dig'?0.28:0.13, t);
    g.gain.exponentialRampToValueAtTime(0.001, t+len);
    src.start(t); src.stop(t+len);
    return;
  }

  const o = audioCtx.createOscillator();
  o.connect(g);
  if(type==='place'){
    o.type='square'; o.frequency.setValueAtTime(180*pitch,t);
    o.frequency.exponentialRampToValueAtTime(90*pitch,t+0.08);
    g.gain.setValueAtTime(0.18,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.1);
    o.start(t); o.stop(t+0.1);
  } else if(type==='pop'){
    o.type='sine'; o.frequency.setValueAtTime(600*pitch,t);
    o.frequency.exponentialRampToValueAtTime(1100*pitch,t+0.06);
    g.gain.setValueAtTime(0.14,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.08);
    o.start(t); o.stop(t+0.08);
  } else if(type==='hurt'){
    o.type='sawtooth'; o.frequency.setValueAtTime(320,t);
    o.frequency.exponentialRampToValueAtTime(90,t+0.22);
    g.gain.setValueAtTime(0.22,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
    o.start(t); o.stop(t+0.25);
  } else if(type==='eat'){
    o.type='triangle'; o.frequency.setValueAtTime(220,t);
    g.gain.setValueAtTime(0.15,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.14);
    o.start(t); o.stop(t+0.14);
  } else if(type==='chest'){
    o.type='sine'; o.frequency.setValueAtTime(300*pitch,t);
    o.frequency.linearRampToValueAtTime(450*pitch,t+0.12);
    g.gain.setValueAtTime(0.1,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.14);
    o.start(t); o.stop(t+0.14);
  } else if(type==='levelup'){
    [523,659,784].forEach((f,i)=>{
      const oo=audioCtx.createOscillator(), gg=audioCtx.createGain();
      oo.type='sine'; oo.frequency.value=f; oo.connect(gg); gg.connect(audioCtx.destination);
      gg.gain.setValueAtTime(0.12,t+i*0.08);
      gg.gain.exponentialRampToValueAtTime(0.001,t+i*0.08+0.2);
      oo.start(t+i*0.08); oo.stop(t+i*0.08+0.2);
    });
  }
}

// ============================================================
// 생존: 허기 · 체력 · 수영 · 낙하 · 사망
// ============================================================
const survival = {
  hungerTimer: 0,
  regenTimer: 0,
  starveTimer: 0,
  stepTimer: 0,
  lastY: 0,
  fallStart: null,
  dead: false,
  damageFlash: 0,
  breath: 10,
  breathTimer: 0,
};

function playerInWater(){
  return getBlock(Math.floor(player.x), Math.floor(player.y-0.6), Math.floor(player.z)) === BLOCKS.WATER;
}
function playerHeadInWater(){
  return getBlock(Math.floor(player.x), Math.floor(player.y), Math.floor(player.z)) === BLOCKS.WATER;
}
function playerInLava(){
  return getBlock(Math.floor(player.x), Math.floor(player.y-0.6), Math.floor(player.z)) === BLOCKS.LAVA;
}

function damage(amount, reason){
  if(survival.dead || player.flying) return;
  player.health = Math.max(0, player.health - amount);
  survival.damageFlash = 0.35;
  playSound('hurt');
  renderHeartFood();
  if(player.health<=0) doDeath();
}

function heal(amount){
  player.health = Math.min(player.maxHealth, player.health + amount);
  renderHeartFood();
}

function doDeath(){
  survival.dead = true;
  menuOpen = 'death';
  document.getElementById('death-screen').classList.add('active');
  document.exitPointerLock();
}

function respawn(){
  survival.dead = false;
  menuOpen = null;
  document.getElementById('death-screen').classList.remove('active');
  player.health = player.maxHealth;
  player.food = player.maxFood;
  survival.breath = 10;
  survival.fallStart = null;
  const sh = getSpawnHeight(0,0);
  player.x=0; player.y=sh+3; player.z=0;
  player.vx=player.vy=player.vz=0;
  renderHeartFood();
  canvas.requestPointerLock();
}

function tickSurvival(dt){
  if(!gameStarted || gamePaused || survival.dead) return;

  // --- 허기 감소 ---
  const moving = keys['KeyW']||keys['KeyA']||keys['KeyS']||keys['KeyD'];
  let drain = 0.12;                          // 기본 소모
  if(moving) drain += player.sprinting ? 0.55 : 0.18;
  survival.hungerTimer += drain*dt;
  if(survival.hungerTimer >= 4){
    survival.hungerTimer = 0;
    player.food = Math.max(0, player.food-1);
    renderHeartFood();
  }

  // --- 자연 회복 / 굶주림 ---
  if(player.food >= 18 && player.health < player.maxHealth){
    survival.regenTimer += dt;
    if(survival.regenTimer >= 4){ survival.regenTimer = 0; heal(1); }
  } else survival.regenTimer = 0;

  if(player.food <= 0){
    survival.starveTimer += dt;
    if(survival.starveTimer >= 4){ survival.starveTimer = 0; damage(1,'굶주림'); }
  } else survival.starveTimer = 0;

  // --- 산소 ---
  if(playerHeadInWater()){
    survival.breathTimer += dt;
    if(survival.breathTimer >= 1){
      survival.breathTimer = 0;
      survival.breath--;
      if(survival.breath < 0){ survival.breath = 0; damage(2,'익사'); }
    }
  } else {
    survival.breath = 10; survival.breathTimer = 0;
  }
  renderBreathBar();

  // --- 용암 피해 ---
  if(playerInLava()){
    survival.lavaTimer = (survival.lavaTimer||0) + dt;
    if(survival.lavaTimer >= 0.5){ survival.lavaTimer = 0; damage(4,'용암'); }
  } else survival.lavaTimer = 0;

  // --- 낙하 피해 ---
  if(!player.flying){
    if(!player.onGround && player.vy < 0){
      if(survival.fallStart === null) survival.fallStart = player.y;
    } else if(player.onGround && survival.fallStart !== null){
      const dist = survival.fallStart - player.y;
      if(dist > 3 && !playerInWater()) damage(Math.floor(dist-3),'낙하');
      survival.fallStart = null;
    }
    if(player.vy > 0) survival.fallStart = null;
  } else survival.fallStart = null;

  // --- 발소리 ---
  if(moving && player.onGround && !player.flying){
    survival.stepTimer += dt;
    const interval = player.sprinting ? 0.28 : 0.42;
    if(survival.stepTimer >= interval){
      survival.stepTimer = 0;
      playSound('step', 0.8+Math.random()*0.4);
    }
  }

  // --- 피해 화면 효과 ---
  if(survival.damageFlash > 0){
    survival.damageFlash -= dt;
    const o = document.getElementById('damage-overlay');
    if(o) o.style.opacity = Math.max(0, survival.damageFlash);
  }
}

let lastBreathDrawn = -1;
function renderBreathBar(){
  const el = document.getElementById('breath-icons');
  if(!el) return;
  const hidden = !playerHeadInWater() && survival.breath>=10;
  const state = hidden ? -1 : survival.breath;
  if(state === lastBreathDrawn) return;   // 값이 바뀔 때만 다시 그림
  lastBreathDrawn = state;
  if(hidden){ el.innerHTML=''; return; }
  el.innerHTML='';
  for(let i=0;i<10;i++){
    const c=document.createElement('canvas'); c.width=14; c.height=14;
    const x=c.getContext('2d');
    if(survival.breath > i){
      x.fillStyle='#66ccff';
      x.beginPath(); x.arc(7,7,4.5,0,Math.PI*2); x.fill();
      x.fillStyle='rgba(255,255,255,0.6)'; x.fillRect(4,4,3,2);
    }
    el.appendChild(c);
  }
}

// --- 먹기 ---
function tryEat(){
  const item = getHeld();
  if(!item || typeof item.id!=='string') return false;
  const def = ITEMS[item.id];
  if(!def || !def.food) return false;
  if(player.food >= player.maxFood) return false;
  player.food = Math.min(player.maxFood, player.food + def.food);
  item.count--;
  if(item.count<=0) inventory[player.selectedSlot]=null;
  playSound('eat');
  renderHeartFood(); renderHotbarUI();
  showPickup(def.n+' 먹음');
  return true;
}

// ============================================================
// 하늘: 해 · 달 · 별
// ============================================================
let sunMesh, moonMesh, starField;

function initSkyObjects(){
  // 해
  const sunTex = makeGlowTexture('#fff8d0','#ffdd44');
  sunMesh = new THREE.Sprite(new THREE.SpriteMaterial({map:sunTex, depthWrite:false, fog:false}));
  sunMesh.scale.set(40,40,1);
  scene.add(sunMesh);

  // 달
  const moonTex = makeMoonTexture();
  moonMesh = new THREE.Sprite(new THREE.SpriteMaterial({map:moonTex, depthWrite:false, fog:false}));
  moonMesh.scale.set(28,28,1);
  scene.add(moonMesh);

  // 별
  const starGeo = new THREE.BufferGeometry();
  const pos = [];
  for(let i=0;i<600;i++){
    // 상반구에만 배치
    const th = Math.random()*Math.PI*2;
    const ph = Math.acos(Math.random());
    const r = 260;
    pos.push(r*Math.sin(ph)*Math.cos(th), r*Math.cos(ph), r*Math.sin(ph)*Math.sin(th));
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  starField = new THREE.Points(starGeo, new THREE.PointsMaterial({
    color:0xffffff, size:1.8, sizeAttenuation:false, transparent:true, opacity:0, fog:false, depthWrite:false
  }));
  scene.add(starField);
}

function makeGlowTexture(inner, outer){
  const c=document.createElement('canvas'); c.width=64; c.height=64;
  const x=c.getContext('2d');
  const g=x.createRadialGradient(32,32,2,32,32,30);
  g.addColorStop(0,inner); g.addColorStop(0.45,outer);
  g.addColorStop(1,'rgba(255,220,80,0)');
  x.fillStyle=g; x.fillRect(0,0,64,64);
  return new THREE.CanvasTexture(c);
}

function makeMoonTexture(){
  const c=document.createElement('canvas'); c.width=64; c.height=64;
  const x=c.getContext('2d');
  const g=x.createRadialGradient(32,32,2,32,32,26);
  g.addColorStop(0,'#ffffff'); g.addColorStop(0.7,'#dde4f0');
  g.addColorStop(1,'rgba(200,215,240,0)');
  x.fillStyle=g; x.beginPath(); x.arc(32,32,26,0,Math.PI*2); x.fill();
  // 크레이터
  x.fillStyle='rgba(150,160,180,0.45)';
  [[24,24,5],[40,30,4],[30,42,3.5],[42,44,2.5]].forEach(([cx,cy,r])=>{
    x.beginPath(); x.arc(cx,cy,r,0,Math.PI*2); x.fill();
  });
  return new THREE.CanvasTexture(c);
}

function updateSkyObjects(){
  if(!sunMesh) return;
  const angle=(dayTime-0.25)*Math.PI*2;
  const R=220;
  const sx=Math.cos(angle)*R, sy=Math.sin(angle)*R;

  sunMesh.position.set(camera.position.x+sx, camera.position.y+sy, camera.position.z+40);
  moonMesh.position.set(camera.position.x-sx, camera.position.y-sy, camera.position.z-40);
  starField.position.copy(camera.position);
  starField.rotation.y = dayTime*Math.PI*2;

  // 밤일수록 별이 진해짐 (해 높이 기준)
  const night = Math.max(0, Math.min(1, -Math.sin(angle)*1.6+0.25));
  starField.material.opacity = night;
  sunMesh.material.opacity = Math.max(0, Math.min(1, Math.sin(angle)*2+0.4));
  moonMesh.material.opacity = night;
}

// ---- 물속 화면 오버레이 ----
function updateWaterOverlay(){
  const o=document.getElementById('water-overlay');
  if(!o) return;
  o.style.opacity = playerHeadInWater() ? '1' : '0';
}

// 드래그 중인 아이템과 슬롯을 교환/합치기. 새 슬롯 값을 반환.
function swapDrag(slot){
  if(dragItem){
    if(slot && slot.id===dragItem.id && slot.count<64){
      const take = Math.min(dragItem.count, 64-slot.count);
      slot.count += take; dragItem.count -= take;
      if(dragItem.count<=0) dragItem = null;
      updateDragCanvas();
      return slot;
    }
    const old = slot; slot = dragItem; dragItem = old; updateDragCanvas();
    return slot;
  }
  if(slot){ dragItem = slot; updateDragCanvas(); return null; }
  return slot;
}

// ============================================================
// 몹 (동물 · 몬스터)
// ============================================================
const MOB_TYPES = {
  pig:     {n:'돼지',    hp:10, w:0.7,h:0.8, body:'#f0a0a8', head:'#f0a0a8', hostile:false, drop:'raw_porkchop', speed:1.1},
  cow:     {n:'소',      hp:10, w:0.8,h:1.1, body:'#4a3828', head:'#f0f0f0', hostile:false, drop:'raw_beef',     speed:1.0},
  sheep:   {n:'양',      hp:8,  w:0.7,h:1.0, body:'#f0f0f0', head:'#e8d0c0', hostile:false, drop:'raw_beef',     speed:1.0},
  chicken: {n:'닭',      hp:4,  w:0.4,h:0.6, body:'#f8f8f8', head:'#f8f8f8', hostile:false, drop:'raw_chicken',  speed:1.2},
  zombie:  {n:'좀비',    hp:20, w:0.6,h:1.8, body:'#3a8a5a', head:'#4a8a6a', hostile:true,  drop:null,           speed:1.5, dmg:3},
  skeleton:{n:'스켈레톤',hp:20, w:0.6,h:1.8, body:'#d8d8d8', head:'#e8e8e8', hostile:true,  drop:'bone',         speed:1.6, dmg:2},
  creeper: {n:'크리퍼',  hp:20, w:0.6,h:1.7, body:'#4aca4a', head:'#5ada5a', hostile:true,  drop:'gunpowder',    speed:1.4, dmg:8},
  spider:  {n:'거미',    hp:16, w:1.0,h:0.7, body:'#3a2020', head:'#4a2828', hostile:true,  drop:'string',       speed:1.9, dmg:2},
};

const mobs = [];
const MAX_MOBS = 18;
let mobSpawnTimer = 0;

function spawnMob(type, x, y, z){
  const def = MOB_TYPES[type];
  const g = new THREE.Group();

  const mat = c => new THREE.MeshLambertMaterial({color:c});
  // 몸통
  const body = new THREE.Mesh(new THREE.BoxGeometry(def.w, def.h*0.6, def.w*1.4), mat(def.body));
  body.position.y = def.h*0.55;
  g.add(body);
  // 머리
  const hs = def.w*0.85;
  const head = new THREE.Mesh(new THREE.BoxGeometry(hs,hs,hs), mat(def.head));
  head.position.set(0, def.h*0.95, def.w*0.75);
  g.add(head);
  // 눈
  const eyeMat = new THREE.MeshBasicMaterial({color: def.hostile?0xff2222:0x222222});
  [-1,1].forEach(s=>{
    const e = new THREE.Mesh(new THREE.BoxGeometry(hs*0.2,hs*0.2,0.02), eyeMat);
    e.position.set(s*hs*0.25, def.h*0.98, def.w*0.75+hs*0.5);
    g.add(e);
  });
  // 다리
  const legs = [];
  const legCount = type==='spider' ? 4 : 2;
  for(let i=0;i<legCount;i++){
    for(const s of [-1,1]){
      const leg = new THREE.Mesh(new THREE.BoxGeometry(def.w*0.25, def.h*0.45, def.w*0.25), mat(def.body));
      leg.position.set(s*def.w*0.3, def.h*0.22, (i - (legCount-1)/2)*def.w*0.5);
      g.add(leg); legs.push(leg);
    }
  }

  g.position.set(x,y,z);
  scene.add(g);

  mobs.push({
    type, def, mesh:g, legs,
    x, y, z, vy:0,
    hp: def.hp,
    yaw: Math.random()*Math.PI*2,
    wanderTimer: 0,
    attackCd: 0,
    walkPhase: 0,
    onGround: false,
  });
}

function mobSolidAt(m, x, y, z){
  const w = m.def.w*0.5, h = m.def.h;
  for(let bx=Math.floor(x-w); bx<=Math.floor(x+w); bx++)
    for(let by=Math.floor(y); by<=Math.floor(y+h); by++)
      for(let bz=Math.floor(z-w); bz<=Math.floor(z+w); bz++)
        if(isSolid(getBlock(bx,by,bz))) return true;
  return false;
}

function updateMobs(dt){
  if(!gameStarted || gamePaused) return;

  // --- 스폰 ---
  mobSpawnTimer += dt;
  if(mobSpawnTimer > 3){
    mobSpawnTimer = 0;
    if(mobs.length < MAX_MOBS){
      const night = dayTime<0.22 || dayTime>0.78;
      const hostileTypes = ['zombie','skeleton','creeper','spider'];
      const peacefulTypes = ['pig','cow','sheep','chicken'];
      const type = night && Math.random()<0.65
        ? hostileTypes[Math.floor(Math.random()*hostileTypes.length)]
        : peacefulTypes[Math.floor(Math.random()*peacefulTypes.length)];

      const ang = Math.random()*Math.PI*2;
      const dist = 16 + Math.random()*14;
      const sx = Math.floor(player.x + Math.cos(ang)*dist);
      const sz = Math.floor(player.z + Math.sin(ang)*dist);
      const sy = getSpawnHeight(sx,sz)+1;
      if(sy>1 && sy<WORLD_HEIGHT-2 && getBlock(sx,sy,sz)===BLOCKS.AIR){
        spawnMob(type, sx+0.5, sy, sz+0.5);
      }
    }
  }

  const GRAV = -20;

  for(let i=mobs.length-1;i>=0;i--){
    const m = mobs[i];

    // 너무 멀면 제거
    const dxp = player.x-m.x, dzp = player.z-m.z;
    const distToPlayer = Math.sqrt(dxp*dxp+dzp*dzp);
    if(distToPlayer > 48 || m.hp<=0){
      scene.remove(m.mesh);
      m.mesh.children.forEach(c=>c.geometry.dispose());
      if(m.hp<=0 && m.def.drop) { addItem(m.def.drop,1); showPickup(itemName(m.def.drop)); playSound('pop'); }
      mobs.splice(i,1);
      continue;
    }

    // --- AI ---
    let mvx=0, mvz=0;
    const chasing = m.def.hostile && distToPlayer < 16;

    if(chasing){
      m.yaw = Math.atan2(dxp, dzp);
      mvx = Math.sin(m.yaw)*m.def.speed;
      mvz = Math.cos(m.yaw)*m.def.speed;

      // 공격
      m.attackCd -= dt;
      if(distToPlayer < 1.5 && m.attackCd<=0 && Math.abs(player.y-m.y)<2.2){
        m.attackCd = 1.2;
        damage(m.def.dmg||2, m.def.n);
      }
    } else {
      // 배회
      m.wanderTimer -= dt;
      if(m.wanderTimer<=0){
        m.wanderTimer = 2+Math.random()*3;
        m.yaw = Math.random()*Math.PI*2;
        m.moving = Math.random()<0.6;
      }
      if(m.moving){
        mvx = Math.sin(m.yaw)*m.def.speed*0.5;
        mvz = Math.cos(m.yaw)*m.def.speed*0.5;
      }
    }

    // --- 물리 ---
    m.vy += GRAV*dt;
    const nx = m.x + mvx*dt;
    const nz = m.z + mvz*dt;

    // 수평 이동 + 자동 점프
    let moved = false;
    if(!mobSolidAt(m,nx,m.y,m.z)){ m.x=nx; moved=true; }
    else if(m.onGround && !mobSolidAt(m,nx,m.y+1,m.z)){ m.vy=7; }
    if(!mobSolidAt(m,m.x,m.y,nz)){ m.z=nz; moved=true; }
    else if(m.onGround && !mobSolidAt(m,m.x,m.y+1,nz)){ m.vy=7; }

    const ny = m.y + m.vy*dt;
    if(!mobSolidAt(m,m.x,ny,m.z)){ m.y=ny; m.onGround=false; }
    else { if(m.vy<0) m.onGround=true; m.vy=0; }

    if(m.y<0){ m.hp=0; }

    // --- 렌더 갱신 ---
    m.mesh.position.set(m.x, m.y, m.z);
    m.mesh.rotation.y = m.yaw;

    // 걷기 애니메이션
    if(moved && m.onGround){
      m.walkPhase += dt*8;
      m.legs.forEach((leg,idx)=>{
        leg.rotation.x = Math.sin(m.walkPhase + (idx%2)*Math.PI)*0.5;
      });
    }

    // 낮에 언데드는 불탐
    if((m.type==='zombie'||m.type==='skeleton') && dayTime>0.3 && dayTime<0.7){
      m.hp -= dt*2;
    }
  }
}

// 좌클릭으로 몹 공격
function attackMob(){
  const dir = new THREE.Vector3(0,0,-1);
  dir.applyEuler(new THREE.Euler(camera.rotation.x, camera.rotation.y, 0, 'YXZ'));

  let best=null, bestD=4;
  for(const m of mobs){
    const dx=m.x-camera.position.x, dy=(m.y+m.def.h*0.5)-camera.position.y, dz=m.z-camera.position.z;
    const d=Math.sqrt(dx*dx+dy*dy+dz*dz);
    if(d>bestD) continue;
    const dot=(dx*dir.x+dy*dir.y+dz*dir.z)/d;
    if(dot>0.93){ best=m; bestD=d; }
  }
  if(!best) return false;

  const held = getHeld();
  let dmg = 1;
  if(held && typeof held.id==='string' && ITEMS[held.id]?.dmg) dmg = ITEMS[held.id].dmg;
  best.hp -= dmg;
  playSound('pop', 0.7);

  // 넉백
  const kx=best.x-player.x, kz=best.z-player.z;
  const kl=Math.hypot(kx,kz)||1;
  best.x += kx/kl*0.4; best.z += kz/kl*0.4; best.vy = 3;
  return true;
}

// ============================================================
// 초기화 및 이벤트 연결
// ============================================================
document.getElementById('respawn-btn').addEventListener('click', respawn);

// 시작 버튼 → 오디오 활성화 + 하늘 오브젝트 생성
document.getElementById('play-btn').addEventListener('click', ()=>{
  initAudio();
  if(!sunMesh) initSkyObjects();
});

// 좌클릭 시 몹 공격 우선
document.addEventListener('mousedown', e=>{
  if(!pointerLocked || menuOpen) return;
  if(e.button===0) attackMob();
}, true);

// 인벤토리 밖 클릭으로 아이템 되돌리기 (용광로/상자 화면에서도 동작)
document.addEventListener('mousedown', e=>{
  if(!dragItem) return;
  if(menuOpen!=='furnace' && menuOpen!=='chest') return;
  const win=document.querySelector('#'+(menuOpen==='furnace'?'furnace-screen':'chest-screen')+' .mc-window');
  if(win && !win.contains(e.target)){
    addItem(dragItem.id, dragItem.count);
    dragItem=null; updateDragCanvas(); refreshOpenMenu();
  }
});
