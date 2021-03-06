var express = require('express');
var router = express.Router();

const pool = global.pool;

router.get('/allFollowVacation', async (req, res, next) => {
    const result = await pool.query(`SELECT COUNT(username) followers,vacation_id FROM user_vacation GROUP BY vacation_id`);
    if (result) {
        res.json(result);
    } else {
        res.status(404).send('error');
    }
});

router.delete('/unFollw/:vacation_id/:username', async (req, res) => {
    const username = req.params.username; 
    const id = req.params.vacation_id;
    const result = await pool.query(`DELETE FROM user_vacation where vacation_id=${id} AND username='${username}'`);
    if (result) {
        const result2 = await pool.query(`SELECT vacation_id FROM user_vacation WHERE username='${username}'`);
        if (result2) {
            res.send(result2.map(item => item.vacation_id));
        } else {
            res.status(404).send('error');
        }
    } else {
        res.status(404).send('error');
    }
});

router.post('/follow', async (req, res, next) => {
    let queryStr = `INSERT INTO user_vacation (username,vacation_id)  
     VALUES ('${req.body.username}',${req.body.vacation_id}) `  
    const result = await pool.query(queryStr);  
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

router.get('/myFollow/:username', async (req, res, next) => {
    const result = await pool.query(`SELECT vacation_id FROM user_vacation WHERE username='${req.params.username}'`);
    if (result) {
        res.send(result.map(item => item.vacation_id));
    } else {
        res.status(404).send('error');
    }
});

router.put('/update/:id', async (req, res, next) => {
    const id = req.params.id;  
    const queryStr = (`UPDATE vacation 
    SET img='${req.body.img}',description='${req.body.description}',destination='${req.body.destination}',
    fromDate='${req.body.fromDate}',toDate='${req.body.toDate}',price=${req.body.price}
    where ID=${id}`);
    const result = await pool.query(queryStr);
    if (result) {
        const queryStr2 = `select * from vacation`;
        const result2 = await pool.query(queryStr2);
        if (result2) {
            res.send(result2);
            global.socket_io.emit('vecations-updated', result2);  
        } else {
            res.status(404).send('error');
        }
    } else {
        res.status(404).send('error');
    }
});

router.post('/add', async (req, res, next) => {
    let queryStr = `INSERT INTO vacation (description,destination,img,fromDate,toDate,price)  
    VALUES ('${req.body.description}','${req.body.destination}','${req.body.img}','${req.body.fromDate}','${req.body.toDate}',${req.body.price}) ` 
    const result = await pool.query(queryStr);  

    if (result) {
        let queryStr2 = `SELECT * FROM vacation`
        const result2 = await pool.query(queryStr2);
        if (result2) {
            res.send(result2);
            global.socket_io.emit('vecations-updated', result2);  
        } else {
            res.status(404).send('error');
        }
    } else {
        res.status(404).send('error');
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id; 
    const result = await pool.query(`DELETE  FROM vacation where ID='${id}';`);
    const resultFollow = await pool.query(`DELETE  FROM user_vacation where vacation_id='${id}';`)
    if (result) {
        const result2 = await pool.query(`SELECT * FROM vacation`);
        if (result2) {
            res.send(result2);
            global.socket_io.emit('vecations-updated', result2); 
        } else {
            res.status(404).send('error');
        }
    } else {
        res.status(404).send('error');
    }
});

router.get('/all', async (req, res, next) => {
    const results = await pool.query(`SELECT * FROM vacation;`);
    res.json(results);
});

module.exports = router;