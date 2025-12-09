/**
 * LLM-assisted burst estimator for per-pack JSON files.
 *
 * What it does:
 * - Reads all pack files in src/data/powerbanks/packs/*.json (excluding index.js).
 * - For packs missing `burst` or flagged with "estimatedByLLM", sends charging-sheet
 *   fields to an LLM (OpenRouter) to estimate:
 *     - atMax (Wh gained in 20 minutes at max input)
 *     - at140W (Wh gained in 20 minutes at 140W or closest test)
 *     - maxW (max input wattage)
 *     - maxProfile (short input profile summary)
 * - Writes the updated pack JSON with:
 *     burst: {
 *       atMax,
 *       at140W,
 *       maxW,
 *       maxProfile,
 *       sustainedW: maxW,
 *       sustains: "Estimated",
 *       outputThrottling: charging.sustained_load || "",
 *       estimatedByLLM: true
 *     }
 *
 * Requirements:
 * - Set OPENROUTER_API_KEY in your environment.
 * - Install axios: npm install axios
 *
 * Run:
 *   node scripts/llm-burst-estimator.js
 *
 * Notes:
 * - The prompt asks for conservative, data-grounded estimates from the provided
 *   charge_duration/charge_capacity/charge_power lines. If the model cannot
 *   confidently estimate, it should return 0 for atMax/at140W.
 * - Files are overwritten in-place.
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import process from 'process';

const ROOT = path.resolve(path.join(process.cwd(), 'src', 'data', 'powerbanks', 'packs'));
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error('OPENROUTER_API_KEY is not set.');
  process.exit(1);
}

const MODEL = process.env.OPENROUTER_MODEL || 'grok-code-fast-1'; // default as provided
const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

const promptTemplate = (pack) => {
  const { name, subtitle = '', charging = {} } = pack;
  const fields = [
    'peak_port_w',
    'capacity_mah',
    'charge_duration',
    'charge_power',
    'charge_capacity',
    'sustained_load',
  ];
  const lines = fields
    .map(k => `${k}: ${charging[k] || ''}`)
    .join('\n');
  return `
You are estimating 20-minute recharge energy (Wh gained in 20 minutes) for a laptop power bank using only the provided lab notes. Be conservative and data-grounded; do not hallucinate beyond what the text supports.

Outputs:
- atMax: Wh gained in 20 minutes at the tested maximum input profile (numeric, no units; 0 if unknown)
- at140W: Wh gained in 20 minutes at 140W or the closest test profile (numeric, no units; 0 if unknown)
- maxW: peak input wattage actually observed (numeric, no units; 0 if unknown)
- maxProfile: a short string summarizing the max input profile (e.g., "316W → 240W → 150W"); empty string if unknown

Rules:
- If there is a charge_capacity line with Wh and a corresponding charge_duration line with minutes at a given W, scale that Wh linearly to 20 minutes as a conservative estimate (min(actual Wh, scaled Wh)).
- Prefer higher-input tests for atMax; prefer 140W (or nearest) for at140W; if only one test, reuse it for both.
- If no timing is provided, approximate atMax as min(peak_input_W * 20/60, reported charge_capacity Wh) when both exist; otherwise 0.
- If nothing is reliable, return 0 for atMax and at140W, and empty maxProfile.

Return JSON only:
{
  "atMax": <number>,
  "at140W": <number>,
  "maxW": <number>,
  "maxProfile": "<string>"
}

Pack:
Name: ${name}
Subtitle: ${subtitle}
Charging sheet fields:
${lines}
`;
};

async function callLLM(prompt) {
  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: 'You are a precise lab data assistant. Return only JSON with numeric fields.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
  };
  const headers = {
    'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,
  // OpenRouter recommends sending a referer/title for rate/fair-use; optional but nice.
  'HTTP-Referer': process.env.OPENROUTER_REFERER || 'http://localhost',
  'X-Title': process.env.OPENROUTER_TITLE || 'llm-burst-estimator',
  };
  const res = await axios.post(ENDPOINT, body, { headers, timeout: 30000 });
  const text = res.data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('No content from LLM');
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in LLM response');
  return JSON.parse(jsonMatch[0]);
}

function loadPacks() {
  return fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.json') && f !== 'index.js')
    .map(f => ({ file: f, data: JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf-8')) }));
}

function savePack(file, data) {
  fs.writeFileSync(path.join(ROOT, file), JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

async function main() {
  const packs = loadPacks();
  let updated = 0;
  for (const { file, data } of packs) {
    const hasBurst = data.burst && !data.burst.estimatedByLLM;
    if (hasBurst) continue;
    const prompt = promptTemplate(data);
    try {
      const resp = await callLLM(prompt);
      const burst = {
        atMax: Number(resp.atMax) || 0,
        at140W: Number(resp.at140W) || 0,
        maxW: Number(resp.maxW) || 0,
        maxProfile: resp.maxProfile || '',
        sustainedW: Number(resp.maxW) || 0,
        sustains: 'Estimated',
        outputThrottling: (data.charging?.sustained_load || '').trim(),
        estimatedByLLM: true,
      };
      data.burst = burst;
      savePack(file, data);
      updated += 1;
      console.log(`Updated burst via LLM: ${file}`);
    } catch (err) {
      console.error(`LLM failed for ${file}:`, err.message);
    }
  }
  console.log(`Done. Burst updated via LLM for ${updated} packs.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

