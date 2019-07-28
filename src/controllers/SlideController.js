const sharp = require('sharp')
const path = require('path')
const fs = require('fs')


module.exports = {
    async test(req,res){
        console.log("entrou no index")
        return res.json('aa')
    },
    async presentation(req,res){
        const {author, } = req.body
        console.log("Ent rou na apresentacao(rota)")
    }
};