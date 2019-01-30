var express = require("express");
var router = express.Router();
router.get("/*", (req, res, next) => {
  next();
});


router.post("/*", (req, res, next) => {
  next();
});



var dasboardDataObj = require("../controllers/dashboard.js");
router.get("/getListAnimal", dasboardDataObj.getListAnimal); 

module.exports = router;
