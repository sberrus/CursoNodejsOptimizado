const path = require("path");

const cargarArchivo = (req, res) => {
	//Verifica si hay archivos en la petición
	if (!req.files || Object.keys(req.files).length === 0) {
		res.status(400).json({ msg: "No files were uploaded." });
		return;
	}

	//Comprobar que el cliente haya enviado el archivo con el nombre adecuado para el backend. (El atributo "name" del input)
	if (!req.files.archivo) {
		res.status(400).json({ msg: "No files were uploaded." });
		return;
	}

	//Capturamos el archivo que nos envia el cliente
	const { archivo } = req.files;

	//Construimos el path de donde se almacenará el archivo y con que nombre lo hará.
	const uploadPath = path.join(__dirname, "../uploads/", archivo.name);

	//El middleware de express-fileupload nos agrega a los archivos un método mv() que nos permite, luego de establecer la lógica de lo que se hará con el archivo, mover este  desde su /tmp/ hasta donde será almacenado.
	archivo.mv(uploadPath, function (err) {
		if (err) {
			return res.status(500).json({ err });
		}

		res.json({ msg: "File uploaded to " + uploadPath });
	});
};

module.exports = { cargarArchivo };
