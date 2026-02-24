import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { generate } from '../src/preact.js';
import type { Package } from 'custom-elements-manifest/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('preact.ts', () => {
  const manifestPath = join(__dirname, 'fixtures', 'sample-manifest.json');
  const manifest: Package = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  describe('generate', () => {
    it('should generate Preact type declarations', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].path, 'types.d.ts');
      assert.ok(result[0].src.length > 0);
    });

    it('should include element imports', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes("import { MyButton } from './/button/element.js'"));
      assert.ok(result[0].src.includes("import { MyInput } from './/input/element.js'"));
    });

    it('should declare global preact.JSX namespace', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('declare global'));
      assert.ok(result[0].src.includes('namespace preact.JSX'));
      assert.ok(result[0].src.includes('interface IntrinsicElements'));
    });

    it('should include tag names in IntrinsicElements', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes("['my-button']"));
      assert.ok(result[0].src.includes("['my-input']"));
    });

    it('should include custom events in element type', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes("CustomElement<MyButton,'customClick' | 'click'>"));
    });

    it('should not include event types for elements without events', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('CustomElement<MyInput>'));
    });

    it('should define CustomEvents and CustomElement type helpers', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('type CustomEvents<K extends string>'));
      assert.ok(result[0].src.includes('type CustomElement<T, K extends string'));
    });

    it('should include generated message comment', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('Generated with https://github.com/blueprintui/custom-element-types'));
    });

    it('should use entrypoint when provided', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: '@mylib/components'
      });

      assert.ok(result[0].src.includes("import { MyButton } from '@mylib/components/button/element.js'"));
      assert.ok(result[0].src.includes("import { MyInput } from '@mylib/components/input/element.js'"));
    });
  });
});
