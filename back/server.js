require('./config/db');
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const app = require('express')();
const port = 3000;
const path = require ('path');
const bodyParser = require('express').json;


app.use(bodyParser());
app.use(morgan("tiny"));
app.set("view engine", "ejs")
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))



app.use('/',require('./routes/router'))

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})


