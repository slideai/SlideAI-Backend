const robots = {
    text: require('../Robots/Text'),
    image: require('../Robots/Image'),
    powerPoint: require('../Robots/PowerPoint')
}

const controller = {};

controller.post = async (req, res) => {
    const recivedViaFrontEnd = {lang,author,searchTerm,font,prefix,numberOsSlides } = req.body
    console.log(recivedViaFrontEnd)

    //text robot
    const sourceContentOriginal = await robots.text.fetchContentFromWikipedia(
            recivedViaFrontEnd.searchTerm,
            recivedViaFrontEnd.lang) 
    const sourceContentSanitized = await robots.text.sanitizeContent(
            sourceContentOriginal
        )
    const contentBreakedIntoSentences = await robots.text.breakContentIntoSentences(
            sourceContentSanitized
        )
    const selectSentencesByLimit = await robots.text.limitMaximumSentences(
        contentBreakedIntoSentences,numberOsSlides
    )
    const sentences = await robots.text.fetchKeywordsOfAllSentences(
        selectSentencesByLimit
    )
    console.log(sentences)


    //image robot
    const fetchedImagesOfAllSentences = await robots.image.fetchImagesOfAllSentences(
        recivedViaFrontEnd.searchTerm,
        sentences,
        recivedViaFrontEnd.lang
    )
    const titlesOfSentences = await robots.image.fetchSentencesTitles(
        recivedViaFrontEnd.searchTerm,
        fetchedImagesOfAllSentences,
        recivedViaFrontEnd.lang
    )
    const downloadedImages = await robots.image.downloadAllImages(
        titlesOfSentences
    )
    console.log(downloadedImages)



    //powerPoint robot
    robots.powerPoint.start(recivedViaFrontEnd,sentences,downloadedImages)
    

    return res.json("Terminou")
}

module.exports = controller;