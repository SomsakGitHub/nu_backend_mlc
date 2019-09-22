const mongoose = require('mongoose');
// var autoIncrement = require("mongodb-autoincrement");

//create database-------------------------------------------------------------------------------------------
const SettingProgramFormSchema = new mongoose.Schema({
    
    document_name: {
        type: String, 
        default: ''
    },
    issue_date: {
        type: Date, 
        default: Date.now
    },
    no: {
        type: String, 
        default: ''
    },
    edit_times: {
        type: String, 
        default: ''
    },          
    topic_name: {
        type: String, 
        default: ''
    },
    PT_item_number_typeOne: {
        type: String, 
        default: ''
    },
    PT_item_number_typeTwo: {
        type: String, 
        default: ''
    },
    explanation: {
        type: String, 
        default: ''
    },
    form_name: {
        type: String, 
        default: ''
    },
    email: {
        type: String, 
        default: ''
    },
    closing_day: {
        type: Date, 
        default: new Date()
    },
    phone: {
        type: String, 
        default: ''
    },
    line: {
        type: String, 
        default: ''
    },
    facebook: {
        type: String, 
        default: ''
    },
    company_name: {
        type: String, 
        default: ''
    }
});

//id autoIncrement-------------------------------------------------------------------------------------------
// UserSchema.plugin(autoIncrement.mongoosePlugin);

module.exports = mongoose.model('SettingProgramForm', SettingProgramFormSchema);