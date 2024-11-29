import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import glob from 'fast-glob'
import {XMLParser} from 'fast-xml-parser'

// where the *.song files are
const SONG_SOURCE_DIR = path.resolve(import.meta.dirname, '..', 'source');

// where the vv xml db files are
const SOURCE_DIR = path.resolve(import.meta.dirname, '..', 'etc/vv_exports');

const OUT_DIR = path.resolve(SONG_SOURCE_DIR, 'VVX');

// to fix fast-glob's posix-style path processing
const posixPath = (p) => p.split(path.sep).join(path.posix.sep);

// enumerate all *.xml files under the source dir
const dbFiles = glob.sync([
    posixPath(path.join(SOURCE_DIR, '**/*.xml'))
], {
    dot: true,
    absolute: true,
});

console.log('Total: ', dbFiles.length)

fs.mkdirSync(OUT_DIR, { recursive: true });

const unqMap = new Map();

async function exec() {
    for (const filename of dbFiles) {
        const rp = path.relative(SOURCE_DIR, filename);

        console.log('Processing:', rp);

        const root = new XMLParser().parse(
            fs.readFileSync(filename, 'utf-8')
        );

        const { songDB } = root;
        const { song: songs } = songDB;

        console.log('Total: ', songs.length)

        const TARGET_CATEGORY = '1_FGPC_2024_(601 - 700)';

        for (const song of songs) {
            if (song.category !== TARGET_CATEGORY) {
                continue;
            }

            const name = String(song.name).trim();
            const serial = Number.parseInt(name, 10) || null;

            if (unqMap.has(name)) {
                unqMap.set(name, [...unqMap.get(name), rp]);
            } else {
                unqMap.set(name, [rp]);
            }

            // console.log('Song:', name);

            const slides = await song.slide.split('<slide>')
                .filter(slide => Boolean(slide.trim()))
                .map(lines => lines.replace(/<BR>/gi, '<br>')
                    .split('<br>')
                    .map(line => line.trim())
                    .filter(slide => Boolean(slide.trim()))
                );

            const outFile = path.resolve(OUT_DIR, name + '.song');

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
                "serial": serial,
                "font": "TAU_Elango_Ragham",
                "font-alt": "Verdana",
                "album": "unknown",
                "author": "unknown",
                "category": "FGPC",
                "genre": "unknown",
                "tags": [
                    "fgpc",
                    "uncategorized",
                ],
                "year": 2023,
                "copyright": "FGPC",
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

            fs.writeFileSync(outFile, content.join('\n'));
        }
    }
}

exec().then(() => {
    console.log('UniqueNames:', unqMap.size);

    const duplicates = Array.from(unqMap.entries()).filter(([_, v]) => v.length > 1);

    console.log('Duplicates:', duplicates);
})