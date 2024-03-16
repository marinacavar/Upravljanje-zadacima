require('./config/db');
const express = require('express');
const app = require('express')();
const port = 3000;

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', userRouter)
app.use('/admin', adminRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})


