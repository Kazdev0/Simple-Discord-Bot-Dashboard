const guild = require("../Models/guild")


module.exports = {
    name:'prefix',
    execute: async (client, message, args) => {
        const g = await guild.findOne({id: message.guild.id})
        message.channel.send(`<@${message.author.id}> This Server Prefix is **${g.prefix}** \n Change prefix: http://localhost:3000/dashboard/${message.guild.id}`)
    }
}