/**
 * மனதின் வரிகள் · Manathin Varigal — script.js
 * Tamil Poetry Studio — Full Feature Implementation
 * ────────────────────────────────────────────────
 * Features: theme system (25 themes), font selectors,
 * image upload + filters, export PNG/PDF, poem editor,
 * star rating, grammar suggestions, particles, toast UI
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   DATA — 25 Themes
   ══════════════════════════════════════════════════════════ */
const THEMES = [
  { id: 'midnight',  name: 'Midnight Blue',     bg: '#08102a',   accent: '#5b8cff' },
  { id: 'chalk',     name: 'Chalk & Ash',        bg: '#111',      accent: '#ddd' },
  { id: 'rain',      name: 'Monsoon Rain',        bg: '#091420',   accent: '#4fa8d5' },
  { id: 'sangam',    name: 'Sangam Ancient',      bg: '#1a1208',   accent: '#c89b3c' },
  { id: 'revolution',name: 'Revolution Red',     bg: '#1a0505',   accent: '#e03030' },
  { id: 'temple',    name: 'Temple Lamp',         bg: '#100c00',   accent: '#ffb830' },
  { id: 'forest',    name: 'Forest Night',        bg: '#060f08',   accent: '#3ab870' },
  { id: 'broken',    name: 'Broken Heart',        bg: '#0d0508',   accent: '#c0507a' },
  { id: 'moon',      name: 'Moonlight Silver',    bg: '#06070f',   accent: '#a0b8e0' },
  { id: 'vintage',   name: 'Vintage Parchment',   bg: '#d0c090',   accent: '#b89050' },
  { id: 'dusk',      name: 'Dusk Orange',         bg: '#100800',   accent: '#ff7a20' },
  { id: 'purple',    name: 'Purple Dusk',         bg: '#080612',   accent: '#9060f0' },
  { id: 'teal',      name: 'Teal Mist',           bg: '#050f10',   accent: '#30b8b8' },
  { id: 'rose',      name: 'Rose Garden',         bg: '#100508',   accent: '#e04878' },
  { id: 'desert',    name: 'Desert Sand',         bg: '#cbb880',   accent: '#d4903a' },
  { id: 'snow',      name: 'Snow Silence',        bg: '#eef2f8',   accent: '#4a80c8' },
  { id: 'ember',     name: 'Ember Glow',          bg: '#0f0800',   accent: '#ff6a00' },
  { id: 'cyber',     name: 'Neon Cyber',          bg: '#030b0b',   accent: '#00f5d4' },
  { id: 'sakura',    name: 'Sakura Blossom',      bg: '#fce8ee',   accent: '#f89aaa' },
  { id: 'ocean',     name: 'Ocean Depths',        bg: '#020812',   accent: '#1a90d8' },
  { id: 'smoke',     name: 'Amber & Smoke',       bg: '#0d0d0d',   accent: '#d0a050' },
  { id: 'aurora',    name: 'Northern Lights',     bg: '#020808',   accent: '#20d890' },
  { id: 'bloodmoon', name: 'Blood Moon',          bg: '#0c0302',   accent: '#d85020' },
  { id: 'ivory',     name: 'Ivory & Gold',        bg: '#f5ead0',   accent: '#b88030' },
  { id: 'cosmos',    name: 'Deep Cosmos',         bg: '#030308',   accent: '#8060f8' },
];

const SAMPLE_POEMS = [
`மழை பெய்த இரவில்
நீ சொன்ன வார்த்தைகள்
இன்னும் என் நெஞ்சில்
நனைந்தே இருக்கின்றன.

காற்று வந்து போகும்
மலர்கள் உதிர்ந்து போகும்
ஆனால் உன் நினைவு
என்றும் மறையாது.`,

`கண்ணீர் துளிகள் ஒவ்வொன்றும்
ஒரு கதை சொல்கின்றன
வலியின் அழகை
யாரும் புரிந்துகொள்வதில்லை.

இரவின் மௌனத்தில்
என் கவிதை பிறக்கிறது
உன் பெயரை மட்டும்
மீண்டும் மீண்டும் எழுதுகிறேன்.`,

`கடல் அலைகள் போல
உன் நினைவுகள் வருகின்றன
ஒவ்வொரு முறையும்
என்னை தொட்டுச் செல்கின்றன.

தூரத்தில் நட்சத்திரங்கள்
உன் கண்களை நினைவூட்டுகின்றன
இரவு விண்ணில் தனியாக
உன்னை தேடி அலைகிறேன்.`
];

