'use strict';

// ── canvas setup ──────────────────────────────────────────────────────────────
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// ── logical-pixel helpers ─────────────────────────────────────────────────────
function r(x, y, w, h, col) {
  ctx.fillStyle = col;
  ctx.fillRect(x * S, y * S, w * S, h * S);
}
function rr(x, y, w, h) { ctx.fillRect(x*S, y*S, w*S, h*S); } // reuse last color

// ── floor patterns ────────────────────────────────────────────────────────────
function drawWoodFloor(ox, oy, ow, oh) {
  r(ox, oy, ow, oh, C.wood1);
  for (let px = ox; px < ox + ow; px += 24) {
    r(px, oy, 1, oh, C.wood2);
  }
  for (let py = oy; py < oy + oh; py += 6) {
    r(ox, py, ow, 1, C.wood3);
  }
}

function drawTileFloor(ox, oy, ow, oh) {
  r(ox, oy, ow, oh, C.tile1);
  for (let px = ox; px < ox + ow; px += 16) {
    for (let py = oy; py < oy + oh; py += 16) {
      r(px, py, 16, 1, C.tile2);
      r(px, py, 1, 16, C.tile2);
    }
  }
}

function drawCarpetFloor(ox, oy, ow, oh) {
  r(ox, oy, ow, oh, C.carpet1);
  for (let px = ox; px < ox + ow; px += 8) {
    r(px, oy, 1, oh, C.carpet2);
  }
}

function drawLinoFloor(ox, oy, ow, oh) {
  r(ox, oy, ow, oh, C.lino1);
  for (let px = ox; px < ox + ow; px += 12) {
    for (let py = oy; py < oy + oh; py += 12) {
      r(px, py, 12, 1, C.lino2);
      r(px, py, 1, 12, C.lino2);
    }
  }
}

// ── shared room elements ──────────────────────────────────────────────────────
function drawCeiling(ox, ceilColor) {
  r(ox, 0, ROOM_W, CEIL_Y, ceilColor || C.ceil);
  r(ox, CEIL_Y - 2, ROOM_W, 2, C.ceilMold);
}

function drawSkyWindow(ox, wy, ww, wh, hour, horrorLevel, minute) {
  // frame
  r(ox - 2, wy - 2, ww + 4, wh + 4, C.woodF);

  // sky color
  let skyCol, grassCol;
  if (hour >= 6 && hour < 18) {
    skyCol   = C.skyDay;
    grassCol = C.grassDay;
  } else if (hour >= 18 && hour < 20) {
    const t = (hour - 18 + (minute || 0) / 60) / 2;
    skyCol   = blendColor('#87CEEB', '#E88040', t);
    grassCol = blendColor('#3A8830', '#1A4818', t);
  } else {
    skyCol   = C.skyNight;
    grassCol = '#183018';
  }

  // horror tint
  if (horrorLevel >= 2) skyCol = blendColor(skyCol, '#100800', Math.min(1, (horrorLevel-1)*0.15));

  r(ox, wy, ww, wh, skyCol);

  // ground line
  r(ox, wy + Math.round(wh * 0.65), ww, Math.round(wh * 0.35), grassCol);

  // tree silhouette
  r(ox + 4,  wy + Math.round(wh*0.25), 4, Math.round(wh*0.4),  C.treeD);
  r(ox + 1,  wy + Math.round(wh*0.2),  10, Math.round(wh*0.3), C.treeD);

  // window pane cross
  r(ox + Math.floor(ww/2) - 1, wy, 2, wh, C.woodF);
  r(ox, wy + Math.floor(wh/2) - 1, ww, 2, C.woodF);

  // night stars
  if (hour >= 20 || hour < 5) {
    ctx.fillStyle = '#ffffff';
    [[3,3],[12,7],[20,2],[28,10],[35,5],[8,14],[24,14]].forEach(([sx,sy]) => {
      ctx.fillRect((ox+sx)*S, (wy+sy)*S, S, S);
    });
  }
}

function drawDoor(ox, oy, col) {
  const dc = col || C.woodF;
  r(ox, oy, 18, 35, dc);
  r(ox+1, oy+1, 16, 33, C.woodFL);
  r(ox+2, oy+2, 14, 15, dc);
  r(ox+2, oy+19, 14, 14, dc);
  r(ox, oy+35, 18, 3, C.woodFD); // threshold
  // knob
  r(ox+13, oy+17, 3, 3, C.metalL);
  r(ox+14, oy+18, 1, 1, C.metalD);
}

