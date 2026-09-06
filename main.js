// ========================================================
// INVENTORY HELPERS
// ========================================================
function getHeld() { return inventory[player.selectedSlot]; }

function addItem(id, count=1) {
  // Stack with existing
  for(let i=0;i<36;i++) {
    if(inventory[i]?.id===id && inventory[i].count<64) {
      const take=Math.min(count,64-inventory[i].count);
      inventory[i].count+=take; count-=take;
      if(count<=0) return true;
    }
  }
  // Empty slot
  for(let i=0;i<36;i++) {
    if(!inventory[i]) {inventory[i]={id,count};return true;}
  }
  return false;
}

function itemName(id) {
  if(id===null||id===undefined) return '';
  if(typeof id==='number') return BD[id]?.n || `블록 #${id}`;
  return ITEMS[id]?.n || id;
}

// ========================================================
// CRAFTING
// ========================================================
function normPattern(slots,size) {
  const ids=slots.map(s=>s?s.id:null);
  let r0=size,r1=-1,c0=size,c1=-1;
  for(let r=0;r<size;r++) for(let c=0;c<size;c++) {
    if(ids[r*size+c]!==null){if(r<r0)r0=r;if(r>r1)r1=r;if(c<c0)c0=c;if(c>c1)c1=c;}
  }
  if(r1===-1) return [];
  const out=[];
  for(let r=r0;r<=r1;r++){const row=[];for(let c=c0;c<=c1;c++)row.push(ids[r*size+c]);out.push(row);}
  return out;
}

function patMatch(a,b) {
  if(a.length!==b.length) return false;
  for(let r=0;r<a.length;r++){
    if(a[r].length!==b[r].length) return false;
    for(let c=0;c<a[r].length;c++) if((a[r][c]??null)!==(b[r][c]??null)) return false;
  }
  return true;
}

function checkCraft(slots,size) {
  const pat=normPattern(slots,size);
  for(const rec of RECIPES) if(patMatch(pat,rec.p)) return rec.r;
  return null;
}

// ========================================================
// HUD
// ========================================================
function renderHUD() {
  renderHeartFood();
  renderHotbarUI();
}

function renderHeartFood() {
  // Hearts
  const hc=document.getElementById('health-icons');
  hc.innerHTML='';
  for(let i=0;i<10;i++) {
    const c=document.createElement('canvas');
    c.width=18;c.height=18;
    const ct=c.getContext('2d');
    const full=player.health>=(i+1)*2;
    const half=!full&&player.health>=i*2+1;
    const empty=!full&&!half;
    // Heart shape
    ct.fillStyle=empty?'#3a0000':half?'#cc0000':'#cc0000';
    ct.beginPath();
    ct.moveTo(9,14);
    ct.bezierCurveTo(9,14,2,9,2,6);
    ct.bezierCurveTo(2,3,5,2,7,4);
    ct.bezierCurveTo(7.5,4.5,9,6,9,6);
    ct.bezierCurveTo(9,6,10.5,4.5,11,4);
    ct.bezierCurveTo(13,2,16,3,16,6);
    ct.bezierCurveTo(16,9,9,14,9,14);
    ct.fill();
    if(half){ct.fillStyle='#3a0000';ct.fillRect(9,0,9,18);}
    // Shine
    if(!empty){ct.fillStyle='rgba(255,100,100,0.4)';ct.fillRect(5,4,3,3);}
    hc.appendChild(c);
  }
  // Food
  const fc=document.getElementById('food-icons');
  fc.innerHTML='';
  for(let i=0;i<10;i++) {
    const c=document.createElement('canvas');
    c.width=18;c.height=18;
    const ct=c.getContext('2d');
    const full=player.food>=(i+1)*2;
    const half=!full&&player.food>=i*2+1;
    const empty=!full&&!half;
    // Chicken leg icon
    ct.fillStyle=empty?'#333':half?'#c09050':'#c09050';
    ct.beginPath(); ct.arc(9,8,5,0,Math.PI*2); ct.fill();
    if(!empty){ct.fillStyle='rgba(200,150,50,0.5)';ct.fillRect(5,4,4,4);}
    ct.fillStyle=empty?'#444':'#8b4513';
    ct.fillRect(8,12,3,5);
    if(half){ct.fillStyle='rgba(0,0,0,0.5)';ct.fillRect(9,0,9,18);}
    fc.appendChild(c);
  }
}

