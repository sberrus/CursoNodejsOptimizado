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
		const nombre = await subirArchivos(req.files, ["jpg", "pdf"]);
		res.json({ nombre });
	} catch (error) {
		console.log(error);
		res.status(400).json({ error });
	}
};

module.exports = { cargarArchivo };
