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

//update  vacation
router.put('/updatevacation', async (req, res, next) => {
    const id = req.query.id;   ////from client-> in the url?id
    var queryStr = (`UPDATE vacation 
    SET description='${req.body.description}',destination='${req.body.destination}',img='${req.body.img}',
    date='${req.body.date}',price=${req.body.price},follow=${req.body.follow}
    where ID=${id};`);
    const result = await pool.query(queryStr);
    if (result.status = 200) {
        res.send(result);
    } else {
        res.status(404).send('error');
    }
});

//insert  vacation
router.post('/insertvacation', async (req, res, next) => {
    let queryStr = `INSERT INTO vacation (description,destination,img,date,price,follow)  
    VALUES ('${req.body.description}','${req.body.destination}','${req.body.img}','${req.body.date}',${req.body.price},${req.body.follow}) `  //from client
    const result = await pool.query(queryStr);  //queryStr send to DB

    if (result.status = 200) {
        res.send(result);
    } else {
        res.status(404).send('error');
    }
});

//delete vacation 
router.delete('/deletevacation', async (req, res) => {
    const id = req.query.id;   ////from client-> in the url?id
    await pool.query(`DELETE  FROM vacation where ID=${id};`);
    res.json({
        msg: "OK"
    })
});

// show vacation
router.get('/allvacation', async (req, res, next) => {
    const results = await pool.query(`SELECT * FROM vacation;`);
    res.json(results);
});

//get data from users
router.get('/allusers', async (req, res, next) => {
    const queryStr = `SELECT * FROM users;`
    const user = await pool.query(queryStr);
    res.send(user);
})

//insert values to users  -> admin
router.get('/insertteam', async (req, res) => {
    // admin
    await pool.query(`INSERT INTO users (first_name,last_name,username,password,rol) VALUES ('Noa','Friedman','NoaF','@1234N','admin') `);
    // users
    await pool.query(`INSERT INTO users (first_name,last_name,username,password,rol) VALUES ('Tal','Waser','Tal','12345','user') `);
    await pool.query(`INSERT INTO users (first_name,last_name,username,password,rol) VALUES ('Romi','Waser','Romi','%123W','user') `);
    res.json({
        msg: "OK"
    })
});

//delete values to users
router.delete('/deleteuser', async (req, res) => {
    await pool.query(`DELETE FROM users WHERE  ID=5 `);
    res.json({
        msg: "OK"
    })
});

module.exports = router;