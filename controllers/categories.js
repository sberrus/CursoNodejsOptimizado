const { request, response } = require("express");
const { Categoria, Usuario } = require("../models");

//todo: Crear los controladores de cada una de las acciones que deseamos hacer con las categorias. Cada una de las acciones tiene sus propias reglas

//Obtener categorias - paginado - total - populate* -> Investigar
const obtenerCategorias = async (req = request, res) => {
	const { limit = 5, offset = 0 } = req.query;

	//Consulta
	const [total, categorias] = await Promise.all([
		Categoria.countDocuments().where({ estado: true }),
		await Categoria.find({ estado: true })
			.limit(parseInt(limit))
			.skip(parseInt(offset)),
	]);

	//respuesta
	res.json({ total, categorias });
};

//Obtener categoria - populate* -> Investigar
const obtenerCategoria = async (req = request, res) => {
	//Param
	const { id } = req.params;

	//categoria
	const categoria = await Categoria.findById(id).populate("usuario", [
		//Ejemplo para llamar multiples elementos del populate.
		"nombre",
		"role",
	]);

	//Populate nos permite llamar a la información que contiene el documento referenciado dentro del schema al que se aplica. Por lo tanto en el Schema de Categorias tenemos una llave que se llama usuario que contiene el id de un documento del Schema Usuario. Al momento de almacenar los datos Mongo guarda el id del documento usuario.
	//Populate nos permite llamar a dicha información y al momento de devolver el documento devuelve toda la información referente al documento referenciado.
	//p* Si enviamos un solo argumento, llamamos a todo la información del documento pero en el segundo argumento podemos pasar una sola propiedad que nos permite acceder solo a la información que deseemos. En este ejemplo solo llamaremos a la propiedad nombre del documento Usuario referenciado al Schema de Categoria. Tambien podemos enviarle un arreglo en strings con todos los elementos que deseamos que nos devuelva la consulta.
	//respuesta
	res.json(categoria);
};

//Crear categoria
const crearCategoria = async (req, res = response) => {
	//body
	const nombre = req.body.nombre.toUpperCase();

	//Check if the category exists
	const categoriaDB = await Categoria.findOne({ nombre });
	if (categoriaDB) {
		return res.status(400).json({
			msg: `La categoria ${categoriaDB.nombre}, ya existe`,
		});
	}

	//Datos para el modelo
	const data = {
		nombre,
		usuario: req.uid,
	};
	//Instanciando nuevo modelo con los datos.
	const categoria = new Categoria(data);

	//Guardar DB
	await categoria.save();

	//return
	res.status(201).json(categoria);
};

//Actualizar categoria
const actualizarCategoria = async (req, res) => {
	//param
	const { id } = req.params;
	//body
	const { nombre = "", ...resto } = req.body;

	const categoria = await Categoria.findByIdAndUpdate(
		id,
		{
			nombre: nombre.toUpperCase(),
		},
		//La configuración "new" nos permite observar el documento ya actualizado en la consulta.
		{ new: true }
	);

	res.json(categoria);
};

//Borrar categoria (cambiando estado solamente)
const eliminarCategoria = async (req, res) => {
	//MongoID
	const { id } = req.params;

	//Cambiar status de la bbdd del documento
	data = {
		estado: false,
	};

	const categoria = await Categoria.findByIdAndUpdate(id, data);

	res.json({ ok: true });
};

module.exports = {
	crearCategoria,
	obtenerCategoria,
	obtenerCategorias,
	actualizarCategoria,
	eliminarCategoria,
};
