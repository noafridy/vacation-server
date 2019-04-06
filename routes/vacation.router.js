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
router.put('/update/:id', async (req, res, next) => {
    const id = req.params.id;   //after the : is the name of var
    var queryStr = (`UPDATE vacation 
    SET description='${req.body.description}',destination='${req.body.destination}',img='${req.body.img}',
    fromDate=${req.body.fromDate},toDate=${req.body.toDate},price=${req.body.price},follow=${req.body.follow}
    where ID=${id};`);
    const result = await pool.query(queryStr);
    if (result.status = 200) {
        res.send(result);
    } else {
        res.status(404).send('error');
    }
});

//add  vacation
router.post('/add', async (req, res, next) => {
    debugger
    let queryStr = `INSERT INTO vacation (description,destination,img,fromDate,toDate,price)  
    VALUES ('${req.body.description}','${req.body.destination}','${req.body.img}',${req.body.fromDate},${req.body.toDate},${req.body.price}) `  //from client
    const result = await pool.query(queryStr);  //queryStr send to DB
debugger
    if (result.status = 200) {
        res.send(result);
    } else {
        res.status(404).send('error');
    }
});

//delete vacation 
router.delete('/:id', async (req, res) => {
    const id = req.params.id;   //: is in parmas-> params is from url
    await pool.query(`DELETE  FROM vacation where ID=${id};`);
    res.json({
        msg: "OK"
    })
});

// show all vacation
router.get('/all', async (req, res, next) => {
    const results = await pool.query(`SELECT * FROM vacation;`);
    res.json(results);
});


module.exports = router;