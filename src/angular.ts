import { generatedMessage, createElementMetadata, CustomElement } from './utils.js';

export function generate(config: { customElementsManifest: any, entrypoint: string }) {
  const elements = createElementMetadata(config.customElementsManifest, config.entrypoint);

  const src = `
/* 
 * custom-element-types.module.ts
 * ${generatedMessage}
 */
import { Directive, Input, Output, EventEmitter, ElementRef, NgModule } from '@angular/core';
${elements.map(e => e.import).join('\n')}

${elements.map(e => getDirective(e)).join('\n')}

${getModule(elements)}`.trim();
  return [{ src, path: 'custom-element-types.module.ts' }];;
}

// https://github.com/angular/angular/issues/14761
function getDirective(element: CustomElement) {
  return `
@Directive({ selector: '${element.tagName}' })
export class ${element.name}Directive {
  protected element: ${element.name};
${getInputProperties(element)}
${getOutputEvents(element)}
  constructor(elementRef: ElementRef) {
    this.element = elementRef.nativeElement;
  }
}`;
}

function getModule(elements: CustomElement[]) {
  return `
const directives = [${elements.map(e => `${e.name}Directive,`).join('\n    ')}];
@NgModule({
  declarations: [...directives],
  exports: [...directives],
})
export class CustomElementTypesModule { }`;
}

function getInputProperties(element: CustomElement) {
  return element.propeties.map(prop => `
  @Input() set ${prop.name}(value${prop.type === 'boolean' ? `: boolean | ''` : ''}) { this.element.${prop.name} = ${prop.type === 'boolean' ? `value === '' ? true : ` : ''}value; }
  get ${prop.name}() { return this.element.${prop.name}; }`).join('\n');
}

function getOutputEvents(element: any) {
  return `${element.events?.length ? `\n${element.events?.map(event => `  @Output('${event.name}') ${event.name}Event: EventEmitter<CustomEvent> = new EventEmitter();`).join('\n\n')}` : ''}`;
}
