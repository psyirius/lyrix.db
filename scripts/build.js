import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import XML from 'xmlbuilder2'
import glob from 'fast-glob'
import { unified } from 'unified'
import remarkFrontmatter from 'remark-frontmatter'
import remarkStringify from 'remark-stringify'
import remarkParse from 'remark-parse'
import remarkBreaks from 'remark-breaks'

// where the *.song files are
const SONG_SOURCE_DIR = path.resolve(import.meta.dirname, '..', 'source');

// to fix fast-glob's posix-style path processing
const posixPath = (p) => p.split(path.sep).join(path.posix.sep);

const parser = unified()
  .use(remarkParse)
  .use(remarkBreaks)
  .use(remarkStringify)
  .use(remarkFrontmatter, [
    { type: 'meta', marker: '-' }, // meta is in yaml
  ]);

  // enumerate all *.song files under the source dir
const songFiles = glob.sync([
  posixPath(path.join(SONG_SOURCE_DIR, '**/*.song'))
], {
  dot: true,
  absolute: true,
});

const songs = [];

for (const filename of songFiles) {
  const rp = path.relative(SONG_SOURCE_DIR, filename);

  console.log('Processing:', rp);

  const doc = fs.readFileSync(filename, 'utf-8')

  // root: mdast
  const root = parser.parse(doc)

  const metaNode = root.children.find(e => e.type === 'meta')
  if (!metaNode) {
    throw new Error("Missing item: Metadata!")
  }
  const metadata = YAML.parse(metaNode.value)

  // console.log('Metadata:', metadata)

  const paragraphs = root.children.filter(e => e.type === 'paragraph')

  const slides = paragraphs.map(e => {
    return e.children.map(e => {
      switch (e.type) {
        case 'break': return '<br>'
        case 'text': return e.value
        default:
          throw new Error(`Unknown node: ${e.type}`)
      }
    }).join('')
  })

  songs.push({ metadata, slides })
}

const vvSongDB = XML.create({ version: '1.0', encoding: 'UTF-8' })
  .ele('songDB');

vvSongDB.ele('type').txt('XMLsong');
vvSongDB.ele('disclaimer').txt('...');

songs.forEach(({ metadata, slides }) => {
  const slidesSet = slides.join('<slide>');

  vvSongDB.ele('song')
    .ele('name').txt(metadata['title-en']).up()
    .ele('name2').dat(metadata['title']).up()
    .ele('category').txt(metadata['category']).up()
    .ele('font').txt(metadata['font']).up()
    .ele('font2').txt(metadata['font-alt']).up()
    .ele('bkgnd').txt('null').up()
    .ele('yvideo').txt('').up()
    .ele('timestamp').txt('5/28/2020  17:34').up()
    .ele('key').txt('').up()
    .ele('copyright').txt(metadata['copyright']).up()
    .ele('notes').txt('').up()
    .ele('tags').dat(metadata['tags'].join(', ')).up()
    .ele('slideseq').dat('').up()
    .ele('subcat').dat(metadata['serial']).up()  // wierd: subcat is used as song number
    .ele('slide').dat(slidesSet).up()
    .ele('slide2').dat(slides.map(e => '').join('<slide>')).up()
})

// convert the XML tree to string
const vvSongDBXml = vvSongDB.end({
  format: 'xml',
  prettyPrint: true,
  // allowEmptyTags: true,
});

// console.log(vvSongDBXml);

fs.writeFileSync("dist/vv-songs.xml", vvSongDBXml);