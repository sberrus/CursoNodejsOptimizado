//Helpers
const { subirArchivos } = require("../helpers");

//Models
const { Product, Usuario } = require("../models");

const cargarArchivo = async (req, res) => {
	//Verifica si hay archivos en la petición
	if (
		!req.files ||
		Object.keys(req.files).length === 0 ||
		!req.files.archivo
	) {
		res.status(400).json({ msg: "No files were uploaded." });
		return;
	}

	try {
		const nombre = await subirArchivos(req.files, ["pdf"], "pdf");
		res.json({ nombre });
	} catch (error) {
		console.log(error);
		res.status(400).json({ error });
	}
};

const actualizarImagenUsuario = async (req, res) => {
	const { coleccion, id } = req.params;

	let modelo;

	switch (coleccion) {
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res
					.status(400)
					.json({ msg: `No existe un usuario con el id ${id}` });
			}
			break;
		case "productos":
			modelo = await Product.findById(id);
			if (!modelo) {
				return res
					.status(400)
					.json({ msg: `No existe un producto con el id ${id}` });
			}
			break;
		default:
			return res.status(500).json({
				msg: "No se ha implementado esta función jeje sorry :)",
			});
	}

	try {
		//Guardamos la imagen en la BBDD y capturamos el nombre para actualizar la información en la BBDD
		const nombre = await subirArchivos(req.files, undefined, coleccion);
		modelo.img = nombre;
		await modelo.save();

		res.json(modelo);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ msg: error });
	}
};

module.exports = { cargarArchivo, actualizarImagenUsuario };
