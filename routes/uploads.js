//Imports
const { Router } = require("express");
const { check } = require("express-validator");

//Controllers
const { cargarArchivo, actualizarImagenUsuario } = require("../controllers");
const { existeUsuarioPorId, coleccionesPermitidas } = require("../helpers");
const { validarCampos, validarJWT } = require("../middlewares");

//App
const router = Router();

router.post("/", cargarArchivo);

router.put(
	"/:coleccion/:id",
	[
		check("id")
			.notEmpty()
			.withMessage("Debes enviar un id")
			.isMongoId()
			.withMessage("El id no es un ID válido de Mongo"),
		check("coleccion").custom((c) =>
			coleccionesPermitidas(c, ["usuarios", "productos"])
		),
		validarCampos,
	],
	actualizarImagenUsuario
);

module.exports = router;
