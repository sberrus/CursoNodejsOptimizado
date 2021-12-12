//Helpers
const { subirArchivos } = require("../helpers");

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

	res.json({ ok: true, coleccion, id });
};

module.exports = { cargarArchivo, actualizarImagenUsuario };
