//imports
const { Router } = require("express");
const { check } = require("express-validator");
//controllers
const {
	getUsers,
	postUsers,
	putUsers,
	patchUsers,
	deleteUsers,
} = require("../controllers/usuarios");
//middlewares
/* OPTIMIZANDO LA IMPORTACIÓN DE MIDDLEWARES */
const { validarCampos, validarJWT, validarRoles } = require("../middlewares");
//helpers
const {
	esRoleValido,
	existeEmail,
	existeUsuarioPorId,
} = require("../helpers/db-validators");

const router = Router();

router.get("/", getUsers);
router.post(
	"/",
	//express-validator
	[
		check("nombre", "El nombre es obligatorio").notEmpty(),
		check("password", "El password es obligatorio").notEmpty(),
		check(
			"password",
			"El password debe tener mínimo 6 caractéres"
		).isLength({ min: 6 }),
		check("correo", "El correo no es valido").isEmail(),
		check("correo").custom(existeEmail),
		check("role").custom(esRoleValido),
		validarCampos,
	],
	postUsers
);
router.put(
	"/:id",
	[
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeUsuarioPorId),
		check("correo").custom(existeEmail),
		check(
			"password",
			"El password debe tener mínimo 6 caractéres"
		).isLength({ min: 6 }),
		check("role").custom(esRoleValido),
		validarCampos,
	],
	putUsers
);
router.patch("/", patchUsers);
router.delete(
	"/:id",
	[
		validarJWT,
		validarRoles("ADMIN_ROLE"),
		check("id", "No es un ID válido").isMongoId(),
		check("id").custom(existeUsuarioPorId),
		validarCampos,
	],
	deleteUsers
);

module.exports = router;
