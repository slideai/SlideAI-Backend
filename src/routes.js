const express = require('express');
const SlideController = require('./controllers/SlideController')

const routes = new express.Router();

routes.get('/posts',SlideController.index);



module.exports = routes;