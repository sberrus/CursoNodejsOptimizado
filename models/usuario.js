const {
	//Schema: El schema es una serie de normas que se aplican a los datos que vayan a entrar en la ddbb. Si los datos enviados no cumplen con el Schema, no se enviarán a la ddbb.
	Schema,
	//
	model,
} = require("mongoose");

const UsuarioSchema = Schema({
	//campo a modificar
	nombre: {
		//Tipo de dato String,Bool,Number, etc... [revisar la documentación para saber más]
		type: String,
		//Condicional para saber si es requerido o no. Podemos enviar bool para indicar si es requerido o no. También podemos enviar un objeto en el cual el primer elemento va a ser el booleano y el segundo un mensaje de error para devolver en el caso de que no se envie el dato requerido.
		required: [true, "Nombre Obligatorio"],
	},
	correo: {
		type: String,
		required: [true, "El correo es obligatorio"],
		//Define si el campo debe ser unico, en el caso contrario devuelve un error.
		unique: true,
	},
	password: {
		type: String,
		required: [true, "La contraseña es obligatoria"],
	},
	img: {
		default: null,
		type: String,
	},
	role: {
		type: String,
		required: [true, "No se ha indicado el [role] del usuario"],
		//Esta propiedad define mediante un array los valores que son permitidos para este campo.
		emun: ["ADMIN_ROLE", "USER_ROLE"],
	},
	estado: {
		type: Boolean,
		//Esta propiedad define el valor por defecto del campo en el caso de que no le enviemos ningún dato.
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
});

//MODIFICACIÓN DE MÉTODOS DE MONGOOSE
//Modificando retorno al guardar un documento en la BBDD.
UsuarioSchema.methods.toJSON = function () {
	//usamos una función declarativa y una una función llave porque esto nos permite tener mejor control del objeto "this".
	//Esto nos permite utilizar nuestro modelo como si fuera un objeto literal en JS.
	const { __v, password, _id, ...usuario } = this.toObject();
	//devolvemos usuario ya que este contiene todos los valores excepto (__v,password) y todos los que deseemos extraer de los datos que envia el server a la ddbb.
	usuario.uid = _id;
	return usuario;
};

//exportamos la función model() que es la que se encarga de configurar internamente el schema para que pueda ser utilizado.
module.exports = model(
	//El primer argumento es el nombre de la colección. El nombre de la colección se define en singular ya que mongo internamente la reescribe a plural por temas de convención. La otra cosa que hay que tomar en cuenta es que lo vuelve "lowercase" al momento de crear la colección
	"Usuario",
	//El segundo argumento es el Schema que hemos creado anteoriormente.
	UsuarioSchema
);
