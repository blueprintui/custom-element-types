import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { generate } from '../src/react.js';
import type { Package } from 'custom-elements-manifest/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('react.ts', () => {
  const manifestPath = join(__dirname, 'fixtures', 'sample-manifest.json');
  const manifest: Package = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  describe('generate', () => {
    it('should generate React type declarations', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].path, 'types.d.ts');
      assert.ok(result[0].src.length > 0);
    });

    it('should include React DOMAttributes import', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes("import { DOMAttributes } from 'react'"));
    });

    it('should include element imports', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes("import { MyButton } from './/button/element.js'"));
      assert.ok(result[0].src.includes("import { MyInput } from './/input/element.js'"));
    });

    it('should declare module "react"', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('declare module "react"'));
      assert.ok(result[0].src.includes('namespace JSX'));
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

    it('should map elements to CustomElement type with class name', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('CustomElement<MyButton'));
      assert.ok(result[0].src.includes('CustomElement<MyInput'));
    });

    it('should include custom events in element type', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      // MyButton has customClick and click events (click is declared but not filtered)
      assert.ok(result[0].src.includes("CustomElement<MyButton,'customClick' | 'click'>"));
    });

    it('should not include event types for elements without custom events', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      // MyInput has no custom events
      assert.ok(result[0].src.includes('CustomElement<MyInput>'));
      assert.ok(!result[0].src.match(/CustomElement<MyInput,.*>/));
    });

    it('should include generated message comment', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('Generated with https://github.com/blueprintui/custom-element-types'));
    });

    it('should define CustomEvents type helper', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('type CustomEvents<K extends string>'));
    });

    it('should define CustomElement type helper', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('type CustomElement<T, K extends string'));
      assert.ok(result[0].src.includes('DOMAttributes<T>'));
      assert.ok(result[0].src.includes('children: any'));
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
