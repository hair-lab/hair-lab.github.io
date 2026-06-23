/* Generates clean, flat character-avatar SVGs into images/avatars/.
   No photos — friendly stylized placeholder characters.
   Params are assigned deterministically per member id (neutral variety:
   hair style/color, skin tone, background, glasses). Run: node tools/gen-avatars.js */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'images', 'avatars');
fs.mkdirSync(OUT, { recursive: true });

const hair = {
  shortSide: (c) => `<path d="M54 88 C50 50 78 36 100 36 C122 36 150 50 146 88 C146 74 132 66 132 66 C120 58 80 58 68 66 C68 66 54 74 54 88 Z" fill="${c}"/>`,
  buzz: (c) => `<path d="M56 86 C54 52 78 40 100 40 C122 40 146 52 144 86 C140 62 120 56 100 56 C80 56 60 62 56 86 Z" fill="${c}"/>`,
  bun: (c) => `<circle cx="100" cy="34" r="12" fill="${c}"/><path d="M54 90 C50 52 78 40 100 40 C122 40 150 52 146 90 C146 72 130 62 100 62 C70 62 54 72 54 90 Z" fill="${c}"/>`,
  long: (c) => `<path d="M50 86 C46 48 76 34 100 34 C124 34 154 48 150 86 L150 132 C150 132 142 120 140 96 C140 78 124 64 100 64 C76 64 60 78 60 96 C58 120 50 132 50 132 Z" fill="${c}"/>`,
  curly: (c) => `<path d="M54 84 C44 78 50 58 64 56 C62 42 86 32 100 32 C114 32 138 42 136 56 C150 58 156 78 146 84 C150 72 134 64 134 64 C120 56 80 56 66 64 C66 64 50 72 54 84 Z" fill="${c}"/><circle cx="60" cy="62" r="7" fill="${c}"/><circle cx="140" cy="62" r="7" fill="${c}"/><circle cx="74" cy="50" r="7" fill="${c}"/><circle cx="126" cy="50" r="7" fill="${c}"/><circle cx="100" cy="44" r="8" fill="${c}"/>`,
  waves: (c) => `<path d="M52 88 C48 50 78 36 100 36 C122 36 152 50 148 88 C146 70 150 64 138 60 C140 70 128 62 120 64 C112 58 100 64 100 60 C100 64 88 58 80 64 C72 62 60 70 62 60 C50 64 54 70 52 88 Z" fill="${c}"/>`,
};

function face(skin) {
  return `
    <rect x="88" y="120" width="24" height="34" rx="12" fill="${skin}"/>
    <ellipse cx="56" cy="98" rx="8" ry="10" fill="${skin}"/>
    <ellipse cx="144" cy="98" rx="8" ry="10" fill="${skin}"/>
    <path d="M58 92 C58 56 78 44 100 44 C122 44 142 56 142 92 C142 122 124 142 100 142 C76 142 58 122 58 92 Z" fill="${skin}"/>`;
}
function features() {
  return `
    <g fill="#3A2A20"><circle cx="84" cy="96" r="4.6"/><circle cx="116" cy="96" r="4.6"/></g>
    <g stroke="#3A2A20" stroke-width="3.2" stroke-linecap="round"><path d="M76 85 q8 -4 16 0"/><path d="M108 85 q8 -4 16 0"/></g>
    <path d="M92 118 q8 7 16 0" fill="none" stroke="#B5654B" stroke-width="3.4" stroke-linecap="round"/>`;
}
const glasses = () => `
  <g fill="none" stroke="#2B3138" stroke-width="3">
    <rect x="70" y="88" width="22" height="18" rx="6"/><rect x="108" y="88" width="22" height="18" rx="6"/>
    <path d="M92 96 h16"/><path d="M70 94 l-9 -3"/><path d="M130 94 l9 -3"/>
  </g>`;
const clothesEl = (c) => `<path d="M38 200 C38 162 70 150 100 150 C130 150 162 162 162 200 Z" fill="${c}"/>`;

function avatar({ bg, skin, hairColor, style, clothesColor, glasses: hasGlasses }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img">
  <defs><clipPath id="c"><circle cx="100" cy="100" r="100"/></clipPath></defs>
  <g clip-path="url(#c)">
    <rect width="200" height="200" fill="${bg}"/>
    ${clothesEl(clothesColor)}
    ${hair[style](hairColor)}
    ${face(skin)}
    ${features()}
    ${hasGlasses ? glasses() : ''}
  </g>
</svg>`;
}

const bgs     = ['#E8EFFB','#EAF4F1','#FCEFE6','#EFEAFB','#E7F4EC','#FDE9F0','#E3F2F7','#F3EEE2','#EAF0F6','#F1ECF8','#E9F3EE','#FBEFE8','#EEF1F6','#F5EEF6'];
const skins   = ['#F0C9A6','#E7B98C','#D9A36F','#C98D5E','#8D5A30','#F4D4B0','#E5B589','#B5793F'];
const hairs   = ['#2A2622','#3A2A1A','#241C16','#5A3A1E','#1F1B18','#4A3220','#B5662A','#16110D'];
const styles  = ['shortSide','buzz','bun','long','curly','waves'];
const clothes = ['#27406B','#3F7E6E','#7A4FB0','#B5642A','#C2557E','#356BA0','#2F8F73','#4B5563','#9C4668','#2D6A8E','#5B6470','#6B4FA0'];

// Members needing avatars (prof-kim has a fixed config)
const ids = [
  'prof-kim','ryu-kunhee','lee-sooyoung','park-seongwon','kim-minje','svetasheva-arina','gasparini-abebe','farias-lucas',
  'marry-anne','aguilar-daniela','nemo-chowchuvech','yoo-hogyun','hwang-seongjoon',
  'tae-gayeong','lee-jinho','koo-joonhui'
];
const withGlasses = new Set(['prof-kim','ryu-kunhee','yoo-hogyun','koo-joonhui','kim-minje','park-seongwon']);

let n = 0;
ids.forEach((id, i) => {
  let cfg;
  if (id === 'prof-kim') {
    cfg = { bg: '#E8EFFB', skin: '#F0C9A6', hairColor: '#2A2622', style: 'shortSide', clothesColor: '#27406B', glasses: true };
  } else {
    cfg = {
      bg: bgs[i % bgs.length],
      skin: skins[(i * 3) % skins.length],
      hairColor: hairs[(i * 5) % hairs.length],
      style: styles[(i * 2 + 1) % styles.length],
      clothesColor: clothes[i % clothes.length],
      glasses: withGlasses.has(id)
    };
  }
  fs.writeFileSync(path.join(OUT, id + '.svg'), avatar(cfg).trim() + '\n');
  n++;
});
console.log('Generated ' + n + ' avatars in images/avatars/');
