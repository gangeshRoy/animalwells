
var db = require('../database/db_config_mysql.js').localConnect();
const getListAnimal = (req, res) => {
 
    let sql = 'SELECT * FROM tbl_animalBag_master';
    db.query(sql, (err, rows) => {
        if (err) {
            res.json('error');
        } else {
            res.json(rows);
        }
    })
}

module.exports = {
    getListAnimal : getListAnimal
    
   
};