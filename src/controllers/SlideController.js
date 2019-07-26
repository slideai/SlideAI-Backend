const Slide = require('../models/Slide')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')


module.exports = {
    async index(req,res){
        const returnAllPostsSortingByOld = await Slide.find().sort('-createdAt');
        console.log("entrou no index")
        return res.json(returnAllPostsSortingByOld);
    }
};