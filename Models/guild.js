const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    id:{
        type: String,
        require:true
    },
    prefix: {
        type: String,
        require: true,
        default: '!'
    }
});


const guildModel = mongoose.model('guilds', guildSchema);

module.exports = guildModel;