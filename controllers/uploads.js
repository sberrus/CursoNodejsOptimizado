//Node Imports
const path = require("path");
const fs = require("fs");

//Imports
const { response } = require("express");

//Helpers
const { subirArchivos } = require("../helpers");

//Models
const { Product, Usuario } = require("../models");

const cargarArchivo = async (req, res) => {
	try {
		const nombre = await subirArchivos(req.files, ["pdf"], "pdf");
		res.json({ nombre });
	} catch (error) {
		console.log(error);
		res.status(400).json({ error });
	}
};

const actualizarImagen = async (req, res) => {
	const { coleccion, id } = req.params;

	let modelo;

	switch (coleccion) {
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
			}
			break;
		case "productos":
			modelo = await Product.findById(id);
			if (!modelo) {
				return res.status(400).json({ msg: `No existe un producto con el id ${id}` });
			}
			break;
		default:
			return res.status(500).json({
				msg: "No se ha implementado esta función jeje sorry :)",
			});
	}

	try {
		//Limpiar imágenes previas
		if (modelo.img) {
			//Hay que borrar la imagen del servidor
			const pathImagen = path.join(__dirname, "../uploads", coleccion, modelo.img); //Construimos la ruta de la imágen que deseamos comprobar
			//Verificamos que la imágen existe
			if (fs.existsSync(pathImagen)) {
				//Si existe la eliminamos
				fs.unlinkSync(pathImagen);
			}
		}

		//Guardamos la imagen en la BBDD y capturamos el nombre para actualizar la información en la BBDD
		const nombre = await subirArchivos(req.files, undefined, coleccion);
		modelo.img = nombre;
		await modelo.save();

		res.json(modelo);
	} catch (error) {
		return res.status(500).json({ msg: error });
	}
};

const mostrarImagen = async (req, res = response) => {
	const { id, coleccion } = req.params;
	let modelo;

	switch (coleccion) {
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo) {
				//Como estamos trabajando con imagenes podemos modificar el comportamiento en el caso de que no encuentre nada tomando en cuenta los requerimientos del proyecto, podemos enviar una imágen por defecto, avisar de que no se encuentra el archivo o cualquier otro comportamiento.
				return res.status(400).json({ msg: `No existe un usuario con el id ${id}` });
			}
			break;
		case "productos":
			modelo = await Product.findById(id);
			if (!modelo) {
				//Como estamos trabajando con imagenes podemos modificar el comportamiento en el caso de que no encuentre nada tomando en cuenta los requerimientos del proyecto, podemos enviar una imágen por defecto, avisar de que no se encuentra el archivo o cualquier otro comportamiento.
				return res.status(400).json({ msg: `No existe un producto con el id ${id}` });
			}
			break;
		default:
			return res.status(500).json({
				msg: "No se ha implementado esta función jeje sorry :)",
			});
	}
	const placeholderPath = path.join(__dirname, "../assets/placeholder.jpg");
	try {
		//Comprobamos que en el modelo haya una imagen definida.
		if (modelo.img) {
			const pathImagen = path.join(__dirname, "../uploads", coleccion, modelo.img); //Construimos la ruta de la imágen que deseamos comprobar
			//Verificamos que la imágen existe en físico
			if (!fs.existsSync(pathImagen)) {
				res.status(500).json({ msg: "Falta placeholder" });
			}
			return res.sendFile(pathImagen);
		}
		return res.sendFile(placeholderPath);
	} catch (error) {
		return res.sendFile(placeholderPath);
	}
};

module.exports = { cargarArchivo, actualizarImagen, mostrarImagen };
