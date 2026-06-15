'use strict';

const Input = (() => {
  const keys = {};
  const just = {};
  const justUp = {};

  document.addEventListener('keydown', e => {
    if (!keys[e.code]) just[e.code] = true;
    keys[e.code] = true;
    // prevent page scrolling for game keys
    if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) {
      e.preventDefault();
    }
  });

  document.addEventListener('keyup', e => {
    keys[e.code] = false;
    justUp[e.code] = true;
  });

  return {
    update() {
      for (const k in just) delete just[k];
      for (const k in justUp) delete justUp[k];
    },
    down(code)    { return !!keys[code]; },
    pressed(code) { return !!just[code]; },
    released(code){ return !!justUp[code]; },
    left()  { return keys['ArrowLeft']  || keys['KeyA']; },
    right() { return keys['ArrowRight'] || keys['KeyD']; },
    interact() { return just['KeyE']; },
    advance()  { return just['Space'] || just['Enter']; },
  };
})();
