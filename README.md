[![Build Status](https://github.com/wixplosives/core3-github-utils/workflows/tests/badge.svg)](https://github.com/wixplosives/core3-github-utils/actions)

# Core3 Github Utils

- Utils to use in Github Actions

## Install

`Node >= v9`

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build
```

Run the tests :heavy_check_mark:

```bash
$ npm test
```

## Check if files exist

This is most basic example of how to run the action.

`util: check-files-existence`: the util to use

`files: string`: comma separated file paths to check

`allow_failure?: bool`: Optional - false as default. fails workflow if at least 1 file doesn't exist

```
- name: Check if files exist
  uses: wixplosives/core3-github-utils@master
  with:
    util: check-files-existence
    files: src/main.ts, src/check-files-existence.ts
    allow_failure: true
```

## Read file to output

`util: read-file`: The util to use

`filepath: string`: Filepath to read and place on output

`allow_failure?: bool`: Optional - false as default. Fails if requested file doesn't exist.

`trim?: bool`: Optional - false as default. Trims the text from the file.

```
- name: Read file to output
  id: package
  uses: wixplosives/core3-github-utils@master
  with:
    util: read-file
    filepath: ./package.json
    allow_failure: true
    trim: true
- name: Echo package.json
  run: echo "${{ steps.package.outputs.content }}"
```
