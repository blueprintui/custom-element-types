import { getElementImport, getCustomElementModules, getCustomElementDeclrations, generatedMessage } from './utils.js';

export function generate(config: { customElementsManifest: any, entrypoint: string }) {
  const customElementModules = getCustomElementModules(config.customElementsManifest);

  const src = `
/*
 * @experimental
 *
 * types.d.ts
 * ${generatedMessage}
 */
import { DOMAttributes } from 'react';
${customElementModules.flatMap(m => getCustomElementDeclrations(m.declarations).map(e => getElementImport(e, config.entrypoint, m.path))).join('\n')}

type CustomEvents<K extends string> = { [key in K] : (event: CustomEvent) => void };
type CustomElement<T, K extends string = ''> = Partial<T & DOMAttributes<T> & { children: any } & CustomEvents<\`on\${K}\`>>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
${customElementModules.flatMap(m => getCustomElementDeclrations(m.declarations).map(e => `      ['${e.tagName}']: CustomElement<${e.name}${e.events ? `,${e.events.map(event => `'${event.name}'`).join(' | ')}` : ''}>`)).join(';\n')}
    }
  }
}`.trim();

  return [{ src, path: 'types.d.ts' }];
}

