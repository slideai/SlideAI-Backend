require ('dotenv').config()

const imageDownloader = require('image-downloader');
const google = require('googleapis').google;
const customSearch = google.customsearch('v1');
const goolgeSearchApiKey = process.env.GOOGLE_SEARCH_API;
const googleSearchEngineId = process.env.GOOLGE_SEARCH_ENGINE_ID;

console.log("API KEY:"+goolgeSearchApiKey+"\n"+"EngineID:"+googleSearchEngineId);

class Robot {
  start(content) {
    return new Promise(async (next, reject) => {
    try {
      const { searchTerm, sentences, lang } = content;
      content.sentences = await this.fetchImagesOfAllSentences(searchTerm, sentences, lang);
      content.sentences = this.fetchSentencesTitles(searchTerm, content.sentences, lang);
      content.downloadedImages = await this.downloadAllImages(content.sentences, content.id);
      next(content);
    } catch(error) {
      reject(error.message);
    }
    });
  }

  fetchImagesOfAllSentences(searchTerm, sentences, lang) {
    return new Promise(async (next, reject) => {
      try {
        for (let sentenceIndex = 0; sentenceIndex < sentences.length; sentenceIndex++) {
          let query;

          if (!sentenceIndex)
            query = searchTerm;
          else
            query = `${searchTerm} ${sentences[sentenceIndex].keywords[0]}`;

          console.log(`> [image-robot] Querying Google Images with: "${query}"`);

          const googleReturnedImages = await this.fetchGoogleAndReturnImagesLinks(query, lang);

          sentences[sentenceIndex].images = googleReturnedImages.length ? googleReturnedImages : sentences[0].images;
          sentences[sentenceIndex].googleSearchQuery = query;
        }

        next(sentences);
      } catch(error) {
        reject(error.message);
      }
    });
  }

  fetchSentencesTitles(searchTerm, sentences) {
    for(let sentenceIndex = 0; sentenceIndex < sentences.length; sentenceIndex++) {
      let title;

      if(!sentenceIndex)
        title = searchTerm
      else
        title = sentences[sentenceIndex].keywords[0];

      sentences[sentenceIndex].title = titleCase(title);
    }

    return sentences;
  }

  async fetchGoogleAndReturnImagesLinks(query, lang) {
    const response = await customSearch.cse.list({
      auth: goolgeSearchApiKey,
      cx: googleSearchEngineId,
      q: query,
      imgSize: 'large',
      searchType: 'image',
      lr: `lang_${lang}`,
      num: 2
    })
    
    console.log(response.data);

    if(!response.data.items)
      response.data.items = [];

    const imagesUrl = response.data.items.map((item) => {
      return item.link
    })

    return imagesUrl;
  }

  downloadAllImages(sentences, slideId) {
    return new Promise(async (next, reject) => {
      try {
        const downloadedImages = [];

        for (let sentenceIndex = 0; sentenceIndex < sentences.length; sentenceIndex++) {
          const images = sentences[sentenceIndex].images;

          for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
            const imageUrl = images[imageIndex];

            try {
              if (downloadedImages.includes(imageUrl))
                throw new Error('Image already downloaded');

              await this.downloadAndSave(imageUrl, `${sentenceIndex}-${slideId}.png`);
              downloadedImages.push(imageUrl);
              console.log(`> [image-robot] [${sentenceIndex}][${imageIndex}] Image successfully downloaded: ${imageUrl}`);
              break;
            } catch(error) {
              console.log(`> [image-robot] [${sentenceIndex}][${imageIndex}] Error (${imageUrl}): ${error}`);
            }
          }
        }

        next(downloadedImages);
      } catch(error) {
        reject(error.message);
      }
    });
  }

 downloadAndSave(url, fileName) {
    return imageDownloader.image({
      url: url,
      dest: `./content/${fileName}`
    });
  }

}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

function titleCase(string) {
    return string.split(" ").map(x => capitalizeFirstLetter(x)).join(" ");
}

module.exports = new Robot();