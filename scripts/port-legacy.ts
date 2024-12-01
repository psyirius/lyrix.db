import * as fs from 'node:fs'
import * as path from 'node:path'

import YAML from 'yaml'
import glob from 'fast-glob'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkBreaks from 'remark-breaks'
import remarkStringify from 'remark-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import type { RootContent } from 'mdast'

// where the *.lyrix files are
const SONG_SOURCE_DIR = path.resolve(import.meta.dirname, '..', 'source');

// to fix fast-glob's posix-style path processing
const posixPath = (p: string) => p.split(path.sep).join(path.posix.sep);

const parser = unified()
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkStringify)
    .use(remarkFrontmatter, [
        { type: 'meta', marker: '-' }, // meta is in yaml
    ]);

// enumerate all *.lyrix files under the source dir
const songFiles = glob.sync([
    posixPath(path.join(SONG_SOURCE_DIR, 'TODO', '**/*.lyrix'))
], {
    dot: true,
    absolute: true,
    ignore: [
    ],
});

// Fixes the verse numbering in the song files
for (const filename of songFiles) {
    const rp = path.relative(SONG_SOURCE_DIR, filename);

    console.log('Processing:', rp);

    const name = path.basename(filename, '.lyrix');

    const doc = fs.readFileSync(filename, 'utf-8')

    const slides = doc
        .trim()
        .split(/\n\s*\n/)
        .map(slide => slide.split('\n').map(line => line.trim()));

    const meta = {
        "title": name,
        "title-en": name,
        "names": [
            ''
        ],
        "keywords": [
            ''
        ],
        "locale": "ta_IN",
        "serial": 0,
        "font": "TAU_Elango_Ragham",
        "font-alt": "Verdana",
        "album": "unknown",
        "author": "Fr. S. J. Berchmans",
        "category": "Jebathotta Jeyageethangal",
        "genre": "unknown",
        "tags": [
            "uncategorized",
        ],
        "year": 2023,
        "copyright": "Jebathotta Jeyageethangal",
        "version": 2023,
        "revision": 1,
    };

    const content = [
        '---',
        YAML.stringify(meta).trim(),
        '---' + '\n',
        slides.map(lines => lines.map(line => line.replace(/^(\d+)\./, '$1\\.')).join('\\\n'))
            .join('\n\n')
    ]

    fs.writeFileSync(filename, content.join('\n'));
}