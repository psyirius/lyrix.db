import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios'
import * as cheerio from 'cheerio'
import _ from 'lodash'
import he from 'html-entities'
import PocketBase from 'pocketbase';
import * as pbf from "@nedpals/pbf";

const pb = new PocketBase('http://127.0.0.1:8090');

const BASE_URL = 'https://tamilchristiansongs.org'

// GET: https://tamilchristiansongs.org/wp-json/wp/v2/
// GET: https://tamilchristiansongs.org/wp-json/wp/v2/posts/

const client = axios.create({
    baseURL: BASE_URL,
    // timeout: 1000,
    headers: {
        // 'X-Custom-Header': 'foobar',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    },
});

function wp_json_GET(url: string, full = false) {
    if (!full) {
        url = path.join(`/wp-json/`, url).replace(/[\\/]/g, '/')
    }

    console.log('GET:', url)

    return new Promise((resolve, reject) => {
        client.get(url).then((response) => {
            resolve({
                data: response.data,
                headers: response.headers,
                status: response.status,
                statusText: response.statusText,
                config: response.config,
            })
        }).catch((error) => {
            reject(error)
        });
    });
}

function getUser(id: number) {
    return wp_json_GET(`/wp/v2/users/${id}`)
}

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
                url,
                slides: {
                    tamil: getSlides(tamilLyrics),
                    roman: getSlides(tanglishLyrics),
                },
                published: new Date(datePublished),
                modified: new Date(dateModified),
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

// const dumpFN = path.resolve(import.meta.dirname, '../../etc/lyric-dumps/tcs-org.dump.json')
// fs.mkdirSync(path.dirname(dumpFN), { recursive: true })
//
// const cache = new Map<string, any>();
// if (fs.existsSync(dumpFN)) {
//     const data = fs.readFileSync(dumpFN, 'utf-8')
//     const json = JSON.parse(data)
//     for (const item of json) {
//         cache.set(new URL(item.url).href, item)
//     }
// }
//
// console.log(cache.size)
//
// function dumpCache() {
//     const _data = Array.from(cache.values())
//     const data = _.sortBy(
//         _.uniqBy(_data, (item) => item.id),
//         (item) => item.id
//     );
//     fs.writeFileSync(dumpFN, JSON.stringify(data, null, 2))
// }

// getByArtist('david/page/2').then(async (songs) => {
//     console.log(songs.length)
//
//     const tasks: Promise<void>[] = []
//
//     for (const song of songs) {
//         const surl = new URL(song.url).href;
//         if (!cache.has(surl)) {
//             const task = getSongLyrics(song.url).then((data: any) => {
//                 console.log(data.id);
//                 cache.set(surl, data)
//             })
//             tasks.push(task);
//         }
//     }
//
//     console.log(tasks.length)
//
//     Promise.all(tasks).then(() => {
//         dumpCache()
//     })
// });

function parseNavLinkHeader(header: string) {
    const res: Record<string, string> = {}

    const re = /^<([^>]+)>; rel="([^"]+)"$/

    header.split(',').forEach((link) => {
        const [_, url, rel] = link.trim().match(re)!
        res[rel] = url;
    })

    return res
}

const __tasks__: Promise<any>[] = []

const _authors = new Map<number, any>()

function getAuthor(id: number) {
    if (_authors.has(id)) {
        return Promise.resolve(_authors.get(id))
    }

    return wp_json_GET(`/wp/v2/users/${id}`).then(({data}: any) => {
        _authors.set(id, data)
        return data
    })
}

const _tags = new Map<number, any>()

function getTag(id: number) {
    if (_tags.has(id)) {
        return Promise.resolve(_tags.get(id))
    }

    return wp_json_GET(`/wp/v2/tags/${id}`).then(({data}: any) => {
        _tags.set(id, data)
        return data
    })
}

const _categories = new Map<number, any>()

function getCategory(id: number) {
    if (_categories.has(id)) {
        return Promise.resolve(_categories.get(id))
    }

    return wp_json_GET(`/wp/v2/categories/${id}`).then(({data}: any) => {
        _categories.set(id, data)
        return data
    })
}

const _albums = new Map<number, any>()

function getAlbum(id: number) {
    if (_albums.has(id)) {
        return Promise.resolve(_albums.get(id))
    }

    return wp_json_GET(`/wp/v2/albums/${id}`).then(({data}: any) => {
        _albums.set(id, data)
        return data
    })
}

const _artists = new Map<number, any>()

function getArtist(id: number) {
    if (_artists.has(id)) {
        return Promise.resolve(_artists.get(id))
    }

    return wp_json_GET(`/wp/v2/artist/${id}`).then(({data}: any) => {
        _artists.set(id, data)
        return data
    })
}


