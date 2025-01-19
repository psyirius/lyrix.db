import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios'
import * as cheerio from 'cheerio'
import _ from 'lodash'

const BASE_URL = 'https://tamilchristiansongs.org'

const client = axios.create({
    baseURL: BASE_URL,
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
});

function getSongLyrics(url: string) {
    function getSlides(el: any) {
        const slides = []

        for (const slide of el) {
            const lines = [];

            for (const line of slide.children) {
                switch (line.type) {
                    case 'text': {
                        lines.push(line.data.trim())
                        break
                    }
                    case 'tag': {
                        break
                    }
                    default: {
                        throw new Error(`Unknown type: ${line.type}`)
                    }
                }
            }

            slides.push(lines)
        }

        return slides
    }

    function getPostId(eid?: string) {
        const re = /post-(\d+)/
        const res = eid?.match(re)![1]
        return res ? parseInt(res) : null
    }

    return new Promise((resolve, reject) => {
        axios.get(url).then((response) => {
            const $ = cheerio.load(response.data)

            const tagKnownClasses = [
                'lyrics',
                'type-lyrics',
                'status-publish',
                'format-standard',
                'hentry',
            ]

            const article = $('article')
            const post = article.attr('id')

            const tags = (article.attr('class')?.split(' ') || []).filter((cls) => !tagKnownClasses.includes(cls) && cls !== post)

            const title = $('h1.entry-title').text()

            const _ysg = $('script.yoast-schema-graph[type="application/ld+json"]').text()
            const ysg = JSON.parse(_ysg);

            const _webpageGraph = ysg['@graph'].find((graph: any) => graph['@type'] === 'WebPage')
            const {url, datePublished, dateModified} = _webpageGraph;

            // Tamil Only
            const tamilLyrics = $('#tamiltext > p')

            // Tanglish Only
            const tanglishLyrics = $('#tamilroman > #roman_tamiltext > p')

            // Tamil + Tanglish: merged using client side JS
            // const tamilEnglishLyrics = $('#merge_lyrics > p')

            resolve({
                id: getPostId(post),
                title,
                tags,
                slides: {
                    tamil: getSlides(tamilLyrics),
                    roman: getSlides(tanglishLyrics),
                },
                url,
                datePublished: new Date(datePublished),
                dateModified: new Date(dateModified),
            })
        }).catch((error) => {
            reject(error)
        });
    })
}

async function getByArtist(artist: string = 'wesley-maxwell') {
    const response = await client.get(`/artist/${artist}/`);

    const $ = cheerio.load(response.data)

    const songsList = $('#main > p')

    const songs = []

    for (const element of songsList) {
        const songTitle = $(element).text().trim()
        const [songTitleTa, songTitleEn] = songTitle.split(' - ')

        const songUrl = $(element).find('a').attr('href')!

        songs.push({ title: songTitle, url: songUrl })
    }

    return songs
}

async function getByAlphabet(alphabet: string) {
    const response = await client.get(`/${alphabet}/`);

    const $ = cheerio.load(response.data)

    const songsList = $('#main > p')

    const songs = []

    for (const element of songsList) {
        const songTitle = $(element).text().trim()
        const [songTitleTa, songTitleEn] = songTitle.split(' - ')

        const songUrl = $(element).find('a').attr('href')!

        songs.push({ title: songTitle, url: songUrl })
    }

    return songs
}

async function searchSong(query: string) {
    const response = await client.postForm('/wp/wp-admin/admin-ajax.php', {
        action: 'data_fetch',
        keyword: query,
        lang: ''
    })

    const $ = cheerio.load(response.data)

    const results = $('.toast-body > ul > li')

    const songs = []

    for (const element of results) {
        const title = $(element).text().trim()
        const url = $(element).find('a').attr('href')!

        songs.push({ title, url })
    }

    return songs
}

// getByAlphabet('a');

const dumpFN = path.resolve(import.meta.dirname, '../../etc/lyric-dumps/tcs-org.dump.json')
fs.mkdirSync(path.dirname(dumpFN), { recursive: true })

const cache = new Map<string, any>();
if (fs.existsSync(dumpFN)) {
    const data = fs.readFileSync(dumpFN, 'utf-8')
    const json = JSON.parse(data)
    for (const item of json) {
        cache.set(new URL(item.url).href, item)
    }
}

console.log(cache.size)

function dumpCache() {
    const _data = Array.from(cache.values())
    const data = _.uniqBy(_data, (item) => item.id);
    fs.writeFileSync(dumpFN, JSON.stringify(data, null, 2))
}

getByArtist('gersson-edinbaro/page/2').then(async (songs) => {
    console.log(songs.length)

    const tasks: Promise<void>[] = []

    for (const song of songs) {
        const surl = new URL(song.url).href;
        if (!cache.has(surl)) {
            const task = getSongLyrics(song.url).then((data: any) => {
                console.log(data.id);
                cache.set(surl, data)
            })
            tasks.push(task);
        }
    }

    console.log(tasks.length)

    Promise.all(tasks).then(() => {
        dumpCache()
    })
})