function drawBaseboard(ox, oy, ow) {
  r(ox, oy, ow, 4, C.offwhite);
  r(ox, oy, ow, 1, C.white);
}

// ── furniture helpers ─────────────────────────────────────────────────────────
function drawBed(ox, oy) {
  // Headboard
  r(ox, oy, 48, 12, C.woodF);
  r(ox+2, oy+2, 44, 8, C.woodFL);
  r(ox+4, oy+3, 8, 6, C.woodFD);
  r(ox+18,oy+3, 8, 6, C.woodFD);
  r(ox+32,oy+3, 8, 6, C.woodFD);
  // Mattress
  r(ox, oy+12, 48, 26, C.bedSheet);
  r(ox+2,oy+14, 44, 22, C.bedSheet2);
  // Pillow
  r(ox+4, oy+14, 18, 10, C.pillowBlue);
  r(ox+5, oy+15, 16, 8,  C.pillowBlu2);
  r(ox+26,oy+14, 18, 10, C.pillowBlue);
  r(ox+27,oy+15, 16, 8,  C.pillowBlu2);
  // Blanket fold
  r(ox+2, oy+24, 44, 12, '#B8C8DC');
  r(ox+2, oy+24, 44, 2, '#D0DCEA');
  // Legs
  r(ox+1,   oy+38, 4, 6, C.woodFD);
  r(ox+43,  oy+38, 4, 6, C.woodFD);
  // Shadow
  r(ox, oy+44, 48, 3, 'rgba(0,0,0,0.18)');
}

function drawDesk(ox, oy) {
  // Surface
  r(ox, oy, 36, 4, C.woodFL);
  r(ox, oy+4, 36, 20, C.woodF);
  r(ox, oy+4, 36, 2, C.woodFL);
  // Legs
  r(ox+1,   oy+24, 3, 14, C.woodFD);
  r(ox+32,  oy+24, 3, 14, C.woodFD);
  // Drawer
  r(ox+6, oy+8, 24, 12, C.woodFD);
  r(ox+7, oy+9, 22, 10, C.woodF);
  r(ox+17,oy+13, 4, 3, C.metalL);
}

function drawAlarmClock(ox, oy) {
  r(ox, oy+3, 10, 9, C.metalD);
  r(ox+1,oy+4, 8, 7, '#182028');
  r(ox+2,oy+5, 6, 5, '#48A860');
  r(ox+4,oy+2, 2, 2, C.metalL); // bell
  r(ox-1,oy+2, 2, 2, C.metalL);
}

function drawLamp(ox, oy) {
  // Base
  r(ox+3, oy+18, 6, 3, C.metalD);
  r(ox+4, oy+10, 4, 8, C.metalL);
  // Shade
  r(ox,   oy+4, 12, 1, C.woodFL);
  r(ox+1, oy+5, 10, 4, '#F8E880');
  r(ox,   oy+9, 12, 1, C.woodFL);
  r(ox+5, oy+1, 2, 4, C.metalL); // bulb hint
}

function drawSofa(ox, oy) {
  // Back cushion
  r(ox, oy, 56, 18, '#7A5050');
  r(ox+2,oy+2, 52, 14, '#8A6060');
  // Arm rests
  r(ox, oy, 6, 28, '#6A4444');
  r(ox+50,oy, 6, 28, '#6A4444');
  // Seat
  r(ox+6, oy+18, 44, 10, '#8A6060');
  r(ox+6, oy+18, 44, 2, '#9A7070');
  // Left/right cushion divider
  r(ox+6+21, oy+2, 2, 14, '#6A4444');
  // Legs
  r(ox+6,  oy+28, 4, 6, C.woodFD);
  r(ox+46, oy+28, 4, 6, C.woodFD);
  // Shadow
  r(ox, oy+34, 56, 3, 'rgba(0,0,0,0.15)');
}

