(() => {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const CX = 200; // center line of the board

  // ---------- parts catalogue ----------

  const RINGS = {
    spring:    { label: 'spring ring', wire: 118 },
    split:     { label: 'split ring',  wire: 120 },
    carabiner: { label: 'carabiner',   wire: 134 },
    lobster:   { label: 'lobster clasp', wire: 118 },
    gold:      { label: 'gold hoop',   wire: 114 },
  };

  const MATERIALS = {
    cord:   { label: 'cord' },
    ribbon: { label: 'ribbon' },
    chain:  { label: 'ball chain' },
  };

  const COLORS = {
    pink:  '#f1c3cd',
    cream: '#efe5cc',
    sky:   '#b7d1e6',
    lilac: '#cbb8e2',
    sage:  '#b5c8a1',
    red:   '#b4313f',
    black: '#2a2a2a',
  };

  const BEADS = {
    butter: '#f5edbd',
    sky:    '#b9d4e8',
    rose:   '#e9a7b0',
    mint:   '#c2e2c9',
    berry:  '#9b2b47',
    lilac:  '#cdbde7',
    cocoa:  '#8a5a44',
  };

  // Each charm is drawn centered on (0,0); `h` is its half-height along the string.
  const CHARMS = {
    bunny: {
      label: 'bunny', h: 20,
      draw: () => `
        <g fill="#f3edc9">
          <ellipse cx="0" cy="0" rx="20" ry="10" transform="rotate(-12)"/>
          <ellipse cx="-12" cy="2" rx="11" ry="9"/>
          <ellipse cx="-27" cy="8" rx="12" ry="3.6" transform="rotate(18 -27 8)"/>
          <ellipse cx="21" cy="9" rx="10" ry="3.2" transform="rotate(38 21 9)"/>
          <ellipse cx="19" cy="-8" rx="9" ry="7.5"/>
          <ellipse cx="7" cy="-17" rx="12" ry="3.4" transform="rotate(22 7 -17)"/>
          <ellipse cx="6" cy="-12" rx="10" ry="3" transform="rotate(8 6 -12)"/>
          <circle cx="-21" cy="-6" r="4.5"/>
        </g>
        <circle cx="23" cy="-9" r="1.3" fill="#3a3530"/>`,
    },
    flower: {
      label: 'flower', h: 26,
      draw: () => {
        // five round petals: arcs between neighbouring petal tips
        let d = '';
        for (let i = 0; i < 5; i++) {
          const a0 = -Math.PI / 2 + ((i - 0.5) * 2 * Math.PI) / 5;
          const a1 = -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / 5;
          const x0 = 12 * Math.cos(a0), y0 = 12 * Math.sin(a0);
          const x1 = 12 * Math.cos(a1), y1 = 12 * Math.sin(a1);
          d += `${i ? 'L' : 'M'}${x0.toFixed(2)} ${y0.toFixed(2)} A10.5 10.5 0 1 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
        }
        d += 'Z';
        return `<path d="${d}" fill="#e7979a" mask="url(#flowerHole)"/>`;
      },
    },
    heart: {
      label: 'heart', h: 17,
      draw: () => `<path d="M0 17 C-26 0 -22 -21 -8 -20 C-3 -20 0 -16 0 -13 C0 -16 3 -20 8 -20 C22 -21 26 0 0 17Z" fill="#e45b6d"/>`,
    },
    star: {
      label: 'star', h: 20,
      draw: () => {
        const pts = [];
        for (let i = 0; i < 10; i++) {
          const a = -Math.PI / 2 + (i * Math.PI) / 5;
          const r = i % 2 ? 9 : 21;
          pts.push(`${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a) + 2).toFixed(2)}`);
        }
        return `<polygon points="${pts.join(' ')}" fill="#f4d46a" stroke="#f4d46a" stroke-width="5" stroke-linejoin="round"/>`;
      },
    },
    cow: {
      label: 'spotty horse', h: 24,
      draw: () => `
        <g fill="#f6f5ee">
          <ellipse cx="0" cy="0" rx="24" ry="11"/>
          <ellipse cx="20" cy="-10" rx="9" ry="6" transform="rotate(-50 20 -10)"/>
          <ellipse cx="29" cy="-17" rx="9" ry="5" transform="rotate(18 29 -17)"/>
          <ellipse cx="23" cy="-24" rx="2.2" ry="4.5" transform="rotate(-20 23 -24)"/>
          <rect x="-20" y="2" width="6" height="21" rx="3"/>
          <rect x="-10" y="4" width="6" height="19" rx="3"/>
          <rect x="7" y="4" width="6" height="19" rx="3"/>
          <rect x="16" y="2" width="6" height="21" rx="3"/>
          <path d="M-23 -3 Q-32 4 -29 14" stroke="#f6f5ee" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        </g>
        <g fill="#2c2c2c">
          <ellipse cx="-11" cy="-3" rx="5" ry="4"/>
          <circle cx="3" cy="3" r="3.6"/>
          <ellipse cx="13" cy="-4" rx="3.2" ry="2.6"/>
          <circle cx="-2" cy="-7" r="2.2"/>
          <circle cx="-17" cy="14" r="2.2"/>
          <circle cx="10" cy="15" r="2"/>
          <circle cx="31" cy="-18" r="1.8"/>
        </g>`,
    },
    mushroom: {
      label: 'mushroom', h: 20,
      draw: () => `
        <path d="M-7 0 Q-9 16 -6 18 L6 18 Q9 16 7 0Z" fill="#f4ecdc"/>
        <path d="M-22 2 Q-22 -20 0 -20 Q22 -20 22 2 Q0 7 -22 2Z" fill="#d6463c"/>
        <g fill="#fff6ea">
          <circle cx="-10" cy="-9" r="3.4"/><circle cx="4" cy="-14" r="2.8"/>
          <circle cx="12" cy="-4" r="2.6"/><circle cx="-1" cy="-3" r="2"/>
        </g>`,
    },
    cherry: {
      label: 'cherries', h: 21,
      draw: () => `
        <path d="M-9 8 Q-6 -10 2 -19 M9 6 Q6 -8 2 -19" stroke="#4f7a3a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <ellipse cx="7" cy="-19" rx="6" ry="3" fill="#6d9a4c" transform="rotate(-25 7 -19)"/>
        <circle cx="-9" cy="11" r="9" fill="#c4262f"/>
        <circle cx="10" cy="10" r="9" fill="#d32f39"/>`,
    },
    smiley: {
      label: 'smiley', h: 16,
      draw: () => `
        <circle r="16" fill="#f7d54d"/>
        <g fill="#3a2f1a"><ellipse cx="-5.5" cy="-4" rx="1.8" ry="2.6"/><ellipse cx="5.5" cy="-4" rx="1.8" ry="2.6"/></g>
        <path d="M-8 4 Q0 12 8 4" stroke="#3a2f1a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    },
    moon: {
      label: 'moon', h: 19,
      draw: () => `<path d="M6 -19 A19 19 0 1 0 6 19 A14 14 0 1 1 6 -19Z" fill="#cfe0f2"/>`,
    },
    daisy: {
      label: 'daisy', h: 19,
      draw: () => {
        let petals = '';
        for (let i = 0; i < 8; i++) petals += `<ellipse cx="0" cy="-11" rx="5" ry="8.5" transform="rotate(${i * 45})"/>`;
        return `<g fill="#fbfaf4">${petals}</g><circle r="6.5" fill="#f2c03c"/>`;
      },
    },
    pearl: {
      label: 'pearl', h: 7,
      draw: () => `<circle r="7.5" fill="#f7f3ea"/>`,
    },
  };

  const SCALE = 1.4; // charms are drawn small and scaled up on the board
  const BEAD_H = 7.5;
  const beadSVG = (color) => `<ellipse rx="11.5" ry="7.5" fill="${color}"/>`;

  // ---------- state ----------

  const initialState = () => ({
    ring: 'spring',
    material: 'cord',
    color: 'pink',
    strands: 2,
    charms: [], // { id, kind: 'charm'|'bead', type, strand, t }
    selected: 0,
  });

  let state = initialState();
  let history = [];
  let step = 0;
  let nextId = 1;
  let justAdded = null;

  const clone = (s) => JSON.parse(JSON.stringify(s));
  function commit(mutator) {
    history.push(clone(state));
    if (history.length > 100) history.shift();
    mutator(state);
    render();
  }

  // ---------- geometry ----------

  const STRAND_LAYOUT = {
    1: [{ dx: 0, end: 515 }],
    2: [{ dx: -62, end: 535 }, { dx: 54, end: 470 }],
    3: [{ dx: -78, end: 515 }, { dx: 0, end: 470 }, { dx: 74, end: 545 }],
  };

  const knotY = () => RINGS[state.ring].wire + 26;

  function strandGeometry() {
    const ky = knotY();
    return STRAND_LAYOUT[state.strands].map((s, i, all) => {
      const start = { x: CX + (i - (all.length - 1) / 2) * 3, y: ky + 9 };
      const end = { x: CX + s.dx, y: s.end };
      const ctrl = { x: CX + s.dx * 0.35, y: (start.y + end.y) / 2 };
      const pts = [];
      let len = 0;
      for (let k = 0; k <= 80; k++) {
        const t = k / 80, u = 1 - t;
        const p = {
          x: u * u * start.x + 2 * u * t * ctrl.x + t * t * end.x,
          y: u * u * start.y + 2 * u * t * ctrl.y + t * t * end.y,
          t,
        };
        if (k) len += Math.hypot(p.x - pts[k - 1].x, p.y - pts[k - 1].y);
        pts.push(p);
      }
      return { start, ctrl, end, pts, len, d: `M${start.x} ${start.y} Q${ctrl.x} ${ctrl.y} ${end.x} ${end.y}` };
    });
  }

  function pointAt(strand, t) {
    const pts = strand.pts;
    const f = t * (pts.length - 1);
    const i = Math.min(pts.length - 2, Math.floor(f));
    const r = f - i;
    return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * r, y: pts[i].y + (pts[i + 1].y - pts[i].y) * r };
  }

  const T_MIN = 0.1, T_MAX = 0.95;
  const halfH = (c) => (c.kind === 'bead' ? BEAD_H : CHARMS[c.type].h) * SCALE;

  // ---------- drawing ----------

  function ringSVG() {
    const r = state.ring;
    if (r === 'spring' || r === 'gold') {
      const cy = r === 'spring' ? 78 : 78, rad = r === 'spring' ? 40 : 36;
      const grad = r === 'spring' ? 'silver' : 'gold';
      let seams = '';
      if (r === 'spring') {
        for (const deg of [-38, -47]) {
          const a = (deg * Math.PI) / 180;
          seams += `<line x1="${CX + 35 * Math.cos(a)}" y1="${cy + 35 * Math.sin(a)}" x2="${CX + 45 * Math.cos(a)}" y2="${cy + 45 * Math.sin(a)}" stroke="#7b7b80" stroke-width="1.4"/>`;
        }
      }
      return `<g filter="url(#soft)"><circle cx="${CX}" cy="${cy}" r="${rad}" fill="none" stroke="url(#${grad})" stroke-width="${r === 'spring' ? 8 : 6.5}"/>${seams}</g>`;
    }
    if (r === 'split') {
      return `<g filter="url(#soft)" fill="none" stroke="url(#silver)" stroke-width="3.6">
        <circle cx="${CX}" cy="86" r="34"/><circle cx="${CX + 1.5}" cy="87.5" r="31" stroke="#c3c3c6" stroke-width="2"/></g>`;
    }
    if (r === 'carabiner') {
      return `<g filter="url(#soft)">
        <rect x="178" y="24" width="44" height="110" rx="22" fill="none" stroke="url(#silver)" stroke-width="7"/>
        <line x1="182" y1="52" x2="186" y2="104" stroke="#d7d7da" stroke-width="5" stroke-linecap="round"/>
        <line x1="182" y1="52" x2="186" y2="104" stroke="#86868b" stroke-width="1"/></g>`;
    }
    // lobster clasp + jump ring
    return `<g filter="url(#soft)">
      <circle cx="${CX}" cy="22" r="8" fill="none" stroke="url(#silver)" stroke-width="3"/>
      <path d="M200 30 C184 34 180 64 186 82 Q192 96 200 98 Q208 96 214 82 C220 64 216 34 200 30Z" fill="url(#silver)"/>
      <path d="M210 44 Q214 62 209 80" stroke="#7d7d82" stroke-width="1.4" fill="none"/>
      <circle cx="${CX}" cy="106" r="12" fill="none" stroke="url(#silver)" stroke-width="4"/></g>`;
  }

  function cordStroke(d, extra = '') {
    const col = COLORS[state.color];
    if (state.material === 'chain') {
      return `<path d="${d}" fill="none" stroke="#8c8c90" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="0.1 6.5" ${extra}/>
              <path d="${d}" fill="none" stroke="#efeff1" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="0.1 6.5" transform="translate(-0.8 -0.8)"/>`;
    }
    if (state.material === 'ribbon') {
      return `<path d="${d}" fill="none" stroke="${col}" stroke-width="9" ${extra}/>
              <path d="${d}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="2"/>`;
    }
    return `<path d="${d}" fill="none" stroke="${col}" stroke-width="4.5" stroke-linecap="round" ${extra}/>
            <path d="${d}" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="1.2" stroke-linecap="round" transform="translate(-0.9 -0.4)"/>`;
  }

  function stringSVG(strands) {
    const wire = RINGS[state.ring].wire;
    const ky = knotY();
    const loop = `M195 ${ky} C192 ${wire + 2} 193 ${wire - 7} ${CX} ${wire - 7} C207 ${wire - 7} 208 ${wire + 2} 205 ${ky}`;
    let out = `<g filter="url(#soft)">${cordStroke(loop)}`;
    strands.forEach((s) => { out += cordStroke(s.d); });
    // wrapped knot
    const col = state.material === 'chain' ? '#b9b9bd' : COLORS[state.color];
    out += `<rect x="192.5" y="${ky - 5}" width="15" height="15" rx="4.5" fill="${col}"/>
            <g stroke="#000" stroke-opacity="0.14" stroke-width="1">
              <line x1="193" y1="${ky - 1}" x2="207" y2="${ky - 1}"/><line x1="193" y1="${ky + 3}" x2="207" y2="${ky + 3}"/><line x1="193" y1="${ky + 7}" x2="207" y2="${ky + 7}"/>
            </g></g>`;
    return out;
  }

  function charmSVG(c, strands) {
    const s = strands[c.strand];
    const p = pointAt(s, c.t);
    const inner = c.kind === 'bead' ? beadSVG(BEADS[c.type]) : CHARMS[c.type].draw();
    const cls = 'charm' + (c.id === justAdded ? ' drop' : '');
    return `<g class="${cls}" data-id="${c.id}" transform="translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) scale(${SCALE})"><g filter="url(#glaze)">${inner}</g></g>`;
  }

  function cornerStars() {
    const star = (x, y) => {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 6 : 14;
        pts.push(`${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`);
      }
      return `<polygon points="${pts.join(' ')}" stroke-linejoin="round"/>`;
    };
    return star(30, 32) + star(370, 32) + star(30, 568) + star(370, 568);
  }

  const keychainEl = document.getElementById('keychain');
  const boardEl = document.getElementById('board');

  function drawBoard() {
    const strands = strandGeometry();
    let out = '';
    if (step >= 1) {
      if (step === 2) {
        const s = strands[state.selected];
        if (s) out += `<path d="${s.d}" fill="none" stroke="#fff" stroke-opacity="0.75" stroke-width="16" stroke-linecap="round" stroke-dasharray="1 7"/>`;
      }
      out += ringSVG() + stringSVG(strands);
      if (step === 2) {
        strands.forEach((s, i) => {
          out += `<path class="strand-hit" data-strand="${i}" d="${s.d}" fill="none" stroke="transparent" stroke-width="26" pointer-events="stroke"/>`;
        });
      }
      [...state.charms].sort((a, b) => halfH(a) - halfH(b)).forEach((c) => { out += charmSVG(c, strands); });
    } else {
      out += ringSVG();
    }
    keychainEl.innerHTML = out;
    if (justAdded) setTimeout(() => { justAdded = null; }, 500);
  }

  // ---------- steps & controls ----------

  const STEPS = [
    { text: 'Choose a ring. It holds everything together.', next: 'tie a string' },
    { text: 'Pick a string. Cord, ribbon or chain, as many strands as you like.', next: 'add charms' },
    { text: 'Tap a strand, then a charm to thread it on. Drag to slide it, tap to take it off.', next: 'tie it off' },
    { text: 'All tied off. Give it a little swing.', next: 'make another' },
  ];

  const controlsEl = document.getElementById('controls');
  const instructionEl = document.getElementById('instruction');
  const stepCountEl = document.getElementById('stepCount');
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  const undoBtn = document.getElementById('undoBtn');
  const resetBtn = document.getElementById('resetBtn');
  const toolsEl = document.getElementById('tools');

  function pill(label, { active = false, swatch = null, onClick }) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pill' + (active ? ' active' : '');
    if (swatch) {
      const sw = document.createElement('span');
      sw.className = 'swatch';
      sw.style.background = swatch;
      b.appendChild(sw);
    }
    b.appendChild(document.createTextNode(label));
    b.addEventListener('click', onClick);
    return b;
  }

  function row(label, buttons) {
    const r = document.createElement('div');
    r.className = 'row';
    if (label) {
      const l = document.createElement('div');
      l.className = 'row-label';
      l.textContent = label;
      r.appendChild(l);
    }
    buttons.forEach((b) => r.appendChild(b));
    return r;
  }

  function addCharm(kind, type) {
    const strands = strandGeometry();
    const strandIdx = Math.min(state.selected, strands.length - 1);
    const s = strands[strandIdx];
    const h = (kind === 'bead' ? BEAD_H : CHARMS[type].h) * SCALE;
    const on = state.charms.filter((c) => c.strand === strandIdx).sort((a, b) => a.t - b.t);
    // strands bunch together near the knot, so stagger where each one's first charm lands
    let t = 0.2 + 0.14 * strandIdx + h / s.len;
    if (on.length) {
      const last = on[on.length - 1];
      t = last.t + (halfH(last) + h + 1) / s.len;
    }
    t = Math.min(T_MAX, t);
    const id = nextId++;
    justAdded = id;
    commit((st) => st.charms.push({ id, kind, type, strand: strandIdx, t }));
  }

  function renderControls() {
    controlsEl.innerHTML = '';
    if (step === 0) {
      controlsEl.appendChild(row(null, Object.entries(RINGS).map(([k, v]) =>
        pill(v.label, { active: state.ring === k, onClick: () => commit((s) => { s.ring = k; }) }))));
    } else if (step === 1) {
      controlsEl.appendChild(row('material', Object.entries(MATERIALS).map(([k, v]) =>
        pill(v.label, { active: state.material === k, onClick: () => commit((s) => { s.material = k; }) }))));
      if (state.material !== 'chain') {
        controlsEl.appendChild(row('color', Object.entries(COLORS).map(([k, v]) =>
          pill(k, { active: state.color === k, swatch: v, onClick: () => commit((s) => { s.color = k; }) }))));
      }
      controlsEl.appendChild(row('strands', [1, 2, 3].map((n) =>
        pill(['one', 'two', 'three'][n - 1], {
          active: state.strands === n,
          onClick: () => commit((s) => {
            s.strands = n;
            s.selected = Math.min(s.selected, n - 1);
            s.charms.forEach((c) => { c.strand = Math.min(c.strand, n - 1); });
          }),
        }))));
    } else if (step === 2) {
      if (state.strands > 1) {
        controlsEl.appendChild(row('threading onto', Array.from({ length: state.strands }, (_, i) =>
          pill(['left', state.strands === 2 ? 'right' : 'middle', 'right'][i], {
            active: state.selected === i, onClick: () => { state.selected = i; render(); },
          }))));
      }
      controlsEl.appendChild(row('charms', Object.entries(CHARMS).map(([k, v]) =>
        pill(v.label, { onClick: () => addCharm('charm', k) }))));
      controlsEl.appendChild(row('beads', Object.entries(BEADS).map(([k, v]) =>
        pill(k, { swatch: v, onClick: () => addCharm('bead', k) }))));
    } else {
      controlsEl.appendChild(row(null, [pill('save picture', { onClick: savePicture })]));
    }
  }

  function render() {
    document.body.classList.toggle('done', step === 3);
    stepCountEl.textContent = `${step + 1} / ${STEPS.length}`;
    instructionEl.textContent = STEPS[step].text;
    nextBtn.textContent = STEPS[step].next;
    backBtn.style.visibility = step === 0 ? 'hidden' : 'visible';
    toolsEl.style.visibility = step === 3 ? 'hidden' : 'visible';
    undoBtn.disabled = history.length === 0;
    renderControls();
    drawBoard();
  }

  nextBtn.addEventListener('click', () => {
    if (step === 3) {
      state = initialState();
      history = [];
      step = 0;
    } else {
      step++;
    }
    render();
  });
  backBtn.addEventListener('click', () => { if (step > 0) { step--; render(); } });
  undoBtn.addEventListener('click', () => {
    if (!history.length) return;
    state = history.pop();
    render();
  });
  resetBtn.addEventListener('click', () => {
    commit((s) => Object.assign(s, initialState()));
    step = 0;
    render();
  });

  // ---------- pointer interaction on the board ----------

  function toSvg(e) {
    const pt = boardEl.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(boardEl.getScreenCTM().inverse());
  }

  function nearestOnStrands(p) {
    const strands = strandGeometry();
    let best = null;
    strands.forEach((s, i) => {
      s.pts.forEach((q) => {
        if (q.t < T_MIN || q.t > T_MAX) return;
        const d = Math.hypot(q.x - p.x, q.y - p.y);
        if (!best || d < best.d) best = { d, strand: i, t: q.t };
      });
    });
    return best;
  }

  let drag = null;

  boardEl.addEventListener('pointerdown', (e) => {
    if (step !== 2) return;
    const charmEl = e.target.closest('.charm');
    if (charmEl) {
      const id = Number(charmEl.dataset.id);
      drag = { id, start: toSvg(e), moved: false, snapshot: clone(state) };
      boardEl.setPointerCapture(e.pointerId);
      e.preventDefault();
      return;
    }
    const hit = e.target.closest('.strand-hit');
    if (hit) {
      state.selected = Number(hit.dataset.strand);
      render();
    }
  });

  boardEl.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const p = toSvg(e);
    if (!drag.moved && Math.hypot(p.x - drag.start.x, p.y - drag.start.y) < 4) return;
    drag.moved = true;
    const near = nearestOnStrands(p);
    const c = state.charms.find((x) => x.id === drag.id);
    if (c && near) {
      c.strand = near.strand;
      c.t = near.t;
      state.selected = near.strand;
      drawBoard();
    }
  });

  function endDrag() {
    if (!drag) return;
    if (drag.moved) {
      history.push(drag.snapshot);
      render();
    } else {
      const id = drag.id;
      commit((s) => { s.charms = s.charms.filter((c) => c.id !== id); });
    }
    drag = null;
  }
  boardEl.addEventListener('pointerup', endDrag);
  boardEl.addEventListener('pointercancel', () => {
    if (drag) { state = drag.snapshot; drag = null; render(); }
  });

  // ---------- export ----------

  function savePicture() {
    const copy = boardEl.cloneNode(true);
    copy.setAttribute('width', '800');
    copy.setAttribute('height', '1200');
    const data = new XMLSerializer().serializeToString(copy);
    const url = URL.createObjectURL(new Blob([data], { type: 'image/svg+xml' }));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800; canvas.height = 1200;
      canvas.getContext('2d').drawImage(img, 0, 0, 800, 1200);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'my-keychain.png';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      });
    };
    img.src = url;
  }

  document.getElementById('corners').innerHTML = cornerStars();
  render();
})();
