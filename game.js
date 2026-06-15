// ============================================================
// MINECRAFT CLONE - game.js  v2.0
// ============================================================

// ---- BLOCK IDs ----
const BLOCKS = {
  AIR:0, GRASS:1, DIRT:2, STONE:3, COBBLESTONE:4,
  SAND:5, GRAVEL:6, OAK_LOG:7, OAK_LEAVES:8, OAK_PLANKS:9,
  GLASS:10, CRAFTING_TABLE:11, FURNACE:12, CHEST:13, TORCH:14,
  COAL_ORE:15, IRON_ORE:16, GOLD_ORE:17, DIAMOND_ORE:18,
  REDSTONE_ORE:19, LAPIS_ORE:20, BEDROCK:21, WATER:22, LAVA:23,
  TNT:24, BOOKSHELF:25, OBSIDIAN:26, NETHERRACK:27, SNOW:28,
  ICE:29, GLOWSTONE:30, WOOL_WHITE:31, WOOL_RED:32, WOOL_BLUE:33,
  WOOL_GREEN:34, WOOL_YELLOW:35, WOOL_BLACK:36, BIRCH_LOG:37,
  BIRCH_PLANKS:38, SPRUCE_LOG:39, SPRUCE_PLANKS:40, STONE_BRICKS:41,
  MOSSY_STONE_BRICKS:42, BRICK:43, SANDSTONE:44, SOUL_SAND:47,
  NETHER_BRICK:48, END_STONE:49, SPONGE:50, GRAVEL_PATH:45,
  MYCELIUM:46, MOSSY_COBBLESTONE:51, CLAY:52, PODZOL:53,
  MELON:54, PUMPKIN:55, CACTUS:56,
};

