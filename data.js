// ============================================================
// MINECRAFT CLONE - 블록 · 아이템 · 제작법 데이터
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
