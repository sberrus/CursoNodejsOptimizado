//Validadores para usar en las funciones custom de la libreria express-validator en su cadena de validaciones
const { Role, Usuario, Categoria, Product } = require("../models");

const esRoleValido = async (role = "") => {
	const existeRole = await Role.findOne({ role });
	if (!existeRole) {
		//express-validator usa los new Error() para manejar los errores dentro de este. No revienta la App.
		throw new Error(`El role ${role} no está registrado en la BBDD`);
	}
};

const existeEmail = async (correo = "") => {
	const existeEmail = await Usuario.findOne({ correo });
	if (existeEmail) {
		throw new Error(
			`El correo ${correo} ya existe. Por favor utilize otro`
		);
	}
};
const existeUsuarioPorId = async (id) => {
	const existeUsuario = await Usuario.findById(id);
	if (!existeUsuario) {
		throw new Error(
			`El ID: ${id}, no existe en la BBDD. Introduzca uno correcto`
		);
	}
};

/**
 * Comprueba si la categoria existe en la DDBB
 * @param {*} id ID de mongoose de la categoria
 */
const existeCategoria = async (id) => {
	const categoria = await Categoria.findById(id);
	if (!categoria) {
		throw new Error(`La categoria no existe en la BBDD`);
	}
};

/**
 * Comprueba si el nombre ya existe en la BBDD
 * @param {*} nombre String
 */
const existeNombre = async (nombre = "") => {
	const productos = await Product.findOne({ nombre: nombre.toUpperCase() });
	if (productos) {
		throw new Error(`El producto ${nombre} ya existe en la bbdd`);
	}
};

/**
 * Verifica si el producto existe en la BBDD antes de proseguir con el resto de validaciones
 * @param {*} id  Document`s MongoID
 */
const existeProducto = async (id = "") => {
	const producto = await Product.findById(id);
	if (!producto) throw new Error("El producto no existe en la bbdd");
};

module.exports = {
	esRoleValido,
	existeEmail,
	existeUsuarioPorId,
	existeCategoria,
	existeNombre,
	existeProducto,
};