// ---- BLOCK DATA ----
// colors: [top, side, bottom], hardness(-1=unbreakable), tool, transparent
const BD = {
  [BLOCKS.GRASS]:         {n:'잔디 블록',    c:['#5a9e32','#8b6914','#654321'],h:0.6, t:'shovel',  d:[{id:BLOCKS.DIRT,n:1}]},
  [BLOCKS.DIRT]:          {n:'흙',           c:['#654321','#654321','#654321'],h:0.5, t:'shovel',  d:[{id:BLOCKS.DIRT,n:1}]},
  [BLOCKS.STONE]:         {n:'돌',           c:['#787878','#787878','#787878'],h:1.5, t:'pickaxe', d:[{id:BLOCKS.COBBLESTONE,n:1}]},
  [BLOCKS.COBBLESTONE]:   {n:'조약돌',       c:['#6e6e6e','#6e6e6e','#6e6e6e'],h:2.0, t:'pickaxe', d:[{id:BLOCKS.COBBLESTONE,n:1}]},
  [BLOCKS.SAND]:          {n:'모래',         c:['#dbd37a','#dbd37a','#dbd37a'],h:0.5, t:'shovel',  d:[{id:BLOCKS.SAND,n:1}]},
  [BLOCKS.GRAVEL]:        {n:'자갈',         c:['#8a8878','#8a8878','#8a8878'],h:0.6, t:'shovel',  d:[{id:BLOCKS.GRAVEL,n:1}]},
  [BLOCKS.OAK_LOG]:       {n:'참나무 원목',  c:['#c8b45a','#5c3d1a','#c8b45a'],h:2.0, t:'axe',     d:[{id:BLOCKS.OAK_LOG,n:1}]},
  [BLOCKS.OAK_LEAVES]:    {n:'참나무 잎',    c:['#2d7a1f','#2d7a1f','#2d7a1f'],h:0.2, t:'shears',  d:[],          tr:true},
  [BLOCKS.OAK_PLANKS]:    {n:'참나무 판자',  c:['#c09050','#c09050','#c09050'],h:2.0, t:'axe',     d:[{id:BLOCKS.OAK_PLANKS,n:1}]},
  [BLOCKS.GLASS]:         {n:'유리',         c:['#aaddff','#aaddff','#aaddff'],h:0.3, t:'pickaxe', d:[],          tr:true},
  [BLOCKS.CRAFTING_TABLE]:{n:'제작대',       c:['#9e7a33','#7a5a22','#c09050'],h:2.5, t:'axe',     d:[{id:BLOCKS.CRAFTING_TABLE,n:1}]},
  [BLOCKS.FURNACE]:       {n:'용광로',       c:['#808080','#808080','#808080'],h:3.5, t:'pickaxe', d:[{id:BLOCKS.FURNACE,n:1}]},
  [BLOCKS.CHEST]:         {n:'상자',         c:['#9e7a33','#9e7a33','#9e7a33'],h:2.5, t:'axe',     d:[{id:BLOCKS.CHEST,n:1}]},
  [BLOCKS.TORCH]:         {n:'횃불',         c:['#ffcc44','#ffcc44','#ffcc44'],h:0.0, t:null,      d:[{id:BLOCKS.TORCH,n:1}], tr:true},
  [BLOCKS.COAL_ORE]:      {n:'석탄 광석',    c:['#333333','#333333','#333333'],h:3.0, t:'pickaxe', d:[{id:'coal',n:1}]},
  [BLOCKS.IRON_ORE]:      {n:'철 광석',      c:['#c8a090','#c8a090','#c8a090'],h:3.0, t:'pickaxe', d:[{id:BLOCKS.IRON_ORE,n:1}]},
  [BLOCKS.GOLD_ORE]:      {n:'금 광석',      c:['#d4c45a','#d4c45a','#d4c45a'],h:3.0, t:'pickaxe', d:[{id:BLOCKS.GOLD_ORE,n:1}]},
  [BLOCKS.DIAMOND_ORE]:   {n:'다이아몬드 광석',c:['#3db8b8','#3db8b8','#3db8b8'],h:3.0,t:'pickaxe',d:[{id:'diamond',n:1}]},
  [BLOCKS.REDSTONE_ORE]:  {n:'레드스톤 광석', c:['#7a0000','#7a0000','#7a0000'],h:3.0, t:'pickaxe', d:[{id:'redstone',n:4}]},
  [BLOCKS.LAPIS_ORE]:     {n:'청금석 광석',  c:['#1a3a7a','#1a3a7a','#1a3a7a'],h:3.0, t:'pickaxe', d:[{id:'lapis',n:6}]},
  [BLOCKS.BEDROCK]:       {n:'암반',         c:['#1a1a1a','#1a1a1a','#1a1a1a'],h:-1,  t:'pickaxe', d:[]},
  [BLOCKS.WATER]:         {n:'물',           c:['#1a44bb','#1a44bb','#1a44bb'],h:0,   t:'bucket',  d:[],          tr:true},
  [BLOCKS.LAVA]:          {n:'용암',         c:['#cc4400','#cc4400','#cc4400'],h:0,   t:'bucket',  d:[]},
  [BLOCKS.TNT]:           {n:'TNT',          c:['#aa2222','#882222','#aa2222'],h:0.0, t:null,      d:[{id:BLOCKS.TNT,n:1}]},
  [BLOCKS.BOOKSHELF]:     {n:'책장',         c:['#c09050','#a07030','#c09050'],h:1.5, t:'axe',     d:[{id:BLOCKS.OAK_PLANKS,n:3}]},
  [BLOCKS.OBSIDIAN]:      {n:'흑요석',       c:['#180830','#180830','#180830'],h:50,  t:'pickaxe', d:[{id:BLOCKS.OBSIDIAN,n:1}]},
  [BLOCKS.NETHERRACK]:    {n:'네더랙',       c:['#6e2020','#6e2020','#6e2020'],h:0.4, t:'pickaxe', d:[{id:BLOCKS.NETHERRACK,n:1}]},
  [BLOCKS.SNOW]:          {n:'눈',           c:['#f4f4f4','#f4f4f4','#f4f4f4'],h:0.2, t:'shovel',  d:[{id:BLOCKS.SNOW,n:1}]},
  [BLOCKS.ICE]:           {n:'얼음',         c:['#88aaee','#88aaee','#88aaee'],h:0.5, t:'pickaxe', d:[],          tr:true},
  [BLOCKS.GLOWSTONE]:     {n:'형광석',       c:['#eecc44','#eecc44','#eecc44'],h:0.3, t:'pickaxe', d:[{id:'glowstone_dust',n:4}]},
  [BLOCKS.WOOL_WHITE]:    {n:'흰색 양털',    c:['#eeeeee','#eeeeee','#eeeeee'],h:0.8, t:'shears',  d:[{id:BLOCKS.WOOL_WHITE,n:1}]},
  [BLOCKS.WOOL_RED]:      {n:'빨간색 양털',  c:['#cc2222','#cc2222','#cc2222'],h:0.8, t:'shears',  d:[{id:BLOCKS.WOOL_RED,n:1}]},
  [BLOCKS.WOOL_BLUE]:     {n:'파란색 양털',  c:['#2244cc','#2244cc','#2244cc'],h:0.8, t:'shears',  d:[{id:BLOCKS.WOOL_BLUE,n:1}]},
  [BLOCKS.WOOL_GREEN]:    {n:'초록색 양털',  c:['#228822','#228822','#228822'],h:0.8, t:'shears',  d:[{id:BLOCKS.WOOL_GREEN,n:1}]},
  [BLOCKS.WOOL_YELLOW]:   {n:'노란색 양털',  c:['#cccc22','#cccc22','#cccc22'],h:0.8, t:'shears',  d:[{id:BLOCKS.WOOL_YELLOW,n:1}]},
  [BLOCKS.WOOL_BLACK]:    {n:'검은색 양털',  c:['#222222','#222222','#222222'],h:0.8, t:'shears',  d:[{id:BLOCKS.WOOL_BLACK,n:1}]},
  [BLOCKS.BIRCH_LOG]:     {n:'자작나무 원목',c:['#e0e0c8','#b8b8a0','#e0e0c8'],h:2.0, t:'axe',     d:[{id:BLOCKS.BIRCH_LOG,n:1}]},
  [BLOCKS.BIRCH_PLANKS]:  {n:'자작나무 판자',c:['#d4c898','#d4c898','#d4c898'],h:2.0, t:'axe',     d:[{id:BLOCKS.BIRCH_PLANKS,n:1}]},
  [BLOCKS.SPRUCE_LOG]:    {n:'가문비나무 원목',c:['#4a3820','#2c1e0a','#4a3820'],h:2.0,t:'axe',    d:[{id:BLOCKS.SPRUCE_LOG,n:1}]},
  [BLOCKS.SPRUCE_PLANKS]: {n:'가문비나무 판자',c:['#704828','#704828','#704828'],h:2.0,t:'axe',    d:[{id:BLOCKS.SPRUCE_PLANKS,n:1}]},
  [BLOCKS.STONE_BRICKS]:  {n:'석재 벽돌',   c:['#888888','#888888','#888888'],h:1.5, t:'pickaxe', d:[{id:BLOCKS.STONE_BRICKS,n:1}]},
  [BLOCKS.MOSSY_STONE_BRICKS]:{n:'이끼 낀 석재 벽돌',c:['#607850','#607850','#607850'],h:1.5,t:'pickaxe',d:[{id:BLOCKS.MOSSY_STONE_BRICKS,n:1}]},
  [BLOCKS.BRICK]:         {n:'벽돌',         c:['#993322','#993322','#993322'],h:2.0, t:'pickaxe', d:[{id:BLOCKS.BRICK,n:1}]},
  [BLOCKS.SANDSTONE]:     {n:'사암',         c:['#e8d87a','#d8c86a','#e8d87a'],h:0.8, t:'pickaxe', d:[{id:BLOCKS.SANDSTONE,n:1}]},
  [BLOCKS.SOUL_SAND]:     {n:'영혼 모래',    c:['#4a3020','#4a3020','#4a3020'],h:0.5, t:'shovel',  d:[{id:BLOCKS.SOUL_SAND,n:1}]},
  [BLOCKS.NETHER_BRICK]:  {n:'네더 벽돌',   c:['#2a1010','#2a1010','#2a1010'],h:2.0, t:'pickaxe', d:[{id:BLOCKS.NETHER_BRICK,n:1}]},
  [BLOCKS.END_STONE]:     {n:'엔드 돌',      c:['#d8d890','#d8d890','#d8d890'],h:3.0, t:'pickaxe', d:[{id:BLOCKS.END_STONE,n:1}]},
  [BLOCKS.SPONGE]:        {n:'스펀지',       c:['#c8c820','#c8c820','#c8c820'],h:0.6, t:null,      d:[{id:BLOCKS.SPONGE,n:1}]},
  [BLOCKS.GRAVEL_PATH]:   {n:'자갈 길',      c:['#907858','#907858','#907858'],h:0.6, t:'shovel',  d:[{id:BLOCKS.DIRT,n:1}]},
  [BLOCKS.MYCELIUM]:      {n:'균사체',       c:['#887888','#654321','#654321'],h:0.6, t:'shovel',  d:[{id:BLOCKS.DIRT,n:1}]},
  [BLOCKS.MOSSY_COBBLESTONE]:{n:'이끼 낀 조약돌',c:['#567845','#567845','#567845'],h:2.0,t:'pickaxe',d:[{id:BLOCKS.MOSSY_COBBLESTONE,n:1}]},
  [BLOCKS.CLAY]:          {n:'점토',         c:['#8090a0','#8090a0','#8090a0'],h:0.6, t:'shovel',  d:[{id:BLOCKS.CLAY,n:4}]},
  [BLOCKS.PODZOL]:        {n:'포드졸',       c:['#302010','#654321','#654321'],h:0.5, t:'shovel',  d:[{id:BLOCKS.DIRT,n:1}]},
  [BLOCKS.MELON]:         {n:'수박',         c:['#2a8a20','#3aaa30','#2a8a20'],h:1.0, t:null,      d:[{id:'melon_slice',n:3}]},
  [BLOCKS.PUMPKIN]:       {n:'호박',         c:['#cc7722','#cc7722','#cc7722'],h:1.0, t:null,      d:[{id:BLOCKS.PUMPKIN,n:1}]},
  [BLOCKS.CACTUS]:        {n:'선인장',       c:['#2a7a20','#2a7a20','#2a7a20'],h:0.4, t:null,      d:[{id:BLOCKS.CACTUS,n:1}], tr:true},
};

