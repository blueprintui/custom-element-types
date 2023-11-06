import { generatedMessage, createElementMetadata, CustomElement } from './utils.js';

export function generate(config: { customElementsManifest: any, entrypoint: string }) {
  const elements = createElementMetadata(config.customElementsManifest, config.entrypoint);

  const src = `
/* 
 * custom-element-types.module.ts
 * ${generatedMessage}
 */
import { Directive, Input, Output, EventEmitter, ElementRef } from '@angular/core';
${elements.map(e => e.importType).join('\n')}

${elements.map(e => getDirective(e)).join('\n')}`.trim();
  return [{ src, path: 'custom-element-types.module.ts' }];;
}

// https://github.com/angular/angular/issues/14761
function getDirective(element: CustomElement) {
  return `
@Directive({ selector: '${element.tagName}', standalone: true })
export class ${element.name}Directive {
  protected element: Partial<${element.name}>;
${getInputProperties(element)}
${getOutputEvents(element)}
  constructor(elementRef: ElementRef) {
    this.element = elementRef.nativeElement;
  }
}`;
}

function getInputProperties(element: CustomElement) {
  return element.propeties.map(prop => `
  @Input() set ${prop.name}(value${prop.type === 'boolean' ? `: boolean | ''` : ''}) { this.element.${prop.name} = ${prop.type === 'boolean' ? `value === '' ? true : ` : ''}value; }
  get ${prop.name}() { return this.element.${prop.name}; }`).join('\n');
}

function getOutputEvents(element: any) {
  return `${element.events?.length ? `\n${element.events?.map(event => `  @Output('${event.name}') ${event.name}Event: EventEmitter<CustomEvent> = new EventEmitter();`).join('\n\n')}` : ''}`;
}
