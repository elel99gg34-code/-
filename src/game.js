'use strict';

// ── Story data ────────────────────────────────────────────────────────────────
const STORIES = {
  day1_wakeup: [
    "...알람이 울린다.",
    "오전 7시. 오늘도 평범한 아침이 시작됐다.",
    "특별한 건 없다. 그냥... 하루다."
  ],
  day1_desk: [
    "오늘 할 일은 딱히 없다.",
    "그냥 집에서 쉬는 날이지."
  ],
  day1_window_bed: [
    "창밖은 맑다.",
    "평화롭다. 이런 날도 있어야지."
  ],
  day1_frontdoor: [
    "오늘은... 밖에 나갈 기분이 아니다.",
    "집에 있기로 했다."
  ],
  day1_mirror_hall: [
    "거울 속 내 얼굴. 피곤해 보이긴 하지만...",
    "뭐, 괜찮겠지."
  ],
  day1_sofa: [
    "소파에 앉았다.",
    "등이 잘 받쳐지는 게 역시 편하다."
  ],
  day1_tv: [
    "리모컨을 켰다.",
    "뉴스가 나온다. 어딘가에서 무슨 일이 일어나고 있겠지.",
    "채널을 돌렸다. 드라마. 예능. 다큐. 별로 보고 싶은 게 없다.",
    "그냥 틀어놓는다."
  ],
  day1_window_live: [
    "창밖을 봤다.",
    "나무가 바람에 흔들린다.",
    "조용한 오후다."
  ],
  day1_fridge: [
    "냉장고를 열었다.",
    "우유, 계란, 남은 반찬들...",
    "뭔가 먹을까."
  ],
  day1_eat: [
    "밥을 차렸다.",
    "늘 먹는 것들이지만... 맛은 있다.",
    "밥 한 공기를 비웠다."
  ],
  day1_shower: [
    "샤워를 했다.",
    "따뜻한 물이 피로를 씻어낸다.",
    "오늘 하루도 다 끝났다."
  ],
  day1_mirror_bath: [
    "세면대 거울을 봤다.",
    "...그냥 나다."
  ],
  day1_sleep: [
    "오늘도 별일 없이 하루가 지났다.",
    "침대에 누웠다.",
    "눈을 감는다. 내일도 평범한 하루겠지.",
    "..."
  ],

  day2_wakeup: [
    "알람이 울린다.",
    "오늘도 7시.",
    "...",
    "왜인지 모르겠는데, 기분이 좀 이상하다.",
    "꿈 때문인가. 무슨 꿈이었는지 기억이 안 난다."
  ],
  day2_desk: [
    "시계를 봤다. 07:02.",
    "...",
    "잠깐 멈췄다.",
    "이 방이... 전보다 좀 어두운 것 같다. 착각이겠지."
  ],
  day2_window_bed: [
    "창문을 봤다.",
    "...",
    "아무것도 없다.",
    "당연히."
  ],
  day2_frontdoor: [
    "나가고 싶은 기분도 아니다.",
    "...아니, 나가기가 싫다는 느낌이다.",
    "이상하지."
  ],
  day2_mirror_hall: [
    "거울을 봤다.",
    "...",
    "내 눈이 조금 충혈된 것 같다.",
    "잘 못 잔 것 같긴 하다.",
    "...잠깐.",
    "거울 속 내가 나랑 동시에 움직이지 않은 것 같았다.",
    "다시 봤다. 당연히 같이 움직인다.",
    "...피곤한가보다."
  ],
  day2_sofa: [
    "소파에 앉았다.",
    "아까부터 이 방이 왠지 좁은 느낌이다.",
    "착각이겠지."
  ],
  day2_tv: [
    "TV를 켰다.",
    "---치직---",
    "잠깐 노이즈가 생겼다가 바로 사라졌다.",
    "...",
    "그냥 방송 수신 문제겠지."
  ],
  day2_window_live: [
    "창밖을 봤다.",
    "...",
    "나무가 흔들린다.",
    "...",
    "뭔가를 본 것 같았다. 나무 옆에.",
    "다시 봤다. 아무것도 없다.",
    "...",
    "그냥... 나무 그림자겠지."
  ],
  day2_fridge: [
    "냉장고를 열었다.",
    "우유 유통기한이 내일이다.",
    "...",
    "아직 괜찮겠지."
  ],
  day2_eat: [
    "밥을 먹었다.",
    "...",
    "밥 맛이 좀 이상한 것 같다. 아니, 그냥 입맛이 없는 건가.",
    "다 먹었다."
  ],
  day2_shower: [
    "샤워를 시작했다.",
    "...",
    "샤워 중에 갑자기 물이 차가워졌다.",
    "금방 다시 따뜻해졌지만...",
    "조금 소름이 돋았다."
  ],
  day2_mirror_bath: [
    "세면대 거울을 봤다.",
    "...",
    "거울에 김이 서려 있다.",
    "손으로 닦았다.",
    "...",
    "누가 거울에 손가락으로 뭔가를 쓴 것 같다.",
    "아니, 그냥 물방울 자국이겠지."
  ],
  day2_sleep: [
    "잠들려고 누웠다.",
    "...",
    "잠이 잘 오지 않는다. 이유는 모르겠다.",
    "눈을 감았다.",
    "...",
    "밖에서 소리가 들리는 것 같다.",
    "...",
    "...",
    "조용하다.",
    "그냥 바람 소리겠지.",
    "눈을 감는다."
  ],

  day3_wakeup: [
    "알람이 울린다.",
    "...",
    "이상하게 무거운 기분으로 일어났다.",
    "꿈을 꿨다. 기억이 안 난다.",
    "...",
    "근데... 창문 쪽을 보고 싶지 않았다.",
    "...",
    "왜 그런지 모르겠다."
  ],
  day3_desk: [
    "시계가 07:00을 가리키고 있다.",
    "...",
    "알람이 정확히 켜졌는데...",
    "왜 알람 소리를 듣기 전에 깼지?"
  ],
  day3_window_bed: [
    "...",
    "창밖에 아무것도 없다.",
    "...",
    "없다.",
    "...없지?"
  ],
  day3_frontdoor: [
    "...",
    "나가고 싶다.",
    "...",
    "그런데 나가면 안 될 것 같다.",
    "느낌이 그렇다."
  ],
  day3_mirror_hall: [
    "거울을 봤다.",
    "...",
    "내가 거울을 들여다보는데...",
    "거울 속 내 눈이 나를 보고 있지 않은 것 같다.",
    "...",
    "빠르게 시선을 돌렸다.",
    "다시 봤다. 내 눈은 내 눈을 보고 있다.",
    "...",
    "화장실 가서 세수나 해야겠다."
  ],
  day3_sofa: [
    "소파에 앉으려다가...",
    "창문 쪽으로 눈이 갔다.",
    "...",
    "아무것도 없다.",
    "앉았다."
  ],
  day3_tv: [
    "TV를 켰다.",
    "---치직---",
    "화면이 깜빡이다가 켜졌다.",
    "뭔가를 보는데... 집중이 안 된다.",
    "...",
    "어디선가 소리가 들리는 것 같다. 창문 밖에서?"
  ],
  day3_window_live: [
    "창밖을 봤다.",
    "...",
    "나무가 조금 이상하게 서있는 것 같다.",
    "...아니, 그냥 나무다.",
    "...",
    "빨리 시선을 거뒀다."
  ],
  day3_window_live_before: [
    "창문 쪽을 보고 싶지 않다.",
    "...",
    "하지만 눈이 자꾸 그쪽으로 간다."
  ],
  day3_fridge: [
    "냉장고를 열었다.",
    "...",
    "우유 유통기한이 어제였다.",
    "어제 버렸어야 했는데.",
    "...",
    "아무 생각도 하기 싫다."
  ],
  day3_eat: [
    "밥을 먹었다.",
    "...",
    "맛이 없다.",
    "...",
    "다 먹었다."
  ],
  day3_shower: [
    "샤워를 했다.",
    "...",
    "눈을 감고 싶지 않았다.",
    "...",
    "이유는 모르겠다.",
    "빨리 끝냈다."
  ],
  day3_mirror_bath: [
    "거울을 봤다.",
    "...",
    "...",
    "거울 속 나는 나를 보고 있다.",
    "...",
    "그런데...",
    "거울 속 나의 표정이...",
    "...",
    "...내가 짓고 있는 표정이 아닌 것 같다.",
    "...",
    "얼른 화장실에서 나왔다."
  ],
  day3_sleep: [
    "...",
    "침대에 누웠다.",
    "...",
    "눈을 감으면 그게 보일 것 같다.",
    "...",
    "...",
    "...",
    "언제 잠들었는지 모르겠다.",
    "...",
    "오늘 밤 꿈을 꾸겠지.",
    "...",
    "기억하고 싶지 않은 꿈을."
  ],

  ghost_window: [
    "...",
    "...",
    "창문 밖에...",
    "...",
    "뭔가가 서있다.",
    "...",
    "사람 모양이다.",
    "...",
    "움직이지 않는다.",
    "...",
    "그냥... 보고 있다.",
    "나를."
  ],
  ghost_window_look: [
    "...",
    "눈이 마주쳤다.",
    "...",
    "흰 눈.",
    "...",
    "...",
    "...",
    "시선을 거뒀다."
  ],
  ghost_window_away: [
    "...",
    "더 이상 보고 싶지 않다.",
    "...",
    "소파로 돌아갔다.",
    "...",
    "느껴진다.",
    "아직 거기 있는 걸."
  ],

  end_loop: [
    "...",
    "또 아침이 왔다.",
    "어제 창문 밖에 있던 것이 기억난다.",
    "...",
    "오늘도... 평범한 하루일까.",
    "...",
    "—— THE END ——"
  ],
};

