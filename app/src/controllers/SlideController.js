const generateRandomId = require('../utils/generateRandomId');

const robots = {
    text: require('../Robots/Text'),
    image: require('../Robots/Image'),
    powerPoint: require('../Robots/PowerPoint')
}

const controller = {};

controller.post = async (req, res) => {
    let content = { lang, author, searchTerm, font, prefix, numberOfSlides } = req.body;
    content.id = generateRandomId();

    try {
      content = await robots.text.start(content);
      content = await robots.image.start(content);
      await robots.powerPoint.start(content);
      res.json({ slideId: content.id });
    } catch(error) {
      res.status(400).json({ error });
    }
}

module.exports = controller;