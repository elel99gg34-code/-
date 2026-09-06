// ========================================================
// TEXTURE GENERATION
// ========================================================
const blockTexCache = {};

function drawTex(blockId, face) {
  const key = `${blockId}_${face}`;
  if (blockTexCache[key]) return blockTexCache[key];

  const data = BD[blockId];
  if (!data) return null;

  const size = 16;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');

  // Base color from face
  const col = face==='top' ? data.c[0] : face==='bottom' ? data.c[2] : data.c[1];
  ctx.fillStyle = col;
  ctx.fillRect(0,0,size,size);

  const rng = seededRand(blockId * 31 + (face==='top'?0:face==='bottom'?1:2));

  // Pixel noise
  for (let i=0; i<40; i++) {
    const px = Math.floor(rng()*size);
    const py = Math.floor(rng()*size);
    ctx.fillStyle = rng()<0.5 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.08)';
    ctx.fillRect(px,py,1,1);
  }

  // Block-specific patterns
  switch(blockId) {
    case BLOCKS.GRASS:
      if(face==='top') {
        ctx.fillStyle='#4a8a22'; ctx.fillRect(0,0,size,size);
        for(let i=0;i<20;i++){const px=Math.floor(rng()*size);const py=Math.floor(rng()*size);ctx.fillStyle='rgba(0,0,0,0.1)';ctx.fillRect(px,py,1,1);}
      } else if(face==='side') {
        ctx.fillStyle='#4a8a22'; ctx.fillRect(0,0,size,4);
        ctx.fillStyle='rgba(0,0,0,0.1)'; ctx.fillRect(0,4,size,1);
      }
      break;
    case BLOCKS.DIRT:
      // Add scattered pixels for texture
      for(let i=0;i<15;i++){const px=Math.floor(rng()*size);const py=Math.floor(rng()*size);ctx.fillStyle='rgba(100,60,10,0.3)';ctx.fillRect(px,py,2,2);}
      break;
    case BLOCKS.STONE:
      ctx.fillStyle='rgba(0,0,0,0.2)';
      for(let i=0;i<8;i++){const px=Math.floor(rng()*size);const py=Math.floor(rng()*size);ctx.fillRect(px,py,2+Math.floor(rng()*2),1);}
      break;
    case BLOCKS.COBBLESTONE:
    case BLOCKS.MOSSY_COBBLESTONE:
      ctx.strokeStyle='rgba(0,0,0,0.4)'; ctx.lineWidth=1;
      // Rounded stone shapes
      for(let i=0;i<4;i++){
        const px=Math.floor(rng()*10)+1, py=Math.floor(rng()*10)+1;
        const pw=Math.floor(rng()*4)+2, ph=Math.floor(rng()*3)+2;
        ctx.strokeRect(px,py,pw,ph);
      }
      if(blockId===BLOCKS.MOSSY_COBBLESTONE){ctx.fillStyle='rgba(40,100,20,0.3)';ctx.fillRect(0,0,size,size);}
      break;
    case BLOCKS.STONE_BRICKS:
      ctx.strokeStyle='rgba(0,0,0,0.4)'; ctx.lineWidth=1;
      ctx.strokeRect(0,0,size,8); ctx.strokeRect(0,8,size,8);
      ctx.strokeRect(0,0,8,8); ctx.strokeRect(8,8,8,8);
      break;
    case BLOCKS.BRICK:
      ctx.strokeStyle='rgba(80,20,0,0.5)'; ctx.lineWidth=1;
      ctx.strokeRect(0,0,size,5); ctx.strokeRect(0,5,size,5); ctx.strokeRect(0,10,size,5);
      ctx.strokeRect(0,0,8,5); ctx.strokeRect(8,5,8,5); ctx.strokeRect(4,10,8,5);
      break;
    case BLOCKS.OAK_LOG:
    case BLOCKS.BIRCH_LOG:
    case BLOCKS.SPRUCE_LOG:
      if(face==='top'||face==='bottom') {
        ctx.strokeStyle='rgba(0,0,0,0.25)'; ctx.lineWidth=1;
        for(let r=1;r<7;r+=2){ctx.beginPath();ctx.arc(8,8,r,0,Math.PI*2);ctx.stroke();}
      } else {
        ctx.fillStyle='rgba(0,0,0,0.15)';
        ctx.fillRect(0,0,2,size); ctx.fillRect(13,0,2,size);
        if(blockId===BLOCKS.BIRCH_LOG){
          ctx.fillStyle='rgba(50,50,30,0.3)';
          for(let i=0;i<3;i++){const y=Math.floor(rng()*size);ctx.fillRect(0,y,size,2);}
        }
      }
      break;
    case BLOCKS.OAK_PLANKS:
    case BLOCKS.BIRCH_PLANKS:
    case BLOCKS.SPRUCE_PLANKS:
      ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(0,8); ctx.lineTo(size,8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(8,0); ctx.lineTo(8,8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4,8); ctx.lineTo(4,size); ctx.stroke();
      break;
    case BLOCKS.SAND:
    case BLOCKS.SANDSTONE:
      for(let i=0;i<25;i++){const px=Math.floor(rng()*size);const py=Math.floor(rng()*size);ctx.fillStyle='rgba(200,180,60,0.2)';ctx.fillRect(px,py,1,1);}
      break;
    case BLOCKS.GRAVEL:
      for(let i=0;i<6;i++){const px=Math.floor(rng()*12)+1;const py=Math.floor(rng()*12)+1;ctx.fillStyle='rgba(0,0,0,0.2)';ctx.beginPath();ctx.arc(px,py,rng()*2+0.5,0,Math.PI*2);ctx.fill();}
      break;
    case BLOCKS.OAK_LEAVES:
      ctx.fillStyle='rgba(50,130,30,0.4)';
      for(let i=0;i<20;i++){const px=Math.floor(rng()*14)+1;const py=Math.floor(rng()*14)+1;ctx.fillRect(px,py,2,2);}
      break;
    case BLOCKS.GLASS:
      ctx.clearRect(0,0,size,size);
      ctx.fillStyle='rgba(150,210,255,0.25)'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.fillRect(0,0,2,2); ctx.fillRect(2,0,1,1);
      break;
    case BLOCKS.CRAFTING_TABLE:
      if(face==='top') {
        ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=1;
        ctx.strokeRect(2,2,12,12);
        ctx.strokeRect(2,2,6,6); ctx.strokeRect(8,2,6,6);
        ctx.strokeRect(2,8,6,6); ctx.strokeRect(8,8,6,6);
        ctx.fillStyle='rgba(100,60,0,0.3)'; ctx.fillRect(2,2,12,12);
      }
      break;
    case BLOCKS.FURNACE:
      if(face==='side') {
        ctx.fillStyle='#555'; ctx.fillRect(4,4,8,8);
        ctx.fillStyle='#ff6600'; ctx.fillRect(6,6,4,4);
        ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.fillRect(4,4,8,1);
      }
      break;
    case BLOCKS.COAL_ORE:
      ctx.fillStyle='#3a3a3a'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='rgba(0,0,0,0.6)';
      for(let i=0;i<4;i++){const px=Math.floor(rng()*10)+2;const py=Math.floor(rng()*10)+2;ctx.fillRect(px,py,Math.floor(rng()*3)+1,Math.floor(rng()*3)+1);}
      break;
    case BLOCKS.IRON_ORE:
      ctx.fillStyle='rgba(200,140,100,0.6)';
      for(let i=0;i<5;i++){const px=Math.floor(rng()*12)+1;const py=Math.floor(rng()*12)+1;ctx.fillRect(px,py,2,2);}
      break;
    case BLOCKS.GOLD_ORE:
      ctx.fillStyle='rgba(220,200,40,0.7)';
      for(let i=0;i<5;i++){const px=Math.floor(rng()*12)+1;const py=Math.floor(rng()*12)+1;ctx.fillRect(px,py,2,2);}
      break;
    case BLOCKS.DIAMOND_ORE:
      ctx.fillStyle='rgba(40,200,200,0.7)';
      for(let i=0;i<5;i++){const px=Math.floor(rng()*12)+1;const py=Math.floor(rng()*12)+1;ctx.fillRect(px,py,2,2);}
      break;
    case BLOCKS.REDSTONE_ORE:
      ctx.fillStyle='rgba(200,30,30,0.7)';
      for(let i=0;i<5;i++){const px=Math.floor(rng()*12)+1;const py=Math.floor(rng()*12)+1;ctx.fillRect(px,py,2,2);}
      break;
    case BLOCKS.LAPIS_ORE:
      ctx.fillStyle='rgba(30,60,200,0.7)';
      for(let i=0;i<5;i++){const px=Math.floor(rng()*12)+1;const py=Math.floor(rng()*12)+1;ctx.fillRect(px,py,2,2);}
      break;
    case BLOCKS.BEDROCK:
      ctx.fillStyle='rgba(0,0,0,0.4)';
      for(let i=0;i<10;i++){const px=Math.floor(rng()*14)+1;const py=Math.floor(rng()*14)+1;ctx.fillRect(px,py,Math.floor(rng()*3)+1,Math.floor(rng()*2)+1);}
      break;
    case BLOCKS.WATER:
      ctx.fillStyle='rgba(30,80,200,0.7)'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='rgba(100,150,255,0.3)';
      ctx.fillRect(0,2,size,1); ctx.fillRect(0,8,size,1); ctx.fillRect(0,13,size,1);
      break;
    case BLOCKS.LAVA:
      ctx.fillStyle='rgba(200,60,0,0.9)'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='rgba(255,150,0,0.5)';
      for(let i=0;i<5;i++){const px=Math.floor(rng()*12)+2;const py=Math.floor(rng()*12)+2;ctx.fillRect(px,py,2,2);}
      break;
    case BLOCKS.GLOWSTONE:
      ctx.fillStyle='rgba(255,220,60,0.4)';
      for(let i=0;i<8;i++){const px=Math.floor(rng()*14)+1;const py=Math.floor(rng()*14)+1;ctx.fillRect(px,py,2,2);}
      break;
    case BLOCKS.TNT:
      if(face==='top'||face==='bottom') {
        ctx.fillStyle='#cc8844'; ctx.fillRect(2,2,12,12);
        ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.font='7px monospace'; ctx.textAlign='center';
        ctx.fillText('*',8,10);
      } else {
        ctx.fillStyle='#ffeeee'; ctx.fillRect(2,4,12,8);
        ctx.fillStyle='#cc0000'; ctx.font='bold 5px monospace'; ctx.textAlign='center';
        ctx.fillText('TNT',8,10);
      }
      break;
    case BLOCKS.OBSIDIAN:
      ctx.fillStyle='rgba(100,50,150,0.2)';
      for(let i=0;i<8;i++){const px=Math.floor(rng()*14)+1;const py=Math.floor(rng()*14)+1;ctx.fillRect(px,py,2,1);}
      break;
    case BLOCKS.NETHERRACK:
      for(let i=0;i<10;i++){const px=Math.floor(rng()*14)+1;const py=Math.floor(rng()*14)+1;ctx.fillStyle='rgba(130,20,20,0.4)';ctx.fillRect(px,py,1,1);}
      break;
    case BLOCKS.SOUL_SAND:
      ctx.fillStyle='rgba(0,0,0,0.3)';
      ctx.fillRect(4,5,3,3); ctx.fillRect(10,5,3,3); // "eyes"
      ctx.fillRect(3,11,10,1); // "mouth"
      break;
    case BLOCKS.END_STONE:
      ctx.fillStyle='rgba(200,200,80,0.3)';
      for(let i=0;i<8;i++){const px=Math.floor(rng()*12)+2;const py=Math.floor(rng()*12)+2;ctx.fillRect(px,py,2,2);}
      break;
    case BLOCKS.MYCELIUM:
      if(face==='top'){ctx.fillStyle='rgba(120,80,120,0.5)';ctx.fillRect(0,0,size,size);for(let i=0;i<15;i++){const px=Math.floor(rng()*size);const py=Math.floor(rng()*size);ctx.fillStyle='rgba(180,120,180,0.4)';ctx.fillRect(px,py,1,1);}}
      break;
    case BLOCKS.PUMPKIN:
      if(face==='top'){ctx.fillStyle='rgba(150,90,0,0.5)';ctx.fillRect(6,0,4,size);}
      else{ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(4,5,2,2);ctx.fillRect(10,5,2,2);ctx.fillRect(4,10,8,1);ctx.fillRect(5,11,6,1);}
      break;
    case BLOCKS.MELON:
      ctx.strokeStyle='rgba(0,80,0,0.4)'; ctx.lineWidth=1;
      for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(i*4,0);ctx.lineTo(i*4,size);ctx.stroke();}
      break;
    case BLOCKS.BOOKSHELF:
      if(face==='side') {
        ctx.fillStyle='#5050cc'; ctx.fillRect(1,2,2,12); ctx.fillRect(4,2,2,12);
        ctx.fillRect(7,2,2,12); ctx.fillRect(10,2,2,12); ctx.fillRect(13,2,2,12);
      }
      break;
    case BLOCKS.ICE:
      ctx.fillStyle='rgba(120,160,255,0.15)'; ctx.fillRect(0,0,size,size);
      ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.fillRect(1,1,4,2); ctx.fillRect(10,3,4,1);
      break;
    case BLOCKS.SNOW:
      ctx.fillStyle='rgba(255,255,255,0.3)';
      for(let i=0;i<10;i++){const px=Math.floor(rng()*14)+1;const py=Math.floor(rng()*14)+1;ctx.fillRect(px,py,1,1);}
      break;
  }

  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  blockTexCache[key] = tex;
  return tex;
}

