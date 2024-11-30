import axios from 'axios'
import * as cheerio from 'cheerio'

const BASE_URL = 'https://tamilchristiansongs.org'

const client = axios.create({
    baseURL: BASE_URL,
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
});

async function getByArtist() {
    client.get('/artist/wesley-maxwell/').then((response) => {
        const $ = cheerio.load(response.data)

        const artistName = $('.page-title > span').text()

        const songsList = $('#main > p')

        for (const element of songsList) {
            const songTitle = $(element).text().trim()
            const [songTitleTa, songTitleEn] = songTitle.split(' - ')

            const songUrl = $(element).find('a').attr('href')!

            // Get song lyrics
            axios.get(songUrl).then((response) => {
                const $ = cheerio.load(response.data)

                const tamilLyrics = $('#tamiltext > p')
                // const tanglishLyrics = $('#roman_tamiltext > p')
                // const tamilEnglishLyrics = $('#merge_lyrics > p')

                const slides = []

                for (const slide of tamilLyrics) {
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

                console.log(slides)
            });
        }
    })
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

searchSong('um az').then((songs) => {
    console.log(songs)
})