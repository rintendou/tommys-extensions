import {
    Chapter,
    ChapterDetails,
    Tag,
    HomeSection,
    LanguageCode,
    Manga,
    MangaStatus,
    MangaTile,
    TagSection,
    HomeSectionType
} from 'paperback-extensions-common'

import entities = require('entities')

export interface UpdatedManga {
    id: string[];
    loadMore: boolean;
}

// Helper functions
const decodeHTMLEntity = (str: string): string => {
    return entities.decodeHTML(str)
}

const parseDate = (date: string): Date => {
    date = date.toUpperCase()
    let time: Date
    const number = Number((/\d*/.exec(date) ?? [])[0])
    if (date.includes('LESS THAN AN HOUR') || date.includes('JUST NOW')) {
        time = new Date(Date.now())
    } else if (date.includes('YEAR') || date.includes('YEARS')) {
        time = new Date(Date.now() - (number * 31556952000))
    } else if (date.includes('MONTH') || date.includes('MONTHS')) {
        time = new Date(Date.now() - (number * 2592000000))
    } else if (date.includes('WEEK') || date.includes('WEEKS')) {
        time = new Date(Date.now() - (number * 604800000))
    } else if (date.includes('YESTERDAY')) {
        time = new Date(Date.now() - 86400000)
    } else if (date.includes('DAY') || date.includes('DAYS')) {
        time = new Date(Date.now() - (number * 86400000))
    } else if (date.includes('HOUR') || date.includes('HOURS')) {
        time = new Date(Date.now() - (number * 3600000))
    } else if (date.includes('MINUTE') || date.includes('MINUTES')) {
        time = new Date(Date.now() - (number * 60000))
    } else if (date.includes('SECOND') || date.includes('SECONDS')) {
        time = new Date(Date.now() - (number * 1000))
    } else {
        const split = date.split('-')
        time = new Date(Number(split[2]), Number(split[0]) - 1, Number(split[1]))
    }
    return time
}

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const titles: string[] = []
    titles.push(decodeHTMLEntity($('h4.display5').text().trim()))

    /* 
        There are no alternative titles that I can see of right now
    */
    // const altTitles = $('div.alt-name', 'div.desc').text().trim().split(',')
    // for (const title of altTitles) {
    //     titles.push(decodeHTMLEntity(title))
    // }
    
    const regexedImage = $('div.Cover__MediaContent-sc-i96fzk-1').attr('style')?.match(/background-image:url\('([^']+)'\)/) ?? ''
    let image = 'https://i.imgur.com/GYUxEX8.png'

    if (regexedImage && typeof regexedImage == 'string') {
        image = regexedImage[0]
    }
    // const author = $('a', $('div.info div.item:contains(\'Author\')')).text().trim()

    const arrayTags: Tag[] = []
    for (const tag of $('span', 'div.Info__GenresWrapper-sc-sr6n5a-3').toArray()) {
        const label = $(tag).text().trim()
        const id = encodeURI($(tag).text().trim())

        if (!id || !label) continue

        arrayTags.push({ id: id, label: label })
    }

    const tagSections: TagSection[] = [createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => createTag(x)) })]

    const description = decodeHTMLEntity($('div.Description').text().trim() ?? 'No description available')

    const rawStatus = $('div.item-date', 'div.no-wrap').text().trim().replace(/\s/g, '') ?? ''
    let status = MangaStatus.ONGOING
    switch (rawStatus.toUpperCase()) {
        case 'ONGOING':
            status = MangaStatus.ONGOING
            break
        case 'COMPLETED':
            status = MangaStatus.COMPLETED
            break
        default:
            status = MangaStatus.ONGOING
            break
    }

    return createManga({
        id: mangaId,
        titles: titles,
        image: image,
        status: status,
        // author: author,
        // artist: author,
        tags: tagSections,
        desc: description,
    })
} 

export const parseChapters = () => {

}

export const parseChapterDetails = () => {

}

export const parseHomeSections = () => {

}

export const parseViewMore = () => {

}

export const parseTags = () => {

}

export const parseSearch = () => {

}

export const isLastPage = () => {

}
