import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'

// where the *.song files are
const SONG_SOURCE_DIR = path.resolve(import.meta.dirname, '..', 'source');

// where the vv xml db files are
const SOURCE_DIR = path.resolve(import.meta.dirname, '..', 'etc/fgpc-json-exports');

const OUT_DIR = path.resolve(SONG_SOURCE_DIR, 'FGPC OUT PRE');

// enumerate all *.xml files under the source dir
const inputFile = path.resolve(SOURCE_DIR, 'FGPC-2023 - (901-1000).json');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function exec() {
    {
        console.log('Processing:', inputFile);

        const songs = JSON.parse(
            fs.readFileSync(inputFile, 'utf-8')
        );

        console.log('Total: ', songs.length);

        for (const song of songs) {
            const name = String(song.sequence).trim();
            const serial = Number.parseInt(name, 10) || null;

            // console.log('Song:', name);

            const { contents } = song;

            const slides = contents.map(c => {
                switch (c.type) {
                    case 'verse': return ['###', String(c.sequence)].join(' ');
                    case 'sub': return ['##', String(c.content)].join(' ');
                    case 'slide': return c.lines.map(line => line.replace(/^(\d+)\./, '$1\\.')).join('\\\n');

                    default: {
                        throw new Error('Unknown content type: ' + content.type);
                    }
                }
            });

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
                slides.join('\n\n')
            ]

            fs.writeFileSync(outFile, content.join('\n'));
        }
    }
}

exec().then(() => {
    console.log('Done!');
})