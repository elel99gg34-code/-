// ============================================================
// MINECRAFT CLONE - game.js
// ============================================================

// ---- BLOCK DEFINITIONS ----
const BLOCKS = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  COBBLESTONE: 4,
  SAND: 5,
  GRAVEL: 6,
  OAK_LOG: 7,
  OAK_LEAVES: 8,
  OAK_PLANKS: 9,
  GLASS: 10,
  CRAFTING_TABLE: 11,
  FURNACE: 12,
  CHEST: 13,
  TORCH: 14,
  COAL_ORE: 15,
  IRON_ORE: 16,
  GOLD_ORE: 17,
  DIAMOND_ORE: 18,
  REDSTONE_ORE: 19,
  LAPIS_ORE: 20,
  BEDROCK: 21,
  WATER: 22,
  LAVA: 23,
  TNT: 24,
  BOOKSHELF: 25,
  OBSIDIAN: 26,
  NETHERRACK: 27,
  SNOW: 28,
  ICE: 29,
  GLOWSTONE: 30,
  WOOL_WHITE: 31,
  WOOL_RED: 32,
  WOOL_BLUE: 33,
  WOOL_GREEN: 34,
  WOOL_YELLOW: 35,
  WOOL_BLACK: 36,
  BIRCH_LOG: 37,
  BIRCH_PLANKS: 38,
  SPRUCE_LOG: 39,
  SPRUCE_PLANKS: 40,
  STONE_BRICKS: 41,
  MOSSY_STONE_BRICKS: 42,
  BRICK: 43,
  SANDSTONE: 44,
  GRAVEL_PATH: 45,
  MYCELIUM: 46,
  SOUL_SAND: 47,
  NETHER_BRICK: 48,
  END_STONE: 49,
  SPONGE: 50,
};

// Block properties: name, color(top/side/bottom), hardness, drops, tool
const BLOCK_DATA = {
  [BLOCKS.GRASS]:         { name:'잔디 블록',   colors:['#5a9e32','#8b6914','#8b6914'], hardness:0.6, drops:[{id:BLOCKS.DIRT,count:1}], tool:'shovel' },
  [BLOCKS.DIRT]:          { name:'흙',          colors:['#8b6914','#8b6914','#8b6914'], hardness:0.5, drops:[{id:BLOCKS.DIRT,count:1}], tool:'shovel' },
  [BLOCKS.STONE]:         { name:'돌',          colors:['#808080','#808080','#808080'], hardness:1.5, drops:[{id:BLOCKS.COBBLESTONE,count:1}], tool:'pickaxe' },
  [BLOCKS.COBBLESTONE]:   { name:'조약돌',      colors:['#6e6e6e','#6e6e6e','#6e6e6e'], hardness:2.0, drops:[{id:BLOCKS.COBBLESTONE,count:1}], tool:'pickaxe' },
  [BLOCKS.SAND]:          { name:'모래',        colors:['#dbd37a','#dbd37a','#dbd37a'], hardness:0.5, drops:[{id:BLOCKS.SAND,count:1}], tool:'shovel' },
  [BLOCKS.GRAVEL]:        { name:'자갈',        colors:['#8a8878','#8a8878','#8a8878'], hardness:0.6, drops:[{id:BLOCKS.GRAVEL,count:1}], tool:'shovel' },
  [BLOCKS.OAK_LOG]:       { name:'참나무 원목', colors:['#c8a855','#6b4f1c','#c8a855'], hardness:2.0, drops:[{id:BLOCKS.OAK_LOG,count:1}], tool:'axe' },
  [BLOCKS.OAK_LEAVES]:    { name:'참나무 잎',   colors:['#2d7a1f','#2d7a1f','#2d7a1f'], hardness:0.2, drops:[], tool:'shears', transparent:true },
  [BLOCKS.OAK_PLANKS]:    { name:'참나무 판자', colors:['#bc9a54','#bc9a54','#bc9a54'], hardness:2.0, drops:[{id:BLOCKS.OAK_PLANKS,count:1}], tool:'axe' },
  [BLOCKS.GLASS]:         { name:'유리',        colors:['#aaddff','#aaddff','#aaddff'], hardness:0.3, drops:[], tool:'pickaxe', transparent:true },
  [BLOCKS.CRAFTING_TABLE]:{ name:'제작대',      colors:['#9e7a33','#896928','#bc9a54'], hardness:2.5, drops:[{id:BLOCKS.CRAFTING_TABLE,count:1}], tool:'axe' },
  [BLOCKS.FURNACE]:       { name:'용광로',      colors:['#808080','#7a7a7a','#808080'], hardness:3.5, drops:[{id:BLOCKS.FURNACE,count:1}], tool:'pickaxe' },
  [BLOCKS.CHEST]:         { name:'상자',        colors:['#9e7a33','#9e7a33','#9e7a33'], hardness:2.5, drops:[{id:BLOCKS.CHEST,count:1}], tool:'axe' },
  [BLOCKS.COAL_ORE]:      { name:'석탄 광석',   colors:['#3a3a3a','#3a3a3a','#3a3a3a'], hardness:3.0, drops:[{id:'coal',count:1}], tool:'pickaxe' },
  [BLOCKS.IRON_ORE]:      { name:'철 광석',     colors:['#ad8d7f','#ad8d7f','#ad8d7f'], hardness:3.0, drops:[{id:BLOCKS.IRON_ORE,count:1}], tool:'pickaxe' },
  [BLOCKS.GOLD_ORE]:      { name:'금 광석',     colors:['#d4c45a','#d4c45a','#d4c45a'], hardness:3.0, drops:[{id:BLOCKS.GOLD_ORE,count:1}], tool:'pickaxe' },
  [BLOCKS.DIAMOND_ORE]:   { name:'다이아몬드 광석', colors:['#4fc9c9','#4fc9c9','#4fc9c9'], hardness:3.0, drops:[{id:'diamond',count:1}], tool:'pickaxe' },
  [BLOCKS.REDSTONE_ORE]:  { name:'레드스톤 광석', colors:['#8b0000','#8b0000','#8b0000'], hardness:3.0, drops:[{id:'redstone',count:4}], tool:'pickaxe' },
  [BLOCKS.LAPIS_ORE]:     { name:'청금석 광석', colors:['#1f4e8c','#1f4e8c','#1f4e8c'], hardness:3.0, drops:[{id:'lapis',count:6}], tool:'pickaxe' },
  [BLOCKS.BEDROCK]:       { name:'암반',        colors:['#2a2a2a','#2a2a2a','#2a2a2a'], hardness:-1, drops:[], tool:'pickaxe' },
  [BLOCKS.WATER]:         { name:'물',          colors:['#2255cc','#2255cc','#2255cc'], hardness:0, drops:[], tool:'bucket', transparent:true },
  [BLOCKS.LAVA]:          { name:'용암',        colors:['#cc4400','#cc4400','#cc4400'], hardness:0, drops:[], tool:'bucket', transparent:false },
  [BLOCKS.TNT]:           { name:'TNT',         colors:['#aa2222','#aa2222','#aa2222'], hardness:0, drops:[{id:BLOCKS.TNT,count:1}], tool:null },
  [BLOCKS.BOOKSHELF]:     { name:'책장',        colors:['#bc9a54','#c0a03a','#bc9a54'], hardness:1.5, drops:[{id:BLOCKS.OAK_PLANKS,count:3}], tool:'axe' },
  [BLOCKS.OBSIDIAN]:      { name:'흑요석',      colors:['#1a0a2a','#1a0a2a','#1a0a2a'], hardness:50, drops:[{id:BLOCKS.OBSIDIAN,count:1}], tool:'pickaxe' },
  [BLOCKS.NETHERRACK]:    { name:'네더랙',      colors:['#6e2020','#6e2020','#6e2020'], hardness:0.4, drops:[{id:BLOCKS.NETHERRACK,count:1}], tool:'pickaxe' },
  [BLOCKS.SNOW]:          { name:'눈',          colors:['#f0f0f0','#f0f0f0','#f0f0f0'], hardness:0.2, drops:[{id:BLOCKS.SNOW,count:1}], tool:'shovel' },
  [BLOCKS.ICE]:           { name:'얼음',        colors:['#88bbff','#88bbff','#88bbff'], hardness:0.5, drops:[], tool:'pickaxe', transparent:true },
  [BLOCKS.GLOWSTONE]:     { name:'형광석',      colors:['#eecc44','#eecc44','#eecc44'], hardness:0.3, drops:[{id:'glowstone_dust',count:4}], tool:'pickaxe' },
  [BLOCKS.WOOL_WHITE]:    { name:'흰색 양털',   colors:['#eeeeee','#eeeeee','#eeeeee'], hardness:0.8, drops:[{id:BLOCKS.WOOL_WHITE,count:1}], tool:'shears' },
  [BLOCKS.WOOL_RED]:      { name:'빨간색 양털', colors:['#cc2222','#cc2222','#cc2222'], hardness:0.8, drops:[{id:BLOCKS.WOOL_RED,count:1}], tool:'shears' },
  [BLOCKS.WOOL_BLUE]:     { name:'파란색 양털', colors:['#2244cc','#2244cc','#2244cc'], hardness:0.8, drops:[{id:BLOCKS.WOOL_BLUE,count:1}], tool:'shears' },
  [BLOCKS.WOOL_GREEN]:    { name:'초록색 양털', colors:['#228822','#228822','#228822'], hardness:0.8, drops:[{id:BLOCKS.WOOL_GREEN,count:1}], tool:'shears' },
  [BLOCKS.WOOL_YELLOW]:   { name:'노란색 양털', colors:['#cccc22','#cccc22','#cccc22'], hardness:0.8, drops:[{id:BLOCKS.WOOL_YELLOW,count:1}], tool:'shears' },
  [BLOCKS.WOOL_BLACK]:    { name:'검은색 양털', colors:['#222222','#222222','#222222'], hardness:0.8, drops:[{id:BLOCKS.WOOL_BLACK,count:1}], tool:'shears' },
  [BLOCKS.BIRCH_LOG]:     { name:'자작나무 원목', colors:['#e8e8d0','#c8c8b0','#e8e8d0'], hardness:2.0, drops:[{id:BLOCKS.BIRCH_LOG,count:1}], tool:'axe' },
  [BLOCKS.BIRCH_PLANKS]:  { name:'자작나무 판자', colors:['#d4c8a0','#d4c8a0','#d4c8a0'], hardness:2.0, drops:[{id:BLOCKS.BIRCH_PLANKS,count:1}], tool:'axe' },
  [BLOCKS.SPRUCE_LOG]:    { name:'가문비나무 원목', colors:['#4a3820','#2c1e0a','#4a3820'], hardness:2.0, drops:[{id:BLOCKS.SPRUCE_LOG,count:1}], tool:'axe' },
  [BLOCKS.SPRUCE_PLANKS]: { name:'가문비나무 판자', colors:['#6b4f28','#6b4f28','#6b4f28'], hardness:2.0, drops:[{id:BLOCKS.SPRUCE_PLANKS,count:1}], tool:'axe' },
  [BLOCKS.STONE_BRICKS]:  { name:'석재 벽돌',   colors:['#888888','#888888','#888888'], hardness:1.5, drops:[{id:BLOCKS.STONE_BRICKS,count:1}], tool:'pickaxe' },
  [BLOCKS.BRICK]:         { name:'벽돌',        colors:['#993322','#993322','#993322'], hardness:2.0, drops:[{id:BLOCKS.BRICK,count:1}], tool:'pickaxe' },
  [BLOCKS.SANDSTONE]:     { name:'사암',        colors:['#e8d87a','#d8c86a','#e8d87a'], hardness:0.8, drops:[{id:BLOCKS.SANDSTONE,count:1}], tool:'pickaxe' },
  [BLOCKS.SOUL_SAND]:     { name:'영혼 모래',   colors:['#4a3020','#4a3020','#4a3020'], hardness:0.5, drops:[{id:BLOCKS.SOUL_SAND,count:1}], tool:'shovel' },
  [BLOCKS.NETHER_BRICK]:  { name:'네더 벽돌',   colors:['#2a1010','#2a1010','#2a1010'], hardness:2.0, drops:[{id:BLOCKS.NETHER_BRICK,count:1}], tool:'pickaxe' },
  [BLOCKS.END_STONE]:     { name:'엔드 돌',     colors:['#d8d890','#d8d890','#d8d890'], hardness:3.0, drops:[{id:BLOCKS.END_STONE,count:1}], tool:'pickaxe' },
  [BLOCKS.SPONGE]:        { name:'스펀지',      colors:['#c8c820','#c8c820','#c8c820'], hardness:0.6, drops:[{id:BLOCKS.SPONGE,count:1}], tool:null },
  [BLOCKS.MOSSY_STONE_BRICKS]:{ name:'이끼 낀 석재 벽돌', colors:['#607850','#607850','#607850'], hardness:1.5, drops:[{id:BLOCKS.MOSSY_STONE_BRICKS,count:1}], tool:'pickaxe' },
};