async function parseLyrics(data: any) {
    const {
        id,
        slug,
        date,
        date_gmt,
        modified,
        modified_gmt,
        link,
        author: authorId,
        format,
        class_list,
        artist: artistIds, // id
        tags: tagIds, // id[]
        categories: categoryIds, // id[]
        album: albumIds, // id
        yoast_head_json,
        title,
        content,
        excerpt, // no line breaks
    } = data;

    const author = await getAuthor(authorId)
    const albums = await Promise.all(albumIds.map(getAlbum))
    const artists = await Promise.all(artistIds.map(getArtist))
    const tags = await Promise.all(tagIds.map(getTag))
    const categories = await Promise.all(categoryIds.map(getCategory))

    console.log(data.id, data.title.rendered)
}

function parseLyricsPage(data: any) {
    for (const lyrics of data) {
        parseLyrics(lyrics)
    }
}

function dumpLyricsPage(url: string, sub = false): Promise<void> {
    return wp_json_GET(url, sub)
        .then(async ({data, headers}: any) => {
            const wpTotal = headers.get('X-Wp-Total');
            const wpTotalPages = headers.get('X-Wp-Totalpages');
            const navLinks = parseNavLinkHeader(headers.get('Link'));

            parseLyricsPage(data);

            if (navLinks.next) {
                __tasks__.push(
                    dumpLyricsPage(navLinks.next, true)
                )
            }
        })
}

// const x = dumpLyricsPage('/wp/v2/lyrics');

// ---------------------------------------------------------------------------------------------------------------------

function dumpPage(url: string, onPageData: (records: any[]) => void | Promise<void>, sub = false): Promise<void> {
    return wp_json_GET(url, sub)
        .then(async ({data, headers}: any) => {
            const wpTotal = headers.get('X-Wp-Total');
            const wpTotalPages = headers.get('X-Wp-Totalpages');
            const navLinks = parseNavLinkHeader(headers.get('Link'));

            await onPageData(data);

            if (navLinks.next) {
                await dumpPage(navLinks.next, onPageData, true)
            }
        })
}

// // User / Author
// ;(async () => {
//     // authenticate
//     const su = await pb.collection('_superusers').authWithPassword('admin@tcs.org', 'ANrdoTB2tRRzMIH');
//
//     console.log('Authenticated:', su.record.email);
//
//     await dumpPage('/wp/v2/users', async (data: any[]) => {
//         for (const user of data) {
//             const data = {
//                 id: String(user.id),
//                 link: user.link,
//                 slug: user.slug,
//                 name: user.name,
//                 admin: user.is_super_admin,
//             };
//
//             const record = await pb.collection('authors').create(data);
//
//             console.log(record);
//         }
//     });
//
//     pb.authStore.clear();
// })();

// // Artist
// ;(async () => {
//     // authenticate
//     const su = await pb.collection('_superusers').authWithPassword('admin@tcs.org', 'ANrdoTB2tRRzMIH');
//
//     console.log('Authenticated:', su.record.email);
//
//     await dumpPage('/wp/v2/artist', async (data: any[]) => {
//         for (const user of data) {
//             const data = {
//                 id: String(user.id),
//                 link: user.link,
//                 slug: user.slug,
//                 name: user.name,
//                 count: user.count,
//             };
//
//             const record = await pb.collection('artists').create(data);
//
//             console.log(record);
//         }
//     });
//
//     pb.authStore.clear();
// })();

// // Album
// ;(async () => {
//     // authenticate
//     const su = await pb.collection('_superusers').authWithPassword('admin@tcs.org', 'ANrdoTB2tRRzMIH');
//
//     console.log('Authenticated:', su.record.email);
//
//     await dumpPage('/wp/v2/album', async (data: any[]) => {
//         for (const user of data) {
//             const data = {
//                 id: String(user.id),
//                 link: user.link,
//                 slug: user.slug,
//                 name: user.name,
//                 count: user.count,
//             };
//
//             const record = await pb.collection('albums').create(data);
//
//             console.log(record);
//         }
//     });
//
//     pb.authStore.clear();
// })();

// // Tag
// ;(async () => {
//     // authenticate
//     const su = await pb.collection('_superusers').authWithPassword('admin@tcs.org', 'ANrdoTB2tRRzMIH');
//
//     console.log('Authenticated:', su.record.email);
//
//     await dumpPage('/wp/v2/tags', async (data: any[]) => {
//         for (const user of data) {
//             const data = {
//                 id: String(user.id),
//                 link: user.link,
//                 slug: user.slug,
//                 name: user.name,
//                 count: user.count,
//             };
//
//             const record = await pb.collection('tags').create(data);
//
//             console.log(record);
//         }
//     });
//
//     pb.authStore.clear();
// })();

// // Category
// ;(async () => {
//     // authenticate
//     const su = await pb.collection('_superusers').authWithPassword('admin@tcs.org', 'ANrdoTB2tRRzMIH');
//
//     console.log('Authenticated:', su.record.email);
//
//     await dumpPage('/wp/v2/categories', async (data: any[]) => {
//         for (const user of data) {
//             const data = {
//                 id: String(user.id),
//                 link: user.link,
//                 slug: user.slug,
//                 name: user.name,
//                 count: user.count,
//             };
//
//             const record = await pb.collection('categories').create(data);
//
//             console.log(record);
//         }
//     });
//
//     pb.authStore.clear();
// })();

