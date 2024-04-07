REQUIREMENTS:

Node.js: Download and install the LTS version of node.js from https://nodejs.org/en/download

Post installation:
```sh
npm i -g npm@latest pnpm
```

Song sources are inside the `source` directory.

To install dependencies:
```sh
pnpm install
```

To compile into verseview database:
```sh
pnpm build
```

The resulting verseview database file will be in the `dist` directory.

Notes:
- Use Markdown syntax highlighting for the `*.song` file for some better DX :P
