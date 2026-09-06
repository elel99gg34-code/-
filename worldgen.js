// ========================================================
// WORLD GENERATION
// ========================================================
function getBlock(x,y,z) {
  if(y<0) return BLOCKS.BEDROCK;
  if(y>=WORLD_HEIGHT) return BLOCKS.AIR;
  return world.get(`${x},${y},${z}`)??BLOCKS.AIR;
}

function setBlockDirect(x,y,z,id) {
  if(y<0||y>=WORLD_HEIGHT) return;
  const k=`${x},${y},${z}`;
  if(id===BLOCKS.AIR) world.delete(k); else world.set(k,id);
}

function setBlock(x,y,z,id) {
  setBlockDirect(x,y,z,id);
  const cx=Math.floor(x/CHUNK_SIZE), cz=Math.floor(z/CHUNK_SIZE);
  dirtyChunks.add(`${cx},${cz}`);
  // Mark neighbors dirty if on edge
  if(x%CHUNK_SIZE===0) dirtyChunks.add(`${cx-1},${cz}`);
  if(x%CHUNK_SIZE===CHUNK_SIZE-1) dirtyChunks.add(`${cx+1},${cz}`);
  if(z%CHUNK_SIZE===0) dirtyChunks.add(`${cx},${cz-1}`);
  if(z%CHUNK_SIZE===CHUNK_SIZE-1) dirtyChunks.add(`${cx},${cz+1}`);
}

function generateChunk(cx,cz) {
  const key=`${cx},${cz}`;
  if(generatedChunks.has(key)) return;
  generatedChunks.add(key);

  const ox=cx*CHUNK_SIZE, oz=cz*CHUNK_SIZE;
  const rng=seededRand(cx*73856093^cz*19349663);

  for(let lx=0;lx<CHUNK_SIZE;lx++) {
    for(let lz=0;lz<CHUNK_SIZE;lz++) {
      const wx=ox+lx, wz=oz+lz;

      // Terrain height with two noise layers
      const n1=noise1.oct(wx*0.008, wz*0.008, 5, 0.5);
      const n2=noise2.oct(wx*0.04,  wz*0.04,  3, 0.6);
      const height=Math.floor(SEA_LEVEL + n1*18 + n2*5);
      const h=Math.max(2, Math.min(WORLD_HEIGHT-2, height));

      // Biome indicator
      const biome=noise2.n(wx*0.003, wz*0.003);
      const isDesert=biome<-0.3;
      const isSnowy=biome>0.5;
      const isTaiga=biome>0.3&&biome<=0.5;

      // Bedrock (y=0)
      setBlockDirect(wx,0,wz,BLOCKS.BEDROCK);

      // Stone + ores
      for(let y=1;y<h-3;y++) {
        const r=rng();
        let bt=BLOCKS.STONE;
        if(y<8  && r<0.020) bt=BLOCKS.REDSTONE_ORE;
        else if(y<12 && r<0.015) bt=BLOCKS.DIAMOND_ORE;
        else if(y<20 && r<0.025) bt=BLOCKS.LAPIS_ORE;
        else if(y<24 && r<0.030) bt=BLOCKS.GOLD_ORE;
        else if(y<40 && r<0.040) bt=BLOCKS.IRON_ORE;
        else if(r<0.060) bt=BLOCKS.COAL_ORE;
        else if(r<0.062) bt=BLOCKS.GRAVEL;
        setBlockDirect(wx,y,wz,bt);
      }

      // 동굴 파기 (3D 느낌: 두 개의 2D 노이즈를 y 로 오프셋)
      for(let y=3;y<h-4;y++){
        const c1=noise1.n(wx*0.06+y*0.13, wz*0.06-y*0.09);
        const c2=noise2.n(wx*0.05-y*0.11, wz*0.05+y*0.07);
        if(c1*c1+c2*c2 < 0.045){
          setBlockDirect(wx,y,wz,BLOCKS.AIR);
          // 깊은 곳 동굴 바닥에 가끔 용암
          if(y<8 && rng()<0.15) setBlockDirect(wx,y,wz,BLOCKS.LAVA);
        }
      }

      // Dirt layers
      const dirtDepth=isDesert?1:3;
      for(let y=Math.max(1,h-dirtDepth);y<h;y++) {
        setBlockDirect(wx,y,wz, isDesert?BLOCKS.SAND:BLOCKS.DIRT);
      }

      // Surface block
      if(h>=SEA_LEVEL) {
        let surface=BLOCKS.GRASS;
        if(isDesert) surface=BLOCKS.SAND;
        else if(isSnowy) surface=BLOCKS.SNOW;
        else if(isTaiga) surface=BLOCKS.PODZOL;
        setBlockDirect(wx,h,wz,surface);

        // Trees (non-desert) / cactus (desert)
        if(lx>2 && lx<CHUNK_SIZE-3 && lz>2 && lz<CHUNK_SIZE-3) {
          const tr=rng();
          if(isDesert) {
            if(tr<0.03) {
              const cH=1+Math.floor(rng()*3);
              for(let cy=1;cy<=cH;cy++) setBlockDirect(wx,h+cy,wz,BLOCKS.CACTUS);
            }
          } else if(tr<0.012) {
            const logType=isTaiga?BLOCKS.SPRUCE_LOG:(rng()<0.7?BLOCKS.OAK_LOG:BLOCKS.BIRCH_LOG);
            const leafType=BLOCKS.OAK_LEAVES;
            const treeH=isTaiga?(5+Math.floor(rng()*4)):(4+Math.floor(rng()*2));
            for(let ty=1;ty<=treeH;ty++) setBlockDirect(wx,h+ty,wz,logType);
            const leafY=h+treeH;
            const leafR=isTaiga?1:2;
            for(let ly=leafY-1;ly<=leafY+1;ly++) {
              const r2=ly===leafY?1:leafR;
              for(let lxo=-r2;lxo<=r2;lxo++) {
                for(let lzo=-r2;lzo<=r2;lzo++) {
                  if(Math.abs(lxo)+Math.abs(lzo)>r2+1) continue;
                  if(lxo===0&&lzo===0) continue;
                  if(getBlock(wx+lxo,ly,wz+lzo)===BLOCKS.AIR)
                    setBlockDirect(wx+lxo,ly,wz+lzo,leafType);
                }
              }
            }
            setBlockDirect(wx,leafY+1,wz,leafType);
          }
        }

        // Flowers & grass decoration (skip for now - use blocks)
      } else {
        // Below sea level
        for(let y=h+1;y<=SEA_LEVEL;y++) setBlockDirect(wx,y,wz,BLOCKS.WATER);
        // Clay on the bottom
        if(rng()<0.3) setBlockDirect(wx,h,wz,BLOCKS.CLAY);
        else setBlockDirect(wx,h,wz,BLOCKS.SAND);
      }
    }
  }
  dirtyChunks.add(key);
}