function drawTV(ox, oy) {
  // Stand
  r(ox+12, oy+34, 16, 8, C.darkGray);
  r(ox+8,  oy+42, 24, 3, C.darkGray);
  // Body
  r(ox, oy, 40, 34, C.black);
  r(ox+2,oy+2, 36, 28, C.tvScreen);
  // Power LED
  r(ox+36,oy+31, 2, 1, '#00AA00');
}

function drawTVOn(ox, oy) {
  drawTV(ox, oy);
  // Screen glow
  r(ox+2, oy+2, 36, 28, C.tvGlow);
  // Simulated "content" (abstract color blocks)
  r(ox+4, oy+4, 12, 10, '#304858');
  r(ox+18,oy+4, 16, 5,  '#607080');
  r(ox+4, oy+16, 30, 4, '#405060');
  r(ox+4, oy+22, 20, 4, '#304050');
}

function drawBookshelf(ox, oy) {
  r(ox, oy, 26, 52, C.woodF);
  r(ox+2,oy+2, 22, 48, C.woodFL);
  // Shelves
  for (let sy = 0; sy < 3; sy++) {
    const shelf_y = oy + 2 + sy * 15;
    r(ox+2, shelf_y+13, 22, 2, C.woodFD);
    // Books
    const books = ['#8B2020','#203868','#205838','#884488','#8B7020'];
    for (let b = 0; b < 4; b++) {
      r(ox+3+b*5, shelf_y+3, 4, 10, books[b % books.length]);
      r(ox+4+b*5, shelf_y+4, 2, 8,  blendColor(books[b % books.length], '#fff', 0.15));
    }
  }
  r(ox, oy, 26, 2, C.woodFD);
  r(ox, oy+50,26, 2, C.woodFD);
}

function drawCoffeTable(ox, oy) {
  r(ox, oy, 32, 4, C.woodFL);
  r(ox+1, oy+1, 30, 2, C.woodF);
  r(ox+1, oy+4, 4, 10, C.woodFD);
  r(ox+27,oy+4, 4, 10, C.woodFD);
  // Mug on table
  r(ox+12, oy-5, 6, 5, '#CCCCCC');
  r(ox+13, oy-4, 4, 3, '#885530');
  r(ox+18, oy-3, 2, 2, '#BBBBBB'); // handle
}

function drawKitchenCounter(ox, oy, ow) {
  r(ox, oy-4, ow, 4, '#C0C8C0'); // countertop
  r(ox, oy,   ow, 28, C.woodF);
  r(ox, oy,   ow, 2, C.woodFL);
  // Cupboard doors
  for (let d = 0; d < Math.floor(ow/20); d++) {
    r(ox+d*20+1, oy+3, 18, 22, C.woodFL);
    r(ox+d*20+2, oy+4, 16, 20, C.woodF);
    r(ox+d*20+8, oy+13, 4, 3, C.metalL);
  }
}

function drawSink(ox, oy) {
  r(ox, oy, 20, 10, '#B8C4BC');
  r(ox+1,oy+1, 18, 8, '#A8B8B0');
  r(ox+8,oy-4, 4, 4, C.metalL);
  r(ox+9,oy-5, 2, 6, C.metalD);
}

function drawStove(ox, oy) {
  r(ox, oy, 24, 28, '#888888');
  r(ox+1,oy+1, 22, 26, '#606060');
  // Burners
  [[4,3],[14,3],[4,13],[14,13]].forEach(([bx,by]) => {
    r(ox+bx,oy+by, 6, 6, '#404040');
    r(ox+bx+1,oy+by+1, 4, 4, '#303030');
  });
  // Oven door
  r(ox+2,oy+19, 20, 8, '#505050');
  r(ox+3,oy+20, 18, 6, '#404040');
  // Handle
  r(ox+4,oy+18, 16, 2, C.metalL);
}

function drawFridge(ox, oy) {
  r(ox, oy, 22, 50, C.fridgeCol);
  r(ox+1,oy+1, 20, 28, '#E4E8E4'); // freezer
  r(ox+1,oy+30, 20, 18, '#E4E8E4'); // fridge
  r(ox, oy+29, 22, 2, C.metalD); // divider
  // Handles
  r(ox+17,oy+6,  2, 12, C.metalD);
  r(ox+17,oy+35, 2, 10, C.metalD);
}

