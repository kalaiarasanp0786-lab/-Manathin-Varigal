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

/* ══════════════════════════════════════════════════════════
   SUGGESTION ENGINE — Tamil Poetry Analysis
   ══════════════════════════════════════════════════════════ */
const GRAMMAR_RULES = [
  { pattern: 'எனக்கு த', fix: 'எனக்குத்', note: 'புணர்ச்சி — உகர எழுத்துக்கு முன் த→த்' },
  { pattern: 'அவள் சொல்லுகிறாள்', fix: 'அவள் சொல்கிறாள்', note: 'நவீன வினை வடிவம் பயன்படுத்தவும்' },
  { pattern: 'போகிறது', fix: 'போகின்றது', note: 'இலக்கிய வடிவம்: -கிறது → -கின்றது' },
  { pattern: 'வருகிறது', fix: 'வருகின்றது', note: 'இலக்கிய வடிவம் மிகவும் அழகானது' },
  { pattern: 'மிகவும் மிக', fix: 'மிக (மட்டும்)', note: 'இரட்டை அடைமொழி தவிர்க்கவும்' },
  { pattern: 'நான் நான்', fix: 'நான் (ஒரு முறை)', note: 'சொல் மறிப்பு தவிர்க்கவும்' },
];

const POETIC_WORDS = [
  { plain: 'காதல்',    poetic: 'அன்பு / ஆசை / நேசம் / காமம்',    note: 'உணர்வை ஆழப்படுத்தும் சொற்கள்' },
  { plain: 'வானம்',    poetic: 'விண் / ஆகாயம் / அம்பரம்',        note: 'பண்டைய இலக்கிய சொற்கள்' },
  { plain: 'நீர்',     poetic: 'தண்ணீர் / புனல் / நீரோடை',       note: 'இயற்கை வர்ணனைக்கு' },
  { plain: 'கண்',     poetic: 'விழி / நயனம் / கண்ணி',            note: 'சங்க இலக்கியம்' },
  { plain: 'மரம்',    poetic: 'விருட்சம் / தரு / மரவல்லி',        note: 'இலக்கிய வடிவங்கள்' },
  { plain: 'பூ',      poetic: 'மலர் / செம்மல் / நறுமலர்',         note: 'கவித்துவமான வடிவம்' },
  { plain: 'நிலா',    poetic: 'மதி / திங்கள் / சந்திரன்',         note: 'அழகிய பண்டைய சொற்கள்' },
  { plain: 'கடல்',    poetic: 'யாழ்கடல் / திரைகடல் / பேழைக்கடல்', note: 'சங்க இலக்கிய வடிவம்' },
  { plain: 'இரவு',    poetic: 'யாமம் / இரா / கார்இரவு',           note: 'இலக்கிய நடை' },
  { plain: 'காற்று',  poetic: 'வளி / மருத்து / தென்றல்',          note: 'இயற்கை கவிதை' },
];

const EMOTION_KEYWORDS = {
  sadness:  ['கண்ணீர்','வலி','துயர்','அழுகை','தனிமை','கவலை','பிரிவு','இழப்பு'],
  love:     ['காதல்','அன்பு','நேசம்','இதயம்','கனவு','ஆசை','தாகம்','மோகம்'],
  nature:   ['மழை','வானம்','நிலா','காற்று','கடல்','மலர்','பூ','மரம்','ஆறு'],
  longing:  ['ஏக்கம்','தவிப்பு','காத்திருக்கிறேன்','நினைவு','தேடுகிறேன்'],
  joy:      ['மகிழ்ச்சி','சிரிப்பு','ஆனந்தம்','பரவசம்','உவகை'],
  patriot:  ['தமிழ்','மண்','நாடு','விடுதலை','வீரம்','போர்'],
};

