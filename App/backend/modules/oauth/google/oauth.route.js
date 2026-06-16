const express = require("express");
const oauth = express.Router();
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const googleController = require("./google.oauth.controller");

oauth.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

oauth.use(passport.initialize());
oauth.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("PROFILE", profile);
      done(null, profile);
    },
  ),
);

oauth.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
oauth.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleController.manageOauthCallback,
);

module.exports = oauth;
