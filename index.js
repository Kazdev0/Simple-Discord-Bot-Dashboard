const { Client, GatewayIntentBits, Events, Collection } = require('discord.js')
const config = require('./config')
const client = new Client({
    intents:[GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds]
});
const express = require('express');
const app = express();
const fs = require('fs')
const mongoose = require('mongoose');
mongoose.set('strictQuery', true)
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require('passport')
const guildSchema = require('./Models/guild');


client.on(Events.ClientReady, () => {
    console.log('Bot Connected from Discord.')
    mongoose.connect(config.database.url, {
        useNewUrlParser:true
    }).then(() => app.listen(config.http.port), console.log('MongoDB connection successfully connected.'));    
})

client.commands = new Collection();
const commandPath = './commands';
const commands = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commands) {
    const command = require(`${commandPath}/${file}`);
    console.log(`${command.name} Loaded.`)

    client.commands.set(command.name, command)
};

client.on(Events.MessageCreate, async (message) => {
    if(message.author.bot || !message.guild) return;
    const guild = await guildSchema.findOne({ id: message.guild.id })

    if(!message.content.startsWith(guild.prefix)) return;

    const args = message.content.slice(guild.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    if(!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(client, message, args)
    } catch (e) {
        message.reply(`${e}`)
    }
}); 

client.on(Events.GuildCreate, async (guild) => {
    const newGuild = await guildSchema.create({id:guild.id});
    newGuild.save();
});
client.on(Events.GuildDelete, async (guild) => {
    await guildSchema.findOneAndDelete({id: guild.id})  
})

client.login(config.bot.token)


/* Express Server */

app.set('views', 'www');
app.set('view engine', 'ejs');

app.use(cookieParser('passport'));
app.use(flash())

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(passport.initialize());
app.use(passport.session());
require('./Auth/passport/discord')

app.get("/login", passport.authenticate("discord"));
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/login'
}), function(req, res) {
    res.redirect('/guilds') // Successful auth
});

const {Home} = require('./routers/index');

app.use('/',Home(client));