const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    tag:{
        type:String,
        require: true
    },
    avatar:{
        type:String,
        require:false
    },
    pid:{
        type:String,
        require:true
    },
    guilds:{
        type:Array,
        require:false
    },
    rtoken: String,
    atoken: String
});

const userModel = mongoose.model('users', userSchema)
module.exports = userModel;