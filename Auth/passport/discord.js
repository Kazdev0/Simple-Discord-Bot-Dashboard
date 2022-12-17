const passport = require("passport");
const User = require('../../Models/user');
const DiscordStrategy = require("passport-discord").Strategy;
const refresh = require("passport-oauth2-refresh");
const config = require("../../config");


passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    if (user) done(null, user);
  });
  
  const strat = new DiscordStrategy(
    {
      clientID:config.bot.clientID,
      clientSecret:config.bot.clientSecret,
      callbackURL: config.bot.callbackURL,
      scope: ["identify", "guilds"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ pid: profile.id });
        if (user) {
          User.findOneAndUpdate(
            { pid: profile.id },
            { guilds: profile.guilds, rtoken: refreshToken, atoken: accessToken },
  
            async (err) => {
              if (err) throw err;
              let newUser = await User.findOne({ id: profile.id });
              done(null, newUser);
            }
          );
        } else {
          const newUser = await User.create({
            pid: profile.id,
            username: profile.username,
            tag:profile.discriminator,
          });
  
          const savedUser = await newUser.save();
  
          done(null, savedUser);
        }
      } catch (err) {
        console.log(err);
        done(err, null);
      }
    }
  );
  
  passport.use("discord", strat);
  refresh.use("discord", strat);
