import path from "node:path"
import fs from "node:fs";
import opentype, {Font, Glyph, Path} from 'opentype.js'

const CONSONANT = Symbol("consonant");

const glyphNameMap = {
    'அ': '/a.tm',
    'ஆ': '/aa.tm',
    'இ': '/i.tm',
    'ஈ': '/ii.tm',
    'உ': '/u.tm',
    'ஊ': '/uu.tm',
    'எ': '/e.tm',
    'ஏ': '/ee.tm',
    'ஐ': '/ai.tm',
    'ஒ': '/o.tm',
    'ஓ': '/oo.tm',
    'ஔ': '/au.tm',

    'ஃ': '/aaytam.tm',

    'க': '/ka.tm',
    'ங': '/nga.tm',
    'ச': '/ca.tm',
    'ஞ': '/nya.tm',
    'ட': '/tta.tm',
    'ண': '/nna.tm',
    'த': '/ta.tm',
    'ந': '/na.tm',
    'ப': '/pa.tm',
    'ம': '/ma.tm',
    'ய': '/ya.tm',
    'ர': '/ra.tm',
    'ல': '/la.tm',
    'வ': '/va.tm',
    'ழ': '/llla.tm',
    'ள': '/lla.tm',
    'ற': '/rra.tm',
    'ன': '/nnna.tm',

    'ஶ': '/sha.tm',
    'ஜ': '/ja.tm',
    'ஷ': '/ssa.tm',
    'ஸ': '/sa.tm',
    'ஹ': '/ha.tm',
    'க்ஷ': '/kssa.tm', // ['க', '்', 'ஷ']

    '்': '/pullidflt.tm',
    'ா': '/matraaa.tm',
    'ி': '/matraidflt.tm',
    'ீ': '/matraiidflt.tm',
    'ு': '/matraudflt.tm',
    'ூ': '/matrauudflt.tm',
    'ெ': '/matrae.tm',
    'ே': '/matraee.tm',
    'ை': '/matraai.tm',
    'ொ': '/matrao.tm',
    'ோ': '/matraoo.tm',
    'ௌ': '/matraau.tm',

    'ௗ': '/matraauspare.tm',

    '◌': '/DottedCircle',

    'க்': '/kapulli.tm',
    'ங்': '/ngapulli.tm',
    'ச்': '/capulli.tm',
    'ஞ்': '/nyapulli.tm',
    'ட்': '/ttapulli.tm',
    'ண்': '/nnapulli.tm',
    'த்': '/tapulli.tm',
    'ந்': '/napulli.tm',
    'ப்': '/papulli.tm',
    'ம்': '/mapulli.tm',
    'ய்': '/yapulli.tm',
    'ர்': '/rapulli.tm',
    'ல்': '/lapulli.tm',
    'வ்': '/vapulli.tm',
    'ழ்': '/lllapulli.tm',
    'ள்': '/llapulli.tm',
    'ற்': '/rrapulli.tm',
    'ன்': '/nnnapulli.tm',
}

