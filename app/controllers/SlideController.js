const generateRandomId = require('../utils/generateRandomId');

const robots = {
    text: require('../Robots/Text'),
    image: require('../Robots/Image'),
    powerPoint: require('../Robots/PowerPoint')
}

const controller = {};

controller.post = async (req, res) => {
    let content = { lang = 'en', author = '', searchTerm, font = 'Roboto', prefix, numberOfSlides = 7 } = req.body;
    content.id = generateRandomId();

    if(!searchTerm)
      return res.status(400).json({ error: 'search term missing' });

    if(numberOfSliddes > 20)
      return res.status(400).json({ error: 'number of slides exceeded the limit' });

    try {
      content = await robots.text.start(content);
      content = await robots.image.start(content);
      await robots.powerPoint.start(content);
      res.json({ slideId: content.id });
    } catch(error) {
      res.status(500).json({ error });
    }
}

module.exports = controller;