const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    tasks: {
        type: String,
        required:true
    },
    user: {
        type: String,
        required:true
        
    },
    deadline: {
        type: String,
        required:true

    },
    status: {
        type:String,
        required:true
    }
    
});

const Task = mongoose.model('Task', schema);

module.exports = Task;

