import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import glob from 'fast-glob'

// where the *.json files are
const SOURCE_DIR = path.resolve(import.meta.dirname, '..', 'etc');

const SONG_SOURCE_DIR = path.resolve(import.meta.dirname, '..', 'source');
const OUT_DIR = path.resolve(SONG_SOURCE_DIR, 'Kirubasanam SongBook');

// to fix fast-glob's posix-style path processing
const posixPath = (p: string) => p.split(path.sep).join(path.posix.sep);
const normalizeEOLs = (s: string) => s.replace(/\r\n|\n|\r/g, '\n');

fs.mkdirSync(OUT_DIR, { recursive: true });

const names: string[] = [];

// enumerate all *.song files under the source dir
const songFiles = glob.sync([
    posixPath(path.join(SOURCE_DIR, 'kcc_songs', '**/*.json'))
], {
    dot: true,
    absolute: true,
    ignore: [
    ],
});

async function exec() {
    console.log('Total:', songFiles.length);

    for (const filename of songFiles) {
        const rp = path.relative(SONG_SOURCE_DIR, filename);

        console.log('Processing:', rp);

        const song = JSON.parse(fs.readFileSync(filename, 'utf-8'))

        const name = String(song.meta.name).trim();
        const serial = isNaN(song.id) ? null : song.id;

        // console.log('Song:', name);
        names.push(name);

        if (!song.contents) {
            throw new Error('No slides found for song: ' + name);
        }

        const slides: string[][] = song.contents.map((slide: any) => {
            return slide.content.map((line: string) => line.trim());
        });

        if (slides.length != song.contents.length) {
            throw new Error('Slide count mismatch for song: ' + name);
        }

        const outFile = path.resolve(OUT_DIR, song.id + '.lyrix');

        const meta = {
            "title": name,
            "title-en": String(song.id),
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
            "author": "unknown",
            "category": "KCC",
            "genre": "unknown",
            "youtube": null,
            "tags": [
                "kcc",
                "uncategorized",
            ],
            "year": 2023,
            "copyright": "Unknown",
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

    fs.writeFileSync(path.resolve(SONG_SOURCE_DIR, '..', '.tmp', 'kcc-songs.tamil-names.json'), JSON.stringify(names, null, 2));
}

exec().then(() => {
    console.log('DONE!');
})