// ---- ITEMS ----
const ITEMS = {
  coal:           {n:'석탄',          col:'#222233'},
  iron_ingot:     {n:'철 주괴',       col:'#d8ccc0'},
  gold_ingot:     {n:'금 주괴',       col:'#ffd700'},
  diamond:        {n:'다이아몬드',    col:'#55ffff'},
  redstone:       {n:'레드스톤',      col:'#dd0000'},
  lapis:          {n:'청금석',        col:'#1144aa'},
  glowstone_dust: {n:'형광석 가루',   col:'#eebb22'},
  stick:          {n:'막대기',        col:'#9b6914'},
  string:         {n:'실',            col:'#dddddd'},
  flint:          {n:'부싯돌',        col:'#556677'},
  feather:        {n:'깃털',          col:'#f8f8f8'},
  bone:           {n:'뼈',            col:'#fffff0'},
  gunpowder:      {n:'화약',          col:'#888888'},
  apple:          {n:'사과',          col:'#cc2200', food:4},
  bread:          {n:'빵',            col:'#c89040', food:5},
  cooked_beef:    {n:'스테이크',      col:'#8b2500', food:8},
  raw_beef:       {n:'생 소고기',     col:'#cc4444', food:3},
  cooked_porkchop:{n:'익힌 돼지고기', col:'#d4824a', food:8},
  raw_porkchop:   {n:'생 돼지고기',   col:'#e89070', food:3},
  cooked_chicken: {n:'익힌 닭고기',   col:'#d4a060', food:6},
  raw_chicken:    {n:'생 닭고기',     col:'#e0b080', food:2},
  cooked_fish:    {n:'익힌 생선',     col:'#b07040', food:5},
  raw_fish:       {n:'생 생선',       col:'#6080c0', food:2},
  melon_slice:    {n:'수박 조각',     col:'#cc3333', food:2},
  bucket:         {n:'양동이',        col:'#888888'},
  water_bucket:   {n:'물 양동이',     col:'#2255cc'},
  lava_bucket:    {n:'용암 양동이',   col:'#cc4400'},
  bow:            {n:'활',            col:'#8b4513'},
  arrow:          {n:'화살',          col:'#9b6914'},
  fishing_rod:    {n:'낚싯대',        col:'#8b4513'},
  shears:         {n:'가위',          col:'#aaaaaa', tool:'shears'},
  flint_and_steel:{n:'부싯돌과 부시', col:'#888888'},
  compass:        {n:'나침반',        col:'#cc0000'},
  clock:          {n:'시계',          col:'#ffd700'},
  map:            {n:'지도',          col:'#c09050'},
  book:           {n:'책',            col:'#c09050'},
  paper:          {n:'종이',          col:'#eeeeee'},
  leather:        {n:'가죽',          col:'#8b4513'},
  egg:            {n:'달걀',          col:'#ffe4b5'},
  sugar:          {n:'설탕',          col:'#ffffff'},
  wheat:          {n:'밀',            col:'#c8a855'},
  seed:           {n:'씨앗',          col:'#228822'},
  bowl:           {n:'그릇',          col:'#8b4513'},
  mushroom_stew:  {n:'버섯 스튜',     col:'#8b4513', food:6},
  brick_item:     {n:'벽돌 아이템',   col:'#993322'},
  nether_brick_item:{n:'네더 벽돌 아이템', col:'#2a1010'},
  iron_helmet:    {n:'철 투구',       col:'#d8ccc0', armor:2, slot:0},
  iron_chestplate:{n:'철 흉갑',       col:'#d8ccc0', armor:6, slot:1},
  iron_leggings:  {n:'철 각반',       col:'#d8ccc0', armor:5, slot:2},
  iron_boots:     {n:'철 신발',       col:'#d8ccc0', armor:2, slot:3},
  diamond_helmet: {n:'다이아 투구',   col:'#55ffff', armor:3, slot:0},
  diamond_chestplate:{n:'다이아 흉갑',col:'#55ffff', armor:8, slot:1},
  diamond_leggings:{n:'다이아 각반',  col:'#55ffff', armor:6, slot:2},
  diamond_boots:  {n:'다이아 신발',   col:'#55ffff', armor:3, slot:3},
  // Tools
  wood_sword:     {n:'나무 검',       col:'#c09050', dmg:4,  type:'weapon'},
  stone_sword:    {n:'돌 검',         col:'#808080', dmg:5,  type:'weapon'},
  iron_sword:     {n:'철 검',         col:'#d8ccc0', dmg:6,  type:'weapon'},
  gold_sword:     {n:'금 검',         col:'#ffd700', dmg:4,  type:'weapon'},
  diamond_sword:  {n:'다이아몬드 검', col:'#55ffff', dmg:7,  type:'weapon'},
  wood_pickaxe:   {n:'나무 곡괭이',   col:'#c09050', tool:'pickaxe', lv:1},
  stone_pickaxe:  {n:'돌 곡괭이',     col:'#808080', tool:'pickaxe', lv:2},
  iron_pickaxe:   {n:'철 곡괭이',     col:'#d8ccc0', tool:'pickaxe', lv:3},
  gold_pickaxe:   {n:'금 곡괭이',     col:'#ffd700', tool:'pickaxe', lv:2},
  diamond_pickaxe:{n:'다이아 곡괭이', col:'#55ffff', tool:'pickaxe', lv:4},
  wood_axe:       {n:'나무 도끼',     col:'#c09050', tool:'axe',     lv:1},
  stone_axe:      {n:'돌 도끼',       col:'#808080', tool:'axe',     lv:2},
  iron_axe:       {n:'철 도끼',       col:'#d8ccc0', tool:'axe',     lv:3},
  gold_axe:       {n:'금 도끼',       col:'#ffd700', tool:'axe',     lv:2},
  diamond_axe:    {n:'다이아 도끼',   col:'#55ffff', tool:'axe',     lv:4},
  wood_shovel:    {n:'나무 삽',       col:'#c09050', tool:'shovel',  lv:1},
  stone_shovel:   {n:'돌 삽',         col:'#808080', tool:'shovel',  lv:2},
  iron_shovel:    {n:'철 삽',         col:'#d8ccc0', tool:'shovel',  lv:3},
  gold_shovel:    {n:'금 삽',         col:'#ffd700', tool:'shovel',  lv:2},
  diamond_shovel: {n:'다이아 삽',     col:'#55ffff', tool:'shovel',  lv:4},
  wood_hoe:       {n:'나무 괭이',     col:'#c09050', tool:'hoe'},
  stone_hoe:      {n:'돌 괭이',       col:'#808080', tool:'hoe'},
  iron_hoe:       {n:'철 괭이',       col:'#d8ccc0', tool:'hoe'},
  diamond_hoe:    {n:'다이아 괭이',   col:'#55ffff', tool:'hoe'},
};