// Items (non-block)
const ITEMS = {
  'coal':          { name:'석탄',       color:'#222' },
  'iron_ingot':    { name:'철 주괴',    color:'#d4c8c0' },
  'gold_ingot':    { name:'금 주괴',    color:'#ffd700' },
  'diamond':       { name:'다이아몬드', color:'#55ffff' },
  'redstone':      { name:'레드스톤',   color:'#cc0000' },
  'lapis':         { name:'청금석',     color:'#1144aa' },
  'glowstone_dust':{ name:'형광석 가루',color:'#eebb22' },
  'stick':         { name:'막대기',     color:'#8b6914' },
  'string':        { name:'실',         color:'#eee' },
  'flint':         { name:'부싯돌',     color:'#555' },
  'feather':       { name:'깃털',       color:'#fff' },
  'bone':          { name:'뼈',         color:'#eee' },
  'gunpowder':     { name:'화약',       color:'#888' },
  'apple':         { name:'사과',       color:'#cc2200' },
  'bread':         { name:'빵',         color:'#c89040' },
  'wood_sword':    { name:'나무 검',    color:'#bc9a54', damage:4 },
  'stone_sword':   { name:'돌 검',      color:'#808080', damage:5 },
  'iron_sword':    { name:'철 검',      color:'#d4c8c0', damage:6 },
  'gold_sword':    { name:'금 검',      color:'#ffd700', damage:4 },
  'diamond_sword': { name:'다이아몬드 검', color:'#55ffff', damage:7 },
  'wood_pickaxe':  { name:'나무 곡괭이', color:'#bc9a54', tool:'pickaxe', level:1 },
  'stone_pickaxe': { name:'돌 곡괭이',  color:'#808080', tool:'pickaxe', level:2 },
  'iron_pickaxe':  { name:'철 곡괭이',  color:'#d4c8c0', tool:'pickaxe', level:3 },
  'gold_pickaxe':  { name:'금 곡괭이',  color:'#ffd700', tool:'pickaxe', level:2 },
  'diamond_pickaxe':{ name:'다이아 곡괭이', color:'#55ffff', tool:'pickaxe', level:4 },
  'wood_axe':      { name:'나무 도끼',  color:'#bc9a54', tool:'axe', level:1 },
  'stone_axe':     { name:'돌 도끼',    color:'#808080', tool:'axe', level:2 },
  'iron_axe':      { name:'철 도끼',    color:'#d4c8c0', tool:'axe', level:3 },
  'gold_axe':      { name:'금 도끼',    color:'#ffd700', tool:'axe', level:2 },
  'diamond_axe':   { name:'다이아 도끼', color:'#55ffff', tool:'axe', level:4 },
  'wood_shovel':   { name:'나무 삽',    color:'#bc9a54', tool:'shovel', level:1 },
  'stone_shovel':  { name:'돌 삽',      color:'#808080', tool:'shovel', level:2 },
  'iron_shovel':   { name:'철 삽',      color:'#d4c8c0', tool:'shovel', level:3 },
  'gold_shovel':   { name:'금 삽',      color:'#ffd700', tool:'shovel', level:2 },
  'diamond_shovel':{ name:'다이아 삽',  color:'#55ffff', tool:'shovel', level:4 },
  'wood_hoe':      { name:'나무 괭이',  color:'#bc9a54', tool:'hoe' },
  'stone_hoe':     { name:'돌 괭이',    color:'#808080', tool:'hoe' },
  'iron_hoe':      { name:'철 괭이',    color:'#d4c8c0', tool:'hoe' },
  'diamond_hoe':   { name:'다이아 괭이',color:'#55ffff', tool:'hoe' },
  'bucket':        { name:'양동이',     color:'#888' },
  'water_bucket':  { name:'물 양동이',  color:'#2255cc' },
  'lava_bucket':   { name:'용암 양동이',color:'#cc4400' },
  'bow':           { name:'활',         color:'#8b4513' },
  'arrow':         { name:'화살',       color:'#8b6914' },
  'fishing_rod':   { name:'낚싯대',     color:'#8b4513' },
  'shears':        { name:'가위',       color:'#aaa', tool:'shears' },
  'flint_and_steel':{ name:'부싯돌과 부시', color:'#888' },
  'compass':       { name:'나침반',     color:'#cc0000' },
  'clock':         { name:'시계',       color:'#ffd700' },
  'map':           { name:'지도',       color:'#bc9a54' },
  'book':          { name:'책',         color:'#bc9a54' },
  'paper':         { name:'종이',       color:'#eee' },
  'leather':       { name:'가죽',       color:'#8b4513' },
  'egg':           { name:'달걀',       color:'#ffe4b5' },
  'sugar':         { name:'설탕',       color:'#fff' },
  'wheat':         { name:'밀',         color:'#c8a855' },
  'seed':          { name:'씨앗',       color:'#228822' },
  'bowl':          { name:'그릇',       color:'#8b4513' },
  'mushroom_stew': { name:'버섯 스튜',  color:'#8b4513' },
  'cooked_porkchop':{ name:'익힌 돼지고기', color:'#d4824a' },
  'raw_porkchop':  { name:'생 돼지고기', color:'#e89070' },
  'cooked_beef':   { name:'스테이크',   color:'#8b2500' },
  'raw_beef':      { name:'생 소고기',  color:'#cc4444' },
  'cooked_chicken':{ name:'익힌 닭고기', color:'#d4a060' },
  'raw_chicken':   { name:'생 닭고기',  color:'#e0b080' },
  'cooked_fish':   { name:'익힌 생선',  color:'#b07040' },
  'raw_fish':      { name:'생 생선',    color:'#6080c0' },
};