function renderHotbarUI() {
  const el=document.getElementById('hotbar');
  el.innerHTML='';
  for(let i=0;i<9;i++) {
    const slot=document.createElement('div');
    slot.className='hotbar-slot'+(i===player.selectedSlot?' selected':'');
    const c=document.createElement('canvas');
    c.width=40;c.height=40;
    const ct=c.getContext('2d');
    drawItem(ct,inventory[i],0,0,40);
    slot.appendChild(c);
    slot.onclick=()=>{player.selectedSlot=i;renderHotbarUI();};
    el.appendChild(slot);
  }
}

// ========================================================
// INVENTORY UI
// ========================================================
function openInventory() {
  menuOpen='inventory';
  document.getElementById('inventory-screen').classList.add('active');
  document.exitPointerLock();
  buildInventoryUI();
}
function closeInventory() {
  menuOpen=null;
  document.getElementById('inventory-screen').classList.remove('active');
  canvas.requestPointerLock();
  renderHotbarUI();
}
function openCraftingTable() {
  menuOpen='crafting';
  document.getElementById('crafting-screen').classList.add('active');
  document.exitPointerLock();
  buildCraftingUI();
}
function closeCraftingTable() {
  // Return craft slots
  for(let i=0;i<9;i++){if(tableSlots[i]){addItem(tableSlots[i].id,tableSlots[i].count);tableSlots[i]=null;}}
  menuOpen=null;
  document.getElementById('crafting-screen').classList.remove('active');
  canvas.requestPointerLock();
  renderHotbarUI();
}

function makeSlot(item, onClick, onRight) {
  const div=document.createElement('div');
  div.className='inv-slot';
  const c=document.createElement('canvas');
  c.width=32;c.height=32;
  drawItem(c.getContext('2d'),item,0,0,32);
  div.appendChild(c);
  if(onClick) div.addEventListener('click',onClick);
  if(onRight) div.addEventListener('contextmenu',e=>{e.preventDefault();onRight();});
  return div;
}

function buildInventoryUI() {
  // Main inventory (rows 1-3)
  const grid=document.getElementById('inv-grid');
  grid.innerHTML='';
  for(let i=9;i<36;i++) {
    grid.appendChild(makeSlot(inventory[i],
      ()=>slotClick('inv',i),()=>slotRight('inv',i)));
  }
  // Hotbar row
  const hb=document.getElementById('inv-hotbar');
  hb.innerHTML='';
  for(let i=0;i<9;i++) {
    hb.appendChild(makeSlot(inventory[i],
      ()=>slotClick('inv',i),()=>slotRight('inv',i)));
  }
  // Armor
  const ac=document.getElementById('armor-slots');
  ac.innerHTML='';
  ['투구','흉갑','각반','신발'].forEach((name,i)=>{
    const s=makeSlot(armorSlots[i],()=>slotClick('armor',i));
    s.title=name; ac.appendChild(s);
  });
  // 2x2 craft
  const cg=document.getElementById('inv-craft-grid');
  cg.innerHTML='';
  for(let i=0;i<4;i++) {
    cg.appendChild(makeSlot(invCraft[i],()=>slotClick('invcr',i)));
  }
  // Craft result
  const cr=document.getElementById('inv-craft-result');
  cr.innerHTML='';
  const res=checkCraft(invCraft,2);
  const rc=document.createElement('canvas');
  rc.width=32;rc.height=32;
  drawItem(rc.getContext('2d'),res?{id:res.id,count:res.n}:null,0,0,32);
  cr.appendChild(rc);
  cr.onclick=()=>{
    if(!res) return;
    addItem(res.id,res.n);
    for(let i=0;i<4;i++){if(invCraft[i]){invCraft[i].count--;if(invCraft[i].count<=0)invCraft[i]=null;}}
    buildInventoryUI(); renderHotbarUI();
  };

  // Draw player silhouette
  drawPlayerPreview();
}

