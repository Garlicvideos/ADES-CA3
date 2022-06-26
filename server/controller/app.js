//-- Import required modules --//
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

//-- Hook middlewares --//
app.use(cors());
app.use(bodyParser.json());

//-- Import API Routes --//
const users_routes = require("../routes/users_routes");

//-- Mount API Routes --//
app.use('/api/users/', users_routes);

//Export the app
module.exports = app;