// ---- CRAFTING RECIPES ----
// Pattern: array of rows, each row is array of item IDs (null=empty)
// result: {id, count}
const RECIPES = [
  // Planks
  { pattern:[[BLOCKS.OAK_LOG]], result:{id:BLOCKS.OAK_PLANKS,count:4} },
  { pattern:[[BLOCKS.BIRCH_LOG]], result:{id:BLOCKS.BIRCH_PLANKS,count:4} },
  { pattern:[[BLOCKS.SPRUCE_LOG]], result:{id:BLOCKS.SPRUCE_PLANKS,count:4} },
  // Sticks
  { pattern:[[BLOCKS.OAK_PLANKS],[BLOCKS.OAK_PLANKS]], result:{id:'stick',count:4} },
  { pattern:[[BLOCKS.BIRCH_PLANKS],[BLOCKS.BIRCH_PLANKS]], result:{id:'stick',count:4} },
  { pattern:[[BLOCKS.SPRUCE_PLANKS],[BLOCKS.SPRUCE_PLANKS]], result:{id:'stick',count:4} },
  // Crafting Table
  { pattern:[[BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS],[BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS]], result:{id:BLOCKS.CRAFTING_TABLE,count:1} },
  // Torch
  { pattern:[['coal'],['stick']], result:{id:BLOCKS.TORCH,count:4} },
  // --- 3x3 recipes ---
  // Wooden tools
  { pattern:[[BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS],[null,'stick',null],[null,'stick',null]], result:{id:'wood_pickaxe',count:1} },
  { pattern:[[BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS,null],[BLOCKS.OAK_PLANKS,'stick',null],[null,'stick',null]], result:{id:'wood_axe',count:1} },
  { pattern:[[null,BLOCKS.OAK_PLANKS,null],[null,'stick',null],[null,'stick',null]], result:{id:'wood_shovel',count:1} },
  { pattern:[[BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS,null],[null,'stick',null],[null,'stick',null]], result:{id:'wood_hoe',count:1} },
  { pattern:[[null,BLOCKS.OAK_PLANKS,null],[null,BLOCKS.OAK_PLANKS,null],[null,'stick',null]], result:{id:'wood_sword',count:1} },
  // Stone tools
  { pattern:[[BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE],[null,'stick',null],[null,'stick',null]], result:{id:'stone_pickaxe',count:1} },
  { pattern:[[BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE,null],[BLOCKS.COBBLESTONE,'stick',null],[null,'stick',null]], result:{id:'stone_axe',count:1} },
  { pattern:[[null,BLOCKS.COBBLESTONE,null],[null,'stick',null],[null,'stick',null]], result:{id:'stone_shovel',count:1} },
  { pattern:[[BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE,null],[null,'stick',null],[null,'stick',null]], result:{id:'stone_hoe',count:1} },
  { pattern:[[null,BLOCKS.COBBLESTONE,null],[null,BLOCKS.COBBLESTONE,null],[null,'stick',null]], result:{id:'stone_sword',count:1} },
  // Iron tools
  { pattern:[['iron_ingot','iron_ingot','iron_ingot'],[null,'stick',null],[null,'stick',null]], result:{id:'iron_pickaxe',count:1} },
  { pattern:[['iron_ingot','iron_ingot',null],['iron_ingot','stick',null],[null,'stick',null]], result:{id:'iron_axe',count:1} },
  { pattern:[[null,'iron_ingot',null],[null,'stick',null],[null,'stick',null]], result:{id:'iron_shovel',count:1} },
  { pattern:[['iron_ingot','iron_ingot',null],[null,'stick',null],[null,'stick',null]], result:{id:'iron_hoe',count:1} },
  { pattern:[[null,'iron_ingot',null],[null,'iron_ingot',null],[null,'stick',null]], result:{id:'iron_sword',count:1} },
  // Gold tools
  { pattern:[['gold_ingot','gold_ingot','gold_ingot'],[null,'stick',null],[null,'stick',null]], result:{id:'gold_pickaxe',count:1} },
  { pattern:[[null,'gold_ingot',null],[null,'gold_ingot',null],[null,'stick',null]], result:{id:'gold_sword',count:1} },
  // Diamond tools
  { pattern:[['diamond','diamond','diamond'],[null,'stick',null],[null,'stick',null]], result:{id:'diamond_pickaxe',count:1} },
  { pattern:[['diamond','diamond',null],['diamond','stick',null],[null,'stick',null]], result:{id:'diamond_axe',count:1} },
  { pattern:[[null,'diamond',null],[null,'stick',null],[null,'stick',null]], result:{id:'diamond_shovel',count:1} },
  { pattern:[[null,'diamond',null],[null,'diamond',null],[null,'stick',null]], result:{id:'diamond_sword',count:1} },
  // Furnace
  { pattern:[[BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE],[BLOCKS.COBBLESTONE,null,BLOCKS.COBBLESTONE],[BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE,BLOCKS.COBBLESTONE]], result:{id:BLOCKS.FURNACE,count:1} },
  // Chest
  { pattern:[[BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS],[BLOCKS.OAK_PLANKS,null,BLOCKS.OAK_PLANKS],[BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS]], result:{id:BLOCKS.CHEST,count:1} },
  // TNT
  { pattern:[['gunpowder',BLOCKS.SAND,'gunpowder'],[BLOCKS.SAND,'gunpowder',BLOCKS.SAND],['gunpowder',BLOCKS.SAND,'gunpowder']], result:{id:BLOCKS.TNT,count:1} },
  // Stone bricks
  { pattern:[[BLOCKS.STONE,BLOCKS.STONE],[BLOCKS.STONE,BLOCKS.STONE]], result:{id:BLOCKS.STONE_BRICKS,count:4} },
  // Sandstone
  { pattern:[[BLOCKS.SAND,BLOCKS.SAND],[BLOCKS.SAND,BLOCKS.SAND]], result:{id:BLOCKS.SANDSTONE,count:4} },
  // Glass
  // (requires furnace - just allow crafting for simplicity)
  // Bucket
  { pattern:[[BLOCKS.OAK_PLANKS,null,BLOCKS.OAK_PLANKS],[null,BLOCKS.OAK_PLANKS,null]], result:{id:'bucket',count:1} },
  // Bow
  { pattern:[[null,'stick',null],[BLOCKS.OAK_PLANKS,'stick','string'],[null,'stick',null]], result:{id:'bow',count:1} },
  // Shears
  { pattern:[[null,'iron_ingot'],[null,'iron_ingot']], result:{id:'shears',count:1} },  // simplified
  // Wool blocks from string
  { pattern:[['string','string','string'],['string','string','string'],[null,null,null]], result:{id:BLOCKS.WOOL_WHITE,count:1} },
  // Bookshelf
  { pattern:[[BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS],['book','book','book'],[BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS,BLOCKS.OAK_PLANKS]], result:{id:BLOCKS.BOOKSHELF,count:1} },
  // Book
  { pattern:[['paper','paper','paper'],['paper','paper','paper'],['leather',null,null]], result:{id:'book',count:1} },
  // Paper
  { pattern:[['wheat','wheat','wheat']], result:{id:'paper',count:3} },
  // Bread
  { pattern:[['wheat','wheat','wheat']], result:{id:'bread',count:1} },
  // Brick block
  { pattern:[['brick','brick'],['brick','brick']], result:{id:BLOCKS.BRICK,count:1} },
  // Flint and steel
  { pattern:[['iron_ingot',null],[null,'flint']], result:{id:'flint_and_steel',count:1} },
  // Nether brick block
  { pattern:[['nether_brick','nether_brick'],['nether_brick','nether_brick']], result:{id:BLOCKS.NETHER_BRICK,count:1} },
];

// ---- WORLD CONSTANTS ----
const CHUNK_SIZE = 16;
const WORLD_HEIGHT = 64;
const SEA_LEVEL = 32;
const RENDER_DISTANCE = 4; // chunks

