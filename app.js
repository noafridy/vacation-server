var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mysql = require('promise-mysql');
const { Client } = require('pg');
var bodyParser = require('body-parser');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://jiibdlkybibmyf:9d0e440d351094db4a96d393a70704ed7471589d5f436bda82bfad4adc9a172f@ec2-54-75-238-138.eu-west-1.compute.amazonaws.com:5432/d3csp50dl0fh8s',
    ssl: true,
});

client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//         console.log(JSON.stringify(row));
//     }
//     client.end();
// });

// in development
//define a database pool
// var pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'vacations_web',
//     connectionLimit: 10
// });

// global.pool = pool;

// in production
global.pool = client;

var vacationRouter = require('./routes/vacation.router');
var userRouter = require('./routes/user.router');

var app = express();

app.use(session({
    secret: 'dskPP Pdns jdnj',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "content-type");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

app.use('/vacation/', vacationRouter);
app.use('/user/', userRouter);


module.exports = app;
