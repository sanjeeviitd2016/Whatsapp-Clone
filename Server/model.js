const mongoose = require('mongoose');

const schema= new mongoose.Schema({

    name: {type:String},
    message: {type: String},
    timestamp:String,
    received:Boolean

})

const message= mongoose.model("messages",schema);
module.exports= message;