function drawPlayerPreview() {
  const c=document.getElementById('player-canvas');
  if(!c) return;
  const ct=c.getContext('2d');
  ct.clearRect(0,0,60,90);
  // Body
  ct.fillStyle='#5a8a5a'; ct.fillRect(18,30,24,26); // torso
  ct.fillStyle='#5a6aaa'; ct.fillRect(20,56,10,24); // left leg
  ct.fillStyle='#4a5a9a'; ct.fillRect(30,56,10,24); // right leg
  ct.fillStyle='#d4a870'; ct.fillRect(18,30,8,22);  // left arm
  ct.fillStyle='#c49860'; ct.fillRect(34,30,8,22);  // right arm
  // Head
  ct.fillStyle='#d4a870'; ct.fillRect(16,8,28,24);
  // Eyes
  ct.fillStyle='#3a3aff'; ct.fillRect(22,16,5,5); ct.fillRect(33,16,5,5);
  // Mouth
  ct.fillStyle='#5a2a10'; ct.fillRect(23,25,14,3);
  // Armor overlay
  if(armorSlots[0]){ct.fillStyle='rgba(100,100,200,0.4)';ct.fillRect(16,8,28,24);}
  if(armorSlots[1]){ct.fillStyle='rgba(100,100,200,0.4)';ct.fillRect(18,30,24,26);}
}

function buildCraftingUI() {
  const cg=document.getElementById('craft-grid');
  cg.innerHTML='';
  for(let i=0;i<9;i++) {
    cg.appendChild(makeSlot(tableSlots[i],()=>slotClick('craft',i)));
  }
  const res=checkCraft(tableSlots,3);
  const cr=document.getElementById('craft-result');
  cr.innerHTML='';
  const rc=document.createElement('canvas');
  rc.width=32;rc.height=32;
  drawItem(rc.getContext('2d'),res?{id:res.id,count:res.n}:null,0,0,32);
  cr.appendChild(rc);
  cr.onclick=()=>{
    if(!res) return;
    addItem(res.id,res.n);
    for(let i=0;i<9;i++){if(tableSlots[i]){tableSlots[i].count--;if(tableSlots[i].count<=0)tableSlots[i]=null;}}
    buildCraftingUI(); renderHotbarUI();
  };
  const ig=document.getElementById('craft-inv-grid');
  ig.innerHTML='';
  for(let i=9;i<36;i++) ig.appendChild(makeSlot(inventory[i],()=>slotClick('craftinv',i)));
  const ih=document.getElementById('craft-inv-hotbar');
  ih.innerHTML='';
  for(let i=0;i<9;i++) ih.appendChild(makeSlot(inventory[i],()=>slotClick('craftinv',i)));
}

function slotClick(area,idx) {
  const getSlot=()=>{
    if(area==='inv'||area==='craftinv') return inventory[idx];
    if(area==='invcr') return invCraft[idx];
    if(area==='craft') return tableSlots[idx];
    if(area==='armor') return armorSlots[idx];
    return null;
  };
  const setSlot=(v)=>{
    if(area==='inv'||area==='craftinv') inventory[idx]=v;
    else if(area==='invcr') invCraft[idx]=v;
    else if(area==='craft') tableSlots[idx]=v;
    else if(area==='armor') armorSlots[idx]=v;
  };

  const cur=getSlot();
  if(dragItem) {
    if(cur && cur.id===dragItem.id && cur.count<64) {
      cur.count+=dragItem.count; dragItem=null;
    } else {
      setSlot(dragItem); dragItem=cur;
    }
  } else {
    if(cur) {dragItem=cur; setSlot(null);}
  }
  updateDragCanvas();
  if(menuOpen==='inventory') buildInventoryUI();
  else if(menuOpen==='crafting') buildCraftingUI();
  renderHotbarUI();
}

function slotRight(area,idx) {
  if(dragItem) {
    // Place one
    const cur=area==='inv'?inventory[idx]:null;
    if(!cur) {
      if(area==='inv') inventory[idx]={id:dragItem.id,count:1};
      dragItem.count--;
      if(dragItem.count<=0) dragItem=null;
    } else if(cur.id===dragItem.id && cur.count<64) {
      cur.count++; dragItem.count--;
      if(dragItem.count<=0) dragItem=null;
    }
  } else {
    const cur=area==='inv'?inventory[idx]:null;
    if(cur && cur.count>1) {
      const half=Math.ceil(cur.count/2);
      dragItem={id:cur.id,count:half};
      cur.count-=half;
    } else if(cur) {
      dragItem=cur; inventory[idx]=null;
    }
  }
  updateDragCanvas();
  if(menuOpen==='inventory') buildInventoryUI();
  renderHotbarUI();
}

