const express = require ('express')
const mongoose = require ('mongoose')
const cors = require('cors')
const path = require('path')
const app = express()


const server = require('http').Server(app)

mongoose.connect((process.env.DATABASE_URI)||('mongodb+srv://leonardo:leonardo@cluster0-exdr6.mongodb.net/test?retryWrites=true&w=majority') ,
{
    useNewUrlParser:true,
})

app.use(cors())
app.use('/files',express.static(path.resolve(__dirname, '..', 'imagens','resized')))
app.use(require('./routes'))

server.listen(process.env.PORT || 3333)