// ---- NOISE ----
class SimplexNoise {
  constructor(seed=42) {
    this.p = new Uint8Array(512);
    const perm = new Uint8Array(256);
    for(let i=0;i<256;i++) perm[i]=i;
    let n,q,s=seed;
    for(let i=255;i>0;i--){
      s=(s*9301+49297)%233280;
      let j=Math.floor((s/233280)*(i+1));
      n=perm[i];perm[i]=perm[j];perm[j]=n;
    }
    for(let i=0;i<512;i++) this.p[i]=perm[i&255];
  }
  fade(t){return t*t*t*(t*(t*6-15)+10);}
  lerp(a,b,t){return a+t*(b-a);}
  grad(h,x,y){
    h&=3;
    const u=h<2?x:y, v=h<2?y:x;
    return ((h&1)?-u:u)+((h&2)?-v:v);
  }
  noise2d(x,y){
    const X=Math.floor(x)&255, Y=Math.floor(y)&255;
    x-=Math.floor(x); y-=Math.floor(y);
    const u=this.fade(x), v=this.fade(y);
    const a=this.p[X]+Y, b=this.p[X+1]+Y;
    return this.lerp(
      this.lerp(this.grad(this.p[a],x,y),this.grad(this.p[b],x-1,y),u),
      this.lerp(this.grad(this.p[a+1],x,y-1),this.grad(this.p[b+1],x-1,y-1),u),v
    );
  }
  octave(x,y,oct,persist){
    let val=0,freq=1,amp=1,max=0;
    for(let i=0;i<oct;i++){val+=this.noise2d(x*freq,y*freq)*amp;max+=amp;amp*=persist;freq*=2;}
    return val/max;
  }
}

// ---- GAME STATE ----
let canvas, ctx, gl;
let scene, camera, renderer;
let gameStarted = false;
let gamePaused = false;
let menuOpen = null; // 'inventory' | 'crafting' | null
let pointerLocked = false;

const noise = new SimplexNoise(12345);

// World storage: key="x,y,z" -> blockId
const world = new Map();
const chunkMeshes = new Map();
const dirtyChunks = new Set();

// Player
const player = {
  x: 0, y: SEA_LEVEL + 3, z: 0,
  vx: 0, vy: 0, vz: 0,
  yaw: 0, pitch: 0,
  onGround: false,
  flying: false,
  sprinting: false,
  health: 20, maxHealth: 20,
  food: 20, maxFood: 20,
  xp: 0, xpLevel: 0,
  selectedSlot: 0,
};

// Inventory: 36 slots (0-8 hotbar, 9-35 main)
const inventory = new Array(36).fill(null);
const armorSlots = new Array(4).fill(null); // helmet, chest, legs, boots
const invCraftSlots = new Array(4).fill(null); // 2x2
const craftSlots = new Array(9).fill(null);    // 3x3 crafting table

// Input
const keys = {};
let mouseX = 0, mouseY = 0;
let mouseDX = 0, mouseDY = 0;

// Breaking
let breakingBlock = null;
let breakProgress = 0;
let breakTime = 0;

// Raycasting result
let lookingAt = null;

// Block textures (canvas-based)
const blockTextures = {};

// ---- THREE.JS SETUP ----
function initThree() {
  canvas = document.getElementById('minecraft-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB);
  scene.fog = new THREE.Fog(0x87CEEB, RENDER_DISTANCE * CHUNK_SIZE * 0.5, RENDER_DISTANCE * CHUNK_SIZE);

  camera = new THREE.PerspectiveCamera(70, canvas.width / canvas.height, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.width, canvas.height);
  renderer.shadowMap.enabled = true;

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Directional (sun) light
  const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
  sunLight.position.set(100, 200, 100);
  sunLight.castShadow = true;
  scene.add(sunLight);

  // Block selection highlight
  const geo = new THREE.BoxGeometry(1.002, 1.002, 1.002);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x000000, wireframe: true, transparent: true, opacity: 0.4
  });
  window.selectionBox = new THREE.Mesh(geo, mat);
  window.selectionBox.visible = false;
  scene.add(window.selectionBox);
}

// ---- TEXTURE GENERATION ----
function makeBlockTexture(colors, type) {
  const size = 16;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  const col = colors[1] || colors[0];
  ctx.fillStyle = col;
  ctx.fillRect(0, 0, size, size);

  // Add pixel noise for texture
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  for (let i = 0; i < 30; i++) {
    const px = Math.floor(Math.random() * size);
    const py = Math.floor(Math.random() * size);
    ctx.fillRect(px, py, 1, 1);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 20; i++) {
    const px = Math.floor(Math.random() * size);
    const py = Math.floor(Math.random() * size);
    ctx.fillRect(px, py, 1, 1);
  }

  // Special patterns
  if (type === BLOCKS.GRASS) {
    ctx.fillStyle = colors[0]; // green top stripe
    ctx.fillRect(0, 0, size, 3);
  }
  if (type === BLOCKS.OAK_LOG || type === BLOCKS.BIRCH_LOG || type === BLOCKS.SPRUCE_LOG) {
    // Ring pattern
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    for (let r = 2; r < size / 2; r += 3) {
      ctx.beginPath();
      ctx.arc(size/2, size/2, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  if (type === BLOCKS.COBBLESTONE || type === BLOCKS.STONE_BRICKS) {
    // Brick pattern
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    for (let y = 0; y < size; y += 4) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
    }
    for (let x = 0; x < size; x += 8) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke();
    }
  }
  if (type === BLOCKS.TNT) {
    ctx.fillStyle = '#cc0000';
    ctx.font = '6px sans-serif';
    ctx.fillText('TNT', 2, 10);
  }
  if (type === BLOCKS.CRAFTING_TABLE) {
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, 12, 12);
    ctx.strokeRect(2, 2, 6, 6);
    ctx.strokeRect(8, 2, 6, 6);
    ctx.strokeRect(2, 8, 6, 6);
    ctx.strokeRect(8, 8, 6, 6);
  }
  return new THREE.CanvasTexture(c);
}

function initTextures() {
  for (const [id, data] of Object.entries(BLOCK_DATA)) {
    blockTextures[id] = {
      top: makeBlockTexture(data.colors, parseInt(id)),
      side: makeBlockTexture([data.colors[1], data.colors[1], data.colors[2]], parseInt(id)),
      bottom: makeBlockTexture([data.colors[2], data.colors[2], data.colors[2]], parseInt(id)),
    };
  }
}

// ---- WORLD GENERATION ----
function getBlock(x, y, z) {
  if (y < 0) return BLOCKS.BEDROCK;
  if (y >= WORLD_HEIGHT) return BLOCKS.AIR;
  return world.get(`${x},${y},${z}`) ?? BLOCKS.AIR;
}

function setBlock(x, y, z, id) {
  if (y < 0 || y >= WORLD_HEIGHT) return;
  const key = `${x},${y},${z}`;
  if (id === BLOCKS.AIR) world.delete(key);
  else world.set(key, id);
  markChunkDirty(x, z);
  markChunkDirty(x-1, z); markChunkDirty(x+1, z);
  markChunkDirty(x, z-1); markChunkDirty(x, z+1);
}

function markChunkDirty(x, z) {
  const cx = Math.floor(x / CHUNK_SIZE);
  const cz = Math.floor(z / CHUNK_SIZE);
  dirtyChunks.add(`${cx},${cz}`);
}

function generateChunk(cx, cz) {
  const ox = cx * CHUNK_SIZE;
  const oz = cz * CHUNK_SIZE;

  for (let lx = 0; lx < CHUNK_SIZE; lx++) {
    for (let lz = 0; lz < CHUNK_SIZE; lz++) {
      const wx = ox + lx;
      const wz = oz + lz;

      const h1 = noise.octave(wx * 0.01, wz * 0.01, 4, 0.5);
      const h2 = noise.octave(wx * 0.05, wz * 0.05, 2, 0.5);
      const height = Math.floor(SEA_LEVEL + h1 * 16 + h2 * 4);
      const clampedH = Math.max(1, Math.min(WORLD_HEIGHT - 2, height));

      // Bedrock
      setBlock(wx, 0, wz, BLOCKS.BEDROCK);

      // Stone
      for (let y = 1; y < clampedH - 3; y++) {
        let btype = BLOCKS.STONE;
        const r = Math.random();
        if (y < 10 && r < 0.03) btype = BLOCKS.REDSTONE_ORE;
        else if (y < 16 && r < 0.02) btype = BLOCKS.DIAMOND_ORE;
        else if (y < 20 && r < 0.03) btype = BLOCKS.GOLD_ORE;
        else if (y < 30 && r < 0.04) btype = BLOCKS.IRON_ORE;
        else if (r < 0.05) btype = BLOCKS.COAL_ORE;
        else if (r < 0.06) btype = BLOCKS.LAPIS_ORE;
        setBlock(wx, y, wz, btype);
      }

      // Dirt layer
      for (let y = Math.max(1, clampedH - 3); y < clampedH; y++) {
        setBlock(wx, y, wz, BLOCKS.DIRT);
      }

      // Surface
      if (clampedH >= SEA_LEVEL) {
        setBlock(wx, clampedH, wz, BLOCKS.GRASS);

        // Trees
        if (lx > 2 && lx < CHUNK_SIZE-3 && lz > 2 && lz < CHUNK_SIZE-3) {
          if (Math.random() < 0.015) {
            const treeH = 4 + Math.floor(Math.random() * 3);
            for (let ty = 1; ty <= treeH; ty++) {
              setBlock(wx, clampedH + ty, wz, BLOCKS.OAK_LOG);
            }
            const leafStart = clampedH + treeH - 2;
            for (let ly = leafStart; ly <= clampedH + treeH + 1; ly++) {
              const radius = ly <= clampedH + treeH - 1 ? 2 : 1;
              for (let lxo = -radius; lxo <= radius; lxo++) {
                for (let lzo = -radius; lzo <= radius; lzo++) {
                  if (lxo === 0 && lzo === 0) continue;
                  if (Math.abs(lxo) + Math.abs(lzo) <= radius + (ly >= clampedH + treeH ? 0 : 1)) {
                    if (getBlock(wx+lxo, ly, wz+lzo) === BLOCKS.AIR) {
                      setBlock(wx+lxo, ly, wz+lzo, BLOCKS.OAK_LEAVES);
                    }
                  }
                }
              }
            }
            setBlock(wx, clampedH + treeH + 1, wz, BLOCKS.OAK_LEAVES);
          }
        }
      } else {
        // Water
        setBlock(wx, clampedH, wz, BLOCKS.SAND);
        for (let y = clampedH + 1; y <= SEA_LEVEL; y++) {
          setBlock(wx, y, wz, BLOCKS.WATER);
        }
      }
    }
  }
}