const SUGGESTIONS = [
  { orig: 'வாழ் ஆசை', sugg: 'வாழ ஆசை — particle usage correction' },
  { orig: 'எனக்கு தெரியாது', sugg: 'எனக்குத் தெரியாது — punarchi (புணர்ச்சி) rule' },
  { orig: 'அவள் சொல்லுகிறாள்', sugg: 'அவள் சொல்கிறாள் — modern conjugation preferred' },
  { orig: 'நான் போகிறேன்', sugg: '✓ Correct — no suggestion needed' },
  { orig: 'மிகவும் அழகான', sugg: 'Consider: மிக அழகான — avoid adverb doubling' },
  { orig: 'கண்ணீர் வருகிறது', sugg: '✓ Correct classical Tamil usage' },
];

/* ══════════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════════ */
const state = {
  currentTheme: 'midnight',
  bgImageSrc: null,
  bgOpacity: 0.6,
  bgBlur: 0,
  bgPosition: 'center center',
  bgFilter: 'none',
  rating: 0,
  tamilFont: "'Noto Sans Tamil', sans-serif",
  englishFont: "'Playfair Display', serif",
  fontSize: 22,
  lineHeight: 1.9,
  letterSpacing: 0,
  textAlign: 'left',
  borderStyle: 'none',
};

/* ══════════════════════════════════════════════════════════
   DOM REFS
   ══════════════════════════════════════════════════════════ */
const $ = (id) => document.getElementById(id);
const el = {
  body:             document.body,
  themeGrid:        $('themeGrid'),
  poemEditor:       $('poemEditor'),
  poemFileUpload:   $('poemFileUpload'),
  bgImageUpload:    $('bgImageUpload'),
  imageControls:    $('imageControls'),
  imgOpacity:       $('imgOpacity'),
  imgBlur:          $('imgBlur'),
  opacityVal:       $('opacityVal'),
  blurVal:          $('blurVal'),
  tamilFont:        $('tamilFont'),
  englishFont:      $('englishFont'),
  fontSize:         $('fontSize'),
  lineHeight:       $('lineHeight'),
  letterSpacing:    $('letterSpacing'),
  fontSizeVal:      $('fontSizeVal'),
  lineHeightVal:    $('lineHeightVal'),
  letterSpacingVal: $('letterSpacingVal'),
  tamilFontPreview: $('tamilFontPreview'),
  englishFontPreview:$('englishFontPreview'),
  poemTitle:        $('poemTitle'),
  poemAuthor:       $('poemAuthor'),
  poemYear:         $('poemYear'),
  borderStyle:      $('borderStyle'),
  lineCount:        $('lineCount'),
  suggestionBox:    $('suggestionBox'),
  suggestionList:   $('suggestionList'),
  starRating:       $('starRating'),
  ratingVal:        $('ratingVal'),
  btnClear:         $('btnClear'),
  btnSample:        $('btnSample'),
  btnAddLine:       $('btnAddLine'),
  btnRemoveLine:    $('btnRemoveLine'),
  btnSuggest:       $('btnSuggest'),
  btnRemoveImage:   $('btnRemoveImage'),
  btnExportPNG:     $('btnExportPNG'),
  btnExportPDF:     $('btnExportPDF'),
  btnCopyText:      $('btnCopyText'),
  exportStatus:     $('exportStatus'),
  activeThemeName:  $('activeThemeName'),
  toggleDark:       $('toggleDark'),
  btnHelp:          $('btnHelp'),
  helpModal:        $('helpModal'),
  btnCloseHelp:     $('btnCloseHelp'),
  toastContainer:   $('toastContainer'),
  // card
  poemCard:         $('poemCard'),
  cardBg:           $('cardBg'),
  cardOverlay:      $('cardOverlay'),
  particles:        $('particles'),
  ornamentTop:      $('ornamentTop'),
  ornamentBottom:   $('ornamentBottom'),
  previewTitle:     $('previewTitle'),
  previewBody:      $('previewBody'),
  previewMeta:      $('previewMeta'),
  previewRating:    $('previewRating'),
};

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
function init() {
  buildThemeGrid();
  bindPoemEditor();
  bindFileUploads();
  bindImageControls();
  bindFontControls();
  bindAlignControls();
  bindMetaControls();
  bindLineControls();
  bindSuggestions();
  bindStarRating();
  bindExport();
  bindMisc();
  applyTheme('midnight');
  updatePreview();
  spawnParticles();
  loadFromStorage();
}

