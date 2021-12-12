//Imports
const { Router } = require("express");

//Controllers
const { cargarArchivo } = require("../controllers");

//App
const router = Router();

router.post("/", cargarArchivo);

module.exports = router;