// // Scale
// ;(async () => {
//     // authenticate
//     const su = await pb.collection('_superusers').authWithPassword('admin@tcs.org', 'ANrdoTB2tRRzMIH');
//
//     console.log('Authenticated:', su.record.email);
//
//     await dumpPage('/wp/v2/scale', async (data: any[]) => {
//         for (const user of data) {
//             const data = {
//                 id: String(user.id),
//                 link: user.link,
//                 slug: user.slug,
//                 name: user.name,
//                 count: user.count,
//             };
//
//             const record = await pb.collection('scales').create(data);
//
//             console.log(record);
//         }
//     });
//
//     pb.authStore.clear();
// })();

// // Pattern
// ;(async () => {
//     // authenticate
//     const su = await pb.collection('_superusers').authWithPassword('admin@tcs.org', 'ANrdoTB2tRRzMIH');
//
//     console.log('Authenticated:', su.record.email);
//
//     await dumpPage('/wp/v2/pattern', async (data: any[]) => {
//         for (const user of data) {
//             const data = {
//                 id: String(user.id),
//                 link: user.link,
//                 slug: user.slug,
//                 name: user.name,
//                 count: user.count,
//             };
//
//             const record = await pb.collection('patterns').create(data);
//
//             console.log(record);
//         }
//     });
//
//     pb.authStore.clear();
// })();

// // Genre / Style
// ;(async () => {
//     // authenticate
//     const su = await pb.collection('_superusers').authWithPassword('admin@tcs.org', 'ANrdoTB2tRRzMIH');
//
//     console.log('Authenticated:', su.record.email);
//
//     await dumpPage('/wp/v2/style', async (data: any[]) => {
//         for (const user of data) {
//             const data = {
//                 id: String(user.id),
//                 link: user.link,
//                 slug: user.slug,
//                 name: user.name,
//                 count: user.count,
//             };
//
//             const record = await pb.collection('genres').create(data);
//
//             console.log(record);
//         }
//     });
//
//     pb.authStore.clear();
// })();

// // Lyrics
// ;(async () => {
//     // authenticate
//     const su = await pb.collection('_superusers').authWithPassword('admin@tcs.org', 'ANrdoTB2tRRzMIH');
//
//     console.log('Authenticated:', su.record.email);
//
//     await dumpPage('/wp/v2/lyrics?page=1', async (data: any[]) => {
//         for (const lyr of data) {
//             console.log('CREATING:', lyr.id, lyr.title.rendered);
//
//             const data = {
//                 id: String(lyr.id),
//                 link: lyr.link,
//                 slug: lyr.slug,
//                 title: he.decode(lyr.title.rendered),
//                 content: lyr.content.rendered,
//                 categories: lyr.categories.map(String),
//                 tags: lyr.tags.map(String),
//                 artists: lyr.artist.map(String),
//                 albums: lyr.album.map(String),
//                 author: lyr.author ? String(lyr.author) : undefined,
//                 published: new Date(lyr.date_gmt).toISOString(),
//                 modified: new Date(lyr.modified_gmt).toISOString(),
//             };
//
//             // delete existing
//             try {
//                 await pb.collection('lyrics').delete(data.id);
//             } catch (e) {
//                 // ignore
//             }
//
//             const record = await pb.collection('lyrics').create(data);
//
//             console.log(record);
//         }
//     });
//
//     pb.authStore.clear();
// })();

// // Chords
// ;(async () => {
//     // authenticate
//     const su = await pb.collection('_superusers').authWithPassword('admin@tcs.org', 'ANrdoTB2tRRzMIH');
//
//     console.log('Authenticated:', su.record.email);
//
//     await dumpPage('/wp/v2/chords?page=1', async (data: any[]) => {
//         for (const lyr of data) {
//             console.log('CREATING:', lyr.id, lyr.title.rendered);
//
//             const data = {
//                 id: String(lyr.id),
//                 title: he.decode(lyr.title.rendered),
//                 slug: lyr.slug,
//                 link: lyr.link,
//                 content: lyr.content.rendered,
//                 categories: lyr.categories.map(String),
//                 tags: lyr.tags.map(String),
//                 artists: lyr.artist.map(String),
//                 albums: lyr.album.map(String),
//                 scales: lyr.scale.map(String),
//                 patterns: lyr.pattern.map(String),
//                 genres: lyr.style.map(String),
//                 published: new Date(lyr.date_gmt).toISOString(),
//                 modified: new Date(lyr.modified_gmt).toISOString(),
//             };
//
//             // // delete existing
//             // try {
//             //     await pb.collection('chords').delete(data.id);
//             // } catch (e) {
//             //     // ignore
//             // }
//
//             const record = await pb.collection('chords').create(data);
//
//             console.log(record);
//         }
//     });
//
//     pb.authStore.clear();
// })();