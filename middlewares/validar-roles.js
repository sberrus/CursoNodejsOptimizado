//Schemas
const Usuario = require("../models/usuario");

/**
 *
 * @param  {...any} roles Array de strings con los roles permitidos
 * @returns
 */
const validarRoles = (...roles) => {
	return async (req, res, next) => {
		const { uid } = req; //verified uid of request

		const usuario = await Usuario.findById(uid); //db query
		if (!roles.includes(usuario.role)) {
			return res.status(401).json({
				msg: `Solo los usuarios con rol ${roles} pueden realizar esta acción`,
			});
		}
		next();
	};
};

/**
 *	Verifica si el JWT contiene un usuario con rol ="ADMIN_ROLE". Este middleware debe ir después del middleware validarJWT().
 */
const esAdmin = async (req, res, next) => {
	//UserID que devuelve el validador de jwt
	const userID = req.uid;

	//Mongo document
	const usuario = await Usuario.findById(userID);

	if (usuario.role !== "ADMIN_ROLE") {
		return res.status(400).json({
			ok: false,
			msg: "El usuario no cuenta con los permisos necesarios para realizar esta consulta - role",
		});
	}
	next();
};

module.exports = { validarRoles, esAdmin };
