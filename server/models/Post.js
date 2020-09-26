const { Schema, model } = require('mongoose')
const moment = require('moment')


const Post = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 10
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    content: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    imgOwner:{
        type: String,
    },
    created_at: {
        type: Date,
        default: moment( Date.now() ).toLocaleString({timeZone: 'America/Sao_Paulo'})
    }
})

module.exports = model('posts', Post)