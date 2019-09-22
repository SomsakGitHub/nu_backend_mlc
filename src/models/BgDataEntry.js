const mongoose = require('mongoose');
// var autoIncrement = require("mongodb-autoincrement");

//create database-------------------------------------------------------------------------------------------
const BgDataEntrySchema = new mongoose.Schema({

    user_id: {
        type: String, 
        default: ''
    },
    department_name: {
        type: String, 
        default: ''
    },
    topic_name: {
        type: String, 
        default: ''
    },
    blood_glucose_member_id: {
        type: String, 
        default: ''
    },
    meter_brand: {
        type: String, 
        default: ''
    },
    meter_number: {
        type: Array, 
        default: ''
    },
    serial_number: {
        type: Array, 
        default: ''
    },
    lot_strip: {
        type: Array, 
        default: ''
    },
    // code_item_number_typeOne: {
    //     type: Array, 
    //     default: ''
    // },
    // code_item_number_typeTwo: {
    //     type: Array, 
    //     default: ''
    // },
    value_item_number_typeOne: {
        type: Array, 
        default: ''
    },
    value_item_number_typeTwo: {
        type: Array, 
        default: ''
    },
    receive_date: {
        type: Array,
        default: Date.now()
    },
    analyze_date: {
        type: Array,
        default: Date.now()
    },
    auditor: {
        type: String,
        default: ''
    },
    auditor_appointment: {
        type: String,
        default: ''
    },
    // auditor_date: {
    //     type: Date,
    //     default: Date.now()
    // },
    assessor: {
        type: String,
        default: ''
    },
    assessor_appointment: {
        type: String,
        default: ''
    },
    assessor_date: {
        type: Date,
        default: Date.now()
    }
});

//id autoIncrement-------------------------------------------------------------------------------------------
// UserSchema.plugin(autoIncrement.mongoosePlugin);

module.exports = mongoose.model('BgDataEntry', BgDataEntrySchema);