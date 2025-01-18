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
    posixPath(path.join(SONG_SOURCE_DIR, 'Kirubasanam SongBook', '**/*.lyrix'))
], {
    dot: true,
    absolute: true,
    ignore: [
    ],
});

const nameMap = new Map<string, string>();

const cs = JSON.parse(
    fs.readFileSync(path.resolve(SONG_SOURCE_DIR, '..', '.tmp', 'kcc-songs.tanglish-names.json'), 'utf-8')
) as Record<string, string>;

for (const [k, v] of Object.entries(cs)) {
    nameMap.set(k, v);
}

// Fixes the verse numbering in the song files
for (const filename of songFiles) {
    const rp = path.relative(SONG_SOURCE_DIR, filename);

    const doc = fs.readFileSync(filename, 'utf-8')

    // root: mdast
    const root = parser.parse(doc)

    const metaNode = root.children.find((e: any) => e.type === 'meta') as any
    if (!metaNode) {
        throw new Error("Missing item: Metadata!")
    }

    let processed = true;
    let newFilename: string | undefined = undefined;

    const metadata = YAML.parse(metaNode.value)
    {
        // console.log('Metadata:', metadata)

        const tamTitle = metadata['title'];
        const engTitle = nameMap.get(tamTitle);

        if (!engTitle) {
            throw new Error(`Title not found: ${tamTitle}`);
        }

        metadata['title-en'] = engTitle;

        // newFilename = engTitle;
    }
    metaNode.value = YAML.stringify(metadata);

    const children: RootContent[] = [];

    for (const node of root.children) {
        switch (node.type) {
            case 'paragraph': {
                const [ first ] = node.children;
                if (first && (first.type === 'text')) {
                    const { value: text, position } = first;
                    const verseNumPattern = /^(\d+)\./;

                    if (verseNumPattern.test(text)) {
                        const verseNumMatches = verseNumPattern.exec(text);
                        if (!verseNumMatches) {
                            throw new Error("Verse number not found!")
                        }

                        const verseNum = verseNumMatches[1];

                        children.push({
                            "type": "heading",
                            "depth": 3,
                            "children": [
                                {
                                    "type": "text",
                                    "value": verseNum,
                                    position,
                                }
                            ],
                            position,
                        });

                        first.value = text.replace(verseNumPattern, '').trim();

                        processed = true;
                    }
                }
                children.push(node);
                break;
            }
            default:
                children.push(node);
                break;
        }
    }

    if (!processed) {
        continue
    }

    console.log('Processed:', rp);

    const content = parser.stringify({ type: 'root', children });

    fs.writeFileSync(filename, content, 'utf-8');

    if (newFilename) {
        const sanitized = newFilename
            .replace(/[?]/g, ' ');

        const newFilenamePath = path.resolve(path.dirname(filename), `${sanitized}.lyrix`);

        try {
            fs.renameSync(filename, newFilenamePath);
        } catch (e) {
            console.error('Error renaming:', filename, '->', newFilenamePath);
        }
    }
}