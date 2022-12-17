const router = require('express').Router();
const { PermissionsBitField,PermissionFlagsBits  } = require('discord.js');
const {ensureAuthenticated} = require('../Auth/check');
const guild = require('../Models/guild');


function Home(client = null) {
    router.get('/', (req, res) => {
        res.render('pages/index', {title:'Ana Sayfa', bot:client, user: req.user ? req.user : null })
    })
    router.get('/guilds', ensureAuthenticated, (req, res) => {
        res.render('pages/guilds', {user: req.user, bot:client, Perms: PermissionsBitField, flag: PermissionFlagsBits})
    })
    router.get('/dashboard/:id', ensureAuthenticated, (req, res) => {
        res.render('pages/dashboard', {user: req.user})
    }) 
    router.post('/dashboard/:id', ensureAuthenticated, async (req, res) => {
        try {
            await guild.findOneAndUpdate({
                id:req.params.id
            },
            {
                prefix:req.body.prefix
            })
            return res.redirect('/dashboard/'+ req.params.id)
        }catch (e) {
            throw Error(e)
        }
    })
    return router;
};

module.exports = { Home };