// ========================================================
// ITEM ICON DRAWING
// ========================================================
function drawItem(ctx, item, x, y, size) {
  if (!item) return;
  const id = item.id;
  const color = typeof id === 'number' ? (BD[id]?.c[1] || '#888') : (ITEMS[id]?.col || '#888');

  // Background
  ctx.fillStyle = color;
  const m = size*0.08;
  ctx.fillRect(x+m, y+m, size-m*2, size-m*2);
  ctx.strokeStyle='rgba(0,0,0,0.4)';
  ctx.lineWidth=1;
  ctx.strokeRect(x+m, y+m, size-m*2, size-m*2);

  // Pixel art item icons
  const s = size/16;
  if (typeof id === 'string') {
    if (id.includes('sword')) {
      ctx.fillStyle='rgba(255,255,255,0.8)';
      ctx.fillRect(x+size*0.45, y+size*0.15, size*0.12, size*0.6);
      ctx.fillRect(x+size*0.25, y+size*0.6, size*0.5, size*0.1);
      ctx.fillStyle='#8b4513';
      ctx.fillRect(x+size*0.4, y+size*0.72, size*0.2, size*0.15);
    } else if (id.includes('pickaxe')) {
      ctx.fillStyle='rgba(255,255,255,0.8)';
      ctx.fillRect(x+size*0.2, y+size*0.2, size*0.6, size*0.12);
      ctx.fillStyle='#8b4513';
      ctx.fillRect(x+size*0.45, y+size*0.3, size*0.1, size*0.5);
    } else if (id.includes('axe')) {
      ctx.fillStyle='rgba(255,255,255,0.8)';
      ctx.fillRect(x+size*0.2, y+size*0.2, size*0.4, size*0.35);
      ctx.fillStyle='#8b4513';
      ctx.fillRect(x+size*0.5, y+size*0.5, size*0.1, size*0.35);
    } else if (id.includes('shovel')) {
      ctx.fillStyle='rgba(255,255,255,0.8)';
      ctx.fillRect(x+size*0.4, y+size*0.15, size*0.2, size*0.3);
      ctx.fillRect(x+size*0.3, y+size*0.15, size*0.4, size*0.12);
      ctx.fillStyle='#8b4513';
      ctx.fillRect(x+size*0.45, y+size*0.43, size*0.1, size*0.45);
    } else if (id === 'coal') {
      ctx.fillStyle='#111'; ctx.fillRect(x+size*0.2,y+size*0.2,size*0.6,size*0.6);
      ctx.fillStyle='#444'; ctx.fillRect(x+size*0.25,y+size*0.25,size*0.2,size*0.2);
    } else if (id === 'iron_ingot' || id === 'gold_ingot' || id === 'diamond') {
      ctx.fillStyle=color==='#d8ccc0'?'#c0b8b0':color==='#ffd700'?'#e0c000':'#22cccc';
      ctx.fillRect(x+size*0.15,y+size*0.3,size*0.7,size*0.4);
      ctx.fillRect(x+size*0.25,y+size*0.2,size*0.5,size*0.5);
    } else if (id === 'stick') {
      ctx.fillStyle='#8b4513';
      ctx.save(); ctx.translate(x+size/2,y+size/2);
      ctx.rotate(Math.PI/4); ctx.fillRect(-size*0.05,-size*0.4,size*0.1,size*0.8);
      ctx.restore();
    } else if (id.includes('helmet') || id.includes('chestplate') || id.includes('legging') || id.includes('boots')) {
      ctx.fillStyle=color;
      if(id.includes('helmet')){ctx.fillRect(x+size*.2,y+size*.2,size*.6,size*.5);ctx.fillRect(x+size*.1,y+size*.4,size*.8,size*.3);}
      else if(id.includes('chestplate')){ctx.fillRect(x+size*.2,y+size*.2,size*.6,size*.6);ctx.clearRect(x+size*.3,y+size*.3,size*.4,size*.4);}
    } else if (id === 'bread') {
      ctx.fillStyle='#d4a860'; ctx.fillRect(x+size*.15,y+size*.35,size*.7,size*.35);
      ctx.fillStyle='#c08040'; ctx.fillRect(x+size*.2,y+size*.3,size*.6,size*.15);
    } else if (id === 'apple') {
      ctx.fillStyle='#cc2200';
      ctx.beginPath(); ctx.arc(x+size*.5,y+size*.55,size*.3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#228800'; ctx.fillRect(x+size*.45,y+size*.15,size*.05,size*.2);
    }
  } else if (typeof id === 'number') {
    // Draw a mini block face
    const tex = drawTex(id, 'top');
    if (tex && tex.image) {
      ctx.drawImage(tex.image, x+m, y+m, size-m*2, size-m*2);
    }
  }

  // Count
  if (item.count > 1) {
    ctx.fillStyle='#fff';
    ctx.font=`bold ${Math.max(8,Math.floor(size*0.35))}px monospace`;
    ctx.textAlign='right';
    ctx.shadowColor='#000'; ctx.shadowOffsetX=1; ctx.shadowOffsetY=1; ctx.shadowBlur=0;
    ctx.fillText(item.count, x+size-2, y+size-2);
    ctx.shadowColor='transparent';
    ctx.textAlign='left';
  }
}