function drawKitchenTable(ox, oy) {
  r(ox, oy, 36, 4, C.woodFL);
  r(ox+1,oy+4, 4, 18, C.woodFD);
  r(ox+31,oy+4, 4, 18, C.woodFD);
  // chairs
  drawChair(ox - 12, oy - 10);
  drawChair(ox + 36+2, oy - 10, true);
  // plate + cup on table
  r(ox+8,  oy-2, 8, 2, '#C8C8C8');
  r(ox+22, oy-4, 5, 4, '#A8B8AA');
}

function drawChair(ox, oy, flip) {
  const fx = flip ? 1 : 0;
  r(ox, oy+6, 14, 3, C.woodF);   // seat
  r(ox+1,oy+9, 4, 10, C.woodFD); // front leg
  r(ox+9,oy+9, 4, 10, C.woodFD);
  r(ox+5,oy, 4, 7, C.woodFD);    // back post
  r(ox+3,oy+2, 8, 2, C.woodFL);  // backrest
}

function drawBathTub(ox, oy) {
  r(ox, oy, 48, 22, '#D0D8DC');
  r(ox+2,oy+2, 44, 18, '#B8C8CC');
  r(ox+3,oy+3, 42, 16, '#A8E8F0'); // water tint
  r(ox, oy+22, 48, 4, '#D0D8DC'); // bottom
  // Faucet
  r(ox+20,oy-4, 8, 4, C.metalL);
  r(ox+23,oy-6, 2, 3, C.metalD);
}

function drawBathSink(ox, oy) {
  // Pedestal
  r(ox+6, oy+14, 8, 10, C.white);
  // Basin
  r(ox, oy, 20, 14, C.white);
  r(ox+2,oy+2, 16, 10, '#D0D8DC');
  r(ox+8,oy-4, 4, 4, C.metalL);
  r(ox+9,oy-6, 2, 5, C.metalD);
}

function drawMirror(ox, oy) {
  r(ox-2, oy-2, 20+4, 26+4, C.woodF);
  r(ox, oy, 20, 26, '#C8D8E0');
  r(ox+1,oy+1, 18, 24, '#B8D0DC');
  // reflection hint (lighter)
  r(ox+2,oy+2, 5, 22, 'rgba(255,255,255,0.18)');
}

function drawToilet(ox, oy) {
  // Tank
  r(ox+2, oy, 14, 14, C.white);
  r(ox+3,oy+1, 12, 12, C.offwhite);
  // Bowl
  r(ox, oy+14, 18, 14, C.white);
  r(ox+2,oy+16, 14, 10, '#C8D0C8');
  // Seat
  r(ox+1,oy+14, 16, 3, C.offwhite);
}

function drawPlant(ox, oy) {
  r(ox+3, oy+14, 8, 8, C.potSoil);
  r(ox+2, oy+8, 10, 8, '#4A8040');
  r(ox+2, oy+8, 10, 6, '#6AA050');
  r(ox,   oy+4, 4,  8, '#5A9045');
  r(ox+10,oy+4, 4,  8, '#5A9045');
  r(ox+4, oy,   6,  6, '#6AB050');
}

function drawCoatRack(ox, oy) {
  r(ox+3, oy,  2, 38, C.woodFD);
  r(ox,   oy,  8,  3, C.woodF);
  r(ox-2, oy+5, 4, 2, C.woodF); // peg
  r(ox+6, oy+5, 4, 2, C.woodF); // peg
  r(ox+1, oy+10,6, 2, C.woodF); // peg
  r(ox-2, oy+38, 12, 3, C.woodFD); // base
  // Coat hanging
  r(ox-3, oy+6, 6, 20, '#405060');
  r(ox-4, oy+8, 5, 14, '#304050');
}

