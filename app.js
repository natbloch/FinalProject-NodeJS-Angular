const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const passport = require('passport');
const config = require('./config/usersdb');
const index = require('./routes/index');
const users = require('./routes/users');
const albums = require('./routes/albums');


//Connect to DB
mongoose.connect(config.database);


const app = express();
require('./config/passport');


//Port#
const port = 3000;

app.use(cookieParser());

// body-parser &session MW
app.use(bodyParser.json());
app.use(session({secret:'jhbjhbjh234Whb', resave: false, saveUninitialized: false}));


//Passport MW
app.use(passport.initialize());
app.use(passport.session());


//Static Public Folder
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', users);
app.use('/albums', albums);
app.use('/', index);

//Initialize server
app.listen(port, () => {
	console.log('Server started on port ' + port);
});
