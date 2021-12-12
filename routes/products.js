//imports
const { Router } = require("express");
const { check } = require("express-validator");

//Controllers
const {
	crearProductos,
	verTodosLosProductos,
	verProductoPorID,
	actualizarProductos,
	eliminarProducto,
} = require("../controllers/product");

//Helpers
const { existeNombre, existeProducto } = require("../helpers/db-validators");

//Middlewares
const { validarCampos, validarJWT, esAdmin } = require("../middlewares");

//Route
const router = Router();

//Nuevo producto - privado
router.post(
	"/",
	[
		validarJWT,
		esAdmin,
		check("nombre", "El campo nombre es obligatorio")
			.notEmpty()
			.custom(existeNombre),
		check("categoria", "El campo categoria es obligatorio").notEmpty(),
		validarCampos,
	],
	crearProductos
);

//Ver productos - Público
router.get("/", verTodosLosProductos);

//Ver producto por ID - Público
router.get(
	"/:id",
	[check("id").notEmpty().isMongoId().custom(existeProducto), validarCampos],
	verProductoPorID
);

//Actualizar producto - privado
router.put(
	"/:id",
	[
		validarJWT,
		check("id").notEmpty().isMongoId().custom(existeProducto),
		check("nombre").optional(),
		check("precio")
			.optional()
			.isNumeric()
			.withMessage("El campo 'precio' debe ser un número"),
		check("descripcion").optional(),
		check("disponible")
			.optional()
			.isBoolean()
			.withMessage("El campo 'disponible' debe ser booleano"),
		validarCampos,
	],
	actualizarProductos
);

//Eliminar producto - privado - admin
router.delete(
	"/:id",
	[
		validarJWT,
		esAdmin,
		check("id").notEmpty().isMongoId().custom(existeProducto),
		validarCampos,
	],
	eliminarProducto
);

module.exports = router;