// ── Interaction zones (worldX = center, in logical pixels) ────────────────────
// worldX calculated from draw.js: room_base_x + furniture_ox + half_width
const INTERACTS = [
  // Bedroom (room base 0)  ← window first so it wins when near window, not desk
  { id:'win_bed',      worldX:   95, label:'창문',   room: RM.BED },   // 0+55+23=78 → right side
  { id:'desk',         worldX:   60, label:'책상',   room: RM.BED },   // 0+48+18=66
  { id:'bed',          worldX:  234, label:'침대',   room: RM.BED },   // 0+210+24=234
  // Hallway (room base 320)
  { id:'frontdoor',    worldX:  336, label:'현관문', room: RM.HALL },  // 320+4+12=336
  { id:'mirror_hall',  worldX:  462, label:'거울',   room: RM.HALL },  // 320+130+12=462
  // Living Room (room base 640)
  { id:'win_live',     worldX:  692, label:'창문',   room: RM.LIVE },  // 640+20+32=692
  { id:'sofa',         worldX:  778, label:'소파',   room: RM.LIVE },  // 640+110+28=778
  { id:'tv',           worldX:  915, label:'TV',     room: RM.LIVE },  // 640+255+20=915
  // Kitchen (room base 960)
  { id:'table',        worldX: 1008, label:'식탁',   room: RM.KITCHEN }, // 960+30+18=1008
  { id:'sink_kit',     worldX: 1135, label:'싱크대', room: RM.KITCHEN }, // 960+165+10=1135
  { id:'fridge',       worldX: 1255, label:'냉장고', room: RM.KITCHEN }, // 960+284+11=1255
  // Bathroom (room base 1280)
  { id:'shower',       worldX: 1324, label:'샤워기', room: RM.BATH },  // 1280+20+24=1324
  { id:'mirror_bath',  worldX: 1428, label:'거울',   room: RM.BATH },  // 1280+136+12=1428
  { id:'toilet',       worldX: 1529, label:'화장실', room: RM.BATH },  // 1280+240+9=1529
];

