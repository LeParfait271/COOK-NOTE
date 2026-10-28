#!/usr/bin/env node
'use strict';

// Repere (et retire avec --write) les regles CSS mortes de styles/ : une regle
// est morte quand chacun de ses selecteurs exige une classe qu'aucun fichier
// du site ne produit (JS, HTML, scripts de build). Prudent : une classe est
// tenue pour vivante des que son nom apparait quelque part, ou qu'un prefixe
// dynamique (`nutri-${...}`) la couvre.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STYLES = path.join(ROOT, 'styles');
const write = process.argv.includes('--write');

const SOURCE_DIRS = ['.', 'scripts', 'scripts/lib'];
const sources = SOURCE_DIRS.flatMap(dir => fs.readdirSync(path.join(ROOT, dir))
  .filter(name => /\.(js|html|json)$/.test(name) && !/^(recipes|catalog)/.test(name))
  .map(name => path.join(ROOT, dir, name)))
  .filter(file => !file.endsWith('find-dead-css.js'))
  .map(file => fs.readFileSync(file, 'utf8'))
  .join('\n');
// Les autres feuilles (hors styles/) sont des producteurs de classes legitimes.
const otherCss = fs.readdirSync(ROOT).filter(name => name.endsWith('.css')).map(name => fs.readFileSync(path.join(ROOT, name), 'utf8')).join('\n');

const dynamicPrefixes = [...sources.matchAll(/([a-z][a-z0-9-]*-)\$\{/g)].map(match => match[1]);
const known = new Map();
function classUsed(name) {
  if (known.has(name)) return known.get(name);
  const used = new RegExp(`(^|[^a-zA-Z0-9_-])${name.replace(/[-]/g, '\\-')}($|[^a-zA-Z0-9_-])`).test(sources)
    || dynamicPrefixes.some(prefix => name.startsWith(prefix))
    || otherCss.includes(name);
  known.set(name, used);
  return used;
}

function selectorDead(selector) {
  // Les pseudo-classes fonctionnelles (:is, :not, :has, :where) peuvent rendre
  // une classe optionnelle : on ignore leur contenu (prudence).
  const outer = selector.replace(/:(?:is|not|has|where)\((?:[^()]|\([^()]*\))*\)/g, '');
  const classes = [...outer.matchAll(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g)].map(match => match[1]);
  return classes.some(name => !classUsed(name));
}

function splitSelectors(text) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of text) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

// Parcours a accolades : renvoie le texte sans les regles mortes.
function prune(css, report) {
  let output = '';
  let index = 0;
  while (index < css.length) {
    const open = css.indexOf('{', index);
    if (open < 0) {
      output += css.slice(index);
      break;
    }
    // Commentaires et texte entre regles conserves tels quels.
    let preludeStart = index;
    const prelude = css.slice(preludeStart, open);
    const commentEnd = prelude.lastIndexOf('*/');
    const selectorText = (commentEnd >= 0 ? prelude.slice(commentEnd + 2) : prelude);
    const lead = prelude.slice(0, prelude.length - selectorText.length);
    let depth = 1;
    let close = open + 1;
    while (close < css.length && depth > 0) {
      if (css[close] === '{') depth += 1;
      else if (css[close] === '}') depth -= 1;
      close += 1;
    }
    const body = css.slice(open + 1, close - 1);
    const head = selectorText.trim();
    if (head.startsWith('@')) {
      const inner = /^@(media|supports|layer|container)/.test(head) ? prune(body, report) : body;
      if (/^@(media|supports|container)/.test(head) && !inner.replace(/\/\*[\s\S]*?\*\//g, '').trim()) {
        output += lead;
      } else {
        output += `${lead}${selectorText}{${inner}}`;
      }
    } else {
      const selectors = splitSelectors(head);
      const alive = selectors.filter(selector => !selectorDead(selector));
      if (!alive.length && selectors.length) {
        report.push(head.replace(/\s+/g, ' ').slice(0, 120));
        output += lead.replace(/\n[ \t]*$/, '\n');
      } else if (alive.length < selectors.length) {
        // Selecteurs morts retires de la liste, la regle reste.
        report.push(`(partiel) ${selectors.filter(selector => selectorDead(selector)).join(', ').slice(0, 120)}`);
        output += `${lead}${selectorText.match(/^\s*/)[0]}${alive.join(',\n')} {${body}}`;
      } else {
        output += `${lead}${selectorText}{${body}}`;
      }
    }
    index = close;
  }
  return output;
}

let before = 0;
let after = 0;
const files = fs.readdirSync(STYLES).filter(name => name.endsWith('.css')).sort();
files.forEach(name => {
  const file = path.join(STYLES, name);
  const css = fs.readFileSync(file, 'utf8');
  const report = [];
  const next = prune(css, report).replace(/\n{3,}/g, '\n\n');
  before += css.length;
  after += next.length;
  if (report.length) {
    console.log(`\n${name} : ${report.length} regle(s) morte(s), -${Math.round((css.length - next.length) / 1024)} Ko`);
    report.slice(0, 8).forEach(line => console.log(`  ${line}`));
    if (report.length > 8) console.log(`  ... et ${report.length - 8} autres`);
  }
  if (write && next !== css) fs.writeFileSync(file, next, 'utf8');
});
console.log(`\nTotal : ${Math.round(before / 1024)} Ko -> ${Math.round(after / 1024)} Ko${write ? ' (ecrit)' : ' (simulation, --write pour appliquer)'}`);
