import { Package } from 'custom-elements-manifest/schema';
import { isReservedEvent, isReservedProperty } from './reserved.js';

export interface CustomElement {
  name: string;
  tagName: string;
  path: string;
  import: string;
  description: string;
  propeties: { name: string; type: string; }[];
  events: { name: string; }[];
  cssProperties: any[];
  slots: any[]
}

export interface CustomElementMetadata {
  entrypoint: string;
  elements: CustomElement[];
}

export function createElementMetadata(customElementsManifest: Package, entrypoint): CustomElement[] {
  const modules = getCustomElementModules(customElementsManifest);

  const elements = modules.flatMap(m => {
    return m.declarations.filter(d => d.customElement && d.tagName).map(d => {

      const path = `${entrypoint ? `${entrypoint}` : './'}${replaceTsExtentions(m.path)}`;
      const element: CustomElement = {
        name: d.name,
        tagName: d.tagName,
        description: d.description ?? '',
        path,
        import: `import { ${d.name} } from '${path}';`,
        slots: d.slots ?? [],
        cssProperties: d.cssProperties ?? [],
        events: getCustomElementEvents(d) ?? [],
        propeties: getPublicProperties(d)
      };

      return element;
    });
  });

  return elements;
}

function replaceTsExtentions(filePath: string) {
  return filePath.endsWith('.ts') ? changeExt(filePath, 'js') : filePath;
}

function changeExt(filePath: string, ext: string) {
  const pos = filePath.includes('.') ? filePath.lastIndexOf('.') : filePath.length;
  return `${filePath.substr(0, pos)}.${ext}`;
}

function getPublicProperties(element: any) {
  return (element.members?.filter(m =>
    !m.readonly &&
    !m.static &&
    m.kind === 'field' &&
    m.attribute !== undefined &&
    m.privacy === undefined &&
    m.privacy !== 'private' &&
    m.privacy !== 'protected' &&
    !isReservedProperty(m.name)
  ) ?? []).map(p => ({ name: p.name, type: p.type?.text }));
}

function getCustomElementModules(customElementsManifest: any) {
  return customElementsManifest.modules.filter(m => m.declarations?.length && m.declarations.find(d => d.customElement === true));
}

function getCustomElementEvents(element): any[] {
  const memberEvents = element.members
    .filter(event => event.privacy === undefined) // public
    .filter(prop => prop.type && prop.type?.text && prop.type?.text.includes('EventEmitter') && !isReservedEvent(prop.name))
    .map(event => ({ name: event.name }));
  const events = element.events ?? [];
  return Object.values(Object.values([...memberEvents, ...events].reduce((prev, next) => ({ ...prev, [next.name]: next }), {})));
}

export const generatedMessage = `Generated with https://github.com/blueprintui/custom-element-types`;
