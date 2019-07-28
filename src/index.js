const express = require ('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const server = require('http').Server(app)
const io = require ('socket.io')(server)

app.use((req,res,next)=>{
    req.io=io
    next()
})
app.use(cors())
app.use(bodyParser.json())
app.use(require('./routes'))

server.listen(process.env.PORT || 3333)


