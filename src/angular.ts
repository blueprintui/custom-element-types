import { getElementImport, getPublicProperties, getCustomElementModules, getCustomElementDeclrations } from './utils.js';

export function generate(config: { customElementsManifest: any, entrypoint: string }) {
  const customElementModules = getCustomElementModules(config.customElementsManifest);
  
  const src = `
// custom-element-types.module.ts
import { Directive, Input, Output, EventEmitter, ElementRef, NgModule } from '@angular/core';
${customElementModules.flatMap(m => getCustomElementDeclrations(m.declarations).map(e => `${getElementImport(e, config.entrypoint, m.path)}`)).join('\n')}

${customElementModules.flatMap(m => getCustomElementDeclrations(m.declarations).map(e => getDirective(e)).join('\n')).join('\n')}

${getModule(customElementModules)}`.trim();

  return [{ src, path: 'custom-element-types.module.ts' }];;
}

// https://github.com/angular/angular/issues/14761
function getDirective(element: any) {
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

function getModule(customElementModules: any) {
  return `
const directives = [${customElementModules.flatMap(m => m.declarations.filter(d => d.customElement && d.tagName).map(e => `${e.name}Directive,`)).join('\n    ')}];
@NgModule({
  declarations: [...directives],
  exports: [...directives],
})
export class CustomElementTypesModule { }`;
}

function getInputProperties(element: any) {
  // @Input() @HostBinding('${prop.name}') ${prop.name}!: ${element.name}['${prop.name}']${prop.type?.text === 'boolean' ? ` | ''` : ''};`).join('\n  ')}
  return getPublicProperties(element).map(prop => `
  @Input() set ${prop.name}(value${prop.type?.text === 'boolean' ? `: boolean | ''` : ''}) { this.element.${prop.name} = ${prop.type?.text === 'boolean' ? '!!' : ''}value; }
  get ${prop.name}() { return this.element.${prop.name}; }`).join('\n');
}

function getOutputEvents(element: any) {
  return `${element.events?.length ? `\n${element.events?.map(event => `  @Output() ${event.name}: EventEmitter<CustomEvent> = new EventEmitter();`).join('\n\n')}` : ''}`;
}