function updateDragCanvas() {
  const dc=document.getElementById('drag-item');
  if(dragItem) {
    dc.style.display='block';
    const ct=dc.getContext('2d');
    ct.clearRect(0,0,36,36);
    drawItem(ct,dragItem,0,0,36);
  } else {
    dc.style.display='none';
  }
}

// Mouse move for drag
document.addEventListener('mousemove',e=>{
  const dc=document.getElementById('drag-item');
  if(dragItem){dc.style.left=(e.clientX-18)+'px';dc.style.top=(e.clientY-18)+'px';}
});

// Drop drag on outside click
document.addEventListener('mousedown',e=>{
  if(!dragItem||!menuOpen) return;
  const win=document.querySelector('.inv-window');
  if(win&&!win.contains(e.target)){addItem(dragItem.id,dragItem.count);dragItem=null;updateDragCanvas();
    if(menuOpen==='inventory') buildInventoryUI();
    else if(menuOpen==='crafting') buildCraftingUI();
    renderHotbarUI();
  }
});

// ========================================================
// BLOCK BREAKING / PLACING
// ========================================================
function getToolInfo() {
  const item=getHeld();
  if(!item||typeof item.id!=='string') return {tool:null,lv:0};
  const d=ITEMS[item.id];
  return {tool:d?.tool||null, lv:d?.lv||1};
}

function breakTime(bid) {
  const bdat=BD[bid];
  if(!bdat) return 0.5;
  if(bdat.h<0) return Infinity;
  if(bdat.h===0) return 0.05;
  const {tool,lv}=getToolInfo();
  let mul=1;
  if(tool&&tool===bdat.t) mul=1.5+lv*0.8;
  return bdat.h*1.5/mul;
}

function doMine(x,y,z) {
  const bid=getBlock(x,y,z);
  if(bid===BLOCKS.AIR) return;
  const bdat=BD[bid];
  if(!bdat||bdat.h<0) return;
  setBlock(x,y,z,BLOCKS.AIR);
  if(typeof playSound==='function') playSound('dig', 0.8+Math.random()*0.5);
  if(bdat.d) bdat.d.forEach(drop=>{addItem(drop.id,drop.n);showPickup(itemName(drop.id));});
  renderHotbarUI();
}

function doPlace(x,y,z) {
  const item=getHeld();
  if(!item) return;
  const id=item.id;
  if(typeof id!=='number'||!BD[id]) return;
  // Don't place in player
  const W=0.3,H1=1.6,H2=0.2;
  if(x+1>player.x-W&&x<player.x+W && y+1>player.y-H1&&y<player.y+H2 && z+1>player.z-W&&z<player.z+W) return;
  setBlock(x,y,z,id);
  if(typeof playSound==='function') playSound('place', 0.9+Math.random()*0.3);
  item.count--;
  if(item.count<=0) inventory[player.selectedSlot]=null;
  renderHotbarUI();
}

function showPickup(name) {
  const el=document.getElementById('pickup-text');
  el.textContent=name+' 획득';
  el.style.opacity='1';
  clearTimeout(el._t);
  el._t=setTimeout(()=>el.style.opacity='0',1800);
}

