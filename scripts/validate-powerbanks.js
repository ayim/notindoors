import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const sourceFile = path.join(root, 'src', 'data', 'powerbanks', 'powerbanks.json');
const packsDir = path.join(root, 'src', 'data', 'powerbanks', 'packs');
const writeMode = process.argv.includes('--write');

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const serialize = (obj) => JSON.stringify(obj, null, 2) + '\n';

if (!fs.existsSync(sourceFile)) {
  console.error(`Source file not found: ${sourceFile}`);
  process.exit(1);
}

if (!fs.existsSync(packsDir)) {
  if (writeMode) {
    fs.mkdirSync(packsDir, { recursive: true });
  } else {
    console.error(`Packs directory missing: ${packsDir}`);
    process.exit(1);
  }
}

const sourcePacks = readJson(sourceFile);
const sourceSlugs = new Set(sourcePacks.map(p => p.slug));

let errors = [];
let writes = 0;

for (const pack of sourcePacks) {
  const target = path.join(packsDir, `${pack.slug}.json`);
  const desired = serialize(pack);
  if (!fs.existsSync(target)) {
    const msg = `Missing pack file: ${target}`;
    if (writeMode) {
      fs.writeFileSync(target, desired);
      writes += 1;
      console.log(`Created: ${target}`);
    } else {
      errors.push(msg);
    }
    continue;
  }
  const current = fs.readFileSync(target, 'utf8');
  if (current !== desired) {
    const msg = `Out of sync: ${target}`;
    if (writeMode) {
      fs.writeFileSync(target, desired);
      writes += 1;
      console.log(`Updated: ${target}`);
    } else {
      errors.push(msg);
    }
  }
}

// Extra files not in source
const packFiles = fs.readdirSync(packsDir).filter(f => f.endsWith('.json') && f !== 'index.js');
for (const file of packFiles) {
  const slug = file.replace(/\.json$/, '');
  if (!sourceSlugs.has(slug)) {
    const msg = `Extra pack file not in source: ${path.join(packsDir, file)}`;
    errors.push(msg);
  }
}

// Rebuild index.js
const importLines = [];
const identifiers = [];
for (const pack of sourcePacks) {
  const id = pack.slug.replace(/[^a-zA-Z0-9]/g, '_');
  identifiers.push(id);
  importLines.push(`import ${id} from './${pack.slug}.json';`);
}
const indexContent = `${importLines.join('\n')}\n\nconst packs = [\n  ${identifiers.join(',\n  ')}\n];\n\nexport default packs;\n`;
const indexPath = path.join(packsDir, 'index.js');
const currentIndex = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';
if (currentIndex !== indexContent) {
  if (writeMode) {
    fs.writeFileSync(indexPath, indexContent);
    writes += 1;
    console.log(`Updated: ${indexPath}`);
  } else {
    errors.push('index.js is out of sync with source.');
  }
}

if (errors.length && !writeMode) {
  console.error('Validation failed:');
  errors.forEach(e => console.error(`- ${e}`));
  process.exit(1);
}

if (writeMode) {
  console.log(`Sync complete. Files written/updated: ${writes}`);
} else {
  console.log('Validation passed. Packs are in sync with source.');
}

