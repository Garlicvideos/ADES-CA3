//Import required modules
const express = require("express");
const router = express.Router();
const utils = require("../utils/utils.js");
const passport = require("../auth/passport");
const jwt = require('jsonwebtoken');
const configs = require("../config/config.js");

//Models
const User = require("../models/User");

//-- POST Request handling --//
/**
 * Creates a new user
 */
router.post("/", (req, res) => {
    //Trims the user input before passing it through to the authenticate method
    utils.trimObject(req.body, (err, trimmedInput) => {
        //Check if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error
            //Checks if the username provided is empty
            if (trimmedInput.username == null || trimmedInput.username == "") {
                response = {"message": "Username cannot be blank", "affectedInputs": ["username"]};
                return res.status(422).send(response);
            }

            //Checks if the password provided is empty
            if (trimmedInput.password == null || trimmedInput.password == "") {
                response = {"message": "Password cannot be blank", "affectedInputs": ["password"]};
                return res.status(422).send(response);
            }
            //Create a new user
            User.createUser(trimmedInput, (err, result) => {
                //Checks if there was an error
                if (err) {
                    //There was an error
                    console.log(err);
                    
                    //Check if the error was due to a duplicate entry
                    if (err.code == "ER_DUP_ENTRY") {
                        //Error was caused by a duplicate entry. Check which column is affected
                        let response = {};
                        if (err.sqlMessage.includes("users.username")) {
                            //Username is already in use
                            response = {"message": "Username is already in use!", "affectedInputs": ["username"]};
                        }
                        return res.status(422).send(response);
                    } else {
                        //Unknown error occurred
                        return res.status(500).send();
                    }
                } else {
                    //There was no error
                    let response = {"userid": result.insertId};
                    return res.status(201).send(response);
                }
            });
        }
    });
});

/**
 * Authenticates a user
 */
router.post('/authenticate', (req, res, next) => {
    passport.authenticate('login', {session: false}, (err, user) => {
        //Checks if the authentication was successful
        if (err || !user) {
            //Invalid username or password provided
            console.log(err);
            return res.status(401).send();
        }

        //Authentication success, save user info to the request object
        req.login(user, {session: false}, (err) => {
            //Checks if there were any errors
            if (err) {
                console.log(err);
                res.send(err);
            }

            //Generates a signed payload
            const payload = {userid: user.userid, username: user.username};
            const token = jwt.sign(payload, configs.JWTSecretKey, { algorithm: "HS256" });

            //Returns with a json response
            return res.json({ token });
        });
    })(req, res, next);
});

//-- GET Request handling --//
/**
 * Retrieves data for a specific user account
 */
router.get("/protected", passport.authenticate("jwt", { session: false}), (req, res) => {
    res.status(200).json({ 
        message: "You are logged in!", 
        tokenContents: req.user 
    });
});

/**
 * Retrieves data for a specific user account
 */
router.get("/:userid", passport.authenticate("jwt", { session: false}), (req, res) => {
    //Get the id supplied in the request parameter
    let userid = req.params.userid;

    //Checks if the userid supplied matches the account the user is logged in to
    if (userid != req.user.userid) {
        //The user is trying to retrieve another user's information
        //Return a 401
        return res.status(401).send();
    }

    //Retrieves data for the user with a specific id
    User.getUserById(userid, (err, result) => {
        //Checks if there was an error
        if (err) {
            //There was an error
            console.log(err);
            return res.status(500).send();
        } else {
            //There was no error, check if any results were returned
            if (result.length > 0) {
                //There was at least 1 row returned
                return res.status(200).send(result[0]);
            } else {
                //No results were returned
                return res.status(500).send();
            }
        }
    });
});

/**
 * Authenticates via Google
 */
router.get('/authenticate/google', passport.authenticate('google', { scope: ['profile'], session: false }));

/**
 * Callback after google authentication
 */
router.get('/authenticate/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
    //Successful authentication
    res.json(req.user);
});

/**
 * Authenticates via Github
 */
router.get('/authenticate/github', passport.authenticate('github', { scope: [ 'user:email' ], session: false }));

/**
 * Callback after github authentication
 */
router.get('/authenticate/github/callback', passport.authenticate('github', { failureRedirect: '/login', session: false }), (req, res) => {
    //Successful authentication
    res.json(req.user);
});

//Export routes
module.exports = router