// ========================================================
// INPUT
// ========================================================
document.addEventListener('keydown',e=>{
  keys[e.code]=true;
  if(!gameStarted) return;

  if(e.code==='KeyE') {
    if(menuOpen==='death') return;
    if(menuOpen==='inventory') closeInventory();
    else if(menuOpen==='crafting') closeCraftingTable();
    else if(menuOpen==='furnace') closeFurnace();
    else if(menuOpen==='chest') closeChest();
    else openInventory();
    return;
  }
  if(e.code==='Escape') {
    if(menuOpen==='death') return;
    if(menuOpen) {
      if(menuOpen==='inventory') closeInventory();
      else if(menuOpen==='crafting') closeCraftingTable();
      else if(menuOpen==='furnace') closeFurnace();
      else if(menuOpen==='chest') closeChest();
    } else {
      document.getElementById('pause-screen').classList.toggle('active');
      gamePaused=!gamePaused;
      if(gamePaused) document.exitPointerLock();
      else canvas.requestPointerLock();
    }
    return;
  }
  if(e.code==='KeyF') player.flying=!player.flying;
  if(e.code==='ShiftLeft'&&!menuOpen) player.sprinting=true;
  if(e.code==='F3') {
    const d=document.getElementById('debug-info');
    const co=document.getElementById('coords');
    const show=d.style.display==='none'||d.style.display==='';
    d.style.display=show?'block':'none';
    co.style.display=show?'block':'none';
  }
  // Hotbar 1-9
  if(e.code.startsWith('Digit')) {
    const n=parseInt(e.code.replace('Digit',''))-1;
    if(n>=0&&n<=8){player.selectedSlot=n;renderHotbarUI();}
  }
  // Drop
  if(e.code==='KeyQ') {
    const it=inventory[player.selectedSlot];
    if(it){it.count--;if(it.count<=0)inventory[player.selectedSlot]=null;renderHotbarUI();}
  }
});

document.addEventListener('keyup',e=>{
  keys[e.code]=false;
  if(e.code==='ShiftLeft') player.sprinting=false;
});

document.addEventListener('wheel',e=>{
  if(menuOpen) return;
  player.selectedSlot=((player.selectedSlot+(e.deltaY>0?1:-1))+9)%9;
  renderHotbarUI();
},{passive:true});

document.addEventListener('pointerlockchange',()=>{
  pointerLocked=document.pointerLockElement===canvas;
});

document.addEventListener('mousemove',e=>{
  if(!pointerLocked||menuOpen) return;
  const sens=0.0018;
  player.yaw-=e.movementX*sens;
  player.pitch=Math.max(-Math.PI/2+0.01,Math.min(Math.PI/2-0.01,player.pitch-e.movementY*sens));
});

document.addEventListener('mousedown',e=>{
  if(!pointerLocked||menuOpen) return;
  if(e.button===0) {
    isBreaking=true;
    breakStart=performance.now();
    breakBlock=lookingAt?{...lookingAt}:null;
  }
  if(e.button===2) {
    // 음식 먹기가 우선
    if(typeof tryEat==='function' && tryEat()) return;
    if(lookingAt) {
      const bid=getBlock(lookingAt.x,lookingAt.y,lookingAt.z);
      if(bid===BLOCKS.CRAFTING_TABLE) {openCraftingTable();return;}
      if(bid===BLOCKS.FURNACE) {openFurnace(lookingAt.x,lookingAt.y,lookingAt.z);return;}
      if(bid===BLOCKS.CHEST)   {openChest(lookingAt.x,lookingAt.y,lookingAt.z);return;}
      doPlace(lookingAt.px,lookingAt.py,lookingAt.pz);
    }
  }
});
document.addEventListener('mouseup',e=>{
  if(e.button===0){isBreaking=false;breakBlock=null;breakProgress=0;}
});
document.addEventListener('contextmenu',e=>e.preventDefault());

// ========================================================
// BREAKING LOGIC
// ========================================================
function updateBreaking(now) {
  if(!isBreaking||!lookingAt||!breakBlock) return;
  if(lookingAt.x!==breakBlock.x||lookingAt.y!==breakBlock.y||lookingAt.z!==breakBlock.z) {
    isBreaking=false;breakBlock=null;breakProgress=0;return;
  }
  const bid=getBlock(breakBlock.x,breakBlock.y,breakBlock.z);
  const needed=breakTime(bid)*1000;
  breakProgress=Math.min(1,(now-breakStart)/needed);
  if(breakProgress>=1) {
    doMine(breakBlock.x,breakBlock.y,breakBlock.z);
    isBreaking=false;breakBlock=null;breakProgress=0;
  }
}

