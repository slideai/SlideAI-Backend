const express = require('express');
const SlideController = require('./controllers/SlideController');
const routes = new express.Router();

routes.post('/slides', SlideController.post)



module.exports = routes;