import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { generate } from '../src/typescript.js';
import type { Package } from 'custom-elements-manifest/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('typescript.ts', () => {
  const manifestPath = join(__dirname, 'fixtures', 'sample-manifest.json');
  const manifest: Package = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  describe('generate', () => {
    it('should generate TypeScript type declarations', () => {
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

    it('should declare global HTMLElementTagNameMap', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('declare global'));
      assert.ok(result[0].src.includes('interface HTMLElementTagNameMap'));
    });

    it('should map tag names to element classes', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes("'my-button': MyButton"));
      assert.ok(result[0].src.includes("'my-input': MyInput"));
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

    it('should have proper TypeScript declaration syntax', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      // Check the structure is valid TypeScript
      assert.ok(result[0].src.match(/declare global\s*\{/));
      assert.ok(result[0].src.match(/interface HTMLElementTagNameMap\s*\{/));
      assert.ok(result[0].src.includes('}'));
    });

    it('should separate tag name mappings with semicolons', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      // Check that entries are properly separated
      const tagMappingSection = result[0].src.match(/interface HTMLElementTagNameMap\s*\{([^}]*)\}/);
      assert.ok(tagMappingSection);
      assert.ok(tagMappingSection[1].includes("'my-button': MyButton;"));
      assert.ok(tagMappingSection[1].includes("'my-input': MyInput"));
    });
  });
});
