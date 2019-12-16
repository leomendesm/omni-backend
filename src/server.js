const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect('mongodb+srv://omni:omni@cluster0-xj4mk.mongodb.net/omni?retryWrites=true&w=majority', { useNewUrlParser: true })
const routes =  require('./routes')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const connectedUsers = {}

io.on('connection', socket => {
	const { user } = socket.handshake.query

	connectedUsers[user] = socket.id
})
app.use((req, res, next) => {
	req.io = io
	req.connectedUsers = connectedUsers

	return next()
})
app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(3333)

