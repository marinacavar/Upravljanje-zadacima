const express = require('express');
const route = express.Router();
const controller = require('../controller/user');

route.get('/', (req,res) => {
    res.render('index');
})

route.get('/add-user', (req,res) => {
    res.render('add_user');
})

route.get('/update-user', (req,res) => {
    res.render('update_user');
})
route.post('/api/users', controller.create);
route.get('/api/users',controller.find);
route.put('/api/users/:id',controller.update);
route.delete('/api/users:id',controller.delete);

module.exports=route;