// ── player sprite ─────────────────────────────────────────────────────────────
function drawPlayer(lx, ly, dir, frame, sleeping) {
  if (sleeping) { drawPlayerSleeping(lx, ly); return; }

  const ox = Math.floor(lx);
  const oy = Math.floor(ly);

  // Walk cycle: shift arm/leg on frame
  const legSwing = (frame === 1) ? 1 : (frame === 3 ? -1 : 0);
  const flip = dir === 'left';

  function p(x, y, w, h, col) {
    const rx = flip ? (ox + PLAYER_W - x - w) : ox + x;
    r(rx, oy + y, w, h, col);
  }

  // Shadow
  r(ox, oy + PLAYER_H, PLAYER_W, 2, 'rgba(0,0,0,0.18)');

  // Shoes
  p(0, 19, 4, 3, C.shoe);
  p(6, 19, 4, 3, C.shoe);

  // Pants / legs
  p(1, 14, 3, 5, C.pants);
  p(6, 14, 3, 5, C.pants);

  // Walk leg shift
  if (legSwing !== 0) {
    p(1, 14 + legSwing, 3, 5, C.pants);
    p(6, 14 - legSwing, 3, 5, C.pants);
    p(0, 19 + legSwing, 4, 3, C.shoe);
    p(6, 19 - legSwing, 4, 3, C.shoe);
  }

  // Body / shirt
  p(1,  8, 8, 7, C.shirt);
  p(2,  8, 6, 1, blendColor(C.shirt,'#fff',0.2)); // collar highlight

  // Arms
  const armY = (frame === 1) ? 1 : (frame === 3 ? -1 : 0);
  p(-1, 9 + armY,  2, 6, C.arm);   // left arm
  p(9,  9 - armY,  2, 6, C.arm);   // right arm

  // Head
  p(2,  2, 6, 6, C.skin);
  p(2,  2, 6, 2, C.hair); // hair top
  p(2,  4, 1, 2, C.hair); // hair side
  p(7,  4, 1, 2, C.hair); // hair side

  // Face
  if (!flip) {
    r(ox+4, oy+5, 1, 1, C.black); // left eye
    r(ox+7, oy+5, 1, 1, C.black); // right eye
  } else {
    r(ox+2, oy+5, 1, 1, C.black);
    r(ox+5, oy+5, 1, 1, C.black);
  }
}

function drawPlayerSleeping(lx, ly) {
  // Player lying in bed - just draw lump under covers
  r(Math.floor(lx), Math.floor(ly), 18, 5, '#C0CCDC');
  r(Math.floor(lx)+2, Math.floor(ly)-2, 6, 6, C.skin); // head sticking out
  r(Math.floor(lx)+2, Math.floor(ly)-2, 6, 2, C.hair);
}

// ── room renderers ────────────────────────────────────────────────────────────

function drawBedroom(ox, G) {
  const h = G.state.hour, hl = G.state.horrorLevel;

  // Ceiling
  drawCeiling(ox, hl >= 2 ? blendColor(C.ceil,'#0a0800',0.25) : C.ceil);
  // Wall
  r(ox, CEIL_Y, ROOM_W, FLOOR_Y - CEIL_Y, C.bedWall);
  if (hl >= 1) {
    // subtle dark gradient creeping in from corners
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `rgba(0,0,0,${0.003 * i * hl})`;
      ctx.fillRect(ox*S, CEIL_Y*S, i*S, (FLOOR_Y-CEIL_Y)*S);
      ctx.fillRect((ox+ROOM_W-i)*S, CEIL_Y*S, i*S, (FLOOR_Y-CEIL_Y)*S);
    }
  }
  // Wallpaper stripe
  for (let px = ox; px < ox + ROOM_W; px += 14) {
    r(px, CEIL_Y, 2, FLOOR_Y - CEIL_Y, 'rgba(255,255,255,0.06)');
  }

  // Floor
  drawWoodFloor(ox, GND_Y, ROOM_W, LH - GND_Y);

  // Baseboard
  drawBaseboard(ox, FLOOR_Y, ROOM_W);

  // Window (left of wall)
  const winX = ox + 55;
  const winY = WALL_Y + 10;
  drawSkyWindow(winX, winY, 46, 54, h, hl, G.state.minute);

  // Bed (right side)
  drawBed(ox + 210, FLOOR_Y - 44);

  // Desk (left side)
  drawDesk(ox + 48, FLOOR_Y - 38);

  // Alarm clock on desk
  drawAlarmClock(ox + 58, FLOOR_Y - 43);

  // Lamp on desk
  drawLamp(ox + 88, FLOOR_Y - 59);

  // Bookshelf on far right (before door)
  drawBookshelf(ox + 268, FLOOR_Y - 52);

  // Plant in corner
  drawPlant(ox + 8, FLOOR_Y - 22);

  // Door to hallway (right)
  drawDoor(ox + ROOM_W - 26, FLOOR_Y - 38);
}