function analyzeTamilPoem(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const results = [];

  // 1. Line count feedback
  if (lines.length < 3) {
    results.push({ type: 'structure', icon: '📝', msg: 'கவிதை மிகவும் குறுகியது — குறைந்தது 4–8 வரிகள் சேர்க்கவும்.' });
  } else if (lines.length > 20) {
    results.push({ type: 'structure', icon: '📏', msg: `${lines.length} வரிகள் உள்ளன — நீண்ட கவிதையை பிரிவுகளாக (stanzas) ஒழுங்கமைக்கவும்.` });
  } else {
    results.push({ type: 'structure', icon: '✅', msg: `${lines.length} வரிகள் — நல்ல அளவு. கட்டமைப்பு சரியாக உள்ளது.` });
  }

  // 2. Emotion detection
  let detected = [];
  for (const [emotion, words] of Object.entries(EMOTION_KEYWORDS)) {
    if (words.some(w => text.includes(w))) detected.push(emotion);
  }
  const emotionMap = {
    sadness: '💔 சோகக் கவிதை — வலி, பிரிவு உணர்வுகள் தெரிகின்றன',
    love:    '❤️ காதல் கவிதை — அன்பும் ஆசையும் நிறைந்துள்ளது',
    nature:  '🌿 இயற்கை கவிதை — இயற்கை வர்ணனை அழகாக உள்ளது',
    longing: '🌙 ஏக்கக் கவிதை — தவிப்பு உணர்வு நன்கு வெளிப்படுகிறது',
    joy:     '😊 மகிழ்ச்சிக் கவிதை — உவகை உணர்வு நிறைந்துள்ளது',
    patriot: '🏛️ தேசியக் கவிதை — தமிழ் பற்றும் மண் உணர்வும் வெளிப்படுகிறது',
  };
  if (detected.length > 0) {
    results.push({ type: 'emotion', icon: '🎭', msg: `உணர்வு பகுப்பாய்வு: ${detected.map(e => emotionMap[e]).join(' | ')}` });
  } else {
    results.push({ type: 'emotion', icon: '🎭', msg: 'உணர்வு: தெளிவான உணர்வு வார்த்தைகளை சேர்க்கவும் — கவிதை உயிர் பெறும்.' });
  }

  // 3. Grammar checks
  let grammarFound = false;
  GRAMMAR_RULES.forEach(rule => {
    if (text.includes(rule.pattern)) {
      results.push({ type: 'grammar', icon: '⚠️', msg: `"${rule.pattern}" → "${rule.fix}" — ${rule.note}` });
      grammarFound = true;
    }
  });
  if (!grammarFound) {
    results.push({ type: 'grammar', icon: '✅', msg: 'இலக்கண சோதனை: பெரிய தவறுகள் இல்லை.' });
  }

  // 4. Poetic word suggestions
  const wordSuggs = POETIC_WORDS.filter(w => text.includes(w.plain));
  if (wordSuggs.length > 0) {
    wordSuggs.slice(0, 3).forEach(w => {
      results.push({ type: 'vocab', icon: '✨', msg: `"${w.plain}" → கவித்துவமான மாற்று: ${w.poetic} (${w.note})` });
    });
  } else {
    results.push({ type: 'vocab', icon: '📚', msg: 'சொல் வளம்: விழி, மலர், தண்டலை, புனல், மருத்து போன்ற இலக்கிய சொற்கள் பயன்படுத்தவும்.' });
  }

  // 5. Rhythm tip
  const avgLen = lines.reduce((s, l) => s + l.length, 0) / (lines.length || 1);
  if (avgLen < 8) {
    results.push({ type: 'rhythm', icon: '🎵', msg: 'தாள நடை: வரிகள் மிகவும் குறுகியவை — சொற்களை நீட்டி ஒலி அழகை கொண்டுவாருங்கள்.' });
  } else if (avgLen > 40) {
    results.push({ type: 'rhythm', icon: '🎵', msg: 'தாள நடை: வரிகள் நீண்டவை — சிறு வரிகளாக உடைத்தால் தாளம் மேம்படும்.' });
  } else {
    results.push({ type: 'rhythm', icon: '🎵', msg: 'தாள நடை: வரி நீளம் சீராக உள்ளது — நல்ல தாளக் கட்டமைப்பு.' });
  }

  // 6. Always-on poetic tip
  const poeticTips = [
    'அனுப்பிராசம் (Alliteration): ஒரே எழுத்தில் தொடங்கும் வரிகள் கவிதையை இசையாக்கும்.',
    'சொல் மறிப்பு (Repetition): முக்கியமான வார்த்தையை மீண்டும் பயன்படுத்துவது வலிமை தரும்.',
    'உருவகம் (Metaphor): "கண்ணீர் ஆறாக ஓடுகிறது" போன்ற படிமங்கள் பயன்படுத்தவும்.',
    'திரிபு (Irony): எதிரான சொற்களை இணைத்து ஆழமான பொருள் தரவும்.',
    'முடிவு வரி: கவிதையின் கடைசி வரி வலிமையாக இருக்க வேண்டும் — வாசகர் மனதில் தங்க வேண்டும்.',
  ];
  results.push({ type: 'tip', icon: '💡', msg: poeticTips[Math.floor(Math.random() * poeticTips.length)] });

  return results;
}

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
  fontRanges: [],   // [{start, end, font}] — per-selection font overrides
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
  btnApplyTamilFont:$('btnApplyTamilFont'),
  btnClearRanges:   $('btnClearRanges'),
  fontHint:         $('fontHint'),
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
  bindAccordions();
  bindMobileTabs();
  applyTheme('midnight');
  updatePreview();
  spawnParticles();
  loadFromStorage();
}

