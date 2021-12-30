# Custom Element Types

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
| type              | `react`, `angular`, `typescript`                                             |
| custom-elements   | optional custom path to `custom-elements.json` file                           |
| write             | write to file, optionally provide a output directory path                     |
| entrypoint        | package name for base entrypoint import path, else defaults to relative path |
