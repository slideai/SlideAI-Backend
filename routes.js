const express = require('express');
const multer = require('multer');

const routes = new express.Router();

routes.get('/posts');



module.exports = routes;