// Bamini
const glyphMap = {
    vowels: {
        'அ': 'm',
        'ஆ': 'M',
        'இ': ',',
        'ஈ': '<',
        'உ': 'c',
        'ஊ': 'C',
        'எ': 'v',
        'ஏ': 'V',
        'ஐ': 'I',
        'ஒ': 'x',
        'ஓ': 'X',
        'ஔ': 'xs',
    },
    special: {
        'ஃ': '/',
    },
    consonants: {
        base: {
            'க': 'f',
            'ங': 'q',
            'ச': 'r',
            'ஞ': 'Q',
            'ட': 'l',
            'ண': 'z',
            'த': 'j',
            'ந': 'e',
            'ப': 'g',
            'ம': 'k',
            'ய': 'a',
            'ர': 'u',
            'ல': 'y',
            'வ': 't',
            'ழ': 'o',
            'ள': 's',
            'ற': 'w',
            'ன': 'd',
        },
        extra: {
            'ஶ': null,
            'ஜ': '[',
            'ஷ': '\\',
            'ஸ': ']',
            'ஹ': '`',
            'க்ஷ': '~',
        },
        composite: {
            template: {
                '்': [CONSONANT, ';'],
                'ா': [CONSONANT, 'h'],
                'ி': [CONSONANT, 'p'],
                'ீ': [CONSONANT, 'P'],
                'ு': [CONSONANT, '§'],
                'ூ': [CONSONANT, '_'],
                'ெ': ['n', CONSONANT],
                'ே': ['N', CONSONANT],
                'ை': ['i', CONSONANT],
                'ொ': ['n', CONSONANT, 'h'],
                'ோ': ['N', CONSONANT, 'h'],
                'ௌ': ['n', CONSONANT, 's'],
            },
            syllabary: {
                'ி': {
                    'டி': 'b',
                },
                'ீ': {
                    'டீ': 'B',
                },
                'ு': {
                    'கு': 'F',
                    'ஙு': null,
                    'சு': 'R',
                    'ஞு': null,
                    'டு': 'L',
                    'ணு': 'Z',
                    'து': 'J',
                    'நு': 'E',
                    'பு': 'G',
                    'மு': 'K',
                    'யு': 'A',
                    'ரு': 'U',
                    'லு': 'Y',
                    'வு': 'T',
                    'ழு': 'O',
                    'ளு': 'S',
                    'று': 'W',
                    'னு': 'D',
                },
                'ூ': {
                    'கூ': '$',
                    'ஙூ': null,
                    'சூ': '#',
                    'ஞூ': null,
                    'டூ': '^',
                    'ணூ': 'Z}',
                    'தூ': 'J}',
                    'நூ': 'E}',
                    'பூ': 'G+',
                    'மூ': '%',
                    'யூ': 'A+',
                    'ரூ': '&',
                    'லூ': 'Y}',
                    'வூ': 'T+',
                    'ழூ': '*',
                    'ளூ': '@',
                    'றூ': 'W}',
                    'னூ': 'D}',
                },
            },
            extra: {
                'ௗ': [CONSONANT, 's'],
            }
        },
    },
    numerals: {
        '௦': null,    // 0
        '௧': null,    // 1
        '௨': null,    // 2
        '௩': null,    // 3
        '௪': null,    // 4
        '௫': null,    // 5
        '௬': null,    // 6
        '௭': null,    // 7
        '௮': null,    // 8
        '௯': null,    // 9
        '௰': null,    // 10
        '௱': null,    // 100
        '௲': null,    // 1000
    },
    symbols: {
        '௳': null,
        '௴': null,
        '௵': null,
        '௶': null,
        '௷': null,
        '௸': '¨',
        '௹': null,
        '௺': null,
    },
    misc: {
        'ஸ்ரீ': '=',
        'ௐ': null,
    },
    extra: {
        // Numbers
        '0': '0',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',

        // Punc & Sym
        ':': ':',
        '(': '(',
        ')': ')',
        '-': '-',
        '.': '.',
        '!': '!',
        '?': '?',
        ';': '|',
        '=': '¡',
        '&': '¦',
    },
};

// Glyph Remapping
// Kerning Adjustment

const FONTS_DIR = path.resolve(import.meta.dirname, '..', 'fonts');

const ttfBuf = fs.readFileSync(
    // path.resolve(FONTS_DIR, 'Stmzh (Legacy)/tam.ttf')
    // path.resolve(FONTS_DIR, 'tamilbible.ttf')
    // path.resolve(FONTS_DIR, 'BAMINI-Tamil16.ttf')
    path.resolve(FONTS_DIR, 'MuktaMalar-Medium.ttf')
    // path.resolve(FONTS_DIR, 'BalooThambi-Regular.ttf')
);

// const fkft = fk.create(ttfBuf);
const font = opentype.parse(ttfBuf.buffer, {});

Glyph.prototype.getPath = function(x, y, fontSize, options, font) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;

    if (!options) { options = { }; }

    let xScale = options.xScale;
    let yScale = options.yScale;

    const commands = this.path.commands;
    const scale = 1;
    if (xScale === undefined) { xScale = scale; }
    if (yScale === undefined) { yScale = scale; }

    const p = new Path();
    for (let i = 0; i < commands.length; i += 1) {
        const cmd = commands[i];
        if (cmd.type === 'M') {
            p.moveTo(
                x + (cmd.x * xScale),
                y + (cmd.y * yScale),
            );
        } else if (cmd.type === 'L') {
            p.lineTo(
                x + (cmd.x * xScale),
                y + (cmd.y * yScale),
            );
        } else if (cmd.type === 'Q') {
            p.quadraticCurveTo(
                x + (cmd.x1 * xScale),
                y + (cmd.y1 * yScale),
                x + (cmd.x * xScale),
                y + (cmd.y * yScale),
            );
        } else if (cmd.type === 'C') {
            p.curveTo(
                x + (cmd.x1 * xScale),
                y + (cmd.y1 * yScale),
                x + (cmd.x2 * xScale),
                y + (cmd.y2 * yScale),
                x + (cmd.x * xScale),
                y + (cmd.y * yScale),
            );
        } else if (cmd.type === 'Z') {
            p.closePath();
        }
    }

    return p;
};

