# custom-element-types

[![npm version](https://badge.fury.io/js/custom-element-types.svg)](https://badge.fury.io/js/custom-element-types) ![CI Build](https://github.com/coryrylan/custom-element-types/actions/workflows/build.yml/badge.svg)

A generator to create type definitions and framework bindings for applications using Web Components (Custom Elements).

## Getting Started

Install via NPM

```bash
npm install --save-dev custom-element-types
```

## Playground

If you have a published Web Component library you can try out the [generator playground](https://custom-element-types.web.app).

## CLI

```bash
custom-element-types --write --type react --entrypoint @blueprintui/components
```

| Args              | Description                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| type              | `react`, `preact`, `angular`, `typescript`, `blazor`                         |
| custom-elements   | optional custom path to `custom-elements.json` file                           |
| write             | write to file, optionally provide a output directory path                     |
| entrypoint        | package name for base entrypoint import path, else defaults to relative path |

## Examples
- React: https://stackblitz.com/edit/http-server-noh4jj 
- Angular: https://stackblitz.com/edit/node-1tthxz
- Preact: https://stackblitz.com/edit/vitejs-vite-8qed1q
- Blazor: https://github.com/coryrylan/clarity-blazor
