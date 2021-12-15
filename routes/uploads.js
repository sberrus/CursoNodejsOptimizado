//Imports
const { Router } = require("express");
const { check } = require("express-validator");

//Controllers
const { cargarArchivo, actualizarImagen, mostrarImagen } = require("../controllers");
const { coleccionesPermitidas } = require("../helpers");
const { validarCampos, validarArchivo } = require("../middlewares");

//App
const router = Router();

router.post("/", validarArchivo, cargarArchivo);

router.put(
	"/:coleccion/:id",
	[
		validarArchivo,
		check("id")
			.notEmpty()
			.withMessage("Debes enviar un id")
			.isMongoId()
			.withMessage("El id no es un ID válido de Mongo"),
		check("coleccion").custom((c) => coleccionesPermitidas(c, ["usuarios", "productos"])),
		validarCampos,
	],
	actualizarImagen
);

router.get(
	"/:coleccion/:id",
	[
		check("id")
			.notEmpty()
			.withMessage("Debes enviar un id")
			.isMongoId()
			.withMessage("El id no es un ID válido de Mongo"),
		check("coleccion").custom((c) => coleccionesPermitidas(c, ["usuarios", "productos"])),
		validarCampos,
	],
	mostrarImagen
);

module.exports = router;
