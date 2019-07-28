module.exports = {
    async test(req,res){
        console.log("entrou no index")
        return res.json('aa')
    },
    async startPresentation(req,res){
        console.log(req.body)
        const recivedViaFrontEnd = {lang,author,searchTerm,font,prefix,maximumSentences } = req.body
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
        const sentences = await robots.text.breakContentIntoSentences(
                sourceContentSanitized
            )
         console.log(sourceContentOriginal)
         console.log(sourceContentSanitized)
         console.log(sentences)

        return res.json("Terminou")
    }
};