function ensureChunks(px, pz) {
  const cx = Math.floor(px / CHUNK_SIZE);
  const cz = Math.floor(pz / CHUNK_SIZE);
  for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
    for (let dz = -RENDER_DISTANCE; dz <= RENDER_DISTANCE; dz++) {
      const key = `${cx+dx},${cz+dz}`;
      if (!chunkMeshes.has(key)) {
        generateChunk(cx+dx, cz+dz);
        dirtyChunks.add(key);
      }
    }
  }
}

// ---- CHUNK MESH BUILDING ----
const FACES = [
  { dir:[0,1,0],  verts:[[-0.5,0.5,-0.5],[0.5,0.5,-0.5],[0.5,0.5,0.5],[-0.5,0.5,0.5]],  tex:'top' },
  { dir:[0,-1,0], verts:[[-0.5,-0.5,0.5],[0.5,-0.5,0.5],[0.5,-0.5,-0.5],[-0.5,-0.5,-0.5]], tex:'bottom' },
  { dir:[0,0,1],  verts:[[-0.5,-0.5,0.5],[0.5,-0.5,0.5],[0.5,0.5,0.5],[-0.5,0.5,0.5]],  tex:'side' },
  { dir:[0,0,-1], verts:[[0.5,-0.5,-0.5],[-0.5,-0.5,-0.5],[-0.5,0.5,-0.5],[0.5,0.5,-0.5]], tex:'side' },
  { dir:[1,0,0],  verts:[[0.5,-0.5,0.5],[0.5,-0.5,-0.5],[0.5,0.5,-0.5],[0.5,0.5,0.5]],  tex:'side' },
  { dir:[-1,0,0], verts:[[-0.5,-0.5,-0.5],[-0.5,-0.5,0.5],[-0.5,0.5,0.5],[-0.5,0.5,-0.5]], tex:'side' },
];

function buildChunkMesh(cx, cz) {
  const key = `${cx},${cz}`;
  // Remove old mesh
  if (chunkMeshes.has(key)) {
    const old = chunkMeshes.get(key);
    scene.remove(old);
    old.geometry.dispose();
    chunkMeshes.delete(key);
  }

  const ox = cx * CHUNK_SIZE;
  const oz = cz * CHUNK_SIZE;

  // Group by texture to minimize draw calls
  const groups = {};

  for (let lx = 0; lx < CHUNK_SIZE; lx++) {
    for (let y = 0; y < WORLD_HEIGHT; y++) {
      for (let lz = 0; lz < CHUNK_SIZE; lz++) {
        const wx = ox + lx, wz = oz + lz;
        const blockId = getBlock(wx, y, wz);
        if (blockId === BLOCKS.AIR) continue;
        const bdata = BLOCK_DATA[blockId];
        if (!bdata) continue;

        for (const face of FACES) {
          const nx = wx + face.dir[0];
          const ny = y  + face.dir[1];
          const nz = wz + face.dir[2];
          const neighbor = getBlock(nx, ny, nz);

          let shouldRender = false;
          if (neighbor === BLOCKS.AIR) shouldRender = true;
          else if (BLOCK_DATA[neighbor]?.transparent && neighbor !== blockId) shouldRender = true;

          if (!shouldRender) continue;

          const texKey = `${blockId}_${face.tex}`;
          if (!groups[texKey]) {
            groups[texKey] = { positions:[], uvs:[], indices:[], blockId, texFace:face.tex, count:0 };
          }
          const g = groups[texKey];
          const base = g.count * 4;

          for (const v of face.verts) {
            g.positions.push(wx + v[0], y + v[1], wz + v[2]);
          }
          g.uvs.push(0,0, 1,0, 1,1, 0,1);
          g.indices.push(base, base+1, base+2, base, base+2, base+3);
          g.count++;
        }
      }
    }
  }

  const group = new THREE.Group();
  for (const [texKey, g] of Object.entries(groups)) {
    if (g.count === 0) continue;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(g.positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(g.uvs, 2));
    geo.setIndex(g.indices);
    geo.computeVertexNormals();

    const tex = blockTextures[g.blockId]?.[g.texFace];
    const mat = new THREE.MeshLambertMaterial({ map: tex || null, color: tex ? 0xffffff : BLOCK_DATA[g.blockId].colors[1] });
    if (BLOCK_DATA[g.blockId]?.transparent) mat.transparent = true, mat.opacity = 0.7;

    group.add(new THREE.Mesh(geo, mat));
  }

  scene.add(group);
  chunkMeshes.set(key, group);
}

function rebuildDirtyChunks() {
  let rebuilt = 0;
  for (const key of [...dirtyChunks]) {
    if (rebuilt >= 2) break;
    const [cx, cz] = key.split(',').map(Number);
    buildChunkMesh(cx, cz);
    dirtyChunks.delete(key);
    rebuilt++;
  }
}

// ---- RAYCASTING ----
function raycast(maxDist = 5) {
  const dir = new THREE.Vector3(0, 0, -1);
  dir.applyEuler(new THREE.Euler(camera.rotation.x, camera.rotation.y, 0, 'YXZ'));

  const pos = [camera.position.x, camera.position.y, camera.position.z];
  const step = 0.05;
  let prev = [Math.floor(pos[0]), Math.floor(pos[1]), Math.floor(pos[2])];

  for (let d = 0; d < maxDist; d += step) {
    const cx = pos[0] + dir.x * d;
    const cy = pos[1] + dir.y * d;
    const cz = pos[2] + dir.z * d;
    const bx = Math.floor(cx), by = Math.floor(cy), bz = Math.floor(cz);

    if (getBlock(bx, by, bz) !== BLOCKS.AIR) {
      return { x: bx, y: by, z: bz, px: prev[0], py: prev[1], pz: prev[2] };
    }
    prev = [bx, by, bz];
  }
  return null;
}

// ---- PHYSICS ----
function playerAABB() {
  return {
    minX: player.x - 0.3, maxX: player.x + 0.3,
    minY: player.y - 1.6, maxY: player.y + 0.2,
    minZ: player.z - 0.3, maxZ: player.z + 0.3,
  };
}

function collidesWithWorld(x, y, z) {
  const w = 0.3, h1 = 1.6, h2 = 0.2;
  for (let bx = Math.floor(x - w); bx <= Math.floor(x + w); bx++) {
    for (let by = Math.floor(y - h1); by <= Math.floor(y + h2); by++) {
      for (let bz = Math.floor(z - w); bz <= Math.floor(z + w); bz++) {
        const b = getBlock(bx, by, bz);
        if (b !== BLOCKS.AIR && b !== BLOCKS.WATER && !BLOCK_DATA[b]?.transparent) return true;
      }
    }
  }
  return false;
}

