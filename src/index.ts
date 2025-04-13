#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { generate as generateAngular } from './angular.js';
import { generate as generateReact } from './react.js';
import { generate as generatePreact } from './preact.js';
import { generate as generateTypeScript } from './typescript.js';
import { generate as generateBlazor } from './blazor.js';
import { generate as generateJSX } from './jsx.js';

const { ensureFileSync, writeFileSync, readJsonSync } = fs;
const argv = yargs(hideBin(process.argv)).argv;
const writePath = argv.write === true ? './' : argv.write;
const manifestPath = argv.customElements ? argv.customElements : './custom-elements.json';

const generator = {
  angular: generateAngular,
  react: generateReact,
  preact: generatePreact,
  typescript: generateTypeScript,
  blazor: generateBlazor,
  jsx: generateJSX
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
  files.forEach(file => {
    ensureFileSync(path.resolve(dir, file.path));
    writeFileSync(path.resolve(dir, file.path), file.src);
  });
}

run();
