import { getElementImport, getCustomElementModules, getCustomElementDeclrations, generatedMessage } from './utils.js';

export function generate(config: { customElementsManifest: any, entrypoint: string }) {
  const customElementModules = getCustomElementModules(config.customElementsManifest);
  
  const src = `
/*
 * types.d.ts
 * ${generatedMessage}
 */
${customElementModules.flatMap(m => getCustomElementDeclrations(m.declarations).map(e => getElementImport(e, config.entrypoint, m.path))).join('\n')}

declare global {
  interface HTMLElementTagNameMap {
${customElementModules.flatMap(m => getCustomElementDeclrations(m.declarations).map(e => `      '${e.tagName}': ${e.name}`)).join(';\n')}
  }
}`.trim();

  return [{ src, path: 'types.d.ts' }];;
}
