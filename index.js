const express = require('express')
const consign = require('consign')
const mongoose = require('mongoose')
const { MONGO_URI } = require('./config')

let PORT = process.env.PORT || 3000

let app = express()

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('==> MongoDB Connected!'))
    .catch(err => console.log(err))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

consign().include('routes').into(app)

app.listen(PORT, '192.168.0.33', () => console.log(`==> Server is Running at http://192.168.0.33:${PORT}`))