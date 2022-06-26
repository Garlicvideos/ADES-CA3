//-- Import required modules --//
const passport = require("passport");
const LocalStrategy = require('passport-local');
const utils = require("../utils/utils.js");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const configs = require("../config/config.js");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

//Models
const User = require("../models/User");

//-- Defines strategies --//
const strategies = {
    //Defines the login strategy
    login: new LocalStrategy((username, password, callback) => {
        //Trims the user input before passing it through to the authenticate method
        utils.trimObject({username, password}, (err, trimmedInput) => {
            //Check if there was an error
            if (err) {
                //There was an error
                return callback(err);
            } else {
                //There was no error
                //Authenticate the user
                User.authenticate(trimmedInput.username, trimmedInput.password, (err, result) => {
                    //Checks if there was an error
                    if (err) {
                        //There was an error
                        //Account details are invalid
                        return callback(err);
                    } else {
                        //There was no error, return the user details
                        return callback(null, result);
                    }
                });
            }
        });
    }),

    //Defines the JWT strategy
    jwt: new JWTStrategy(configs.passportJWTConfig(ExtractJWT, configs.JWTSecretKey), (jwtPayload, cb) => {
        //Checks if the user is logged in
        if (jwtPayload.userid != null) {
            //The user is logged in, return the payload
            return cb(null, jwtPayload);
        } else {
            //The user is not logged in, return an error
            return cb("not logged in", false);
        }
    }),

    //Defines the Google OAuth 2.0 Strategy
    google: new GoogleStrategy(configs.googleOAuthConfig, (accessToken, refreshToken, profile, cb) => {
        cb(null, profile);
    }),
    
    //Defines the Github Strategy
    github: new GitHubStrategy(configs.githubOAuthConfig, (accessToken, refreshToken, profile, cb) => {
        cb(null, profile);
    })
}

//Uses both local and jwt strategies
passport.use("login", strategies.login);
passport.use(strategies.jwt);
passport.use(strategies.google);
passport.use(strategies.github);

//Export the configured Passport object
module.exports = passport;