Font.prototype.forEachGlyph = function(text, x, y, fontSize, options, callback) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 72;
    options = Object.assign({}, this.defaultRenderOptions, options);
    const fontScale = 1;
    const glyphs = Array.isArray(text) ? Array.from(text) : this.stringToGlyphs(text, options);
    let kerningLookups;
    if (options.kerning) {
        const script = options.script || this.position.getDefaultScriptName();
        kerningLookups = this.position.getKerningTables(script, options.language);
    }
    for (let i = 0; i < glyphs.length; i += 1) {
        const glyph = glyphs[i];
        callback.call(this, glyph, x, y, fontSize, options);
        if (glyph.advanceWidth) {
            x += glyph.advanceWidth * fontScale;
        }

        if (options.kerning && i < glyphs.length - 1) {
            // We should apply position adjustment lookups in a more generic way.
            // Here we only use the xAdvance value.
            const kerningValue = kerningLookups ?
                this.position.getKerningValue(kerningLookups, glyph.index, glyphs[i + 1].index) :
                this.getKerningValue(glyph, glyphs[i + 1]);
            x += kerningValue * fontScale;
        }

        if (options.letterSpacing) {
            x += options.letterSpacing * fontSize;
        } else if (options.tracking) {
            x += (options.tracking / 1000) * fontSize;
        }
    }
    return x;
};

const todoGlyph = new Glyph({
    name: '.todo',
    unicode: 0,
    advanceWidth: 650,
    path: new Path()
});
todoGlyph.path.extend([{"type":"M","x":1388,"y":0},{"type":"L","x":92,"y":0},{"type":"L","x":92,"y":1480},{"type":"L","x":1388,"y":1480},{"type":"L","x":1388,"y":0},{"type":"Z"},{"type":"M","x":184,"y":92},{"type":"L","x":1296,"y":92},{"type":"L","x":1296,"y":1388},{"type":"L","x":184,"y":1388},{"type":"L","x":184,"y":92},{"type":"Z"}]);

