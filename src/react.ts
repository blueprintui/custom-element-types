import { generatedMessage, createElementMetadata } from './utils.js';

export function generate(config: { customElementsManifest: any, entrypoint: string }) {
  const elements = createElementMetadata(config.customElementsManifest, config.entrypoint);
  const src = `
/*
 * @experimental
 *
 * types.d.ts
 * ${generatedMessage}
 */
import { DOMAttributes } from 'react';
${elements.map(e => e.import).join('\n')}

type CustomEvents<K extends string> = { [key in K] : (event: CustomEvent) => void };
type CustomElement<T, K extends string = ''> = Partial<T & DOMAttributes<T> & { children: any } & CustomEvents<\`on\${K}\`>>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
${elements.map(e => `      ['${e.tagName}']: CustomElement<${e.name}${e.events.length ? `,${e.events.map(event => `'${event.name}'`).join(' | ')}` : ''}>`).join(';\n')}
    }
  }
}`.trim();

  return [{ src, path: 'types.d.ts' }];
}

