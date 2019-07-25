const express = require ('express')
const mongoose = require ('mongoose')
const cors = require('cors')
const path = require('path')


const server = require('http').Server(app)
const app = express()
 

app.use(cors())
app.use('/files',express.static(path.resolve(__dirname, '..', 'imagens','resized')))
app.use(require('./routes'))

server.listen(process.env.PORT || 3333)