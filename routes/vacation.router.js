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

//delete unFollow user_vacation
router.delete('/unFollw/:vacation_id/:username', async (req, res) => {
    const username = req.params.username; //: is in parmas-> params is from url
    const id = req.params.vacation_id;
    debugger;
    const result = await pool.query(`DELETE FROM user_vacation where vacation_id=${id} AND username='${username}'`);
    if (result) {
        const result2 = await pool.query(`SELECT * FROM user_vacation`);
        if (result2) {
            res.send(result2);
        } else {
            res.status(404).send('error');
        }
    } else {
        res.status(404).send('error');
    }
});

//Follow  user_vacation
router.post('/follow', async (req, res, next) => {
    let queryStr = `INSERT INTO user_vacation (username,vacation_id)  
     VALUES ('${req.body.username}',${req.body.vacation_id}) `  //from client
    const result = await pool.query(queryStr);  //queryStr send to DB
    debugger
    if (result) {
        let queryStr2 = `SELECT vacation_id FROM user_vacation WHERE username='${req.body.username}' `
        const result2 = await pool.query(queryStr2);
        if (result2) {
            res.send(result2.map(item => item.vacation_id));
        } else {
            res.status(404).send('error');
        }
    } else {
        res.status(404).send('error');
    }
});

// show all user_vacation
router.get('/myFollow/:username', async (req, res, next) => {
    const result = await pool.query(`SELECT vacation_id FROM user_vacation WHERE username='${req.params.username}'`);
    if (result) {
        res.send(result.map(item => item.vacation_id));
    } else {
        res.status(404).send('error');
    }
});

//update  vacation
router.put('/update/:id', async (req, res, next) => {
    const id = req.params.id;   //after the : is the name of var
    debugger
    const queryStr = (`UPDATE vacation 
    SET description='${req.body.description}',destination='${req.body.destination}',
    fromDate='${req.body.fromDate}',toDate='${req.body.toDate}',price=${req.body.price}
    where ID=${id}`);
    const result = await pool.query(queryStr);
    if (result.status = 200) {
        const queryStr2 = `select * from vacation`;
        const result2 = await pool.query(queryStr2);
        if (result2) {
            res.send(result2);
        } else {
            res.status(404).send('error');
        }
    } else {
        res.status(404).send('error');
    }
});

//add  vacation
router.post('/add', async (req, res, next) => {
    let queryStr = `INSERT INTO vacation (description,destination,img,fromDate,toDate,price)  
    VALUES ('${req.body.description}','${req.body.destination}','${req.body.img}','${req.body.fromDate}','${req.body.toDate}',${req.body.price}) `  //from client
    const result = await pool.query(queryStr);  //queryStr send to DB

    if (result) {
        let queryStr2 = `SELECT * FROM vacation`
        const result2 = await pool.query(queryStr2);
        if (result2) {
            res.send(result2);
        } else {
            res.status(404).send('error');
        }
    } else {
        res.status(404).send('error');
    }
});

//delete vacation 
router.delete('/:id', async (req, res) => {
    const id = req.params.id;   //: is in parmas-> params is from url
    const result = await pool.query(`DELETE  FROM vacation where ID='${id}';`);
    if (result) {
        const result2 = await pool.query(`SELECT * FROM vacation`);
        if (result2) {
            res.send(result2);
        } else {
            res.status(404).send('error');
        }
    } else {
        res.status(404).send('error');
    }
});

// show all vacation
router.get('/all', async (req, res, next) => {
    const results = await pool.query(`SELECT * FROM vacation;`);
    res.json(results);
});


module.exports = router;