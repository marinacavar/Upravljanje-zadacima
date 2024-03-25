const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    task: {
        type: String,
        required:true
    },
    user: {
        type: String,
        required:true
        
    },
    deadline: {
        type:Date,
        requires:true

    },
    status: {
        type:String,
        required:true
    }
    
});

const User = mongoose.model('User', schema);

module.exports = User;