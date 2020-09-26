const {Schema, model} = require('mongoose');
const moment = require('moment');

const Comment = new Schema({
    user_id:{type: Schema.Types.ObjectId, required:true, ref:'users'},
    post_id:{type: Schema.Types.ObjectId, required:true, ref:'posts'},
    content:{type:String, required:true},
    createdAt:{type:Date, default: moment(Date.now()).toLocaleString({timeZone:"America/Sao_Paulo"})}
})

module.exports = model('comments', Comment)