function updatePhysics(dt) {
  if (!gameStarted || menuOpen) return;

  const speed = player.sprinting ? 5.5 : 4.3;
  const GRAVITY = -22;
  const JUMP_VEL = 8;

  const forward = new THREE.Vector3(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
  const right = new THREE.Vector3(Math.cos(player.yaw), 0, -Math.sin(player.yaw));

  let moveX = 0, moveZ = 0;
  if (keys['KeyW']) { moveX += forward.x; moveZ += forward.z; }
  if (keys['KeyS']) { moveX -= forward.x; moveZ -= forward.z; }
  if (keys['KeyA']) { moveX -= right.x; moveZ -= right.z; }
  if (keys['KeyD']) { moveX += right.x; moveZ += right.z; }

  const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
  if (len > 0) { moveX /= len; moveZ /= len; }

  if (player.flying) {
    player.vx = moveX * speed;
    player.vz = moveZ * speed;
    player.vy = 0;
    if (keys['Space']) player.vy = speed;
    if (keys['ShiftLeft']) player.vy = -speed;
    player.x += player.vx * dt;
    player.y += player.vy * dt;
    player.z += player.vz * dt;
    return;
  }

  player.vx = moveX * speed;
  player.vz = moveZ * speed;

  if (keys['Space'] && player.onGround) {
    player.vy = JUMP_VEL;
    player.onGround = false;
  }

  player.vy += GRAVITY * dt;

  // X movement
  const nx = player.x + player.vx * dt;
  if (!collidesWithWorld(nx, player.y, player.z)) player.x = nx;
  else player.vx = 0;

  // Z movement
  const nz = player.z + player.vz * dt;
  if (!collidesWithWorld(player.x, player.y, nz)) player.z = nz;
  else player.vz = 0;

  // Y movement
  const ny = player.y + player.vy * dt;
  if (!collidesWithWorld(player.x, ny, player.z)) {
    player.y = ny;
    player.onGround = false;
  } else {
    if (player.vy < 0) player.onGround = true;
    player.vy = 0;
  }
}

// ---- INVENTORY HELPERS ----
function getHeldItem() {
  return inventory[player.selectedSlot];
}

function addToInventory(id, count = 1) {
  // Try stacking
  for (let i = 0; i < 36; i++) {
    if (inventory[i] && inventory[i].id === id && inventory[i].count < 64) {
      const take = Math.min(count, 64 - inventory[i].count);
      inventory[i].count += take;
      count -= take;
      if (count <= 0) return true;
    }
  }
  // Empty slot
  for (let i = 0; i < 36; i++) {
    if (!inventory[i]) {
      inventory[i] = { id, count };
      return true;
    }
  }
  return false; // full
}

function getItemName(id) {
  if (id === null || id === undefined) return '';
  if (typeof id === 'number') return BLOCK_DATA[id]?.name || `블록${id}`;
  return ITEMS[id]?.name || id;
}

function getItemColor(id) {
  if (id === null || id === undefined) return '#888';
  if (typeof id === 'number') return BLOCK_DATA[id]?.colors[1] || '#888';
  return ITEMS[id]?.color || '#888';
}

// ---- CRAFTING ----
function normalizePattern(slots, size) {
  // Find bounding box of non-null slots
  let minR=size,maxR=-1,minC=size,maxC=-1;
  for(let r=0;r<size;r++){
    for(let c=0;c<size;c++){
      if(slots[r*size+c]!==null){
        if(r<minR)minR=r; if(r>maxR)maxR=r;
        if(c<minC)minC=c; if(c>maxC)maxC=c;
      }
    }
  }
  if(maxR===-1) return [];
  const rows=[];
  for(let r=minR;r<=maxR;r++){
    const row=[];
    for(let c=minC;c<=maxC;c++) row.push(slots[r*size+c]);
    rows.push(row);
  }
  return rows;
}

function patternsMatch(a, b) {
  if(a.length!==b.length) return false;
  for(let r=0;r<a.length;r++){
    if(a[r].length!==b[r].length) return false;
    for(let c=0;c<a[r].length;c++){
      const av=a[r][c]===null?null:a[r][c];
      const bv=b[r][c]===null?null:b[r][c];
      if(av!==bv) return false;
    }
  }
  return true;
}

function checkCraft(slots, size) {
  const pattern = normalizePattern(slots.map(s=>s?s.id:null), size);
  for(const recipe of RECIPES){
    if(patternsMatch(pattern, recipe.pattern)) return recipe.result;
  }
  return null;
}

// ---- HUD RENDERING ----
function renderHearts() {
  const el = document.getElementById('health-icons');
  el.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const hearts = player.health;
    const full = hearts >= (i + 1) * 2;
    const half = !full && hearts >= i * 2 + 1;
    const c = document.createElement('canvas');
    c.width = 18; c.height = 18;
    const ctx2 = c.getContext('2d');
    ctx2.fillStyle = '#555';
    // Heart outline
    ctx2.fillStyle = full ? '#cc0000' : half ? '#cc0000' : '#333';
    ctx2.font = '14px sans-serif';
    ctx2.fillText(full ? '❤' : half ? '♡' : '♡', 0, 14);
    el.appendChild(c);
  }
}

function renderFood() {
  const el = document.getElementById('food-icons');
  el.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const food = player.food;
    const full = food >= (i + 1) * 2;
    const c = document.createElement('canvas');
    c.width = 18; c.height = 18;
    const ctx2 = c.getContext('2d');
    ctx2.fillStyle = full ? '#8b6914' : '#333';
    ctx2.font = '14px sans-serif';
    ctx2.fillText('🍗', 0, 14);
    el.appendChild(c);
  }
}

function drawItemOnCanvas(ctx2, item, x, y, size) {
  if (!item) return;
  const id = item.id;
  const color = getItemColor(id);
  ctx2.fillStyle = color;
  ctx2.fillRect(x + size * 0.1, y + size * 0.1, size * 0.8, size * 0.8);

  // Simple icon detail
  ctx2.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx2.strokeRect(x + size * 0.1, y + size * 0.1, size * 0.8, size * 0.8);

  // Item-specific drawing
  if (typeof id === 'string' && id.includes('sword')) {
    ctx2.strokeStyle = '#fff';
    ctx2.lineWidth = 2;
    ctx2.beginPath();
    ctx2.moveTo(x + size * 0.3, y + size * 0.8);
    ctx2.lineTo(x + size * 0.7, y + size * 0.2);
    ctx2.stroke();
    ctx2.fillStyle = '#8b4513';
    ctx2.fillRect(x + size * 0.2, y + size * 0.55, size * 0.6, size * 0.08);
  }
  if (typeof id === 'string' && id.includes('pickaxe')) {
    ctx2.strokeStyle = '#fff';
    ctx2.lineWidth = 2;
    ctx2.beginPath();
    ctx2.moveTo(x + size * 0.7, y + size * 0.3);
    ctx2.lineTo(x + size * 0.3, y + size * 0.7);
    ctx2.stroke();
    ctx2.fillStyle = '#8b4513';
    ctx2.beginPath();
    ctx2.arc(x + size * 0.3, y + size * 0.3, size * 0.15, 0, Math.PI * 2);
    ctx2.fill();
  }

  // Count
  if (item.count > 1) {
    ctx2.fillStyle = '#fff';
    ctx2.font = `bold ${Math.floor(size * 0.35)}px monospace`;
    ctx2.textAlign = 'right';
    ctx2.fillText(item.count, x + size - 2, y + size - 2);
    ctx2.textAlign = 'left';
  }
}

function renderHotbar() {
  const el = document.getElementById('hotbar');
  el.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const slot = document.createElement('div');
    slot.className = 'hotbar-slot' + (i === player.selectedSlot ? ' selected' : '');
    const c = document.createElement('canvas');
    c.width = 40; c.height = 40;
    const ctx2 = c.getContext('2d');
    const item = inventory[i];
    drawItemOnCanvas(ctx2, item, 0, 0, 40);
    slot.appendChild(c);
    slot.addEventListener('click', () => { player.selectedSlot = i; updateHotbarSelection(); });
    el.appendChild(slot);
  }
}

function updateHotbarSelection() {
  const slots = document.querySelectorAll('.hotbar-slot');
  slots.forEach((s, i) => {
    s.classList.toggle('selected', i === player.selectedSlot);
  });
  renderHotbar();
}

// ---- INVENTORY UI ----
let dragItem = null;
let dragFromIndex = null;
let dragFromArea = null;

function openInventory() {
  menuOpen = 'inventory';
  document.getElementById('inventory-screen').classList.add('active');
  document.exitPointerLock();
  renderInventoryUI();
}

function closeInventory() {
  menuOpen = null;
  document.getElementById('inventory-screen').classList.remove('active');
  canvas.requestPointerLock();
}

function openCraftingTable() {
  menuOpen = 'crafting';
  document.getElementById('crafting-screen').classList.add('active');
  document.exitPointerLock();
  renderCraftingUI();
}

function closeCraftingTable() {
  // Return craft slots to inventory
  for (let i = 0; i < 9; i++) {
    if (craftSlots[i]) { addToInventory(craftSlots[i].id, craftSlots[i].count); craftSlots[i] = null; }
  }
  menuOpen = null;
  document.getElementById('crafting-screen').classList.remove('active');
  canvas.requestPointerLock();
}

