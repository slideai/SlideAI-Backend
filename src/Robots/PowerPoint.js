const fs = require('fs');
const pptx = require('pptxgenjs');

const pathForLogoTransparent = 'assets/logo_transparent.png';
const repUrl = 'https://github.com/slideai/SlideAI-Backend';

class Robot {
  start(content) {
    return new Promise(async (next, reject) => {
      try {
        const { id, author, prefix, searchTerm, lang, font, numberOfSlides, downloadedImages, sentences } = content;
        const presentation = new pptx();

        presentation.setLayout('LAYOUT_WIDE');

        this.defineSettings(presentation, author, prefix, searchTerm);
        this.createCoverSlide(presentation, author, prefix, searchTerm, lang, font, id);
        await this.callCreatorSliders(presentation, numberOfSlides, sentences, font, id);
        this.createReferencesSlide(presentation, searchTerm, downloadedImages, lang, font);
        this.savePresentation(presentation, id);
        this.setExpirePresentation(id);
        await this.clearContentImages(numberOfSlides, id);

        next();
      } catch (error) {
        reject(error.message);
      }
    });
  }

  defineSettings(presentation, author, prefix, searchTerm) {
    presentation.setAuthor(author);
    presentation.setCompany('PPTX Maker');
    presentation.setSubject(searchTerm);
    presentation.setTitle(`${prefix} ${searchTerm}`);
  }

  createCoverSlide(presentation, author, prefix, searchTerm, lang, font, slideId) {
    let coverSlide = presentation.addNewSlide();

    this.insertBackgroundImage(coverSlide, `./content/0-${slideId}.png`);
    this.insertOpacityBackground(coverSlide, presentation.shapes.RECTANGLE);
    this.insertLogo(coverSlide);
    this.insertCredits(coverSlide, lang, font);
    this.insertAuthor(coverSlide, author, lang, font);
  }

  callCreatorSliders(presentation, maximumSentences, sentences, font, slideId) {
    return new Promise(async (next, reject) => {
      try {
        let i = 0;

        for (i = 0; i < maximumSentences; i++) {
          const photoExists = await this.verifyIfImageExists(`./content/${i}-${slideId}.png`);
          const imageUrl = photoExists ? `./content/${i}-${slideId}.png` : `./content/0-${slideId}.png`;
          this.createSlide(presentation, imageUrl, sentences[i].title, sentences[i].text, font);
        }

        next();
      } catch (error) {
        reject(error.message);
      };
    });
  }

  createSlide(presentation, backgroundUrl, title, text, font) {
    const slide = presentation.addNewSlide();

    this.insertBackgroundImage(slide, backgroundUrl);
    this.insertOpacityBackground(slide, presentation.shapes.RECTANGLE);
    this.insertLogo(slide);
    this.insertSlideTitle(slide, title, font);
    this.insertSlideText(slide, text, font);
  }

  createReferencesSlide(presentation, searchTerm, downloadedImages, lang, font) {
    const slide = presentation.addNewSlide();

    this.insertLogo(slide);
    this.insertCredits(slide, lang, font);
    this.insertReferencesTitle(slide, lang, font);
    this.insertWikipediaURL(slide, lang, searchTerm, font);
    this.insertImagesURL(slide, downloadedImages, font);
  }


  async savePresentation(presentation, slideId) {
    console.log('saving........')
    await presentation.save(`./public/slides/${slideId}.pptx`);
    console.log('terminou........')

  }

  setExpirePresentation(slideId) {
    setTimeout(async () => {
      await this.removeFile(`./public/slides/${slideId}.pptx`);
    }, 1000 * 60 * 30);
  }

  async clearContentImages(maximumSentences, slideId) {
    let i = 0;

    for (i = 0; i < maximumSentences; i++) {
      await this.removeFile(`./content/${i}-${slideId}.png`);
    }
  }



  insertBackgroundImage(slide, path) {
    slide.addImage({
      path,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
    });
  }

