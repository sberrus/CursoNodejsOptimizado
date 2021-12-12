//Imports
const { Router } = require("express");

//Controllers
const { cargarArchivo } = require("../controllers");

//App
const router = Router();

router.post(
	"/",
	[
		//No incorporaremos middlewares ni checks en este ejemplo para simplificar las clases e ir a lo escencial de este módulo
	],
	cargarArchivo
);

module.exports = router;
