const algorithmia = require('algorithmia');
const algorithmiaApiKey = require('../../../credentials/algorithmia.json').apiKey;
const sentenceBoundaryDetection = require('sbd');

const watsonApiKey = require('../../../credentials/watson-nlu.json').apikey;
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
 
const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: watsonApiKey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

class Robot {

  start(content) {
    return new Promise(async (next, reject) => {
      try {
        content.sourceContentOriginal = await this.fetchContentFromWikipedia(content.searchTerm, content.lang);
        content.sourceContentSanitized = this.sanitizeContent(content.sourceContentOriginal);
        content.sentences = this.breakContentIntoSentences(content.sourceContentSanitized);
        content.sentences = this.limitMaximumSentences(content.sentences, content.numberOfSlides);
        content.sentences = await this.fetchKeywordsOfAllSentences(content.sentences);
        next(content);
      } catch(error) {
        reject(error.message);
      }
    });
  }

  fetchContentFromWikipedia(articleName, lang) {
    return new Promise(async (next, reject) => {
      try {
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2');

        const wikipediaResponse = await wikipediaAlgorithm.pipe({
          lang,
          articleName
        });
        const wikipediaContent = wikipediaResponse.get();

        next(wikipediaContent.content);
      } catch(error) {
        reject(error.message);
      }
    });
  }

  sanitizeContent(sourceContentOriginal) {
    const withoutBlankLinesAndMarkdown = this.removeBlankLinesAndMarkdown(sourceContentOriginal);
    const withoutDatesInParentheses = this.removeDatesInParentheses(withoutBlankLinesAndMarkdown);
    return withoutDatesInParentheses;
  }

  removeDatesInParentheses(text) {
    return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ');
  }

  removeBlankLinesAndMarkdown(text) {
    const allLines = text.split('\n');

    const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
      if (line.trim().length === 0 || line.trim().startsWith('='))
        return false;

        return true;
    })

      return withoutBlankLinesAndMarkdown.join(' ')
  }

  breakContentIntoSentences(sourceContentSanitized) {
    const contentSentences = [];
    const sentences = sentenceBoundaryDetection.sentences(sourceContentSanitized);

    sentences.forEach((sentence) => {
      contentSentences.push({
        text: sentence,
        keywords: [],
        images: []
      })
    })

    return contentSentences;
  }

  limitMaximumSentences(sentences, maximumSentences) {
    return sentences.slice(0, maximumSentences);
  }

  async fetchKeywordsOfAllSentences(sentences) {
    for (const sentence of sentences) {
      console.log(`> [text-robot] Sentence: "${sentence.text}"`);
      sentence.keywords = await this.fetchWatsonAndReturnKeywords(sentence.text);
      console.log(`> [text-robot] Keywords: ${sentence.keywords.join(', ')}\n`);
    }
    return sentences;
  }

  async fetchWatsonAndReturnKeywords(sentence) {
    return new Promise((resolve, reject) => {
      nlu.analyze({
        text: sentence,
        features: {
          keywords: {}
        }
      }, (error, response) => {
        if (error)
          return reject(error);

        const keywords = response.keywords.map(keyword => keyword.text);

        resolve(keywords);
      })
    })
  }

}

module.exports = new Robot();