// ── Main Game object ──────────────────────────────────────────────────────────
const Game = {
  state: {
    day: 1,
    hour: 7,
    minute: 0,
    playerState: 'idle',
    horrorLevel: 0,
    tvOn: false,
  },

  playerX: 35,
  playerDir: 'right',
  playerAnim: 0,
  playerAnimTimer: 0,

  dialogActive: false,
  dialogLines:  [],
  dialogIdx:    0,
  dialogOnDone: null,

  nearInteract: null,
  usedToday: new Set(),

  ghostVisible:   false,
  ghostAlpha:     0,
  ghostBreath:    0,
  ghostBreathDir: 1,
  ghostTriggered: false,

  screenFlicker: 0,
  redFlash:      0,
  horrorFlicker: 0,

  lastTs:     0,
  running:    false,
  timeBucket: 0,
  TIME_RATE:  0.4,   // game-minutes per real second

  // ── init ──────────────────────────────────────────────────────────────────
  init() {
    document.getElementById('startBtn').addEventListener('click', () => {
      const title = document.getElementById('title');
      title.style.transition = 'opacity 0.9s';
      title.style.opacity = '0';
      setTimeout(() => {
        title.style.display = 'none';
        this.running = true;
        this.showDialog(STORIES.day1_wakeup);
        this.lastTs = performance.now();
        requestAnimationFrame(ts => this.loop(ts));
      }, 900);
    });

    document.getElementById('dialog').addEventListener('click', () => this.advanceDialog());
  },

  // ── game loop ──────────────────────────────────────────────────────────────
  loop(ts) {
    const dt = Math.min((ts - this.lastTs) / 1000, 0.05);
    this.lastTs = ts;

    if (this.running) {
      this.update(dt);
      renderWorld(this);
      this.updateHUD();
    }

    Input.update();
    requestAnimationFrame(t => this.loop(t));
  },

  // ── update ─────────────────────────────────────────────────────────────────
  update(dt) {
    if (Input.advance()) this.advanceDialog();
    if (this.dialogActive) return;

    // Movement
    const speed = 62;
    let moving = false;

    if (Input.left()) {
      this.playerX -= speed * dt;
      this.playerDir = 'left';
      moving = true;
    } else if (Input.right()) {
      this.playerX += speed * dt;
      this.playerDir = 'right';
      moving = true;
    }

    // World bounds
    this.playerX = Math.max(5, Math.min(ROOM_COUNT * ROOM_W - PLAYER_W - 5, this.playerX));

    // Walk animation
    if (moving) {
      this.state.playerState = 'walking';
      this.playerAnimTimer += dt;
      if (this.playerAnimTimer > 0.13) {
        this.playerAnimTimer = 0;
        this.playerAnim = (this.playerAnim + 1) % 4;
      }
    } else {
      this.state.playerState = 'idle';
      this.playerAnim = 0;
    }

    // Current room index
    const room = Math.floor(this.playerX / ROOM_W);

    // Find nearby interaction
    this.nearInteract = null;
    const px = this.playerX + PLAYER_W / 2;
    for (const obj of INTERACTS) {
      if (obj.room !== room) continue;
      if (Math.abs(px - obj.worldX) < 24) {
        this.nearInteract = obj;
        break;
      }
    }

    const hint = document.getElementById('interact-hint');
    if (this.nearInteract) {
      hint.style.display = 'block';
      hint.textContent = `[ E ] ${this.nearInteract.label}`;
    } else {
      hint.style.display = 'none';
    }

    if (Input.interact() && this.nearInteract) {
      this.triggerInteraction(this.nearInteract.id);
    }

    // Time ticks
    this.timeBucket += dt * this.TIME_RATE;
    if (this.timeBucket >= 1) {
      this.timeBucket -= 1;
      this.advanceMinute(1);
    }

    // Auto sleep nudge at late night
    if (this.state.hour >= 23 && !this.usedToday.has('nudge_sleep') && room === RM.BED) {
      this.usedToday.add('nudge_sleep');
      this.showDialog(["피곤하다. 이제 자야겠다."]);
    }

    // Decay horror effects
    if (this.screenFlicker > 0) this.screenFlicker = Math.max(0, this.screenFlicker - dt * 4);
    if (this.redFlash     > 0) this.redFlash      = Math.max(0, this.redFlash     - dt * 2.5);
    if (this.horrorFlicker> 0) this.horrorFlicker  = Math.max(0, this.horrorFlicker- dt * 6);

    // Ghost breath
    if (this.ghostVisible) {
      this.ghostBreath += dt * this.ghostBreathDir * 0.7;
      if (this.ghostBreath > 1)  { this.ghostBreath = 1;  this.ghostBreathDir = -1; }
      if (this.ghostBreath < 0)  { this.ghostBreath = 0;  this.ghostBreathDir =  1; }
      if (this.ghostAlpha < 0.9) this.ghostAlpha = Math.min(0.9, this.ghostAlpha + dt * 0.35);
    }

    // Day-2 hallway flicker
    if (this.state.day >= 2 && room === RM.HALL && Math.random() < 0.004) {
      this.horrorFlicker = 0.8;
    }

    // Day-3 ghost trigger (living room, after 6pm)
    if (this.state.day >= 3 && room === RM.LIVE &&
        !this.ghostTriggered && this.state.hour >= 18) {
      this.triggerGhostEvent();
    }
  },

  // ── time helpers ──────────────────────────────────────────────────────────
  advanceMinute(mins) {
    this.state.minute += mins;
    while (this.state.minute >= 60) {
      this.state.minute -= 60;
      this.state.hour = (this.state.hour + 1) % 24;
    }
  },

  // ── dialog ────────────────────────────────────────────────────────────────
  showDialog(lines, onDone) {
    if (!lines || lines.length === 0) return;
    this.dialogLines  = lines;
    this.dialogIdx    = 0;
    this.dialogActive = true;
    this.dialogOnDone = onDone || null;
    this.displayLine();
  },

  displayLine() {
    const el = document.getElementById('dialog');
    el.style.display = 'block';
    document.getElementById('dialog-text').textContent = this.dialogLines[this.dialogIdx];
  },

  advanceDialog() {
    if (!this.dialogActive) return;
    this.dialogIdx++;
    if (this.dialogIdx >= this.dialogLines.length) {
      this.endDialog();
    } else {
      this.displayLine();
    }
  },

  endDialog() {
    this.dialogActive = false;
    document.getElementById('dialog').style.display = 'none';
    if (this.dialogOnDone) {
      const cb = this.dialogOnDone;
      this.dialogOnDone = null;
      cb();
    }
  },

  // ── interactions ──────────────────────────────────────────────────────────
  triggerInteraction(id) {
    const d = this.state.day;
    const h = this.state.hour;

    switch (id) {
      // Bedroom
      case 'bed':
        if (h >= 21 || h < 7) {
          this.doSleep();
        } else {
          this.showDialog(d >= 3
            ? ["아직이다.", "...", "하지만 이 방을 나가기 싫다."]
            : ["아직 잘 시간이 아니다."]);
        }
        break;

      case 'desk':
        this.showDialog(STORIES[`day${d}_desk`] || ["..."]);
        break;

      case 'win_bed':
        this.showDialog(STORIES[`day${d}_window_bed`] || ["창밖을 봤다."]);
        break;

      // Hallway
      case 'frontdoor':
        this.showDialog(STORIES[`day${d}_frontdoor`] || ["집에 있기로 했다."]);
        break;

      case 'mirror_hall':
        this.showDialog(STORIES[`day${d}_mirror_hall`] || ["거울을 봤다."]);
        break;

      // Living Room
      case 'win_live':
        if (d >= 3 && this.ghostVisible) {
          this.showDialog(STORIES.ghost_window_look, () =>
            this.showDialog(STORIES.ghost_window_away)
          );
        } else if (d >= 3 && this.state.hour >= 17 && !this.ghostTriggered) {
          this.showDialog(STORIES.day3_window_live_before || ["창밖을 봤다."]);
        } else {
          this.showDialog(STORIES[`day${d}_window_live`] || ["창밖을 봤다."]);
        }
        break;

      case 'sofa':
        this.showDialog(STORIES[`day${d}_sofa`] || ["소파에 앉았다."]);
        break;

      case 'tv':
        if (!this.state.tvOn) {
          this.state.tvOn = true;
          this.advanceMinute(120);
          this.showDialog(STORIES[`day${d}_tv`] || ["TV를 켰다."]);
        } else {
          this.state.tvOn = false;
          this.showDialog(["TV를 껐다."]);
        }
        break;

      // Kitchen
      case 'table': {
        const eatCount = ['eat1','eat2','eat3'].filter(k => this.usedToday.has(k)).length;
        if (eatCount === 0) {
          this.usedToday.add('eat1');
          this.advanceMinute(40);
          this.showDialog(STORIES[`day${d}_eat`] || ["밥을 먹었다."]);
        } else if (eatCount === 1) {
          this.usedToday.add('eat2');
          this.advanceMinute(40);
          this.showDialog(d >= 3
            ? ["점심을 먹었다.", "...", "맛이 없다."]
            : ["점심을 먹었다.", "맛있다."]);
        } else if (eatCount === 2) {
          this.usedToday.add('eat3');
          this.advanceMinute(40);
          this.showDialog(d >= 3
            ? ["저녁을 먹었다.", "...", "어서 오늘이 끝났으면 좋겠다."]
            : ["저녁을 먹었다.", "오늘도 잘 먹었다."]);
        } else {
          this.showDialog(["이미 충분히 먹었다."]);
        }
        break;
      }

      case 'fridge':
        this.showDialog(STORIES[`day${d}_fridge`] || ["냉장고를 열었다."]);
        break;

      case 'sink_kit':
        this.showDialog(["손을 씻었다."]);
        this.advanceMinute(5);
        break;

      // Bathroom
      case 'shower':
        if (!this.usedToday.has('shower')) {
          this.usedToday.add('shower');
          this.advanceMinute(30);
          this.showDialog(STORIES[`day${d}_shower`] || ["샤워를 했다."]);
        } else {
          this.showDialog(["이미 샤워했다."]);
        }
        break;

      case 'mirror_bath':
        this.showDialog(STORIES[`day${d}_mirror_bath`] || ["거울을 봤다."]);
        break;

      case 'toilet':
        this.advanceMinute(5);
        this.showDialog(["...", "다녀왔다."]);
        break;

      default:
        this.showDialog(["..."]);
    }
  },

  // ── sleep → new day ────────────────────────────────────────────────────────
  doSleep() {
    const d = this.state.day;
    this.state.playerState = 'sleeping';
    this.showDialog(STORIES[`day${d}_sleep`] || ["잠들었다."], () => this.startNewDay());
  },

  startNewDay() {
    this.state.day++;
    this.state.hour   = 7;
    this.state.minute = 0;
    this.playerX      = 35;
    this.playerDir    = 'right';
    this.usedToday    = new Set();
    this.state.tvOn   = false;
    this.state.playerState = 'idle';

    if (this.state.day === 2) this.state.horrorLevel = 1;
    if (this.state.day === 3) this.state.horrorLevel = 2;
    if (this.state.day  >  3) this.state.horrorLevel = 3;

    this.ghostVisible   = false;
    this.ghostAlpha     = 0;
    this.ghostTriggered = false;

    if (this.state.day > 3) {
      this.showDialog(STORIES.end_loop);
      return;
    }

    const wakeLines = STORIES[`day${this.state.day}_wakeup`];
    if (wakeLines) this.showDialog(wakeLines);
  },

  // ── horror events ──────────────────────────────────────────────────────────
  triggerGhostEvent() {
    this.ghostTriggered = true;

    // Brief red flash + screen flicker
    this.screenFlicker = 0.7;
    setTimeout(() => { this.redFlash = 0.4; }, 300);

    setTimeout(() => {
      this.ghostVisible = true;
      this.ghostAlpha   = 0;
      this.state.horrorLevel = 4;

      setTimeout(() => {
        this.redFlash = 0.25;
        this.showDialog(STORIES.ghost_window, () => {
          this.state.horrorLevel = 5;
        });
      }, 2200);
    }, 600);
  },

  // ── HUD ────────────────────────────────────────────────────────────────────
  updateHUD() {
    document.getElementById('d-day').textContent = `${this.state.day}일차`;
    const h = this.state.hour;
    const m = String(this.state.minute).padStart(2, '0');
    const ampm = h < 12 ? '오전' : '오후';
    const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    document.getElementById('d-time').textContent = `${ampm} ${dh}:${m}`;
  },
};

Game.init();
