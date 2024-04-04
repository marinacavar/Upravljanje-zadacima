const express = require('express');
const route = express.Router();
const controller = require('../controller/user');
const controllers = require('../controller/task');

//User routes
route.post('/api/users',controller.create);
route.post('/login', controller.login);
route.get('/api/users',controller.find);
route.put('/api/users/:id',controller.update);
route.delete('/api/users/:id', controller.delete);



//Task routes
route.post('/task',controllers.create);
route.get('/task',controllers.find);
route.put('/task/:id',controllers.update);
route.delete('/task/:id', controllers.delete);

module.exports=route;