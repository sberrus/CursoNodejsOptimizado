//Imports
const { Router } = require("express");
const { check } = require("express-validator");

//Controllers
const { actualizarImagenCloudinary, mostrarImagenCloudinary } = require("../controllers");
const { coleccionesPermitidas } = require("../helpers");
const { validarCampos, validarArchivo, validarJWT } = require("../middlewares");

//App
const router = Router();

// router.post("/", validarArchivo, cargarArchivo);

router.put(
	"/:coleccion/:id",
	[
		validarJWT,
		validarArchivo,
		check("id")
			.notEmpty()
			.withMessage("Debes enviar un id")
			.isMongoId()
			.withMessage("El id no es un ID válido de Mongo"),
		check("coleccion").custom((c) => coleccionesPermitidas(c, ["usuarios", "productos"])),
		validarCampos,
	],
	actualizarImagenCloudinary
	// actualizarImagen --> Modificamos el controlador que almacena los archivos en el servidor y usamos mejor el servicio de CDN de Cloudinary
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
	mostrarImagenCloudinary
);

module.exports = router;