// ========================================================
// CHUNK MESH BUILDING
// ========================================================
const FACE_DEFS = [
  {dir:[0,1,0], v:[[-0.5,0.5,-0.5],[0.5,0.5,-0.5],[0.5,0.5,0.5],[-0.5,0.5,0.5]], f:'top'},
  {dir:[0,-1,0],v:[[-0.5,-0.5,0.5],[0.5,-0.5,0.5],[0.5,-0.5,-0.5],[-0.5,-0.5,-0.5]],f:'bottom'},
  {dir:[0,0,1], v:[[-0.5,-0.5,0.5],[0.5,-0.5,0.5],[0.5,0.5,0.5],[-0.5,0.5,0.5]], f:'side'},
  {dir:[0,0,-1],v:[[0.5,-0.5,-0.5],[-0.5,-0.5,-0.5],[-0.5,0.5,-0.5],[0.5,0.5,-0.5]],f:'side'},
  {dir:[1,0,0], v:[[0.5,-0.5,0.5],[0.5,-0.5,-0.5],[0.5,0.5,-0.5],[0.5,0.5,0.5]], f:'side'},
  {dir:[-1,0,0],v:[[-0.5,-0.5,-0.5],[-0.5,-0.5,0.5],[-0.5,0.5,0.5],[-0.5,0.5,-0.5]],f:'side'},
];

// AO (ambient occlusion) lookup
function getAO(bx,by,bz,dx,dy,dz) {
  const b=getBlock(bx+dx,by+dy,bz+dz);
  return (b!==BLOCKS.AIR && b!==BLOCKS.WATER && !BD[b]?.tr) ? 0.7 : 1.0;
}

