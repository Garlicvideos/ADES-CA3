//JWT Secretkey
const configs = {
    JWTSecretKey: 'dfkhfkda6812683216jcxzm876875@!#@$dsd',
    passportJWTConfig: (ExtractJWT, secret) => {
        //Configures the strategy
        const config = {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), 
            secretOrKey: secret,
            algorithms: ['HS256'] 
        }

        return config;
    },
    googleOAuthConfig: {
        clientID: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        callbackURL: "http://localhost:3000/api/users/authenticate/google/callback"
    },
    githubOAuthConfig: {
        clientID: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        callbackURL: "http://localhost:3000/api/users/authenticate/github/callback"
    }
}

//Export the configs
module.exports = configs;