// ========================================================
// DAY / NIGHT CYCLE
// ========================================================
function updateSky(dt) {
  dayTime=(dayTime+dt/DAY_DURATION)%1;
  const t=dayTime;
  // 0.25=day, 0.75=night
  const angle=(t-0.25)*Math.PI*2;
  const sunY=Math.sin(angle);
  const sunX=Math.cos(angle);

  // Sky color
  let sr,sg,sb;
  if(t<0.2) {      // Night
    [sr,sg,sb]=[5,5,20];
  } else if(t<0.3) { // Dawn
    const f=(t-0.2)/0.1;
    [sr,sg,sb]=[5+f*130,5+f*50,20+f*80];
  } else if(t<0.7) { // Day
    [sr,sg,sb]=[135,206,235];
  } else if(t<0.8) { // Dusk
    const f=(t-0.7)/0.1;
    [sr,sg,sb]=[135-f*130,206-f*156,235-f*215];
  } else {           // Night
    [sr,sg,sb]=[5,5,20];
  }
  scene.background=new THREE.Color(sr/255,sg/255,sb/255);
  scene.fog.color.setRGB(sr/255,sg/255,sb/255);

  // Sun light
  const bright=Math.max(0,Math.min(1,sunY*2+0.3));
  sunLight.intensity=bright*1.2;
  sunLight.position.set(sunX*200,sunY*200,50);
  ambientLight.intensity=0.2+bright*0.4;
}

// ========================================================
// THREE.JS INIT
// ========================================================
function initThree() {
  canvas=document.getElementById('minecraft-canvas');
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;

  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x87CEEB);
  scene.fog=new THREE.FogExp2(0x87CEEB,0.012);

  camera=new THREE.PerspectiveCamera(75,canvas.width/canvas.height,0.05,500);

  renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(canvas.width,canvas.height);

  ambientLight=new THREE.AmbientLight(0xffffff,0.5);
  scene.add(ambientLight);
  sunLight=new THREE.DirectionalLight(0xfffae0,1.0);
  sunLight.position.set(100,200,50);
  scene.add(sunLight);

  // Selection box
  const geo=new THREE.BoxGeometry(1.001,1.001,1.001);
  const mat=new THREE.MeshBasicMaterial({color:0x000000,wireframe:true,transparent:true,opacity:0.4});
  selectionBox=new THREE.Mesh(geo,mat);
  selectionBox.visible=false;
  scene.add(selectionBox);

  // 캔버스가 준비된 뒤에 등록해야 한다
  canvas.addEventListener('click',()=>{
    if(!gameStarted||menuOpen||gamePaused) return;
    canvas.requestPointerLock();
  });
}

// ========================================================
// UI BUTTONS
// ========================================================
document.getElementById('play-btn').addEventListener('click',startGame);
document.getElementById('resume-btn').addEventListener('click',()=>{
  document.getElementById('pause-screen').classList.remove('active');
  gamePaused=false; canvas.requestPointerLock();
});
document.getElementById('quit-btn').addEventListener('click',()=>{
  document.getElementById('pause-screen').classList.remove('active');
  document.getElementById('start-screen').style.display='flex';
  gameStarted=false; gamePaused=false;
  document.exitPointerLock();
});
document.getElementById('options-btn').addEventListener('click',()=>alert('옵션:\n\nF3 - 디버그 정보\nF - 비행 모드\nE - 인벤토리\nEsc - 일시정지\n1-9 - 단축바 선택\nQ - 아이템 버리기'));

// ========================================================
// GAME START
// ========================================================
function startGame() {
  document.getElementById('start-screen').style.display='none';
  gameStarted=true; gamePaused=false;

  // Find spawn height
  const sh=getSpawnHeight(0,0);
  player.x=0; player.y=sh+3; player.z=0;

  // Starting items
  addItem(BLOCKS.OAK_LOG,10);
  addItem(BLOCKS.DIRT,16);
  addItem(BLOCKS.STONE,10);
  addItem(BLOCKS.COBBLESTONE,16);
  addItem(BLOCKS.GRASS,8);
  addItem(BLOCKS.OAK_PLANKS,8);
  addItem('wood_pickaxe',1);
  addItem('wood_sword',1);
  addItem('bread',8);
  addItem(BLOCKS.TORCH,16);
  addItem(BLOCKS.CRAFTING_TABLE,1);
  addItem('coal',8);
  addItem('stick',16);

  renderHUD();
  canvas.requestPointerLock();
  lastFrameTime=performance.now();
}

