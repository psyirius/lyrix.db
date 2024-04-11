import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import glob from 'fast-glob'
import pumpify from "pumpify";

import RTFParser from "./rtf-parser/rtf-parser.js";
import RTFDocument from "./rtf-parser/rtf-document.js";
import RTFInterpreter from "./rtf-parser/rtf-interpreter.js";
import RTFParagraph from "./rtf-parser/rtf-paragraph.js";
import RTFSpan from "./rtf-parser/rtf-span.js";

async function proToSlides(presentation) {
    function trim(str, charToRemove, suffix = true) {
        while (str.charAt(0) === charToRemove) {
            str = str.substring(1);
        }

        if (suffix) {
            while (str.charAt(str.length - 1) === charToRemove) {
                str = str.substring(0, str.length - 1);
            }
        }

        return str;
    }

    function parse(input) {
        return new Promise((resolve, reject) => {
            const doc = new RTFDocument();
            const parser = new RTFParser();
            const interpreter = new RTFInterpreter(doc);
            const stream = pumpify(parser, interpreter);
            stream.once('error', err => reject(err));
            stream.once('finish', () => resolve(doc));
            stream.end(input);
        });
    }

    function unRTF(o) {
        let text = '';

        if (o instanceof RTFDocument) {
            for (const e of o.content) {
                text += unRTF(e)
            }
        } else if (o instanceof RTFParagraph) {
            for (const e of o.content) {
                text += unRTF(e)
            }
            text += '\n';
        } else if (o instanceof RTFSpan) {
            let val = o.value;

            if (val.startsWith('?')) {
                val = trim(val, '?', false)
            }

            text += val
        } else {
            throw new Error();
        }

        return text
    }

    function makeSlideList(slideStr) {
        return slideStr.split('\n').map(line => line.trim());
    }

    const slideStrList = [];

    for (const cue of presentation.cues) {
        for (const action of cue.actions) {
            const p = action.slide.presentation;
            // console.log(p.baseSlide);

            if (!p.baseSlide.elements) {
                throw new Error('No elements exist');
            }

            for (const {element} of p.baseSlide.elements) {
                const content = Buffer.from(element.text.rtfData, 'base64');
                // console.log(content);

                // fs.writeFileSync(`./${element.uuid.string}-xoxo.rtf`, content);

                const d = await parse(content);

                const slide = unRTF(d).trim();

                // console.log(d);
                // console.log(x);

                slideStrList.push(slide);
            }

            // // Notes parsing
            // {
            //     const content = Buffer.from(p.notes.rtfData, 'base64');
            //
            //     const d = await parse(content);
            //
            //     const notes = unRTF(d).trim();
            //
            //     // console.log(d);
            //     console.log(notes);
            // }
        }
    }

    return slideStrList.map(makeSlideList);
}

// where the *.song files are
const SONG_SOURCE_DIR = path.resolve(import.meta.dirname, '..', 'source');

// where the pro json files are
const SOURCE_DIR = path.resolve(import.meta.dirname, '..', 'etc/legacy-to-port/pro7-json');
// const SOURCE_DIR = path.resolve(import.meta.dirname, '..', 'etc/legacy-to-port/dups');

const OUT_DIR = path.resolve(SONG_SOURCE_DIR, 'Uncategorized');

// to fix fast-glob's posix-style path processing
const posixPath = (p) => p.split(path.sep).join(path.posix.sep);

// enumerate all *.song files under the source dir
const songFiles = glob.sync([
    posixPath(path.join(SOURCE_DIR, '**/*.json'))
], {
    dot: true,
    absolute: true,
});

console.log('Total: ', songFiles.length)

fs.mkdirSync(OUT_DIR, { recursive: true });

const unqMap = new Map();

async function exec() {
    for (const filename of songFiles) {
        const rp = path.relative(SOURCE_DIR, filename);

        // console.log('Processing:', rp);

        const presentation = JSON.parse(
            fs.readFileSync(filename, 'utf-8')
        );

        const name = presentation.name.trim();

        if (unqMap.has(name)) {
            unqMap.set(name, [...unqMap.get(name), rp]);
        } else {
            unqMap.set(name, [rp]);
        }

        // console.log('Song:', name);

        const slides = await proToSlides(presentation);

        const outFile = path.resolve(OUT_DIR, name + '.song');

        const meta = {
            "title": name,
            "title-en": name,
            "names": [
                name
            ],
            "keywords": [
                name
            ],
            "locale": "ta_IN",
            "serial": null,
            "font": "TAU_Elango_Ragham",
            "font-alt": "Verdana",
            "album": "unknown",
            "author": "unknown",
            "category": "Uncategorized",
            "genre": "unknown",
            "tags": [
                "pro",
                "uncategorized",
            ],
            "year": 1993,
            "copyright": "Copy owner",
            "version": 2000,
            "revision": 1,
        };

        const content = [
            '---',
            YAML.stringify(meta),
            '---',
            slides.map(slide => slide.join('\\\n')).join('\n\n')
        ]

        fs.writeFileSync(outFile, content.join('\n'));
    }
}

exec().then(() => {
    console.log('UniqueNames:', unqMap.size);

    const duplicates = Array.from(unqMap.entries()).filter(([_, v]) => v.length > 1);

    console.log('Duplicates:', duplicates);
})