  insertOpacityBackground(slide, RECTANGLE) {
    slide.addShape(RECTANGLE,
      {
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
        fill: {
          type: 'solid',
          color: '000000',
          alpha: 25
        }
      });
  }

  insertLogo(slide) {
    slide.addImage({
      path: pathForLogoTransparent,
      hyperlink: { url: repUrl, tooltip: 'GitHub' },
      x: 11.2,
      y: 5.4,
      w: 2.5,
      h: 2.5,
    });
  }

  insertCredits(slide, lang, font) {
    const creditsText = this.selectTextByLanguage(lang, 'his slide show was made using AutoPPTX', 'Essa apresentação foi feita usando AutoPPTX');

    slide.addText([{
      text: creditsText,
      options: { hyperlink: { url: repUrl, tooltip: 'GitHub' } }
    }],
      {
        x: '25%',
        y: '90%',
        fontSize: 20,
        bold: true,
        color: 'ffffff',
        fontFace: font
      });
  }

  insertAuthor(slide, author, lang, font) {
    const madeText = this.selectTextByLanguage(lang, 'Made by', 'Feito por');

    slide.addText(`${madeText} ${author}`, {
      x: 0,
      y: 0.3,
      w: '100%',
      font: 20,
      color: 'ffffff',
      bold: true,
      align: 'center',
      fontFace: font
    });
  }

  insertPresentationTitle(slide, prefix, searchTerm, font) {
    slide.addText(`${prefix}\n${searchTerm}`, {
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
      margin: 35,
      align: 'center',
      fontSize: 48,
      bold: true,
      color: 'ffffff',
      fontFace: font
    });
  }

  insertSlideTitle(slide, title, font) {
    slide.addText([{ text: title }], {
      x: 0,
      y: 0.5,
      w: '100%',
      align: 'center',
      fontSize: 25,
      bold: true,
      color: 'ffffff',
      fontFace: font
    });
  }

  insertReferencesTitle(slide, lang, font) {
    const referencesText = this.selectTextByLanguage(lang, 'References', 'Referências');

    slide.addText([{ text: referencesText }], {
      x: 0,
      y: 0.5,
      w: '100%',
      align: 'center',
      fontSize: 25,
      bold: true,
      color: '000000',
      fontFace: font
    });
  }

  insertSlideText(slide, text, font) {
    slide.addText([{ text }], {
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
      align: 'center',
      font: 15,
      color: 'ffffff',
      bold: true,
      margin: 16,
      fontFace: font
    });
  }

  insertWikipediaURL(slide, lang, searchTerm, font) {
    const wikipediaUrl = `https://${lang}.wikipedia.org/wiki/${searchTerm}`;

    slide.addText([{
      text: wikipediaUrl,
      options: { hyperlink: { url: wikipediaUrl, tooltip: 'Wikipedia' } },
    }], {
      x: 1.5,
      y: 1.3,
      fontSize: 18,
      bold: true,
      color: '696969',
      fontFace: font
    });
  }

  insertImagesURL(slide, downloadedImages, font) {
    let i = 0;

    for (i = 0; i < downloadedImages.length; i++) {
      let spaceBetweenLines = i / 2;

      slide.addText([{
        text: downloadedImages[i],
        options: { hyperlink: { url: downloadedImages[i], tooltip: 'downloadedImage' } },
      }], {
        x: 1.5,
        y: 1.8 + spaceBetweenLines,
        fontSize: 10,
        fontFace: font,
        color: '696969'
      });
    }
  }

  selectTextByLanguage(lang, textInEnglish, textInPortuguese) {
    switch (lang) {
      case "pt":
        return textInPortuguese;
      default:
        return textInEnglish;
    }
  }

  verifyIfImageExists(imageUrl) {
    return new Promise((next, reject) => {
      fs.readFile(imageUrl, err => {
        if (err)
          next(false);
        else
          next(true);
      });
    });
  }

  removeFile(file) {
    return new Promise(next => {
      fs.unlink(file, next);
    });
  }
}



module.exports = new Robot();