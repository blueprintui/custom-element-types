# custom-element-types

[![npm version](https://badge.fury.io/js/custom-element-types.svg)](https://badge.fury.io/js/custom-element-types) ![CI Build](https://github.com/coryrylan/custom-element-types/actions/workflows/build.yml/badge.svg)

A generator to create TypeScript type definitions for TypeScript applications using Custom Elements.
Currently supports React 18.x expermental and Angular.

## Getting Started

Install via NPM

```bash
npm install --save-dev custom-element-types
```

## Playground

If you have a published Web Component library you can try out the [generator playground](https://custom-element-types.web.app).

## CLI

```bash
custom-element-types --write --type react --entrypoint @cds/core
```

| Args              | Description                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| type              | `react`, `preact`, `angular`, `typescript`                                   |
| custom-elements   | optional custom path to `custom-elements.json` file                           |
| write             | write to file, optionally provide a output directory path                     |
| entrypoint        | package name for base entrypoint import path, else defaults to relative path |

## Examples
- React: https://stackblitz.com/edit/http-server-noh4jj 
- Angular: https://stackblitz.com/edit/node-1tthxz
