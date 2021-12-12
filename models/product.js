const { Schema, model } = require("mongoose");
const ProductoSchema = Schema({
	nombre: {
		type: String,
		required: [true, "nombre de usuario obligatorio"],
	},
	usuario: {
		type: Schema.Types.ObjectId,
		ref: "Usuario",
		required: true,
	},
	precio: {
		type: Number,
		default: 0,
	},
	categoria: {
		type: Schema.Types.ObjectId,
		ref: "Categoria",
		required: true,
	},
	descripcion: {
		type: String,
	},
	disponible: {
		type: Boolean,
		default: true,
	},
});

ProductoSchema.methods.toJSON = function () {
	const { __v, _id, ...data } = this.toObject();
	data.uid = _id;
	return data;
};

module.exports = model("Producto", ProductoSchema);
