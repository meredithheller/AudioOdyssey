"use strict";
const express = require('express');

//const sequelize = require(".utils/database.js");

//const router = require(".routes/router");

const app = express();

const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'db8.cse.nd.edu',
  user: 'mheller5',
  password: 'audioodyssey',
  database: 'mmheller5'
})
connection.connect()

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
    if(err) throw err
    console.log(rows)
})
connection.end
/*
app.get("/", (req, res) => {
    // handle root
})

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// app.use((_, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

app.use(router);

sequelize.sync(); 

app.listen(5000); */