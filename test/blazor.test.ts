import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { generate } from '../src/blazor.js';
import type { Package } from 'custom-elements-manifest/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('blazor.ts', () => {
  const manifestPath = join(__dirname, 'fixtures', 'sample-manifest.json');
  const manifest: Package = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  describe('generate', () => {
    it('should generate two output files', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].path, 'CustomEvents.cs');
      assert.strictEqual(result[1].path, 'custom-events.js');
    });

    it('should generate C# EventHandlers with correct namespace', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('namespace BlazorApp;'));
      assert.ok(result[0].src.includes('public static class EventHandlers'));
    });

    it('should include C# CustomEventArgs class', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('public class CustomEventArgs : EventArgs'));
      assert.ok(result[0].src.includes('public dynamic? Detail { get; set; }'));
      assert.ok(result[0].src.includes('public T GetDetail<T>()'));
    });

    it('should include EventHandler attributes for custom events', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('[EventHandler("on'));
      assert.ok(result[0].src.includes('typeof(CustomEventArgs)'));
    });

    it('should generate JavaScript custom events registration', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[1].src.includes('const customEvents'));
      assert.ok(result[1].src.includes('Blazor.registerCustomEventType'));
    });

    it('should include CustomEvent bubbling workaround in JS', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[1].src.includes('class Bubbled extends CustomEvent'));
    });

    it('should include C# using statements', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('using Microsoft.AspNetCore.Components;'));
      assert.ok(result[0].src.includes('using System.Text.Json;'));
    });

    it('should include generated message comment in both files', () => {
      const result = generate({
        customElementsManifest: manifest,
        entrypoint: undefined
      });

      assert.ok(result[0].src.includes('Generated with https://github.com/blueprintui/custom-element-types'));
      assert.ok(result[1].src.includes('Generated with https://github.com/blueprintui/custom-element-types'));
    });
  });
});
