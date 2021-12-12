//Imports
const { response } = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Schemas
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt-generator");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
	const { correo, password } = req.body;

	try {
		//Vaidaciones
		//existe correo
		const usuario = await Usuario.findOne({ correo });
		if (!usuario) {
			return res
				.status(400)
				.json({ msg: "Error al iniciar sesión - Correo" });
		}
		//usuario activo
		if (usuario.estado === false) {
			return res
				.status(400)
				.json({ msg: "Error al iniciar sesión - Estado" });
		}
		//contraseña
		const validPassword = bcryptjs.compareSync(password, usuario.password);
		if (!validPassword) {
			return res
				.status(400)
				.json({ msg: "Error al iniciar sesión - Password" });
		}
		//generar JWT
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Error en el servidor",
		});
	}
};

const googleSignIn = async (req, res = response) => {
	const { id_token } = req.body;

	try {
		//enviamos el token que nos devuelve el cliente al haberse loggeado con el boton de google y extraemos la información de dicho token con los métodos de autenticación en el backend de google.
		const { nombre, img, correo } = await googleVerify(id_token);



		//Comprobando si el correo ya esta registrado en la bbdd.
		let usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			//Crear usuario
			const data = {
				//datos de google
				nombre,
				correo,
				//enviamos un valor por defecto. El usuario nunca va a poder hacer login con una contraseña debido a que al pasar esto por bcrypt nunca hará match.
				password: ":P",
				img,
				//propiedad para lógica de autenticación
				google: true,
				role: "USER_ROLE",
			};
			usuario = new Usuario(data);
			await usuario.save();
		}

		//Si el usuario en DB tiene el estado en false
		if (!usuario.estado) {
			return res.status(401).json({
				ok: false,
				msg: "Hable con el administrador, usuario bloqueado",
			});
		}

		//Generar el jwt
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			ok: false,
			msg: "Token no se ha verificado correctamente",
			error,
			id_token,
		});
	}
};

module.exports = { login, googleSignIn };
