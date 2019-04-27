var express = require('express');
var router = express.Router();

const pool = global.pool;

router.get('/:username/:password', async (req, res, next) => {
    debugger
    const username = req.params.username;
    const password = req.params.password;
    const result = await pool.query(`SELECT * FROM users WHERE username='${username}'AND password='${password}' ;`);
    if (result.length) {
        const jsonResult = result[0];
        req.session.firstName = jsonResult.first_name ; 
        req.session.lastName = jsonResult.last_name ;
        req.session.username = jsonResult.username ;  
        req.session.rol = jsonResult.rol ;       
        res.cookie('userInfo', JSON.stringify(req.session)); 
        res.send(req.session);
    } else {
        res.statusMessage = "There is a problem with login, please try again";
        res.status(404).send('error');
    }    
});

router.get('/all', async (req, res, next) => {
    const queryStr = `SELECT * FROM users;`
    const user = await pool.query(queryStr);
    res.send(user);
})

router.post('/add', async (req, res, next) => {
    let username = req.body.username;
    let queryStrUsername = `SELECT * FROM users WHERE username='${username}';`
    const resultUsername  = await pool.query(queryStrUsername);  
    if (resultUsername.length) {
        res.statusMessage = "The username is already exist in the system, please choose a different username";
        res.status(400).end();
    } else {
       let queryStr = `INSERT INTO users (first_name,last_name,username,password,rol) 
    VALUES ('${req.body.firstName}','${req.body.lastName}','${req.body.username}','${req.body.password}','user') `  
    const result = await pool.query(queryStr);  

    if (result) {
        req.session.firstName = req.body.firstName ; 
        req.session.lastName = req.body.lastName ;
        req.session.username = req.body.username ;
        req.session.rol = 'user' ;
        res.cookie('userInfo', JSON.stringify(req.session)); 
        res.send(req.body);
    } else {
        res.status(404).send('error');
    } 
    }
});

router.post('/addAdmin', async (req, res) => {
    await pool.query(`INSERT INTO users (first_name,last_name,username,password,rol) VALUES ('Tal','W','Tal123','123','admin') `);
    res.json({
        msg: "OK"
    })
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await pool.query(`DELETE FROM users WHERE  ID=${id}`);
    res.json({
        msg: "OK"
    })
});

module.exports = router;