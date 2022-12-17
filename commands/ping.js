module.exports = {
    name:'ping',
    execute: async (client, message, args) => {
        const ping = message.createdAt - Date.now() 
        message.channel.send(`Ping : ${ping}
        Websocket Ping: ${client.ws.ping}`)
    }
}