const placeholderGlyph = new Glyph({
    name: '.placeholder',
    unicode: 0,
    advanceWidth: 650,
    path: new Path()
});
placeholderGlyph.path.extend([{"type":"M","x":236,"y":23},{"type":"L","x":236,"y":23},{"type":"Q","x1":236,"y1":37,"x":245.5,"y":47.5},{"type":"Q","x1":255,"y1":58,"x":269,"y":58},{"type":"L","x":269,"y":58},{"type":"Q","x1":283,"y1":58,"x":293,"y":47.5},{"type":"Q","x1":303,"y1":37,"x":303,"y":23},{"type":"L","x":303,"y":23},{"type":"Q","x1":303,"y1":9,"x":293,"y":-0.5},{"type":"Q","x1":283,"y1":-10,"x":269,"y":-10},{"type":"L","x":269,"y":-10},{"type":"Q","x1":255,"y1":-10,"x":245.5,"y":0},{"type":"Q","x1":236,"y1":10,"x":236,"y":23},{"type":"Z"},{"type":"M","x":236,"y":474},{"type":"L","x":236,"y":474},{"type":"Q","x1":236,"y1":489,"x":245.5,"y":498.5},{"type":"Q","x1":255,"y1":508,"x":269,"y":508},{"type":"L","x":269,"y":508},{"type":"Q","x1":283,"y1":508,"x":293,"y":498.5},{"type":"Q","x1":303,"y1":489,"x":303,"y":474},{"type":"L","x":303,"y":474},{"type":"Q","x1":303,"y1":460,"x":293,"y":451},{"type":"Q","x1":283,"y1":442,"x":269,"y":442},{"type":"L","x":269,"y":442},{"type":"Q","x1":255,"y1":442,"x":245.5,"y":451},{"type":"Q","x1":236,"y1":460,"x":236,"y":474},{"type":"Z"},{"type":"M","x":11,"y":249},{"type":"L","x":11,"y":249},{"type":"Q","x1":11,"y1":263,"x":20,"y":273},{"type":"Q","x1":29,"y1":283,"x":43,"y":283},{"type":"L","x":43,"y":283},{"type":"Q","x1":57,"y1":283,"x":67,"y":273},{"type":"Q","x1":77,"y1":263,"x":77,"y":249},{"type":"L","x":77,"y":249},{"type":"Q","x1":77,"y1":235,"x":67,"y":225.5},{"type":"Q","x1":57,"y1":216,"x":43,"y":216},{"type":"L","x":43,"y":216},{"type":"Q","x1":29,"y1":216,"x":20,"y":225.5},{"type":"Q","x1":11,"y1":235,"x":11,"y":249},{"type":"Z"},{"type":"M","x":461,"y":249},{"type":"L","x":461,"y":249},{"type":"Q","x1":461,"y1":263,"x":471,"y":273},{"type":"Q","x1":481,"y1":283,"x":495,"y":283},{"type":"L","x":495,"y":283},{"type":"Q","x1":509,"y1":283,"x":518.5,"y":273},{"type":"Q","x1":528,"y1":263,"x":528,"y":249},{"type":"L","x":528,"y":249},{"type":"Q","x1":528,"y1":235,"x":518.5,"y":225.5},{"type":"Q","x1":509,"y1":216,"x":495,"y":216},{"type":"L","x":495,"y":216},{"type":"Q","x1":481,"y1":216,"x":471,"y":225.5},{"type":"Q","x1":461,"y1":235,"x":461,"y":249},{"type":"Z"},{"type":"M","x":85,"y":400},{"type":"L","x":85,"y":400},{"type":"Q","x1":85,"y1":414,"x":94.5,"y":424},{"type":"Q","x1":104,"y1":434,"x":118,"y":434},{"type":"L","x":118,"y":434},{"type":"Q","x1":132,"y1":434,"x":142,"y":424},{"type":"Q","x1":152,"y1":414,"x":152,"y":400},{"type":"L","x":152,"y":400},{"type":"Q","x1":152,"y1":386,"x":142,"y":376.5},{"type":"Q","x1":132,"y1":367,"x":118,"y":367},{"type":"L","x":118,"y":367},{"type":"Q","x1":104,"y1":367,"x":94.5,"y":376.5},{"type":"Q","x1":85,"y1":386,"x":85,"y":400},{"type":"Z"},{"type":"M","x":85,"y":98},{"type":"L","x":85,"y":98},{"type":"Q","x1":85,"y1":113,"x":94.5,"y":122.5},{"type":"Q","x1":104,"y1":132,"x":118,"y":132},{"type":"L","x":118,"y":132},{"type":"Q","x1":132,"y1":132,"x":142,"y":122},{"type":"Q","x1":152,"y1":112,"x":152,"y":98},{"type":"L","x":152,"y":98},{"type":"Q","x1":152,"y1":84,"x":142,"y":75},{"type":"Q","x1":132,"y1":66,"x":118,"y":66},{"type":"L","x":118,"y":66},{"type":"Q","x1":104,"y1":66,"x":94.5,"y":75},{"type":"Q","x1":85,"y1":84,"x":85,"y":98},{"type":"Z"},{"type":"M","x":386,"y":98},{"type":"L","x":386,"y":98},{"type":"Q","x1":386,"y1":113,"x":396,"y":122.5},{"type":"Q","x1":406,"y1":132,"x":420,"y":132},{"type":"L","x":420,"y":132},{"type":"Q","x1":434,"y1":132,"x":443.5,"y":122.5},{"type":"Q","x1":453,"y1":113,"x":453,"y":98},{"type":"L","x":453,"y":98},{"type":"Q","x1":453,"y1":84,"x":443.5,"y":75},{"type":"Q","x1":434,"y1":66,"x":420,"y":66},{"type":"L","x":420,"y":66},{"type":"Q","x1":406,"y1":66,"x":396,"y":75},{"type":"Q","x1":386,"y1":84,"x":386,"y":98},{"type":"Z"},{"type":"M","x":386,"y":400},{"type":"L","x":386,"y":400},{"type":"Q","x1":386,"y1":414,"x":396,"y":424},{"type":"Q","x1":406,"y1":434,"x":420,"y":434},{"type":"L","x":420,"y":434},{"type":"Q","x1":434,"y1":434,"x":443.5,"y":424},{"type":"Q","x1":453,"y1":414,"x":453,"y":400},{"type":"L","x":453,"y":400},{"type":"Q","x1":453,"y1":386,"x":443.5,"y":376.5},{"type":"Q","x1":434,"y1":367,"x":420,"y":367},{"type":"L","x":420,"y":367},{"type":"Q","x1":406,"y1":367,"x":396,"y":376.5},{"type":"Q","x1":386,"y1":386,"x":386,"y":400},{"type":"Z"}]);

let glyphIndex = 0;
const glyphIndexMap = new Map();
const glyphCodepointMap = new Map();
const substitutions = []; // [ 'liga', { sub: [1, 1, 2], by: 5 } ]

