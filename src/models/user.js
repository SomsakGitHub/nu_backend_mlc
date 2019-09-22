const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// var autoIncrement = require("mongodb-autoincrement");

//create database-------------------------------------------------------------------------------------------
const UserSchema = new mongoose.Schema({
    // _id: {
    //     type: String, 
    //     default: ''
    // },
    
    partner: {
        type: String, 
        default: ''
    },
    department_name: {
        type: String, 
        default: ''
    },
    blood_glucose_member_id: {
        type: String, 
        default: ''
    },
    blood_glucose_meter_qty: {
        type: Intl
    },
    // hct_member_id: {
    //     type: String, 
    //     default: ''
    // },
    // hba1c_member_id: {
    //     type: String, 
    //     default: ''
    // },
    username: {
        type: String, 
        default: ''
    },
    password: {
        type: String, 
        default: ''
    },
    sentBgResult: {
        type: Boolean,
        default: false
    },
    user_type: {
        type: String, 
        default: ''
    },
    user_type_id: {
        type: String, 
        default: ''
    },
    // created_at: {
    //     type: Date, 
    //     default: Date.now()
    // },
    // updated_at: {
    //     type: Date, 
    //     default: Date.now()
    // },
    // status_id: {
    //     type: Intl, 
    //     default: 1
    // }
});

//encode password-------------------------------------------------------------------------------------------
UserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

//id autoIncrement-------------------------------------------------------------------------------------------
// UserSchema.plugin(autoIncrement.mongoosePlugin);

module.exports = mongoose.model('User', UserSchema);