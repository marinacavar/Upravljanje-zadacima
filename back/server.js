require('./config/db');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;

const app = express();
const port = 3001;
const path = require ('path');

app.use(bodyParser());
app.use(cors())
app.use('/',require('./routes/router'))

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})


