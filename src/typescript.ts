import { getElementImport, getCustomElementModules, getCustomElementDeclrations } from './utils.js';

export function generate(config: { customElementsManifest: any, entrypoint: string }) {
  const customElementModules = getCustomElementModules(config.customElementsManifest);
  
  const src = `
// types.d.ts
${customElementModules.flatMap(m => getCustomElementDeclrations(m.declarations).map(e => getElementImport(e, config.entrypoint, m.path))).join('\n')}

declare global {
  interface HTMLElementTagNameMap {
${customElementModules.flatMap(m => getCustomElementDeclrations(m.declarations).map(e => `      '${e.tagName}': ${e.name}`)).join(';\n')}
  }
}`.trim();

  return [{ src, path: 'types.d.ts' }];;
}