function getSpawnHeight(x,z) {
  for(let y=WORLD_HEIGHT-1;y>=0;y--) {
    if(getBlock(x,y,z)!==BLOCKS.AIR) return y;
  }
  return SEA_LEVEL;
}

// ========================================================
// DEBUG
// ========================================================
function updateDebug() {
  const d=document.getElementById('debug-info');
  if(d.style.display!=='block') return;
  d.innerHTML=[
    '<b>마인크래프트 클론</b>',
    `FPS: ${Math.round(1000/Math.max(1,frameDt))}`,
    `블록: ${world.size.toLocaleString()}`,
    `청크: ${chunkMeshes.size} / 대기: ${dirtyChunks.size}`,
    `비행: ${player.flying} / 질주: ${player.sprinting}`,
    `선택 아이템: ${getHeld()?itemName(getHeld().id):'(없음)'}`,
    `바라보는 블록: ${lookingAt?`${lookingAt.x},${lookingAt.y},${lookingAt.z} (${BD[getBlock(lookingAt.x,lookingAt.y,lookingAt.z)]?.n||'?'})`:'없음'}`,
    `시간: ${(dayTime*24).toFixed(1)}시`,
  ].join('<br>');

  const co=document.getElementById('coords');
  co.innerHTML=[
    `X: ${player.x.toFixed(2)}`,
    `Y: ${player.y.toFixed(2)}`,
    `Z: ${player.z.toFixed(2)}`,
    `방향: ${(player.yaw*180/Math.PI).toFixed(1)}°`,
  ].join('<br>');
}

// ========================================================
// BREAK OVERLAY (crack effect)
// ========================================================
function renderBreakViz() {
  if(!isBreaking||!lookingAt||breakProgress<=0) {
    selectionBox.material.opacity=0.3;
    selectionBox.material.color.setHex(0x000000);
    return;
  }
  selectionBox.material.opacity=0.1+breakProgress*0.7;
  selectionBox.material.color.setHex(0x111111);
}

// ========================================================
// MAIN LOOP
// ========================================================
function gameLoop(now) {
  requestAnimationFrame(gameLoop);
  frameDt=now-lastFrameTime;
  const dt=Math.min(frameDt/1000,0.05);
  lastFrameTime=now;

  if(!gameStarted||gamePaused) {
    renderer.render(scene,camera);
    return;
  }

  // World
  ensureChunks(player.x,player.z);
  rebuildDirtyChunks();

  // Physics
  updatePhysics(dt);

  // Camera
  camera.position.set(player.x,player.y,player.z);
  camera.rotation.order='YXZ';
  camera.rotation.y=player.yaw;
  camera.rotation.x=player.pitch;

  // Raycast
  lookingAt=raycast(5);
  if(lookingAt) {
    selectionBox.visible=true;
    selectionBox.position.set(lookingAt.x+0.5,lookingAt.y+0.5,lookingAt.z+0.5);
    const bid=getBlock(lookingAt.x,lookingAt.y,lookingAt.z);
    const tt=document.getElementById('block-tooltip');
    tt.style.display='block';
    tt.textContent=BD[bid]?.n||'알 수 없음';
  } else {
    selectionBox.visible=false;
    document.getElementById('block-tooltip').style.display='none';
  }

  // Breaking
  updateBreaking(now);
  renderBreakViz();

  // Day/night
  updateSky(dt);

  // 확장 시스템 (features.js)
  if(typeof tickFurnaces==='function') tickFurnaces(dt);
  if(typeof tickSurvival==='function') tickSurvival(dt);
  if(typeof updateMobs==='function') updateMobs(dt);
  if(typeof updateSkyObjects==='function') updateSkyObjects();
  if(typeof updateWaterOverlay==='function') updateWaterOverlay();

  // Render
  renderer.render(scene,camera);

  updateDebug();
}

// ========================================================
// RESIZE
// ========================================================
window.addEventListener('resize',()=>{
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
});

// ========================================================
// INIT
// ========================================================
initThree();

// Pre-gen spawn chunks
for(let dx=-1;dx<=1;dx++) for(let dz=-1;dz<=1;dz++) generateChunk(dx,dz);

requestAnimationFrame(gameLoop);