/* ══════════════════════════════════════════════════════════
   ACCORDION — collapsible section headings
   ══════════════════════════════════════════════════════════ */
function bindAccordions() {
  document.querySelectorAll('.section-heading').forEach(heading => {
    const section = heading.closest('.control-section');
    heading.addEventListener('click', () => toggleSection(section));
    heading.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSection(section); }
    });
  });
}

function toggleSection(section) {
  const collapsed = section.classList.toggle('collapsed');
  const heading = section.querySelector('.section-heading');
  if (heading) heading.setAttribute('aria-expanded', String(!collapsed));
}

/* ══════════════════════════════════════════════════════════
   MOBILE TABS — Edit / Preview toggle
   ══════════════════════════════════════════════════════════ */
function bindMobileTabs() {
  const tabEdit    = document.getElementById('tabEdit');
  const tabPreview = document.getElementById('tabPreview');
  const panelEdit  = document.getElementById('panelEdit');
  const panelPreview = document.getElementById('panelPreview');
  if (!tabEdit || !tabPreview) return;

  function showTab(tab) {
    if (tab === 'edit') {
      panelEdit.classList.remove('tab-hidden');
      panelPreview.classList.add('tab-hidden');
      tabEdit.classList.add('active');
      tabPreview.classList.remove('active');
    } else {
      panelPreview.classList.remove('tab-hidden');
      panelEdit.classList.add('tab-hidden');
      tabPreview.classList.add('active');
      tabEdit.classList.remove('active');
    }
  }

  tabEdit.addEventListener('click', () => showTab('edit'));
  tabPreview.addEventListener('click', () => showTab('preview'));
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

  // Apply theme ONLY to the poem card — app chrome stays unchanged
  THEMES.forEach(t => el.poemCard.classList.remove('theme-' + t.id));
  el.poemCard.classList.add('theme-' + themeId);
  el.poemCard.dataset.theme = themeId;

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
/* ── Undo/redo history for the poem editor ─────────────── */
const undoStack = [];
let undoPtr = -1;
let undoLock = false;

function pushUndo(val) {
  if (undoLock) return;
  // Trim any forward history
  undoStack.splice(undoPtr + 1);
  // Avoid duplicate consecutive entries
  if (undoStack[undoPtr] !== val) {
    undoStack.push(val);
    if (undoStack.length > 200) undoStack.shift();
    undoPtr = undoStack.length - 1;
  }
}

function applyUndo() {
  if (undoPtr > 0) {
    undoPtr--;
    undoLock = true;
    el.poemEditor.value = undoStack[undoPtr];
    undoLock = false;
    updateLineCount();
    updatePreview();
    saveToStorage();
    toast('undo ↩');
  }
}

function applyRedo() {
  if (undoPtr < undoStack.length - 1) {
    undoPtr++;
    undoLock = true;
    el.poemEditor.value = undoStack[undoPtr];
    undoLock = false;
    updateLineCount();
    updatePreview();
    saveToStorage();
    toast('redo ↪');
  }
}

function bindPoemEditor() {
  // Seed history with initial value
  pushUndo(el.poemEditor.value);

  let debounceTimer;
  el.poemEditor.addEventListener('input', () => {
    updateLineCount();
    updatePreview();
    saveToStorage();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => pushUndo(el.poemEditor.value), 500);
  });

  // Trap Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z inside the textarea itself
  el.poemEditor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      applyUndo();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      applyRedo();
    }
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
    if (!text.trim()) { toast('கவிதையை முதலில் உள்ளிடவும்'); return; }

    const results = analyzeTamilPoem(text);
    el.suggestionList.innerHTML = '';

    results.forEach(r => {
      const li = document.createElement('li');
      li.style.cssText = 'margin-bottom:0.5rem; padding:0.4rem 0.5rem; border-radius:6px; background:rgba(255,255,255,0.04);';
      li.innerHTML = `<span style="font-size:1rem">${r.icon}</span> <strong style="color:var(--accent2)">[${r.type}]</strong> ${r.msg}`;
      el.suggestionList.appendChild(li);
    });

    el.suggestionBox.hidden = false;
    // Open the section if collapsed
    const sec = el.suggestionBox.closest('.control-section');
    if (sec && sec.classList.contains('collapsed')) toggleSection(sec);
    toast('கவிதை பகுப்பாய்வு தயார் ✦');
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
/* Apply a font to the current textarea selection (or whole editor if no selection) */
function applyFontToSelection(fontFamily) {
  const ta = el.poemEditor;
  const start = ta.selectionStart;
  const end   = ta.selectionEnd;

  if (start === end) {
    // No selection → change global default font
    state.tamilFont = fontFamily;
    el.tamilFontPreview.style.fontFamily = fontFamily;
    ta.style.fontFamily = fontFamily;
    updatePreview();
    saveToStorage();
    toast('Default font updated');
    return;
  }

  // Has selection → add/replace range
  // Remove any existing ranges that are fully inside this selection
  state.fontRanges = state.fontRanges.filter(r => !(r.start >= start && r.end <= end));
  // Split ranges that straddle the boundary
  const newRanges = [];
  state.fontRanges.forEach(r => {
    if (r.end > start && r.start < end) {
      // Partial overlap — keep parts outside the new range
      if (r.start < start) newRanges.push({ start: r.start, end: start, font: r.font });
      if (r.end   > end)   newRanges.push({ start: end,   end: r.end,  font: r.font });
    } else {
      newRanges.push(r);
    }
  });
  newRanges.push({ start, end, font: fontFamily });
  newRanges.sort((a, b) => a.start - b.start);
  state.fontRanges = newRanges;

  updateRangeCountHint();
  updatePreview();
  saveToStorage();
  toast(`Font applied to ${end - start} chars ✦`);
  ta.focus();
  ta.setSelectionRange(start, end);
}