// ---- CRAFTING RECIPES ----
const B = BLOCKS;
const RECIPES = [
  // Planks from logs
  {p:[[B.OAK_LOG]],    r:{id:B.OAK_PLANKS,   n:4}},
  {p:[[B.BIRCH_LOG]],  r:{id:B.BIRCH_PLANKS, n:4}},
  {p:[[B.SPRUCE_LOG]], r:{id:B.SPRUCE_PLANKS,n:4}},
  // Sticks
  {p:[[B.OAK_PLANKS],[B.OAK_PLANKS]],   r:{id:'stick',n:4}},
  {p:[[B.BIRCH_PLANKS],[B.BIRCH_PLANKS]],r:{id:'stick',n:4}},
  {p:[[B.SPRUCE_PLANKS],[B.SPRUCE_PLANKS]],r:{id:'stick',n:4}},
  // Crafting table (2x2)
  {p:[[B.OAK_PLANKS,B.OAK_PLANKS],[B.OAK_PLANKS,B.OAK_PLANKS]],r:{id:B.CRAFTING_TABLE,n:1}},
  {p:[[B.BIRCH_PLANKS,B.BIRCH_PLANKS],[B.BIRCH_PLANKS,B.BIRCH_PLANKS]],r:{id:B.CRAFTING_TABLE,n:1}},
  // Torch (2x2 or 3x3)
  {p:[['coal'],['stick']], r:{id:B.TORCH,n:4}},
  // Stone bricks (2x2)
  {p:[[B.STONE,B.STONE],[B.STONE,B.STONE]], r:{id:B.STONE_BRICKS,n:4}},
  // Sandstone (2x2)
  {p:[[B.SAND,B.SAND],[B.SAND,B.SAND]], r:{id:B.SANDSTONE,n:4}},
  // --- 3x3 RECIPES ---
  // Wooden tools
  {p:[[B.OAK_PLANKS,B.OAK_PLANKS,B.OAK_PLANKS],[null,'stick',null],[null,'stick',null]], r:{id:'wood_pickaxe',n:1}},
  {p:[[B.OAK_PLANKS,B.OAK_PLANKS,null],[B.OAK_PLANKS,'stick',null],[null,'stick',null]], r:{id:'wood_axe',n:1}},
  {p:[[null,B.OAK_PLANKS,null],[null,'stick',null],[null,'stick',null]], r:{id:'wood_shovel',n:1}},
  {p:[[B.OAK_PLANKS,B.OAK_PLANKS,null],[null,'stick',null],[null,'stick',null]], r:{id:'wood_hoe',n:1}},
  {p:[[null,B.OAK_PLANKS,null],[null,B.OAK_PLANKS,null],[null,'stick',null]], r:{id:'wood_sword',n:1}},
  // Stone tools
  {p:[[B.COBBLESTONE,B.COBBLESTONE,B.COBBLESTONE],[null,'stick',null],[null,'stick',null]], r:{id:'stone_pickaxe',n:1}},
  {p:[[B.COBBLESTONE,B.COBBLESTONE,null],[B.COBBLESTONE,'stick',null],[null,'stick',null]], r:{id:'stone_axe',n:1}},
  {p:[[null,B.COBBLESTONE,null],[null,'stick',null],[null,'stick',null]], r:{id:'stone_shovel',n:1}},
  {p:[[B.COBBLESTONE,B.COBBLESTONE,null],[null,'stick',null],[null,'stick',null]], r:{id:'stone_hoe',n:1}},
  {p:[[null,B.COBBLESTONE,null],[null,B.COBBLESTONE,null],[null,'stick',null]], r:{id:'stone_sword',n:1}},
  // Iron tools
  {p:[['iron_ingot','iron_ingot','iron_ingot'],[null,'stick',null],[null,'stick',null]], r:{id:'iron_pickaxe',n:1}},
  {p:[['iron_ingot','iron_ingot',null],['iron_ingot','stick',null],[null,'stick',null]], r:{id:'iron_axe',n:1}},
  {p:[[null,'iron_ingot',null],[null,'stick',null],[null,'stick',null]], r:{id:'iron_shovel',n:1}},
  {p:[['iron_ingot','iron_ingot',null],[null,'stick',null],[null,'stick',null]], r:{id:'iron_hoe',n:1}},
  {p:[[null,'iron_ingot',null],[null,'iron_ingot',null],[null,'stick',null]], r:{id:'iron_sword',n:1}},
  // Iron armor
  {p:[['iron_ingot','iron_ingot','iron_ingot'],[null,null,null],[null,null,null]], r:{id:'iron_helmet',n:1}},
  {p:[['iron_ingot',null,'iron_ingot'],['iron_ingot','iron_ingot','iron_ingot'],['iron_ingot','iron_ingot','iron_ingot']], r:{id:'iron_chestplate',n:1}},
  {p:[['iron_ingot','iron_ingot','iron_ingot'],['iron_ingot',null,'iron_ingot'],['iron_ingot',null,'iron_ingot']], r:{id:'iron_leggings',n:1}},
  {p:[['iron_ingot',null,'iron_ingot'],['iron_ingot',null,'iron_ingot'],[null,null,null]], r:{id:'iron_boots',n:1}},
  // Diamond tools
  {p:[['diamond','diamond','diamond'],[null,'stick',null],[null,'stick',null]], r:{id:'diamond_pickaxe',n:1}},
  {p:[['diamond','diamond',null],['diamond','stick',null],[null,'stick',null]], r:{id:'diamond_axe',n:1}},
  {p:[[null,'diamond',null],[null,'stick',null],[null,'stick',null]], r:{id:'diamond_shovel',n:1}},
  {p:[[null,'diamond',null],[null,'diamond',null],[null,'stick',null]], r:{id:'diamond_sword',n:1}},
  // Diamond armor
  {p:[['diamond','diamond','diamond'],[null,null,null],[null,null,null]], r:{id:'diamond_helmet',n:1}},
  {p:[['diamond',null,'diamond'],['diamond','diamond','diamond'],['diamond','diamond','diamond']], r:{id:'diamond_chestplate',n:1}},
  {p:[['diamond','diamond','diamond'],['diamond',null,'diamond'],['diamond',null,'diamond']], r:{id:'diamond_leggings',n:1}},
  {p:[['diamond',null,'diamond'],['diamond',null,'diamond'],[null,null,null]], r:{id:'diamond_boots',n:1}},
  // Gold tools
  {p:[['gold_ingot','gold_ingot','gold_ingot'],[null,'stick',null],[null,'stick',null]], r:{id:'gold_pickaxe',n:1}},
  {p:[[null,'gold_ingot',null],[null,'gold_ingot',null],[null,'stick',null]], r:{id:'gold_sword',n:1}},
  // Furnace
  {p:[[B.COBBLESTONE,B.COBBLESTONE,B.COBBLESTONE],[B.COBBLESTONE,null,B.COBBLESTONE],[B.COBBLESTONE,B.COBBLESTONE,B.COBBLESTONE]], r:{id:B.FURNACE,n:1}},
  // Chest
  {p:[[B.OAK_PLANKS,B.OAK_PLANKS,B.OAK_PLANKS],[B.OAK_PLANKS,null,B.OAK_PLANKS],[B.OAK_PLANKS,B.OAK_PLANKS,B.OAK_PLANKS]], r:{id:B.CHEST,n:1}},
  // TNT
  {p:[['gunpowder',B.SAND,'gunpowder'],[B.SAND,'gunpowder',B.SAND],['gunpowder',B.SAND,'gunpowder']], r:{id:B.TNT,n:1}},
  // Bookshelf
  {p:[[B.OAK_PLANKS,B.OAK_PLANKS,B.OAK_PLANKS],['book','book','book'],[B.OAK_PLANKS,B.OAK_PLANKS,B.OAK_PLANKS]], r:{id:B.BOOKSHELF,n:1}},
  // Book
  {p:[['paper','paper','paper'],['paper','paper','paper'],['leather',null,null]], r:{id:'book',n:1}},
  // Paper
  {p:[['wheat','wheat','wheat']], r:{id:'paper',n:3}},
  // Bread
  {p:[['wheat','wheat','wheat']], r:{id:'bread',n:1}},
  // Bow
  {p:[[null,'stick','string'],[null,'stick','string'],[null,'stick','string']], r:{id:'bow',n:1}},
  // Shears
  {p:[[null,'iron_ingot'],['iron_ingot',null]], r:{id:'shears',n:1}},
  // Bucket
  {p:[['iron_ingot',null,'iron_ingot'],[null,'iron_ingot',null]], r:{id:'bucket',n:1}},
  // Flint and steel
  {p:[['iron_ingot',null],[null,'flint']], r:{id:'flint_and_steel',n:1}},
  // Bowl
  {p:[[B.OAK_PLANKS,null,B.OAK_PLANKS],[null,B.OAK_PLANKS,null]], r:{id:'bowl',n:4}},
  // Wool
  {p:[['string','string','string'],['string','string','string'],['string','string','string']], r:{id:B.WOOL_WHITE,n:1}},
  // Nether brick block
  {p:[['nether_brick_item','nether_brick_item'],['nether_brick_item','nether_brick_item']], r:{id:B.NETHER_BRICK,n:1}},
  // Mossy cobblestone
  {p:[[B.COBBLESTONE,'string']], r:{id:B.MOSSY_COBBLESTONE,n:1}},
  // Brick block
  {p:[['brick_item','brick_item'],['brick_item','brick_item']], r:{id:B.BRICK,n:1}},
];

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

        // Trees (non-desert, not too snowy)
        if(!isDesert && lx>2 && lx<CHUNK_SIZE-3 && lz>2 && lz<CHUNK_SIZE-3) {
          const tr=rng();
          if(tr<0.012) {
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
          } else if(isDesert && tr<0.03) {
            // Cactus
            const cH=1+Math.floor(rng()*3);
            for(let cy=1;cy<=cH;cy++) setBlockDirect(wx,h+cy,wz,BLOCKS.CACTUS);
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

  player.vx=mx; player.vz=mz;
  if(keys['Space']&&player.onGround){player.vy=JUMP;player.onGround=false;}
  player.vy+=GRAVITY*dt;

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
    if(menuOpen==='inventory') closeInventory();
    else if(menuOpen==='crafting') closeCraftingTable();
    else openInventory();
    return;
  }
  if(e.code==='Escape') {
    if(menuOpen) {
      if(menuOpen==='inventory') closeInventory();
      else if(menuOpen==='crafting') closeCraftingTable();
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
  if(e.code==='KeyF3') {
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

canvas.addEventListener('click',()=>{
  if(!gameStarted||menuOpen||gamePaused) return;
  canvas.requestPointerLock();
});

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
    if(lookingAt) {
      const bid=getBlock(lookingAt.x,lookingAt.y,lookingAt.z);
      if(bid===BLOCKS.CRAFTING_TABLE) {openCraftingTable();return;}
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
