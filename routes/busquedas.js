//Imports
const { Router } = require("express");
const { buscar } = require("../controllers");

//Route
const router = Router();

router.get("/:coleccion/:termino", buscar);

module.exports = router;