function updateRangeCountHint() {
  if (!el.fontHint) return;
  const n = state.fontRanges.length;
  if (n === 0) {
    el.fontHint.textContent = '💡 Select text above, then change font to apply it to just that selection.';
  } else {
    el.fontHint.textContent = `✦ ${n} font range${n > 1 ? 's' : ''} active in this poem.`;
  }
}

function bindFontControls() {
  // Initialise textarea to show the default Tamil font
  el.poemEditor.style.fontFamily = state.tamilFont;

  // Tamil font dropdown — on change, check for selection
  el.tamilFont.addEventListener('change', () => {
    const fontFamily = el.tamilFont.value;
    el.tamilFontPreview.style.fontFamily = fontFamily;
    applyFontToSelection(fontFamily);
  });

  // Explicit "Apply to selection" button
  el.btnApplyTamilFont.addEventListener('click', () => {
    applyFontToSelection(el.tamilFont.value);
  });

  // Clear all ranges
  el.btnClearRanges.addEventListener('click', () => {
    state.fontRanges = [];
    updateRangeCountHint();
    updatePreview();
    saveToStorage();
    toast('Font ranges cleared');
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
   RICH FONT RANGE ENGINE
   ══════════════════════════════════════════════════════════ */
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/**
 * Build HTML for the poem body, inserting <span style="font-family:...">
 * around any character ranges that have per-selection font overrides.
 * The rest of the text uses the default font inherited from the parent.
 */
function buildRichPoemHTML(text, ranges) {
  if (!text) return '';
  if (!ranges || ranges.length === 0) return escHtml(text);

  // Sort by start; remove zero-length ranges
  const sorted = ranges
    .filter(r => r.start < r.end && r.end <= text.length)
    .sort((a, b) => a.start - b.start);

  let html = '';
  let pos  = 0;

  for (const r of sorted) {
    if (r.start < pos) continue;   // skip fully overlapped
    if (r.start > pos) {
      html += escHtml(text.slice(pos, r.start));
    }
    html += `<span style="font-family:${r.font}">${escHtml(text.slice(r.start, r.end))}</span>`;
    pos = r.end;
  }
  if (pos < text.length) html += escHtml(text.slice(pos));
  return html;
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

  // Body — build rich HTML preserving per-selection fonts
  const poem = el.poemEditor.value;
  if (poem.trim()) {
    const richInner = buildRichPoemHTML(poem, state.fontRanges);
    // Replace literal newlines with <br> so they render inside a block element
    const lined = richInner.replace(/\n/g, '<br>');

    el.previewBody.innerHTML = '';
    const div = document.createElement('div');
    div.style.cssText = [
      `font-family: ${state.tamilFont}`,
      `font-size: ${state.fontSize}px`,
      `line-height: ${state.lineHeight}`,
      `letter-spacing: ${state.letterSpacing}px`,
      `text-align: ${state.textAlign}`,
      `color: var(--card-text)`,
      `white-space: pre-wrap`,
      `word-break: break-word`,
      `margin: 0`,
    ].join(';');
    div.innerHTML = lined;
    el.previewBody.appendChild(div);
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
      fontRanges: state.fontRanges,
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
      el.poemEditor.style.fontFamily = data.tamilFont;
    }
    if (data.englishFont) {
      el.englishFont.value = data.englishFont;
      state.englishFont = data.englishFont;
      el.englishFontPreview.style.fontFamily = data.englishFont;
    }
    if (Array.isArray(data.fontRanges)) {
      state.fontRanges = data.fontRanges;
      updateRangeCountHint();
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