const map2Glyphs = (map) => Object.values(map).map((text, i) => {
    const unicode = Object.keys(map)[i];
    const codepoints = Array.from(unicode).map(c => c.codePointAt(0));
    const [codepoint] = codepoints;
    const isLigature = codepoints.length > 1;

    let name = glyphNameMap[unicode];

    if (!name) {
        // throw new Error();
        name = String(`fakg${Math.round(Math.random() * 1000)}`);
    }

    const [g, path, x] = (() => {
        if (text) {
            const textChars = Array.from(text);
            const glyphs = textChars.map(c => {
                if (c === CONSONANT) {
                    return placeholderGlyph;
                }
                return font.charToGlyph(c);
            });

            const path = new Path();
            const x = font.forEachGlyph(glyphs, 0, 0, font.unitsPerEm, {}, function(glyph, gX, gY, gFontSize) {
                const gp = glyph.getPath(gX, gY, gFontSize, {}, font);
                path.extend(gp);
            });

            const g = glyphs.at(0);

            return [g, path, x]
        } else {
            const g = todoGlyph;

            return [g, g.path, g.advanceWidth];
        }
    })();

    if (isLigature) {
        if (!codepoints.every(cp => glyphCodepointMap.has(cp))) {
            throw new Error();
        }

        substitutions.push([
            'liga',
            {
                sub: codepoints.map(cp => glyphCodepointMap.get(cp)),
                by: glyphIndex,
            },
        ]);
    } else {
        glyphCodepointMap.set(codepoint, glyphIndex);
    }

    const xg = new Glyph({
        ...g,
        index: glyphIndex,
        name,
        path: path,
        unicode: isLigature ? undefined : codepoint,
        // unicodes: isLigature ? [] : codepoints,
        advanceWidth: x,
    });

    glyphIndexMap.set(xg.index, xg);

    glyphIndex++;

    return xg;
});

const notdefGlyph = new Glyph({
    index: glyphIndex++,
    name: '.notdef',
    unicode: 0,
    advanceWidth: 650,
    path: new Path(),
});
notdefGlyph.path.extend([{"type":"M","x":0,"y":0},{"type":"L","x":0,"y":699},{"type":"L","x":506,"y":699},{"type":"L","x":506,"y":0},{"type":"L","x":0,"y":0},{"type":"Z"},{"type":"M","x":253,"y":402},{"type":"L","x":415,"y":645},{"type":"L","x":91,"y":645},{"type":"L","x":253,"y":402},{"type":"Z"},{"type":"M","x":288,"y":350},{"type":"L","x":447,"y":112},{"type":"L","x":447,"y":588},{"type":"L","x":288,"y":350},{"type":"Z"},{"type":"M","x":91,"y":54},{"type":"L","x":415,"y":54},{"type":"L","x":253,"y":297},{"type":"L","x":91,"y":54},{"type":"Z"},{"type":"M","x":59,"y":588},{"type":"L","x":59,"y":112},{"type":"L","x":218,"y":350},{"type":"L","x":59,"y":588},{"type":"Z"}]);

glyphIndexMap.set(notdefGlyph.index, glyphIndexMap);

const newFont = new Font({
    familyName: font.names.fontFamily.en,
    styleName: font.names.fontSubfamily.en,
    unitsPerEm: font.unitsPerEm,
    ascender: font.ascender,
    descender: font.descender,
    glyphs: [
        // Not Defined
        notdefGlyph,
        // Special
        ...map2Glyphs(glyphMap.special),
        // Vowels
        ...map2Glyphs(glyphMap.vowels),
        // Consonants::base
        ...map2Glyphs(glyphMap.consonants.base),
        // Consonants::composite::template
        ...map2Glyphs(glyphMap.consonants.composite.template),
        // Consonants::composite::extra
        ...map2Glyphs(glyphMap.consonants.composite.extra),
        // Consonants::composite::[templated]
        ...(({base, composite}) => {
            const syllabary = composite.syllabary;

            return Object.entries(composite.template).map(([mxr, tmpl]) => {
                const RES = {};

                const smp = syllabary[mxr] || {};

                for (const [k, v] of Object.entries(base)) {
                    const t = k + mxr;
                    let mrz = smp[t];
                    if (mrz === undefined) {
                        mrz = tmpl.map(x => (x === CONSONANT) ? v : x).join('');
                    }
                    RES[t] = mrz;
                }

                return map2Glyphs(RES);
            }).reduce((a, b) => a.concat(b));
        })(glyphMap.consonants),

        // Consonants::extra
        ...map2Glyphs(glyphMap.consonants.extra),
    ],
});

substitutions.forEach(([feature, sub]) => newFont.substitution.add(feature, sub));

const outData = Buffer.from(
    new Uint8Array(
        newFont.toArrayBuffer()
    )
);

fs.writeFileSync(
    path.resolve(FONTS_DIR, 'tamilbible.unicode.ttf'),
    outData,
)