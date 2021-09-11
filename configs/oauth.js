
const express = require('express');
const app = express()
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const user = require('../models/user');

passport.use(new GoogleStrategy({
    clientID:     process.env.google_client_id,
    clientSecret: process.env.google_client_secret,
    callbackURL: "https://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
        const _id =  profile.id;
        const email =  profile.emails[0].value;
        const name =profile.name.familyName+" "+profile.name.givenName;
        const doc = {
            _id : _id,
            email: email,
            name : name
        }
        console.log(doc);
      return done(null, profile);
  }
));
passport.serializeUser((user, done)=>{
    done(null, user); 
})
passport.deserializeUser((user, done)=>{
    done(null, user); 
})