function drawHallway(ox, G) {
  const h = G.state.hour, hl = G.state.horrorLevel;

  // Ceiling
  drawCeiling(ox, hl >= 2 ? blendColor(C.ceil,'#060400',0.3) : C.ceil);
  // Wall
  const wallCol = hl >= 1 ? blendColor(C.hallWall,'#060404',0.1*hl) : C.hallWall;
  r(ox, CEIL_Y, ROOM_W, FLOOR_Y - CEIL_Y, wallCol);

  // Floor (tile)
  drawTileFloor(ox, GND_Y, ROOM_W, LH - GND_Y);
  drawBaseboard(ox, FLOOR_Y, ROOM_W);

  // Wall picture / frame
  r(ox + 80, WALL_Y+8, 24, 20, C.woodFD);
  r(ox + 82, WALL_Y+10, 20, 16, '#889098'); // abstract art

  // Coat rack
  drawCoatRack(ox + 30, FLOOR_Y - 40);

  // Mirror on wall
  r(ox + 130, WALL_Y + 5, 24, 32, C.woodF);
  r(ox + 132, WALL_Y + 7, 20, 28, '#C8D8E0');
  r(ox + 133, WALL_Y + 8, 5, 26, 'rgba(255,255,255,0.14)');

  // Front door (left wall - can't go outside)
  r(ox + 4, FLOOR_Y - 42, 24, 42, '#5A4020'); // door frame
  r(ox + 6, FLOOR_Y - 40, 20, 40, C.woodFD);
  r(ox + 7, FLOOR_Y - 39, 8, 18, C.woodF);
  r(ox + 7, FLOOR_Y - 19, 8, 16, C.woodF);
  r(ox + 17,FLOOR_Y - 39, 8, 18, C.woodF);
  r(ox + 17,FLOOR_Y - 19, 8, 16, C.woodF);
  r(ox + 20,FLOOR_Y - 21, 4, 4, C.metalL); // lock
  // Peephole
  r(ox + 14, FLOOR_Y - 28, 4, 4, C.black);
  r(ox + 15, FLOOR_Y - 27, 2, 2, '#303030');

  // Flicker effect on hall light (day2+)
  if (hl >= 1 && G.horrorFlicker > 0) {
    r(ox, CEIL_Y, ROOM_W, FLOOR_Y - CEIL_Y, `rgba(0,0,0,${Math.min(0.9, G.horrorFlicker)})`);
  }

  // Door bedroom (left edge)
  drawDoor(ox + ROOM_W - 26, FLOOR_Y - 38);

  // Door living room (right edge)
  drawDoor(ox + ROOM_W - 26 + 1, FLOOR_Y - 38);
}

function drawLivingRoom(ox, G) {
  const h = G.state.hour, hl = G.state.horrorLevel;

  drawCeiling(ox, hl >= 2 ? blendColor(C.ceil,'#0a0604',0.35) : C.ceil);
  const wc = hl >= 1 ? blendColor(C.liveWall,'#060402',0.12*hl) : C.liveWall;
  r(ox, CEIL_Y, ROOM_W, FLOOR_Y - CEIL_Y, wc);

  // Wainscoting
  r(ox, FLOOR_Y - 28, ROOM_W, 2, blendColor(C.liveWall,'#fff',0.15));
  r(ox, FLOOR_Y - 26, ROOM_W, 26, blendColor(C.liveWall,'#000',0.08));

  // Floor (carpet)
  drawCarpetFloor(ox, GND_Y, ROOM_W, LH - GND_Y);
  drawBaseboard(ox, FLOOR_Y, ROOM_W);

  // Large window LEFT
  const winX = ox + 20;
  const winY = WALL_Y + 6;
  const winW = 64, winH = 68;
  drawSkyWindow(winX, winY, winW, winH, h, hl, G.state.minute);

  // HORROR: ghost at window (day3 event)
  if (G.ghostVisible) {
    drawGhost(winX, winY, winW, winH, G.ghostAlpha, G.ghostBreath);
  }

  // Bookshelf (far left)
  drawBookshelf(ox + 2, FLOOR_Y - 52);

  // Sofa (center, facing TV)
  drawSofa(ox + 110, FLOOR_Y - 34);

  // Coffee table
  drawCoffeTable(ox + 168, FLOOR_Y - 14);

  // TV + stand (right)
  const tvOn = G.state.tvOn;
  if (tvOn) drawTVOn(ox + 255, FLOOR_Y - 74);
  else       drawTV(ox + 255, FLOOR_Y - 74);

  // Plant by window
  drawPlant(ox + 88, FLOOR_Y - 22);

  // Door to hallway (left)
  drawDoor(ox + 4, FLOOR_Y - 38);
  // Door to kitchen (right)
  drawDoor(ox + ROOM_W - 26, FLOOR_Y - 38);
}

