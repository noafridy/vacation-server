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


// router.get('/allvacation', async (req, res, next) => {
//     const results = await pool.query(`SELECT appointmentNew.ID as ID,team.name as name,appointmentname,description,starttime,time,date FROM appointmentNew JOIN team 
//     ON appointmentNew.teamname=team.ID;`);
//     res.json(results);
// });

//insert data to appointmentNew
// router.post('/insertData', async (req, res, next) => {   //id is automti  //  (MovieName,year,img,Category) from sql
    // debugger;
//     let queryStr = `INSERT INTO appointmentNew (teamname,appointmentname,description,starttime,time,date)  
//     VALUES (${req.body.teamname},'${req.body.appointmentname}','${req.body.description}','${req.body.starttime}','${req.body.time}','${req.body.date}') `  //from client
//     const result = await pool.query(queryStr);  //queryStr send to DB

//     if(result.status=200) { 
//         res.send(result); 
//     }else{
//        res.status(404).send('error'); 
//     }
    
// });

module.exports = router;