function buildChunkMesh(cx,cz) {
  const key=`${cx},${cz}`;
  if(chunkMeshes.has(key)) {
    const old=chunkMeshes.get(key);
    scene.remove(old);
    old.children.forEach(m=>{m.geometry.dispose();});
    chunkMeshes.delete(key);
  }
  if(!generatedChunks.has(key)) return;

  const ox=cx*CHUNK_SIZE, oz=cz*CHUNK_SIZE;

  // Group by texture key
  const groups={};

  for(let lx=0;lx<CHUNK_SIZE;lx++) {
    for(let y=0;y<WORLD_HEIGHT;y++) {
      for(let lz=0;lz<CHUNK_SIZE;lz++) {
        const wx=ox+lx, wz=oz+lz;
        const bid=getBlock(wx,y,wz);
        if(bid===BLOCKS.AIR) continue;
        const bdat=BD[bid];
        if(!bdat) continue;

        for(const fd of FACE_DEFS) {
          const nx=wx+fd.dir[0], ny=y+fd.dir[1], nz=wz+fd.dir[2];
          const nb=getBlock(nx,ny,nz);

          let render=false;
          if(nb===BLOCKS.AIR) render=true;
          else if(BD[nb]?.tr && nb!==bid) render=true;

          if(!render) continue;

          const tkey=`${bid}_${fd.f}`;
          if(!groups[tkey]) groups[tkey]={pos:[],uv:[],norm:[],col:[],idx:[],bid,face:fd.f,cnt:0};
          const g=groups[tkey];
          const base=g.cnt*4;

          // Simple AO
          const ao=fd.dir[1]===1?1.0:fd.dir[1]===-1?0.6:0.8;

          for(const v of fd.v) {
            g.pos.push(wx+v[0],y+v[1],wz+v[2]);
            g.col.push(ao,ao,ao);
          }
          g.uv.push(0,0,1,0,1,1,0,1);
          g.idx.push(base,base+1,base+2,base,base+2,base+3);
          g.cnt++;
        }
      }
    }
  }

  const group=new THREE.Group();
  for(const [tk,g] of Object.entries(groups)) {
    if(g.cnt===0) continue;
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(g.pos,3));
    geo.setAttribute('uv',new THREE.Float32BufferAttribute(g.uv,2));
    geo.setAttribute('color',new THREE.Float32BufferAttribute(g.col,3));
    geo.setIndex(g.idx);
    geo.computeVertexNormals();

    const tex=drawTex(g.bid, g.face);
    const mat=new THREE.MeshLambertMaterial({
      map:tex,
      vertexColors:true,
      color:0xffffff,
    });
    if(BD[g.bid]?.tr) {mat.transparent=true;mat.opacity=g.bid===BLOCKS.WATER?0.75:0.85;mat.depthWrite=false;}
    group.add(new THREE.Mesh(geo,mat));
  }
  scene.add(group);
  chunkMeshes.set(key,group);
}

function ensureChunks(px,pz) {
  const cx=Math.floor(px/CHUNK_SIZE), cz=Math.floor(pz/CHUNK_SIZE);
  for(let dx=-RENDER_DISTANCE;dx<=RENDER_DISTANCE;dx++) {
    for(let dz=-RENDER_DISTANCE;dz<=RENDER_DISTANCE;dz++) {
      const key=`${cx+dx},${cz+dz}`;
      if(!generatedChunks.has(key)) {
        generateChunk(cx+dx,cz+dz);
      }
    }
  }
  // Remove far chunks
  for(const [key,mesh] of chunkMeshes) {
    const [mcx,mcz]=key.split(',').map(Number);
    if(Math.abs(mcx-cx)>RENDER_DISTANCE+1||Math.abs(mcz-cz)>RENDER_DISTANCE+1) {
      scene.remove(mesh);
      mesh.children.forEach(m=>m.geometry.dispose());
      chunkMeshes.delete(key);
    }
  }
}

function rebuildDirtyChunks() {
  let n=0;
  for(const key of [...dirtyChunks]) {
    if(n>=2) break;
    const [cx,cz]=key.split(',').map(Number);
    buildChunkMesh(cx,cz);
    dirtyChunks.delete(key);
    n++;
  }
}

