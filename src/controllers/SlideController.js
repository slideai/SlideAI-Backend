module.exports = {
    async test(req,res){
        console.log("entrou no index")
        return res.json('aa')
    },
    async startPresentation(req,res){
        const recivedViaFrontEnd = {lang,author,searchTerm,font,prefix,numberOsSlides } = req.body
        const robots = {
            text: require('./TextController')
        }
        console.log(recivedViaFrontEnd)
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

        return res.json("Terminou")
    }
};