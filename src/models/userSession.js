const mongoose = require('mongoose');

//create database-------------------------------------------------------------------------------------------
const UserSessionSchema = new mongoose.Schema({
    user_id: {
        type: String, 
        default: ''
    },
    timestamp: {
        type: Date, 
        default: Date.now()
    }
});

module.exports = mongoose.model('UserSession', UserSessionSchema);