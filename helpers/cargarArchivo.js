//Helpers de carga de archivos

//Imports
const { v4: uuidv4 } = require("uuid");
const path = require("path");

/**
 *
 * @param {*} files req.files el archivo que recive desde el cliente
 * @param {*} extensionesValidas array de strings con las extenciones permitidas -
 * default ["png", "jpg", "jpeg", "gif"]
 * @param {*} carpeta nombre de la sub-carpeta donde se almacenaran los archivos - optional
 * @returns
 */
const subirArchivos = (
	files,
	extensionesValidas = ["png", "jpg", "jpeg", "gif"],
	carpeta = ""
) => {
	return new Promise((resolve, reject) => {
		//Capturamos el archivo que nos envia el cliente
		const archivo = files?.archivo;

		if (!archivo) {
			return reject("No se ha enviado ningun archivo en la petición");
		}

		//extraemos la extensión del archivo
		const nombreCortado = archivo.name.split(".");
		const extension = nombreCortado.pop();

		//validar extension
		if (!extensionesValidas.includes(extension)) {
			return reject(
				`La extensión ${extension} no esta permitida.Las extenciones válidas son ${extensionesValidas}`
			);
		}

		//Nombre temporal para evitar errores al encontrarse archivos con el mismo nombre
		const nombreTemp = uuidv4() + "." + extension;

		//Construimos el path de donde se almacenará el archivo y con que nombre lo hará.
		const uploadPath = path.join(
			__dirname,
			"../uploads/",
			carpeta,
			nombreTemp
		);

		//El middleware de express-fileupload nos agrega a los archivos un método mv() que nos permite, luego de establecer la lógica de lo que se hará con el archivo, mover este  desde su /tmp/ hasta donde será almacenado.
		archivo.mv(uploadPath, function (err) {
			if (err) {
				return reject(err);
			}

			resolve(nombreTemp);
		});
	});
};

module.exports = { subirArchivos };
