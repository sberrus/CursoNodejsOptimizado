//todo: Unificar busqueda de existencia de documento en la bbdd reciviendo el id del documento o el string del nombre para hacerla más flexible.

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

/**
 * Comprueba si el usuario existe en la BBDD mediante su MONGOID
 * @param {*} id MONGOID
 */
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
 * @param {*} id MongoID de la categoria
 */
const existeCategoria = async (id) => {
	const categoria = await Categoria.findById(id);
	if (!categoria) {
		throw new Error(`La categoria no existe en la BBDD`);
	}
};

/**
 * Verifica si existe la categoria a partir de su nombre
 * @param {*} nombre Nombre de categoria -- String
 */
const existeCategoriaPorNombre = async (nombre = "") => {
	const categoria = await Categoria.findOne({ nombre: nombre.toUpperCase() });
	if (!categoria) {
		throw new Error(`La cateogoria ${nombre} no existe en la BBDD`);
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

/**
 * Colecciones permitidas
 */

const coleccionesPermitidas = (coleccion = "", coleccionesPermitidas = []) => {
	const incluida = coleccionesPermitidas.includes(coleccion);

	if (!incluida) {
		throw new Error(
			`La colección ${coleccion}, no esta permitida. Las colecciones permitidas son: ${coleccionesPermitidas}`
		);
	}

	return true;
};
module.exports = {
	esRoleValido,
	existeEmail,
	existeUsuarioPorId,
	existeCategoria,
	existeNombre,
	existeProducto,
	existeCategoriaPorNombre,
	coleccionesPermitidas,
};
