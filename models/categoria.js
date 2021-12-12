const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
	nombre: {
		type: String,
		required: [true, "El nombre es obligatorio"],
		unique: true,
	},
	estado: {
		type: Boolean,
		default: true,
	},
	//El siguiente campo es un campo que dentro tendra un schema de usuario pero para no hacer el Schema entero, hacemos una referencia a otro Schema ya existente, en este caso "Usuario"
	usuario: {
		//Recive un id de Mongo del documento dentro del schema que enviamos como referencia para instanciar los datos.
		type: Schema.Types.ObjectId,
		//El Schema de referencia que va a usar este campo
		ref: "Usuario",
		//Todas las categorias deben tener un usuario que las haya creado
		required: true,
	},
});

//Modificando Payload del Schema
CategoriaSchema.methods.toJSON = function () {
	const { __v, estado, _id, ...categoria } = this.toObject();
	categoria.uid = _id;
	return categoria;
};

module.exports = model("Categoria", CategoriaSchema);