function makeSlotEl(item, onClick, onRightClick) {
  const div = document.createElement('div');
  div.className = 'inv-slot';
  const c = document.createElement('canvas');
  c.width = 32; c.height = 32;
  const ctx2 = c.getContext('2d');
  drawItemOnCanvas(ctx2, item, 0, 0, 32);
  div.appendChild(c);
  div.addEventListener('click', onClick);
  div.addEventListener('contextmenu', e => { e.preventDefault(); onRightClick && onRightClick(); });
  return div;
}

function renderInventoryUI() {
  // Main 3x9 inventory
  const grid = document.getElementById('inv-grid');
  grid.innerHTML = '';
  for (let i = 9; i < 36; i++) {
    const slot = makeSlotEl(inventory[i],
      () => handleSlotClick('inv', i),
      () => handleSlotRightClick('inv', i));
    grid.appendChild(slot);
  }
  // Hotbar row in inventory
  const hb = document.getElementById('inv-hotbar');
  hb.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const slot = makeSlotEl(inventory[i],
      () => handleSlotClick('inv', i),
      () => handleSlotRightClick('inv', i));
    hb.appendChild(slot);
  }
  // Armor slots
  const armor = document.getElementById('armor-slots');
  armor.innerHTML = '';
  const armorNames = ['투구','흉갑','각반','신발'];
  for (let i = 0; i < 4; i++) {
    const slot = makeSlotEl(armorSlots[i],
      () => handleSlotClick('armor', i),
      () => {});
    slot.title = armorNames[i];
    armor.appendChild(slot);
  }
  // 2x2 craft grid
  const cg = document.getElementById('inv-craft-grid');
  cg.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const slot = makeSlotEl(invCraftSlots[i],
      () => handleSlotClick('invcr', i),
      () => {});
    cg.appendChild(slot);
  }
  // Craft result
  const cr = document.getElementById('inv-craft-result');
  cr.innerHTML = '';
  const result = checkCraft(invCraftSlots, 2);
  const c = document.createElement('canvas');
  c.width = 32; c.height = 32;
  const ctx2 = c.getContext('2d');
  drawItemOnCanvas(ctx2, result ? {id: result.id, count: result.count} : null, 0, 0, 32);
  cr.appendChild(c);
  cr.onclick = () => {
    if (!result) return;
    addToInventory(result.id, result.count);
    for (let i = 0; i < 4; i++) {
      if (invCraftSlots[i]) {
        invCraftSlots[i].count--;
        if (invCraftSlots[i].count <= 0) invCraftSlots[i] = null;
      }
    }
    renderInventoryUI();
  };
}

function renderCraftingUI() {
  const cg = document.getElementById('craft-grid');
  cg.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const slot = makeSlotEl(craftSlots[i],
      () => handleSlotClick('craft', i),
      () => {});
    cg.appendChild(slot);
  }
  const result = checkCraft(craftSlots, 3);
  const cr = document.getElementById('craft-result');
  cr.innerHTML = '';
  const c = document.createElement('canvas');
  c.width = 32; c.height = 32;
  const ctx2 = c.getContext('2d');
  drawItemOnCanvas(ctx2, result ? {id: result.id, count: result.count} : null, 0, 0, 32);
  cr.appendChild(c);
  cr.onclick = () => {
    if (!result) return;
    addToInventory(result.id, result.count);
    for (let i = 0; i < 9; i++) {
      if (craftSlots[i]) { craftSlots[i].count--; if(craftSlots[i].count<=0) craftSlots[i]=null; }
    }
    renderCraftingUI();
  };

  const ig = document.getElementById('craft-inv-grid');
  ig.innerHTML = '';
  for (let i = 9; i < 36; i++) {
    const slot = makeSlotEl(inventory[i],
      () => handleSlotClick('craftinv', i),
      () => {});
    ig.appendChild(slot);
  }
  const ih = document.getElementById('craft-inv-hotbar');
  ih.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const slot = makeSlotEl(inventory[i],
      () => handleSlotClick('craftinv', i),
      () => {});
    ih.appendChild(slot);
  }
}

function handleSlotClick(area, idx) {
  if (dragItem) {
    // Place drag item into slot
    let target = null;
    if (area === 'inv') target = inventory[idx];
    else if (area === 'invcr') target = invCraftSlots[idx];
    else if (area === 'craft') target = craftSlots[idx];
    else if (area === 'armor') target = armorSlots[idx];
    else if (area === 'craftinv') target = inventory[idx];

    if (target && target.id === dragItem.id && target.count < 64) {
      target.count += dragItem.count;
      dragItem = null;
    } else {
      // Swap
      const old = target;
      if (area === 'inv' || area === 'craftinv') inventory[idx] = dragItem;
      else if (area === 'invcr') invCraftSlots[idx] = dragItem;
      else if (area === 'craft') craftSlots[idx] = dragItem;
      else if (area === 'armor') armorSlots[idx] = dragItem;
      dragItem = old;
    }
  } else {
    // Pick up item
    let item = null;
    if (area === 'inv' || area === 'craftinv') item = inventory[idx];
    else if (area === 'invcr') item = invCraftSlots[idx];
    else if (area === 'craft') item = craftSlots[idx];
    else if (area === 'armor') item = armorSlots[idx];

    if (item) {
      dragItem = item;
      if (area === 'inv' || area === 'craftinv') inventory[idx] = null;
      else if (area === 'invcr') invCraftSlots[idx] = null;
      else if (area === 'craft') craftSlots[idx] = null;
      else if (area === 'armor') armorSlots[idx] = null;
    }
  }

  if (menuOpen === 'inventory') renderInventoryUI();
  else if (menuOpen === 'crafting') renderCraftingUI();
  renderHotbar();
}

function handleSlotRightClick(area, idx) {
  // Split stack
  const item = area === 'inv' ? inventory[idx] : null;
  if (!item) return;
  if (dragItem) return;
  const half = Math.ceil(item.count / 2);
  dragItem = { id: item.id, count: half };
  item.count -= half;
  if (item.count <= 0) inventory[idx] = null;
  if (menuOpen === 'inventory') renderInventoryUI();
  renderHotbar();
}

// Mouse follow for drag
document.addEventListener('mousemove', e => {
  const dc = document.getElementById('drag-item');
  if (dragItem) {
    dc.style.display = 'block';
    dc.style.left = (e.clientX - 18) + 'px';
    dc.style.top = (e.clientY - 18) + 'px';
    const ctx2 = dc.getContext('2d');
    ctx2.clearRect(0, 0, 36, 36);
    drawItemOnCanvas(ctx2, dragItem, 0, 0, 36);
  } else {
    dc.style.display = 'none';
  }
});

// Drop drag item back to inventory on outside click
document.addEventListener('mousedown', e => {
  if (dragItem && menuOpen) {
    const inv = document.getElementById('inv-window') || document.querySelector('.inv-window');
    if (inv && !inv.contains(e.target)) {
      addToInventory(dragItem.id, dragItem.count);
      dragItem = null;
      if (menuOpen === 'inventory') renderInventoryUI();
      else if (menuOpen === 'crafting') renderCraftingUI();
      renderHotbar();
    }
  }
});

// ---- BLOCK BREAKING / PLACING ----
let isBreaking = false;
let breakStart = 0;

function getHeldTool() {
  const item = getHeldItem();
  if (!item) return { tool: null, level: 0 };
  if (typeof item.id === 'string') {
    const d = ITEMS[item.id];
    return { tool: d?.tool || null, level: d?.level || 1 };
  }
  return { tool: null, level: 0 };
}

function getBreakTime(blockId) {
  const bdata = BLOCK_DATA[blockId];
  if (!bdata) return 0.5;
  if (bdata.hardness < 0) return Infinity;
  if (bdata.hardness === 0) return 0;
  const { tool, level } = getHeldTool();
  let multiplier = 1;
  if (tool === bdata.tool) multiplier = 1.5 + level * 0.5;
  return bdata.hardness * 1.5 / multiplier;
}

function startBreak() {
  if (!lookingAt) return;
  isBreaking = true;
  breakStart = performance.now();
  breakingBlock = { ...lookingAt };
  breakProgress = 0;
}

function stopBreak() {
  isBreaking = false;
  breakingBlock = null;
  breakProgress = 0;
}

function updateBreaking(now) {
  if (!isBreaking || !lookingAt || !breakingBlock) return;
  if (lookingAt.x !== breakingBlock.x || lookingAt.y !== breakingBlock.y || lookingAt.z !== breakingBlock.z) {
    stopBreak();
    return;
  }
  const blockId = getBlock(breakingBlock.x, breakingBlock.y, breakingBlock.z);
  const needed = getBreakTime(blockId) * 1000;
  breakProgress = Math.min(1, (now - breakStart) / needed);

  if (breakProgress >= 1) {
    mineBlock(breakingBlock.x, breakingBlock.y, breakingBlock.z);
    stopBreak();
  }
}

