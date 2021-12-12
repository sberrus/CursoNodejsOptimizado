const { response, request } = require("express");
const { Categoria, Product } = require("../models");

const crearProductos = async (req = request, res = response) => {
	//data
	const userID = req.uid;
	const {
		nombre = "",
		categoria = "",
		precio = 0,
		descripcion = "",
		disponible = true,
	} = req.body;

	//Comprobar si la categoria existe, de lo contrario, crear nueva categoria.
	try {
		let cat = await Categoria.findOne({ nombre: categoria.toUpperCase() });

		if (!cat) {
			const nuevaCategoria = new Categoria({
				nombre: categoria.toUpperCase(),
				usuario: userID,
			});
			cat = await nuevaCategoria.save();
		}

		//Guardar producto
		const product = new Product({
			nombre: nombre.toUpperCase(),
			usuario: userID,
			precio,
			categoria: cat._id,
			descripcion,
			disponible,
		});
		const newProduct = await product.save();

		res.json({ ok: true, newProduct });
	} catch (error) {
		console.log(error);
		res.status(401).json({ ok: false, error });
	}
};

const verTodosLosProductos = async (req, res) => {
	const [total, productos] = await Promise.all([
		Product.countDocuments().where({ disponible: true }),
		Product.find()
			.where({ disponible: true })
			.populate("categoria", "nombre"),
	]);
	res.json({ total, productos });
};

const verProductoPorID = async (req, res) => {
	//Document id
	const { id } = req.params;
	const producto = await Product.findById(id)
		.populate("usuario", "nombre")
		.populate("categoria", "nombre");

	res.json({ producto });
};

const actualizarProductos = async (req, res) => {
	const userID = req.uid; //User ID
	const { id } = req.params; //product id

	const { nombre, precio, descripcion, disponible, categoria } = req.body; //body data

	try {
		let cat = await Categoria.findOne({ nombre: categoria.toUpperCase() });

		if (!cat) {
			const nuevaCategoria = new Categoria({
				nombre: categoria.toUpperCase(),
				usuario: userID,
			});
			cat = await nuevaCategoria.save();
		}

		const product = await Product.findByIdAndUpdate(
			id,
			{
				nombre: nombre.toUpperCase(),
				precio,
				descripcion,
				disponible,
				categoria: cat._id,
			},
			{ new: true }
		);

		res.json({ product });
	} catch (error) {
		console.log(error);
		res.status(400).json({ ok: false });
	}
};

const eliminarProducto = async (req, res) => {
	const { id } = req.params; //Product ID

	const producto = await Product.findByIdAndUpdate(
		id,
		{ disponible: false },
		{ new: true }
	);
	res.json({ producto });
};

module.exports = {
	crearProductos,
	verTodosLosProductos,
	verProductoPorID,
	actualizarProductos,
	eliminarProducto,
};