// ========================================================
// RAYCASTING
// ========================================================
function raycast(maxD=5) {
  const dir=new THREE.Vector3(0,0,-1);
  dir.applyEuler(new THREE.Euler(camera.rotation.x,camera.rotation.y,0,'YXZ'));
  const step=0.04;
  let px=camera.position.x, py=camera.position.y, pz=camera.position.z;
  let pbx=Math.floor(px), pby=Math.floor(py), pbz=Math.floor(pz);

  for(let d=step;d<maxD;d+=step) {
    const cx=px+dir.x*d, cy=py+dir.y*d, cz=pz+dir.z*d;
    const bx=Math.floor(cx), by=Math.floor(cy), bz=Math.floor(cz);
    const b=getBlock(bx,by,bz);
    if(b!==BLOCKS.AIR && b!==BLOCKS.WATER) {
      return {x:bx,y:by,z:bz,px:pbx,py:pby,pz:pbz};
    }
    pbx=bx; pby=by; pbz=bz;
  }
  return null;
}

// ========================================================
// PHYSICS
// ========================================================
function isSolid(b) {
  if(b===BLOCKS.AIR||b===BLOCKS.WATER) return false;
  if(BD[b]?.tr&&b!==BLOCKS.CACTUS) return false;
  return true;
}

function collidesAt(x,y,z) {
  const W=0.3, H1=1.6, H2=0.2;
  for(let bx=Math.floor(x-W);bx<=Math.floor(x+W);bx++)
    for(let by=Math.floor(y-H1);by<=Math.floor(y+H2);by++)
      for(let bz=Math.floor(z-W);bz<=Math.floor(z+W);bz++)
        if(isSolid(getBlock(bx,by,bz))) return true;
  return false;
}

function updatePhysics(dt) {
  if(!gameStarted||gamePaused||menuOpen) return;

  const GRAVITY=-22, JUMP=8;
  const fwd=new THREE.Vector3(-Math.sin(player.yaw),0,-Math.cos(player.yaw));
  const rgt=new THREE.Vector3(Math.cos(player.yaw),0,-Math.sin(player.yaw));

  let mx=0,mz=0;
  if(keys['KeyW']){mx+=fwd.x;mz+=fwd.z;}
  if(keys['KeyS']){mx-=fwd.x;mz-=fwd.z;}
  if(keys['KeyA']){mx-=rgt.x;mz-=rgt.z;}
  if(keys['KeyD']){mx+=rgt.x;mz+=rgt.z;}
  const spd=player.sprinting?5.5:4.3;
  const len=Math.sqrt(mx*mx+mz*mz);
  if(len>0){mx=mx/len*spd;mz=mz/len*spd;}

  if(player.flying) {
    player.vx=mx; player.vz=mz; player.vy=0;
    if(keys['Space']) player.vy=spd;
    if(keys['ShiftLeft']) player.vy=-spd;
    player.x+=player.vx*dt; player.y+=player.vy*dt; player.z+=player.vz*dt;
    return;
  }

  // 물속에서는 느리게 움직이고 천천히 가라앉으며, Space 로 헤엄쳐 올라감
  const inWater = getBlock(Math.floor(player.x),Math.floor(player.y-0.6),Math.floor(player.z))===BLOCKS.WATER;
  if(inWater){
    player.vx=mx*0.5; player.vz=mz*0.5;
    player.vy += GRAVITY*0.22*dt;
    if(player.vy < -2.5) player.vy = -2.5;
    if(keys['Space']) player.vy = 3.2;
  } else {
    player.vx=mx; player.vz=mz;
    if(keys['Space']&&player.onGround){player.vy=JUMP;player.onGround=false;}
    player.vy+=GRAVITY*dt;
  }

  // Move X
  const nx=player.x+player.vx*dt;
  if(!collidesAt(nx,player.y,player.z)) player.x=nx; else player.vx=0;
  // Move Z
  const nz=player.z+player.vz*dt;
  if(!collidesAt(player.x,player.y,nz)) player.z=nz; else player.vz=0;
  // Move Y
  const ny=player.y+player.vy*dt;
  if(!collidesAt(player.x,ny,player.z)) {
    player.y=ny;
    if(player.vy<0) player.onGround=false;
  } else {
    if(player.vy<0) player.onGround=true;
    player.vy=0;
  }

  // Prevent falling below bedrock
  if(player.y<1) {player.y=1;player.vy=0;}
}
