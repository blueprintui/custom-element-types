
export function replaceTsExtentions(filePath: string) {
  return filePath.endsWith('.ts') ? changeExt(filePath, 'js') : filePath;
}

export function changeExt(filePath: string, ext: string) {
  const pos = filePath.includes('.') ? filePath.lastIndexOf('.') : filePath.length;
  return `${filePath.substr(0, pos)}.${ext}`;
}

export function getElementImport(element: any, basePackage: string, modulePath: string) {
  return `import { ${element.name} } from '${basePackage ? `${basePackage}/` : './'}${replaceTsExtentions(modulePath)}';`;
}

export function getPublicProperties(element: any) {
  return element.members.filter(m => m.privacy !== 'private' && m.privacy !== 'protected' && m.kind === 'field')
}

export function getCustomElementModules(customElementsManifest: any) {
  return customElementsManifest.modules.filter(m => m.declarations?.length && m.declarations.find(d => d.customElement === true));
}

export function getCustomElementDeclrations(declarations: any) {
  return declarations.filter(d => d.customElement && d.tagName);
}

export const generatedMessage = `Generated with https://github.com/coryrylan/custom-element-types`;