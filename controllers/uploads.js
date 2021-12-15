//Imports
const path = require("path");
const fs = require("fs");

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

module.exports = { cargarArchivo, actualizarImagenUsuario: actualizarImagen };
