const { Router } = require("express");
const { check, body } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post(
	"/",
	[
		check("correo").notEmpty().withMessage("El correo es obligatorio"),
		check("password")
			.notEmpty()
			.withMessage("La contraseña es obligatoria"),
		validarCampos,
	],
	login
);

router.post(
	"/google",
	[body("id_token").notEmpty().withMessage("id_token es necesario")],
	validarCampos,
	googleSignIn
);

module.exports = router;
