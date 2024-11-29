import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import { PrismaClient } from '@prisma/client'

// where the *.song files are
const SONG_SOURCE_DIR = path.resolve(import.meta.dirname, '..', 'source');

const OUT_DIR = path.resolve(SONG_SOURCE_DIR, 'Tamil Christian Songs');

// to fix fast-glob's posix-style path processing
const posixPath = (p) => p.split(path.sep).join(path.posix.sep);
const normalizeEOLs = (s) => s.replace(/\r\n|\n|\r/g, '\n');

const db = new PrismaClient()

fs.mkdirSync(OUT_DIR, { recursive: true });

async function exec() {
    const songs = await db.song.findMany();

    console.log('Total:', songs.length);

    for (const song of songs) {
        console.log('Processing:', song.title);

        const name = String(song.title).trim();
        const serial = isNaN(song.id) ? null : Number.parseInt(song.id);

        // console.log('Song:', name);

        const slides = normalizeEOLs(song.content)
            .split('\n\n')
            .map(
                slide => slide
                    .trim()
                    .split('\n')
                    .map(line => line.trim())
            );

        const outFile = path.resolve(OUT_DIR, song.id + '.song');

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
            "serial": serial,
            "font": "TAU_Elango_Ragham",
            "font-alt": "Verdana",
            "album": "unknown",
            "author": "unknown",
            "category": "TCS",
            "genre": "unknown",
            "tags": [
                "tcs",
                "uncategorized",
            ],
            "year": 2024,
            "copyright": "Unknown",
            "version": 2024,
            "revision": 1,
        };

        const content = [
            '---',
            YAML.stringify(meta).trim(),
            '---' + '\n',
            slides.map(lines => lines.map(line => line.replace(/^(\d+)\./, '$1\\.')).join('\\\n'))
                .join('\n\n')
        ].join('\n')

        fs.writeFileSync(outFile, content);
    }
}

exec().then(() => {
    console.log('DONE!');
})