function drawKitchen(ox, G) {
  const h = G.state.hour, hl = G.state.horrorLevel;

  drawCeiling(ox);
  const wc = hl >= 2 ? blendColor(C.kitWall,'#080604',0.2) : C.kitWall;
  r(ox, CEIL_Y, ROOM_W, FLOOR_Y - CEIL_Y, wc);

  // Tile backsplash on upper half
  for (let tx = ox; tx < ox + ROOM_W; tx += 10) {
    for (let ty = CEIL_Y; ty < WALL_Y + 30; ty += 10) {
      r(tx, ty, 10, 1, 'rgba(255,255,255,0.08)');
      r(tx, ty, 1, 10, 'rgba(255,255,255,0.08)');
    }
  }

  drawLinoFloor(ox, GND_Y, ROOM_W, LH - GND_Y);
  drawBaseboard(ox, FLOOR_Y, ROOM_W);

  // Window above sink
  drawSkyWindow(ox + 175, WALL_Y + 4, 40, 48, h, hl, G.state.minute);

  // Upper cabinets
  r(ox + 150, WALL_Y + 2, 120, 32, C.cupboard);
  r(ox + 152, WALL_Y + 4, 116, 28, C.cupboardD);
  for (let d = 0; d < 3; d++) {
    r(ox+152+d*38, WALL_Y+5, 36, 26, C.cupboard);
    r(ox+153+d*38, WALL_Y+6, 34, 24, C.woodFL);
    r(ox+166+d*38, WALL_Y+16, 5, 4, C.metalL);
  }

  // Counter (right side)
  drawKitchenCounter(ox + 150, FLOOR_Y - 32, 140);

  // Sink on counter
  drawSink(ox + 165, FLOOR_Y - 36);

  // Stove
  drawStove(ox + 230, FLOOR_Y - 56);

  // Fridge (far right)
  drawFridge(ox + 284, FLOOR_Y - 50);

  // Kitchen table + chairs (left)
  drawKitchenTable(ox + 30, FLOOR_Y - 22);

  // Door to living room (left)
  drawDoor(ox + 4, FLOOR_Y - 38);
  // Door to bathroom (right)
  drawDoor(ox + ROOM_W - 26, FLOOR_Y - 38);
}

function drawBathroom(ox, G) {
  const hl = G.state.horrorLevel;

  drawCeiling(ox);
  const wc = hl >= 2 ? blendColor(C.bathWall,'#060808',0.22) : C.bathWall;
  r(ox, CEIL_Y, ROOM_W, FLOOR_Y - CEIL_Y, wc);

  // Tile walls
  for (let tx = ox; tx < ox + ROOM_W; tx += 12) {
    for (let ty = CEIL_Y; ty < FLOOR_Y; ty += 12) {
      r(tx, ty, 12, 1, 'rgba(255,255,255,0.12)');
      r(tx, ty, 1, 12, 'rgba(255,255,255,0.12)');
    }
  }

  drawTileFloor(ox, GND_Y, ROOM_W, LH - GND_Y);
  drawBaseboard(ox, FLOOR_Y, ROOM_W);

  // Bathtub (left)
  drawBathTub(ox + 20, FLOOR_Y - 26);

  // Sink + mirror (center)
  drawBathSink(ox + 140, FLOOR_Y - 24);
  drawMirror(ox + 136, WALL_Y + 8);

  // Toilet (right)
  drawToilet(ox + 240, FLOOR_Y - 28);

  // Towel rail
  r(ox + 100, FLOOR_Y - 40, 2, 28, C.metalL);
  r(ox + 96,  FLOOR_Y - 41, 10, 2, C.metalL);
  r(ox + 97, FLOOR_Y - 38, 8, 16, '#C87050'); // towel

  // Door (left)
  drawDoor(ox + 4, FLOOR_Y - 38);
}

