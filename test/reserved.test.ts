import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isReservedProperty, isReservedEvent } from '../src/reserved.js';

describe('reserved.ts', () => {
  describe('isReservedProperty', () => {
    it('should identify HTML element properties as reserved', () => {
      assert.strictEqual(isReservedProperty('innerHTML'), true);
      assert.strictEqual(isReservedProperty('outerHTML'), true);
      assert.strictEqual(isReservedProperty('title'), true);
      assert.strictEqual(isReservedProperty('className'), true);
      assert.strictEqual(isReservedProperty('id'), true);
    });

    it('should identify ARIA properties as reserved', () => {
      assert.strictEqual(isReservedProperty('ariaLabel'), true);
      assert.strictEqual(isReservedProperty('ariaHidden'), true);
      assert.strictEqual(isReservedProperty('ariaDisabled'), true);
      assert.strictEqual(isReservedProperty('ariaExpanded'), true);
    });

    it('should be case-insensitive', () => {
      assert.strictEqual(isReservedProperty('InnerHTML'), true);
      assert.strictEqual(isReservedProperty('INNERHTML'), true);
      assert.strictEqual(isReservedProperty('AriaLabel'), true);
      assert.strictEqual(isReservedProperty('ARIALABEL'), true);
    });

    it('should identify custom properties as not reserved', () => {
      assert.strictEqual(isReservedProperty('customProp'), false);
      assert.strictEqual(isReservedProperty('myValue'), false);
      assert.strictEqual(isReservedProperty('disabled'), false);
      assert.strictEqual(isReservedProperty('label'), false);
    });

    it('should identify form-related properties as reserved', () => {
      assert.strictEqual(isReservedProperty('role'), true);
      assert.strictEqual(isReservedProperty('form'), true);
    });

    it('should identify style and offset properties as reserved', () => {
      assert.strictEqual(isReservedProperty('style'), true);
      assert.strictEqual(isReservedProperty('offsetWidth'), true);
      assert.strictEqual(isReservedProperty('offsetHeight'), true);
      assert.strictEqual(isReservedProperty('scrollTop'), true);
      assert.strictEqual(isReservedProperty('clientWidth'), true);
    });

    it('should identify event handler properties as reserved', () => {
      assert.strictEqual(isReservedProperty('onclick'), true);
      assert.strictEqual(isReservedProperty('onchange'), true);
      assert.strictEqual(isReservedProperty('onblur'), true);
      assert.strictEqual(isReservedProperty('onfocus'), true);
    });
  });

  describe('isReservedEvent', () => {
    it('should identify standard HTML events as reserved', () => {
      assert.strictEqual(isReservedEvent('click'), true);
      assert.strictEqual(isReservedEvent('change'), true);
      assert.strictEqual(isReservedEvent('input'), true);
      assert.strictEqual(isReservedEvent('blur'), true);
      assert.strictEqual(isReservedEvent('focus'), true);
    });

    it('should identify mouse events as reserved', () => {
      assert.strictEqual(isReservedEvent('mousedown'), true);
      assert.strictEqual(isReservedEvent('mouseup'), true);
      assert.strictEqual(isReservedEvent('mousemove'), true);
      assert.strictEqual(isReservedEvent('mouseenter'), true);
      assert.strictEqual(isReservedEvent('mouseleave'), true);
    });

    it('should identify keyboard events as reserved', () => {
      assert.strictEqual(isReservedEvent('keydown'), true);
      assert.strictEqual(isReservedEvent('keyup'), true);
      assert.strictEqual(isReservedEvent('keypress'), true);
    });

    it('should identify pointer events as reserved', () => {
      assert.strictEqual(isReservedEvent('pointerdown'), true);
      assert.strictEqual(isReservedEvent('pointerup'), true);
      assert.strictEqual(isReservedEvent('pointermove'), true);
      assert.strictEqual(isReservedEvent('pointercancel'), true);
    });

    it('should be case-insensitive', () => {
      assert.strictEqual(isReservedEvent('Click'), true);
      assert.strictEqual(isReservedEvent('CLICK'), true);
      assert.strictEqual(isReservedEvent('MouseDown'), true);
      assert.strictEqual(isReservedEvent('MOUSEDOWN'), true);
    });

    it('should identify custom events as not reserved', () => {
      assert.strictEqual(isReservedEvent('customClick'), false);
      assert.strictEqual(isReservedEvent('myEvent'), false);
      assert.strictEqual(isReservedEvent('dataChanged'), false);
      assert.strictEqual(isReservedEvent('itemSelected'), false);
    });

    it('should identify drag events as reserved', () => {
      assert.strictEqual(isReservedEvent('drag'), true);
      assert.strictEqual(isReservedEvent('dragstart'), true);
      assert.strictEqual(isReservedEvent('dragend'), true);
      assert.strictEqual(isReservedEvent('drop'), true);
    });

    it('should identify media events as reserved', () => {
      assert.strictEqual(isReservedEvent('play'), true);
      assert.strictEqual(isReservedEvent('pause'), true);
      assert.strictEqual(isReservedEvent('ended'), true);
      assert.strictEqual(isReservedEvent('loadeddata'), true);
    });
  });
});
