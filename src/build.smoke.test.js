// @vitest-environment node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import config from '../vite.config.js';

const outDir = fileURLToPath(new URL('../dist-smoke', import.meta.url));

beforeAll(async () => {
  await fs.rm(outDir, { recursive: true, force: true });
});

afterAll(async () => {
  await fs.rm(outDir, { recursive: true, force: true });
});

test('vite build completes', async () => {
  await build({
    ...config,
    logLevel: 'error',
    clearScreen: false,
    build: {
      ...(config.build || {}),
      outDir,
    },
  });

  const indexPath = path.join(outDir, 'index.html');
  await expect(fs.access(indexPath)).resolves.toBeUndefined();
});

