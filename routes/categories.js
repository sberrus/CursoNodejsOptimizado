const { Router } = require("express");
const { check } = require("express-validator");
const {
	crearCategoria,
	obtenerCategoria,
	obtenerCategorias,
	actualizarCategoria,
	eliminarCategoria,
} = require("../controllers/categories");
const { existeCategoria } = require("../helpers/db-validators");

const { validarJWT, validarCampos, esAdmin } = require("../middlewares");

const router = Router();

//TODO: En las rutas que tienen section params, realizar una comprobación personalizada para comprobar que el id sea válido. Crear custom validator

//Obtener todas las categorias - Public  DONE
router.get("/", obtenerCategorias);

//Crear Categoría - private  DONE
router.post(
	"/",
	[
		check("nombre", "El nombre es obligatorio").notEmpty(),
		validarJWT,
		validarCampos,
	],
	crearCategoria
);

//Obtener categoria por id - public  DONE
router.get(
	"/:id",
	[
		check("id")
			.notEmpty()
			.isMongoId()
			.withMessage("El ID no es un ID de mongo válido")
			.bail()
			.custom(existeCategoria),
		validarJWT,
		validarCampos,
	],
	obtenerCategoria
);

//Actualizar registros por id - private
router.put(
	"/:id",
	[
		check("id")
			.notEmpty()
			.isMongoId()
			.withMessage("El ID no es un ID de mongo válido")
			.bail()
			.custom(existeCategoria),
		check("nombre")
			.notEmpty()
			.withMessage("El nombre no puede estar vacío"),
		validarJWT,
		validarCampos,
	],
	actualizarCategoria
);

//Eliminar categoria - admin only
router.delete(
	"/:id",
	[
		check("id")
			.notEmpty()
			.isMongoId()
			.withMessage("El ID no es válido")
			.bail()
			.custom(existeCategoria),
		validarCampos,
		validarJWT,
		esAdmin,
	],
	eliminarCategoria
);

module.exports = router;