/* ══════════════════════════════════════════════════════════
   THEME GRID
   ══════════════════════════════════════════════════════════ */
function buildThemeGrid() {
  THEMES.forEach(theme => {
    const btn = document.createElement('button');
    btn.className = 'theme-swatch';
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-pressed', theme.id === 'midnight' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme.name);
    btn.dataset.theme = theme.id;
    btn.title = theme.name;

    const swatch = document.createElement('div');
    swatch.className = 'swatch-color';
    swatch.style.background = theme.bg;
    swatch.style.borderBottom = `3px solid ${theme.accent}`;
    swatch.textContent = theme.name;
    swatch.style.color = isLight(theme.bg) ? '#222' : 'rgba(255,255,255,0.85)';

    btn.appendChild(swatch);
    btn.addEventListener('click', () => applyTheme(theme.id));
    el.themeGrid.appendChild(btn);
  });
}

function isLight(hex) {
  const h = hex.replace('#','');
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  return (r*299 + g*587 + b*114) / 1000 > 128;
}

function applyTheme(themeId) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  state.currentTheme = themeId;

  // Remove all theme classes
  THEMES.forEach(t => el.body.classList.remove('theme-' + t.id));
  el.body.classList.add('theme-' + themeId);
  el.body.dataset.theme = themeId;

  // Update swatch active states
  el.themeGrid.querySelectorAll('.theme-swatch').forEach(btn => {
    const isActive = btn.dataset.theme === themeId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  el.activeThemeName.textContent = theme.name;
  respawnParticles();
  saveToStorage();
}

/* ══════════════════════════════════════════════════════════
   POEM EDITOR
   ══════════════════════════════════════════════════════════ */
function bindPoemEditor() {
  el.poemEditor.addEventListener('input', () => {
    updateLineCount();
    updatePreview();
    saveToStorage();
  });
}

function updateLineCount() {
  const lines = el.poemEditor.value.split('\n').length;
  el.lineCount.textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
}

function bindLineControls() {
  el.btnAddLine.addEventListener('click', () => {
    el.poemEditor.value += '\n';
    el.poemEditor.focus();
    updateLineCount();
    updatePreview();
  });

  el.btnRemoveLine.addEventListener('click', () => {
    const lines = el.poemEditor.value.split('\n');
    if (lines.length > 1) {
      lines.pop();
      el.poemEditor.value = lines.join('\n');
      updateLineCount();
      updatePreview();
    }
  });

  el.btnClear.addEventListener('click', () => {
    el.poemEditor.value = '';
    updateLineCount();
    updatePreview();
    toast('Poem cleared');
  });

  el.btnSample.addEventListener('click', () => {
    const poem = SAMPLE_POEMS[Math.floor(Math.random() * SAMPLE_POEMS.length)];
    el.poemEditor.value = poem;
    updateLineCount();
    updatePreview();
    toast('Sample poem loaded ✦');
  });
}

/* ══════════════════════════════════════════════════════════
   GRAMMAR SUGGESTIONS
   ══════════════════════════════════════════════════════════ */
function bindSuggestions() {
  el.btnSuggest.addEventListener('click', () => {
    const text = el.poemEditor.value;
    if (!text.trim()) { toast('Please enter a poem first'); return; }

    el.suggestionList.innerHTML = '';
    const found = [];

    SUGGESTIONS.forEach(s => {
      if (text.includes(s.orig)) found.push(s);
    });

    // Generic tips always shown
    found.push(
      { orig: 'Tip', sugg: 'Use யா / ஆல் / இல் particles consistently throughout' },
      { orig: 'Rhythm', sugg: 'Consider assonance — repeat vowel sounds for musical flow' }
    );

    found.forEach(s => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${s.orig}:</strong> ${s.sugg}`;
      el.suggestionList.appendChild(li);
    });

    el.suggestionBox.hidden = false;
    toast('Suggestions ready ✦');
  });
}

/* ══════════════════════════════════════════════════════════
   FILE UPLOADS
   ══════════════════════════════════════════════════════════ */
function bindFileUploads() {
  el.poemFileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      el.poemEditor.value = ev.target.result;
      updateLineCount();
      updatePreview();
      toast(`Loaded: ${file.name}`);
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  });

  el.bgImageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      state.bgImageSrc = ev.target.result;
      applyBgImage();
      el.imageControls.hidden = false;
      toast('Background image applied ✦');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  el.btnRemoveImage.addEventListener('click', () => {
    state.bgImageSrc = null;
    el.cardBg.style.backgroundImage = '';
    el.imageControls.hidden = true;
    toast('Image removed');
  });
}

/* ══════════════════════════════════════════════════════════
   IMAGE CONTROLS
   ══════════════════════════════════════════════════════════ */
function bindImageControls() {
  el.imgOpacity.addEventListener('input', () => {
    state.bgOpacity = el.imgOpacity.value / 100;
    el.opacityVal.textContent = `${el.imgOpacity.value}%`;
    applyBgImage();
  });

  el.imgBlur.addEventListener('input', () => {
    state.bgBlur = parseInt(el.imgBlur.value);
    el.blurVal.textContent = `${state.bgBlur}px`;
    applyBgImage();
  });

  document.querySelectorAll('.pos-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pos-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.bgPosition = btn.dataset.pos;
      applyBgImage();
    });
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.bgFilter = chip.dataset.filter;
      applyBgImage();
    });
  });
}

function applyBgImage() {
  if (!state.bgImageSrc) return;
  el.cardBg.style.backgroundImage = `url('${state.bgImageSrc}')`;
  el.cardBg.style.backgroundPosition = state.bgPosition;
  el.cardBg.style.backgroundSize = 'cover';
  el.cardBg.style.opacity = state.bgOpacity;
  el.cardBg.style.filter = `blur(${state.bgBlur}px) ${state.bgFilter !== 'none' ? state.bgFilter : ''}`;
}

/* ══════════════════════════════════════════════════════════
   FONT CONTROLS
   ══════════════════════════════════════════════════════════ */
function bindFontControls() {
  el.tamilFont.addEventListener('change', () => {
    state.tamilFont = el.tamilFont.value;
    el.tamilFontPreview.style.fontFamily = state.tamilFont;
    updatePreview();
    saveToStorage();
  });

  el.englishFont.addEventListener('change', () => {
    state.englishFont = el.englishFont.value;
    el.englishFontPreview.style.fontFamily = state.englishFont;
    updatePreview();
    saveToStorage();
  });

  el.fontSize.addEventListener('input', () => {
    state.fontSize = parseInt(el.fontSize.value);
    el.fontSizeVal.textContent = `${state.fontSize}px`;
    updatePreview();
  });

  el.lineHeight.addEventListener('input', () => {
    state.lineHeight = (parseInt(el.lineHeight.value) / 10).toFixed(1);
    el.lineHeightVal.textContent = state.lineHeight;
    updatePreview();
  });

  el.letterSpacing.addEventListener('input', () => {
    state.letterSpacing = parseInt(el.letterSpacing.value);
    el.letterSpacingVal.textContent = `${state.letterSpacing}px`;
    updatePreview();
  });
}

function bindAlignControls() {
  document.querySelectorAll('.align-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.textAlign = btn.dataset.align;
      updatePreview();
    });
  });
}

/* ══════════════════════════════════════════════════════════
   METADATA CONTROLS
   ══════════════════════════════════════════════════════════ */
function bindMetaControls() {
  [el.poemTitle, el.poemAuthor, el.poemYear].forEach(inp => {
    inp.addEventListener('input', () => { updatePreview(); saveToStorage(); });
  });

  el.borderStyle.addEventListener('change', () => {
    state.borderStyle = el.borderStyle.value;
    updateOrnaments();
    saveToStorage();
  });
}

function updateOrnaments() {
  const bs = state.borderStyle;
  ['ornament-top', 'ornament-bottom'].forEach(cls => {
    const el2 = document.querySelector('.' + cls);
    if (!el2) return;
    el2.className = `ornament ${cls.replace('ornament-', 'ornament-')} ${bs}`;
    el2.className = `ornament ornament-${cls.includes('top') ? 'top' : 'bottom'} ${bs}`;
  });
}

/* ══════════════════════════════════════════════════════════
   STAR RATING
   ══════════════════════════════════════════════════════════ */
function bindStarRating() {
  const stars = el.starRating.querySelectorAll('.star');
  const labels = ['—', '★ Poor', '★★ Fair', '★★★ Good', '★★★★ Great', '★★★★★ Excellent'];

  stars.forEach(star => {
    star.addEventListener('click', () => {
      state.rating = parseInt(star.dataset.val);
      stars.forEach((s, i) => s.classList.toggle('active', i < state.rating));
      el.ratingVal.textContent = labels[state.rating] || '—';
      updatePreview();
    });
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.dataset.val);
      stars.forEach((s, i) => s.classList.toggle('active', i < val));
    });
    star.addEventListener('mouseleave', () => {
      stars.forEach((s, i) => s.classList.toggle('active', i < state.rating));
    });
  });
}

/* ══════════════════════════════════════════════════════════
   PREVIEW UPDATE
   ══════════════════════════════════════════════════════════ */
function updatePreview() {
  // Title
  const title = el.poemTitle.value.trim();
  el.previewTitle.textContent = title;
  el.previewTitle.style.display = title ? 'block' : 'none';
  el.previewTitle.style.fontFamily = state.tamilFont;

  // Body
  const poem = el.poemEditor.value;
  if (poem.trim()) {
    el.previewBody.innerHTML = '';
    const pre = document.createElement('pre');
    pre.style.cssText = `
      font-family: ${state.tamilFont};
      font-size: ${state.fontSize}px;
      line-height: ${state.lineHeight};
      letter-spacing: ${state.letterSpacing}px;
      text-align: ${state.textAlign};
      color: var(--card-text);
      white-space: pre-wrap; word-break: break-word;
      margin: 0;
    `;
    pre.textContent = poem;
    el.previewBody.appendChild(pre);
  } else {
    el.previewBody.innerHTML = '<p class="poem-placeholder">உங்கள் கவிதை இங்கே தோன்றும்…<br><span style="font-size:0.75em;opacity:0.6">Your poem will appear here…</span></p>';
  }

  // Meta
  const author = el.poemAuthor.value.trim();
  const year   = el.poemYear.value.trim();
  let metaHtml = '';
  if (author) metaHtml += `— ${author}`;
  if (year)   metaHtml += (author ? `, ` : '— ') + year;
  el.previewMeta.innerHTML = metaHtml ? `<em>${metaHtml}</em>` : '';
  el.previewMeta.style.fontFamily = state.englishFont;

  // Rating
  if (state.rating > 0) {
    el.previewRating.textContent = '★'.repeat(state.rating) + '☆'.repeat(5 - state.rating);
    el.previewRating.style.display = 'block';
  } else {
    el.previewRating.style.display = 'none';
  }

  updateOrnaments();
}

/* ══════════════════════════════════════════════════════════
   PARTICLES
   ══════════════════════════════════════════════════════════ */
function spawnParticles() {
  el.particles.innerHTML = '';
  const count = 12;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: -10px;
      animation-duration: ${6 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 6}s;
    `;
    el.particles.appendChild(p);
  }
}

function respawnParticles() {
  setTimeout(spawnParticles, 300);
}

/* ══════════════════════════════════════════════════════════
   EXPORT
   ══════════════════════════════════════════════════════════ */
function bindExport() {
  el.btnExportPNG.addEventListener('click', exportPNG);
  el.btnExportPDF.addEventListener('click', exportPDF);
  el.btnCopyText.addEventListener('click', copyText);
}

async function exportPNG() {
  if (typeof html2canvas === 'undefined') {
    toast('html2canvas not loaded — check your connection', 4000);
    return;
  }
  el.exportStatus.textContent = '⏳ Generating PNG…';
  try {
    const canvas = await html2canvas(el.poemCard, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
    const link = document.createElement('a');
    link.download = `manathin-varigal-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    el.exportStatus.textContent = '✓ PNG downloaded!';
    toast('PNG downloaded ✦');
  } catch (err) {
    el.exportStatus.textContent = '✗ Export failed';
    toast('PNG export failed: ' + err.message, 4000);
  }
  setTimeout(() => { el.exportStatus.textContent = ''; }, 3000);
}

async function exportPDF() {
  if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
    toast('PDF libraries not loaded — check your connection', 4000);
    return;
  }
  el.exportStatus.textContent = '⏳ Generating PDF…';
  try {
    const { jsPDF } = window.jspdf;
    const canvas = await html2canvas(el.poemCard, {
      scale: 2, useCORS: true, backgroundColor: null, logging: false,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const ratio = canvas.height / canvas.width;
    const imgW = pageW - 20;
    const imgH = imgW * ratio;
    const y = Math.max(10, (pageH - imgH) / 2);
    pdf.addImage(imgData, 'PNG', 10, y, imgW, imgH);
    pdf.save(`manathin-varigal-${Date.now()}.pdf`);
    el.exportStatus.textContent = '✓ PDF downloaded!';
    toast('PDF downloaded ✦');
  } catch (err) {
    el.exportStatus.textContent = '✗ Export failed';
    toast('PDF export failed: ' + err.message, 4000);
  }
  setTimeout(() => { el.exportStatus.textContent = ''; }, 3000);
}

function copyText() {
  const poem = el.poemEditor.value;
  const title = el.poemTitle.value;
  const author = el.poemAuthor.value;
  let text = '';
  if (title) text += title + '\n' + '─'.repeat(title.length) + '\n\n';
  text += poem;
  if (author) text += '\n\n— ' + author;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast('Poem copied to clipboard ✦'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    toast('Poem copied to clipboard ✦');
  }
}

/* ══════════════════════════════════════════════════════════
   MISC (Help, toggles, keyboard)
   ══════════════════════════════════════════════════════════ */
function bindMisc() {
  // Help modal
  el.btnHelp.addEventListener('click', () => { el.helpModal.hidden = false; });
  el.btnCloseHelp.addEventListener('click', () => { el.helpModal.hidden = true; });
  el.helpModal.addEventListener('click', (e) => {
    if (e.target === el.helpModal) el.helpModal.hidden = true;
  });

  // Dark/light toggle — cycles through a few themes
  const lightThemes = ['snow', 'vintage', 'desert', 'sakura', 'ivory'];
  el.toggleDark.addEventListener('click', () => {
    const currentIsLight = lightThemes.includes(state.currentTheme);
    if (currentIsLight) {
      applyTheme('midnight');
    } else {
      applyTheme('snow');
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      el.helpModal.hidden = true;
    }
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'Enter') { e.preventDefault(); el.btnAddLine.click(); }
      if (e.key === 's')     { e.preventDefault(); exportPNG(); }
      if (e.key === 'p')     { e.preventDefault(); exportPDF(); }
      if (e.key === 'k')     { e.preventDefault(); el.btnClear.click(); }
    }
  });
}

/* ══════════════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════════════ */
function toast(msg, duration = 2500) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  el.toastContainer.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 350);
  }, duration);
}

/* ══════════════════════════════════════════════════════════
   LOCAL STORAGE
   ══════════════════════════════════════════════════════════ */
function saveToStorage() {
  try {
    const data = {
      poem: el.poemEditor.value,
      title: el.poemTitle.value,
      author: el.poemAuthor.value,
      year: el.poemYear.value,
      theme: state.currentTheme,
      tamilFont: el.tamilFont.value,
      englishFont: el.englishFont.value,
    };
    localStorage.setItem('mv_poem_data', JSON.stringify(data));
  } catch(_) {}
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('mv_poem_data');
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.poem)       el.poemEditor.value  = data.poem;
    if (data.title)      el.poemTitle.value   = data.title;
    if (data.author)     el.poemAuthor.value  = data.author;
    if (data.year)       el.poemYear.value    = data.year;
    if (data.theme)      applyTheme(data.theme);
    if (data.tamilFont) {
      el.tamilFont.value = data.tamilFont;
      state.tamilFont = data.tamilFont;
      el.tamilFontPreview.style.fontFamily = data.tamilFont;
    }
    if (data.englishFont) {
      el.englishFont.value = data.englishFont;
      state.englishFont = data.englishFont;
      el.englishFontPreview.style.fontFamily = data.englishFont;
    }
    updateLineCount();
    updatePreview();
    if (data.poem) toast('Restored your last poem ✦');
  } catch(_) {}
}

/* ══════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
