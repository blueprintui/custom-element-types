import { generatedMessage, createElementMetadata } from './utils.js';

export function generate(config: { customElementsManifest: any, entrypoint: string }) {
  const elements = createElementMetadata(config.customElementsManifest, config.entrypoint);
  const src = `
/*
 * types.d.ts
 * ${generatedMessage}
 */
${elements.map(e => e.import).join('\n')}

declare global {
  interface HTMLElementTagNameMap {
${elements.map(e => `      '${e.tagName}': ${e.name}`).join(';\n')}
  }
}`.trim();

  return [{ src, path: 'types.d.ts' }];;
}
