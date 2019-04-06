var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); 
var vacationRouter = require('./routes/vacation.router');  //need to changed the name
var userRouter = require('./routes/user.router');  //need to changed the name

var app = express();


app.use(session({
    secret: 'dskPP Pdns jdnj',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  //http if its https it sohuled be true
}));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "content-type");
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

app.use('/vacation/', vacationRouter);
app.use('/user/', userRouter);


module.exports = app;
