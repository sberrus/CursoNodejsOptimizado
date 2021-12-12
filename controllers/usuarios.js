const { response, request } = require("express");
const bcryptjs = require("bcryptjs");

//p*:Los modelos se inicializan con mayusculas para dejar más claro que es un objeto al que podemos instanciar.
const Usuario = require("../models/usuario");

const getUsers = async (req = request, res = response) => {
	//querys
	const query = { estado: true };
	const { limit = 8, offset = 0 } = req.query;
	/* 
	//el método .find() devuelve todos los documentos del Schema.
	const usuarios = await Usuario.find(query)
		//Método para limitar la cantidad de documentos que devuelve la BD.
		.limit(parseInt(limit))
		.skip(parseInt(offset));
	//conocer total de documentos de la colección.
	const total = await Usuario.countDocuments(query);
 */
	//p* El método .all del objeto Promise, nos permite disparar un arreglo de promesas de manera simultanea. A diferencia de los async/await que cargan de manera secuencial, Promise.all carga todo las promesas a la vaz en hilos paralelos permitiendo que el tiempo de carga de las mismas se optimice. Si una de las promesas da error todas lo haran.
	const [total, usuarios] = await Promise.all([
		Usuario.countDocuments(query),
		await Usuario.find(query).limit(parseInt(limit)).skip(parseInt(offset)),
	]);

	res.status(200).json({ total, usuarios });
};

const postUsers = async (req = request, res) => {
	//El express-validator verifica los campos que deseamos validar, en el caso de que alguno tena algun error, debemos capturarlo con la función validationResult(req) que recibe como argumento la request.

	let { nombre, correo, password, role } = req.body;

	//h2*: Proceso de creación de Schema y guardado en bbdd MongoDB.

	//h3*: Instancia del Schema para mandar a la bbdd.
	//Enviamos el objeto que nos envia el cliente a la instancia del Schema que se encarga de crear un objeto valido para MongoDB.

	const usuario = new Usuario({ nombre, correo, password, role });

	//todo: Encriptar contraseña

	//El salt es un valor que se usa para darle más seguridad a un encriptado. Por defecto el valor que recive es 10, mientras mayor sea este número, mayor seguridad tendrá el encriptado, pero esto también hace que la momento de desencriptar la contraseña dure más este proceso.
	const salt = bcryptjs.genSaltSync();

	//Enviamos a la propiedad password del modelo la contraseña hasheada mediante el método .hashSync(string,salt).
	usuario.password = bcryptjs.hashSync(password, salt);

	//h3*: Guardado en BBDD
	//p*: Para guardar los datos en la ddbb se usa el método save() de la instancia el cual nos permite, después de resolver el Schema, mandar los datos a la ddbb.
	//p*: Si el Schema devuelve un error tenemos que atajarlo con un try...catch para poder interactuar con el usuario.
	try {
		await usuario.save();
		res.status(201).json(usuario);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			errorMessage: "Faltan datos obligatorios",
			error,
		});
	}
};
const putUsers = async (req = request, res) => {
	//Section query
	const { id } = req.params;
	//p*: Al destructurar estamos separando las propiedades que no vamos a utilizar o que vamos a modificar de alguna forma y el resto de propiedades las tendremos en el rest operator ...resto. Este Resto es el que se envia a Mongoose para poder actualiazar los paths que hay dentro de este.
	//p*: En el siguiente ejemplo vemos que sacamos _id que es donde aparece el objectID de Mongo. Esto lo hacemos para que en el caso de que nos envien desde el front una propiedad "_id: ñjkfasdk" este lo capture y no llegue a la modificación de la BBDD.
	const { _id, password, google, ...resto } = req.body;

	//Validar contra bbdd
	if (password) {
		//Encriptar contraseña
		const salt = bcryptjs.genSaltSync();
		resto.password = bcryptjs.hashSync(password, salt);
	}
	try {
		const usuario = await Usuario.findByIdAndUpdate(id, resto);
		res.json({ usuario });
	} catch (error) {
		res.status(400).json({ error });
	}
};
const patchUsers = (req, res) => {
	res.json({ msg: "PATCH - desde controller" });
};
const deleteUsers = async (req = request, res) => {
	//params
	const { id } = req.params;

	//extrayendo uid desde la funcion verificarJWT()
	const { uid } = req;

	//ddbb
	try {
		//Eliminar documento de una collección:
		//p*: No se recomienda eliminar directamente al usuario por completo porque esto hace que perdamos la concurrencia con los datos. La mejor práctica es utilizar la propiedad "estado" del documento. Esto para poder utilizar los filtros de Mongo y es mejor para evitar problemas de concurrencia.
		/* const usuario = await Usuario.findByIdAndDelete(id); */

		//Eliminar usuario sin eliminar el documento. Modificar la propiedad estado:
		//p*: De esta forma estamos mediante el estado, dando de baja a un usuario pero sin perder los datos del mismo. Esto le permitiría al usuario en cuestión poder recuperar su información en cualquier momento o si tiene alguna interacción con otros usuarios, no perder el contenido de los mismos.
		const usuario = await Usuario.findByIdAndUpdate(id, {
			estado: false,
		});
		res.status(200).json({ usuario, uid });
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	getUsers,
	postUsers,
	putUsers,
	patchUsers,
	deleteUsers,
};
