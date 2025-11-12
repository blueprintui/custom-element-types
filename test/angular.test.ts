import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { generate } from '../src/angular.js';
import type { Package } from 'custom-elements-manifest/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('angular.ts', () => {
  const manifestPath = join(__dirname, 'fixtures', 'sample-manifest.json');
  const manifest: Package = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  describe('generate', () => {
    it('should generate Angular module with directives', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].path, 'custom-element-types.module.ts');
      assert.ok(result[0].src.length > 0);
    });

    it('should include Angular core imports', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes("import { Directive, Input, Output, EventEmitter, ElementRef } from '@angular/core'"));
    });

    it('should include type imports for elements', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes("import type { MyButton } from './/button/element.js'"));
      assert.ok(result[0].src.includes("import type { MyInput } from './/input/element.js'"));
    });

    it('should generate directives for each element', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('@Directive({ selector: \'my-button\', standalone: true })'));
      assert.ok(result[0].src.includes('export class MyButtonDirective'));

      assert.ok(result[0].src.includes('@Directive({ selector: \'my-input\', standalone: true })'));
      assert.ok(result[0].src.includes('export class MyInputDirective'));
    });

    it('should include ElementRef in directive constructor', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('constructor(elementRef: ElementRef)'));
      assert.ok(result[0].src.includes('this.element = elementRef.nativeElement'));
    });

    it('should generate @Input properties with setters and getters', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      // MyButton has disabled and label properties
      assert.ok(result[0].src.includes('@Input() set disabled'));
      assert.ok(result[0].src.includes('get disabled()'));
      assert.ok(result[0].src.includes('@Input() set label'));
      assert.ok(result[0].src.includes('get label()'));
    });

    it('should handle boolean properties with empty string check', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      // disabled is a boolean property
      assert.ok(result[0].src.includes('@Input() set disabled(value: boolean | \'\')'));
      assert.ok(result[0].src.includes("value === '' ? true :"));
    });

    it('should not add empty string check for non-boolean properties', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      // label is a string property
      assert.ok(result[0].src.includes('@Input() set label(value)'));
      assert.ok(!result[0].src.match(/@Input\(\) set label\(value: boolean/));
    });

    it('should generate @Output events', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      // MyButton has customClick event
      assert.ok(result[0].src.includes("@Output('customClick') customClickEvent"));
      assert.ok(result[0].src.includes('EventEmitter<CustomEvent>'));
    });

    it('should not generate @Output for elements without events', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      // Check that MyInputDirective doesn't have unnecessary output declarations
      const myInputDirectiveMatch = result[0].src.match(/export class MyInputDirective \{[\s\S]*?\n\}/);
      assert.ok(myInputDirectiveMatch);
      assert.ok(!myInputDirectiveMatch[0].includes('@Output'));
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

      assert.ok(result[0].src.includes("import type { MyButton } from '@mylib/components/button/element.js'"));
      assert.ok(result[0].src.includes("import type { MyInput } from '@mylib/components/input/element.js'"));
    });

    it('should mark directives as standalone', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('standalone: true'));
    });

    it('should create protected element reference', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('protected element: Partial<MyButton>'));
      assert.ok(result[0].src.includes('protected element: Partial<MyInput>'));
    });
  });
});
