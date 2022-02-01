import fs from 'fs-extra';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { generate as generateAngular } from './angular.js';
import { generate as generateReact } from './react.js';
import { generate as generatePreact } from './preact.js';
import { generate as generateTypeScript } from './typescript.js';

const { ensureFileSync, writeFileSync, readJsonSync } = fs;
const argv = yargs(hideBin(process.argv)).argv;
const writePath = argv.write === true ? './' : argv.write;
const manifestPath = argv.customElements ? argv.customElements : './custom-elements.json';

const generator = {
  angular: generateAngular,
  react: generateReact,
  preact: generatePreact,
  typescript: generateTypeScript
}

export function run() {
  const customElementsManifest = readJsonSync(path.resolve(manifestPath));
  let result = generator[argv.type]({ customElementsManifest, entrypoint: argv.entrypoint });
  
  if (argv.write) { 
    write(writePath, result);
  } else {
    console.log(result);
  }
}

function write(dir: string, files: { src: string, path: string }[]) {
  ensureFileSync(path.resolve(dir, files[0].path));
  writeFileSync(path.resolve(dir, files[0].path), files[0].src);
}

run();
