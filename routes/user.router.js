var express = require('express');
var router = express.Router();
var mysql = require('promise-mysql');

//define a pool
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vacations_web',
    connectionLimit: 10
});

// get data from user_vacation
router.get('/:username/:password', async (req, res, next) => {
    const username = req.params.username;
    const password = req.params.password;
    const result = await pool.query(`SELECT * FROM users WHERE username='${username}'AND password='${password}' ;`);
    if (result) {
        const jsonResult = result[0];
        req.session.firstName = jsonResult.first_name ; //available only in server
        req.session.lastName = jsonResult.last_name ;
        req.session.username = jsonResult.username ;        
        res.cookie('userInfo', JSON.stringify(req.session)); //כדי שיהיה זמין גם בצד לקוח נעביר לו קוקי 
        res.send(req.session);
    } else {
        res.status(404).send('error');
    }    
});

//get data from users
router.get('/all', async (req, res, next) => {
    const queryStr = `SELECT * FROM users;`
    const user = await pool.query(queryStr);
    res.send(user);
})

//add  users
router.post('/add', async (req, res, next) => {
    let username = req.body.username;
    let queryStrUsername = `SELECT * FROM users WHERE username='${username}';`
    const resultUsername  = await pool.query(queryStrUsername);   //הרצה של השיאלתא
    if (resultUsername.length) {
        res.statusMessage = "The user is already exist in the system";
        res.status(400).end();
    } else {
       let queryStr = `INSERT INTO users (first_name,last_name,username,password,rol) 
    VALUES ('${req.body.firstName}','${req.body.lastName}','${req.body.username}','${req.body.password}','user') `  //from client
    const result = await pool.query(queryStr);  //queryStr send to DB

    if (result) {
        req.session.firstName = req.body.firstName ; //available only in server
        req.session.lastName = req.body.lastName ;
        req.session.username = req.body.username ;
        req.session.rol = 'user' ;
        res.cookie('userInfo', JSON.stringify(req.session)); //כדי שיהיה זמין גם בצד לקוח נעביר לו קוקי 
        res.send(req.body);
    } else {
        res.status(404).send('error');
    } 
    }
});

//add values to users  -> admin
router.post('/addAdmin', async (req, res) => {
    // admin
    await pool.query(`INSERT INTO users (first_name,last_name,username,password,rol) VALUES ('Noa','Friedman','NoaF','@1234N','admin') `);
    // users
    // await pool.query(`INSERT INTO users (first_name,last_name,username,password,rol) VALUES ('Tal','Waser','Tal','12345','user') `);
    // await pool.query(`INSERT INTO users (first_name,last_name,username,password,rol) VALUES ('Romi','Waser','Romi','%123W','user') `);
    res.json({
        msg: "OK"
    })
});

//delete values to users
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await pool.query(`DELETE FROM users WHERE  ID=${id}`);
    res.json({
        msg: "OK"
    })
});

module.exports = router;