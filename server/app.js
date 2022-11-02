

// import sequelize from './utils/database.js';

// import router from './routes/routes.js';

const express = require('express')
const app = express()
const port = 5001
const host = '127.0.0.1'

app.get('/members', (req,res) => {
    console.log(req)
    res.send('Hello World')
})

app.listen(port, () => {
    console.log('Example app listening on port')
})

