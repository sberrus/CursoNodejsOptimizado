const { request, response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Categoria, Product, Role } = require("../models");

//Listas de colecciones permitidas para las busquedas
const coleccionesPermitidas = ["categorias", "usuarios", "productos", "roles"];

/**
 * Buscar usuarios por nombre, correo o MongoID
 * @param {*} termino nombre de usuario || correo || MongoID
 * @param {*} res response object from express
 */
const buscarUsuarios = async (termino = "", res = response) => {
	//BUSQUEDA MEDIANTE MONGOID

	const esMongoID = isValidObjectId(termino);
	if (esMongoID) {
		const usuario = await Usuario.findById(termino);
		return res.json({
			results: usuario ? [usuario] : [],
		});
	}

	//BUSQUEDA MEDIANTE NOMBRE DE USUARIO

	const regex = new RegExp(termino, "i"); //regex para realizar busquedas insensibles. (Si enviamos algo como "test" va a devolver todos los usuarios que tengan "test" en el nombre indiferentemente si son "test 1" "TEST" "test1" "testtest" etc...). Siempre y cuando este el string "test" presente lo encontrará.

	const usuarios = await Usuario.find({
		//$or nos permite indicar más de una ruta para llegar a documentos dentro de la colección. Se le envia un array con las rutas que deseemos buscar dentro de la colección.
		$or: [{ nombre: regex }, { correo: regex }],
		//$nor nos permite indicarle reglas para que no tome en cuenta lo que hagamos en ella.
		$nor: [{ estado: false }],
		//$and nos permite usar la lógica de los AND para las consultas a la bbdd. Para la busqueda actual un equivalente seria especificar en el $and la siguiente estructura: {$and:[{estado:true}]} de esta forma solo devolverá los elementos que también concuerden con dicha regla.
	});

	res.json({
		results: usuarios,
	});
};

/**
 * Buscar categorias por su nombre o por MongoID
 * @param {*} termino nombre de usuario || MongoID
 * @param {*} res response object from express
 */
const buscarCategorias = async (termino = "", res = response) => {
	//BUSCAR POR MONGOID
	const esMongoID = isValidObjectId(termino);
	if (esMongoID) {
		const categoria = await Categoria.findById(termino);
		return res.json({
			results: categoria ? [categoria] : [],
		});
	}

	const regex = RegExp(termino, "i"); //regex del termino

	const categorias = await Categoria.find({
		nombre: regex,
		$and: [{ estado: true }],
	});

	res.json({ results: categorias ? [categorias] : [] });
};

/**
 * Buscar productos mediante Mongoid, nombre de producto o descripcion
 * @param {*} termino MongoID || nombre || descripcion
 * @param {*} res response object from express
 * @returns
 */
const buscarProductos = async (termino = "", res = response) => {
	//VALIDAR POR MONGOID
	const esMongoID = isValidObjectId(termino);
	if (esMongoID) {
		const producto = await Product.findById(termino).populate(
			"categoria",
			"nombre"
		);
		return res.json({
			results: producto ? [producto] : [],
		});
	}

	//BUSCAR POR NOMBRE || DESCRIPCION
	const regex = RegExp(termino, "i"); //regex del termino

	const productos = await Product.find({
		$or: [{ nombre: regex }, { descripcion: regex }],
		$and: [{ disponible: true }],
	}).populate("categoria", "nombre");

	res.json({ results: productos ? [productos] : [] });
};

/**
 * Buscar roles mediante Mongoid o nombre del rol
 * @param {*} termino MongoID || nombre
 * @param {*} res response object from express
 * @returns
 */
const buscarRoles = async (termino = "", res = response) => {
	//VALIDAR POR MONGOID
	const esMongoID = isValidObjectId(termino);
	if (esMongoID) {
		const roles = await Role.findById(termino);
		return res.json({
			results: roles ? [roles] : [],
		});
	}

	//BUSCAR POR NOMBRE
	const regex = RegExp(termino, "i"); //regex del termino

	const roles = await Role.find({ role: regex });

	res.json({ results: roles ? [roles] : [] });
};

/**
 * busca en la bbdd elementos que coincidan en la busqueda pudiendo enviarles mediante query*
 * params la coleccion y el termino.
 */
const buscar = (req = request, res) => {
	const { coleccion, termino } = req.params;

	//Permitir busquedas solo en las colecciones permitidas
	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `Las colecciones permitidas son ${coleccionesPermitidas}`,
		});
	}

	switch (coleccion) {
		case "categorias":
			return buscarCategorias(termino, res);
		case "usuarios":
			return buscarUsuarios(termino, res);
		case "productos":
			return buscarProductos(termino, res);
		case "roles":
			return buscarRoles(termino, res);
		default:
			res.status(500).json({ msg: "Busqueda no permitida actualmente" });
	}
};

module.exports = { buscar };