function mineBlock(x, y, z) {
  const blockId = getBlock(x, y, z);
  if (blockId === BLOCKS.AIR) return;
  const bdata = BLOCK_DATA[blockId];
  if (bdata?.hardness < 0) return;

  setBlock(x, y, z, BLOCKS.AIR);
  markChunkDirty(x, z);

  // Give drops
  if (bdata?.drops) {
    for (const drop of bdata.drops) {
      addToInventory(drop.id, drop.count);
      showPickupText(getItemName(drop.id));
    }
  }

  renderHotbar();
}

function placeBlock(x, y, z) {
  const item = getHeldItem();
  if (!item) return;
  const id = item.id;
  if (typeof id !== 'number' || !BLOCK_DATA[id]) return;

  // Check not in player
  const aabb = playerAABB();
  if (x >= aabb.minX && x < aabb.maxX && y >= aabb.minY && y < aabb.maxY && z >= aabb.minZ && z < aabb.maxZ) return;

  setBlock(x, y, z, id);
  item.count--;
  if (item.count <= 0) inventory[player.selectedSlot] = null;
  renderHotbar();
}

function showPickupText(name) {
  const el = document.getElementById('pickup-text');
  el.textContent = name + ' 획득!';
  el.style.opacity = '1';
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => el.style.opacity = '0', 1500);
}

// ---- INPUT HANDLING ----
document.addEventListener('keydown', e => {
  keys[e.code] = true;

  if (!gameStarted) return;

  // Inventory toggle
  if (e.code === 'KeyE') {
    if (menuOpen === 'inventory') closeInventory();
    else if (menuOpen === 'crafting') closeCraftingTable();
    else openInventory();
    return;
  }

  if (e.code === 'Escape') {
    if (menuOpen) {
      if (menuOpen === 'inventory') closeInventory();
      else if (menuOpen === 'crafting') closeCraftingTable();
    } else if (pointerLocked) {
      document.exitPointerLock();
      document.getElementById('pause-screen').classList.add('active');
      gamePaused = true;
    }
    return;
  }

  // Hotbar shortcuts
  if (e.code.startsWith('Digit')) {
    const n = parseInt(e.code.replace('Digit', '')) - 1;
    if (n >= 0 && n <= 8) { player.selectedSlot = n; updateHotbarSelection(); }
  }

  // Drop item
  if (e.code === 'KeyQ') {
    const item = inventory[player.selectedSlot];
    if (item) { item.count--; if(item.count<=0) inventory[player.selectedSlot]=null; renderHotbar(); }
  }

  // Toggle fly
  if (e.code === 'KeyF') player.flying = !player.flying;

  // Toggle sprint
  if (e.code === 'ShiftLeft') player.sprinting = true;

  // Debug
  if (e.code === 'F3') {
    const d = document.getElementById('debug-info');
    const c = document.getElementById('coords');
    d.style.display = d.style.display === 'none' ? 'block' : 'none';
    c.style.display = c.style.display === 'none' ? 'block' : 'none';
  }
});

document.addEventListener('keyup', e => {
  keys[e.code] = false;
  if (e.code === 'ShiftLeft') player.sprinting = false;
});

// Mouse wheel for hotbar
document.addEventListener('wheel', e => {
  if (menuOpen) return;
  player.selectedSlot = ((player.selectedSlot + (e.deltaY > 0 ? 1 : -1)) + 9) % 9;
  updateHotbarSelection();
});

// Pointer lock
canvas.addEventListener('click', () => {
  if (!gameStarted || menuOpen || gamePaused) return;
  canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  pointerLocked = document.pointerLockElement === canvas;
});

document.addEventListener('mousemove', e => {
  if (!pointerLocked || menuOpen) return;
  const sens = 0.002;
  player.yaw -= e.movementX * sens;
  player.pitch -= e.movementY * sens;
  player.pitch = Math.max(-Math.PI/2 + 0.01, Math.min(Math.PI/2 - 0.01, player.pitch));
});

document.addEventListener('mousedown', e => {
  if (!pointerLocked || menuOpen) return;
  if (e.button === 0) startBreak();
  if (e.button === 2) {
    if (lookingAt) {
      const b = getBlock(lookingAt.x, lookingAt.y, lookingAt.z);
      if (b === BLOCKS.CRAFTING_TABLE) {
        openCraftingTable();
        return;
      }
      placeBlock(lookingAt.px, lookingAt.py, lookingAt.pz);
    }
  }
});

document.addEventListener('mouseup', e => {
  if (e.button === 0) stopBreak();
});

document.addEventListener('contextmenu', e => e.preventDefault());

// ---- UI BUTTONS ----
document.getElementById('play-btn').addEventListener('click', startGame);
document.getElementById('resume-btn').addEventListener('click', () => {
  document.getElementById('pause-screen').classList.remove('active');
  gamePaused = false;
  canvas.requestPointerLock();
});
document.getElementById('quit-btn').addEventListener('click', () => {
  document.getElementById('pause-screen').classList.remove('active');
  document.getElementById('start-screen').style.display = 'flex';
  gameStarted = false;
  gamePaused = false;
  document.exitPointerLock();
});
document.getElementById('options-btn').addEventListener('click', () => {
  alert('옵션은 준비 중입니다.');
});

// ---- GAME START ----
function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  gameStarted = true;
  gamePaused = false;

  // Give starting items
  addToInventory(BLOCKS.OAK_LOG, 10);
  addToInventory(BLOCKS.DIRT, 20);
  addToInventory(BLOCKS.STONE, 10);
  addToInventory(BLOCKS.GRASS, 5);
  addToInventory('wood_pickaxe', 1);
  addToInventory('wood_sword', 1);
  addToInventory('bread', 5);
  addToInventory(BLOCKS.TORCH, 10);
  addToInventory(BLOCKS.CRAFTING_TABLE, 1);

  renderHotbar();
  renderHearts();
  renderFood();

  canvas.requestPointerLock();
}

// ---- DEBUG UPDATE ----
function updateDebug() {
  const d = document.getElementById('debug-info');
  const co = document.getElementById('coords');
  if (d.style.display === 'block') {
    d.innerHTML = [
      `마인크래프트 클론`,
      `FPS: ${Math.round(1000 / Math.max(1, frameDt))}`,
      `청크: ${dirtyChunks.size} 대기 중`,
      `바라보는 블록: ${lookingAt ? `${lookingAt.x},${lookingAt.y},${lookingAt.z} (${BLOCK_DATA[getBlock(lookingAt.x,lookingAt.y,lookingAt.z)]?.name||'?'})` : '없음'}`,
      `비행: ${player.flying}`,
    ].join('<br>');
    co.innerHTML = [
      `X: ${player.x.toFixed(1)}`,
      `Y: ${player.y.toFixed(1)}`,
      `Z: ${player.z.toFixed(1)}`,
      `Yaw: ${(player.yaw * 180 / Math.PI).toFixed(1)}°`,
    ].join('<br>');
  }
}

// ---- BREAK OVERLAY ----
function renderBreakOverlay() {
  if (!isBreaking || !lookingAt) return;
  if (breakProgress <= 0) return;
  // Draw dark overlay on selection
  const sel = window.selectionBox;
  if (sel) {
    sel.material.opacity = 0.2 + breakProgress * 0.6;
    sel.material.color.setHex(0x000000);
  }
}

// ---- MAIN LOOP ----
let lastTime = performance.now();
let frameDt = 16;

function gameLoop(now) {
  requestAnimationFrame(gameLoop);

  frameDt = now - lastTime;
  const dt = Math.min(frameDt / 1000, 0.05);
  lastTime = now;

  if (!gameStarted || gamePaused) return;

  // Ensure world around player
  ensureChunks(player.x, player.z);

  // Rebuild dirty chunks
  rebuildDirtyChunks();

  // Physics
  updatePhysics(dt);

  // Camera
  camera.position.set(player.x, player.y, player.z);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = player.yaw;
  camera.rotation.x = player.pitch;

  // Raycast
  lookingAt = raycast(5);

  // Selection box
  const sel = window.selectionBox;
  if (lookingAt) {
    sel.visible = true;
    sel.position.set(lookingAt.x + 0.5, lookingAt.y + 0.5, lookingAt.z + 0.5);
    // Block tooltip
    const bid = getBlock(lookingAt.x, lookingAt.y, lookingAt.z);
    const tt = document.getElementById('block-tooltip');
    tt.style.display = 'block';
    tt.textContent = BLOCK_DATA[bid]?.name || '알 수 없음';
  } else {
    sel.visible = false;
    document.getElementById('block-tooltip').style.display = 'none';
  }

  // Breaking
  updateBreaking(now);
  renderBreakOverlay();

  // Render
  renderer.render(scene, camera);

  updateDebug();
}

// ---- RESIZE ----
window.addEventListener('resize', () => {
  if (!renderer) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// ---- INIT ----
initThree();
initTextures();

// Start render loop
requestAnimationFrame(gameLoop);

// Initial world gen at 0,0 to show behind start screen
generateChunk(0, 0);
dirtyChunks.add('0,0');
