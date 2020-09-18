const bodyParser = require('body-Parser');
const express = require("express");
const mongoose = require('mongoose');
const app = express();

//exports
const routes = require("../routes/routes");

//configuration body-Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


//connection string for mongoose
mongoose.connect('mongodb+srv://rootUser:GatoNegroPerroCafe@myatlascluster.wregg.gcp.mongodb.net/NodeJSEmployees?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;

        console.log("Connect with MongoDB")
    });

//implement routes
app.use('/', routes());

//set a port
app.listen(3000);