// ── HORROR: ghost ─────────────────────────────────────────────────────────────
function drawGhost(wx, wy, ww, wh, alpha, breath) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  // Ghost is silhouetted behind glass (dark figure)
  const gx = wx + Math.floor(ww / 2) - 5;
  const gy = wy + 4 + Math.floor(breath * 2); // subtle breathing

  // Body
  r(gx,    gy + 6, 10, 20, C.ghost);
  r(gx + 1,gy + 5, 8,  22, C.ghostEdge);

  // Head (slightly oval)
  r(gx + 1,gy,     8,  7,  C.ghost);
  r(gx + 2,gy - 1, 6,  8,  C.ghostEdge);

  // Arms hanging
  r(gx - 2,gy + 8, 3, 12, C.ghost);
  r(gx + 9, gy + 8, 3, 12, C.ghost);

  // Eyes - two faint white dots (the creepiest part)
  ctx.globalAlpha = alpha * 0.6;
  r(gx + 2, gy + 2, 2, 2, '#FFFFFF');
  r(gx + 6, gy + 2, 2, 2, '#FFFFFF');

  // Glow/aura
  ctx.globalAlpha = alpha * 0.12;
  r(gx - 4, gy - 4, 18, 32, C.ghostEdge);

  ctx.restore();
}

// ── horror overlays ───────────────────────────────────────────────────────────
function drawHorrorVignette(level) {
  if (level <= 0) return;
  const grad = ctx.createRadialGradient(W/2,H/2,H*0.25, W/2,H/2,H*0.75);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, `rgba(0,0,0,${Math.min(0.72, level * 0.15)})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawScreenFlicker(intensity) {
  if (intensity <= 0) return;
  ctx.fillStyle = `rgba(0,0,0,${intensity})`;
  ctx.fillRect(0, 0, W, H);
}

function drawRedFlash(intensity) {
  if (intensity <= 0) return;
  ctx.fillStyle = `rgba(80,0,0,${intensity})`;
  ctx.fillRect(0, 0, W, H);
}

// ── camera-aware render ───────────────────────────────────────────────────────
function renderWorld(G) {
  ctx.clearRect(0, 0, W, H);

  const camX = Math.max(0, Math.min(G.playerX - LW/2, ROOM_COUNT * ROOM_W - LW));
  const worldOx = -Math.floor(camX);

  const ROOM_DRAWERS = [drawBedroom, drawHallway, drawLivingRoom, drawKitchen, drawBathroom];

  for (let i = 0; i < ROOM_COUNT; i++) {
    const roomOx = i * ROOM_W + worldOx;
    if (roomOx + ROOM_W >= 0 && roomOx < LW) {
      ROOM_DRAWERS[i](roomOx, G);
    }
  }

  // Player (always drawn; sleeping = lying-in-bed pose)
  const ppx = Math.floor(G.playerX + worldOx);
  const ppy = FLOOR_Y - PLAYER_H;
  drawPlayer(ppx, ppy, G.playerDir, G.playerAnim, G.state.playerState === 'sleeping');

  // Horror overlays
  drawHorrorVignette(G.state.horrorLevel);
  if (G.screenFlicker > 0)  drawScreenFlicker(G.screenFlicker);
  if (G.redFlash > 0)       drawRedFlash(G.redFlash);
}

// ── color utilities ───────────────────────────────────────────────────────────
function blendColor(a, b, t) {
  const ah = a.replace('#',''), bh = b.replace('#','');
  const ar = parseInt(ah.slice(0,2),16), ag = parseInt(ah.slice(2,4),16), ab = parseInt(ah.slice(4,6),16);
  const br = parseInt(bh.slice(0,2),16), bg = parseInt(bh.slice(2,4),16), bb = parseInt(bh.slice(4,6),16);
  const rr2 = Math.round(ar + (br-ar)*t);
  const rg  = Math.round(ag + (bg-ag)*t);
  const rb  = Math.round(ab + (bb-ab)*t);
  return `#${rr2.toString(16).padStart(2,'0')}${rg.toString(16).padStart(2,'0')}${rb.toString(16).padStart(2,'0')}`;
}
