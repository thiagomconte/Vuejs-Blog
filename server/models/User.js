const {Schema, model} = require('mongoose')
const moment = require('moment')

const User = new Schema({
    name:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    created_at:{
        type: Date,
        default: moment( Date.now()).toLocaleString({timeZone: 'America/Sao_Paulo'})
    }
})

module.exports = model('users', User)