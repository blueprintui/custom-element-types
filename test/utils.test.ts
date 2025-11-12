import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createElementMetadata } from '../src/utils.js';
import type { Package } from 'custom-elements-manifest/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('utils.ts', () => {
  const manifestPath = join(__dirname, 'fixtures', 'sample-manifest.json');
  const manifest: Package = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  describe('createElementMetadata', () => {
    it('should extract custom elements from manifest', () => {
      const elements = createElementMetadata(manifest, undefined);

      assert.strictEqual(elements.length, 2, 'Should find 2 custom elements');
      assert.strictEqual(elements[0].name, 'MyButton');
      assert.strictEqual(elements[0].tagName, 'my-button');
      assert.strictEqual(elements[1].name, 'MyInput');
      assert.strictEqual(elements[1].tagName, 'my-input');
    });

    it('should filter out non-custom elements', () => {
      const elements = createElementMetadata(manifest, undefined);

      const notCustomElement = elements.find(el => el.name === 'NotCustomElement');
      assert.strictEqual(notCustomElement, undefined, 'Should not include non-custom elements');
    });

    it('should generate correct import statements', () => {
      const elements = createElementMetadata(manifest, undefined);

      assert.strictEqual(elements[0].import, "import { MyButton } from './/button/element.js';");
      assert.strictEqual(elements[0].importType, "import type { MyButton } from './/button/element.js';");
    });

    it('should replace .ts extensions with .js', () => {
      const elements = createElementMetadata(manifest, undefined);

      assert.ok(elements[0].path.endsWith('.js'), 'Should convert .ts to .js');
      assert.ok(!elements[0].path.endsWith('.ts'), 'Should not have .ts extension');
    });

    it('should use entrypoint when provided', () => {
      const elements = createElementMetadata(manifest, '@mylib/components');

      assert.ok(elements[0].path.startsWith('@mylib/components'), 'Should include entrypoint prefix');
      assert.strictEqual(elements[0].path, '@mylib/components/button/element.js');
    });

    it('should include element metadata', () => {
      const elements = createElementMetadata(manifest, undefined);
      const button = elements[0];

      assert.strictEqual(button.description, 'A custom button element');
      assert.ok(Array.isArray(button.slots), 'Should have slots array');
      assert.ok(Array.isArray(button.cssProperties), 'Should have cssProperties array');
      assert.strictEqual(button.cssProperties.length, 1);
      assert.strictEqual(button.cssProperties[0].name, '--color');
    });
  });

  describe('getPublicProperties', () => {
    it('should filter out readonly properties', () => {
      const elements = createElementMetadata(manifest, undefined);
      const button = elements[0];

      const readonlyProp = button.propeties.find(p => p.name === 'readonly');
      assert.strictEqual(readonlyProp, undefined, 'Should not include readonly properties');
    });

    it('should filter out private properties', () => {
      const elements = createElementMetadata(manifest, undefined);
      const button = elements[0];

      const privateProp = button.propeties.find(p => p.name === 'privateField');
      assert.strictEqual(privateProp, undefined, 'Should not include private properties');
    });

    it('should filter out static properties', () => {
      const elements = createElementMetadata(manifest, undefined);
      const button = elements[0];

      const staticProp = button.propeties.find(p => p.name === 'staticField');
      assert.strictEqual(staticProp, undefined, 'Should not include static properties');
    });

    it('should filter out reserved properties', () => {
      const elements = createElementMetadata(manifest, undefined);
      const button = elements[0];

      const reservedProp = button.propeties.find(p => p.name === 'innerHTML');
      assert.strictEqual(reservedProp, undefined, 'Should not include reserved properties');
    });

    it('should include public properties with attributes', () => {
      const elements = createElementMetadata(manifest, undefined);
      const button = elements[0];

      assert.strictEqual(button.propeties.length, 2, 'Should have 2 valid properties');

      const disabled = button.propeties.find(p => p.name === 'disabled');
      assert.ok(disabled, 'Should include disabled property');
      assert.strictEqual(disabled.type, 'boolean');

      const label = button.propeties.find(p => p.name === 'label');
      assert.ok(label, 'Should include label property');
      assert.strictEqual(label.type, 'string');
    });
  });

  describe('getCustomElementEvents', () => {
    it('should include custom events', () => {
      const elements = createElementMetadata(manifest, undefined);
      const button = elements[0];

      const customClick = button.events.find(e => e.name === 'customClick');
      assert.ok(customClick, 'Should include custom events');
    });

    it('should include declared events (reserved events in manifest are not filtered)', () => {
      const elements = createElementMetadata(manifest, undefined);
      const button = elements[0];

      // Note: The current implementation does not filter reserved events from the declared events array
      // It only filters reserved events from EventEmitter member fields
      const clickEvent = button.events.find(e => e.name === 'click');
      assert.ok(clickEvent, 'Declared events are included even if reserved');

      const customClick = button.events.find(e => e.name === 'customClick');
      assert.ok(customClick, 'Custom events are included');
    });

    it('should handle elements with no events', () => {
      const elements = createElementMetadata(manifest, undefined);
      const input = elements[1];

      assert.ok(Array.isArray(input.events), 'Should have events array');
      assert.strictEqual(input.events.length, 0, 'Should have empty events array');
    });
  });
});
