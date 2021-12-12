//capturamos todos las funciones de cada uno de los middlewares en una constante propia para cada grupo de middlewares
const validarCampos = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const validarRoles = require("../middlewares/validar-roles");

//con el uso del [spread operator ...algo] exportamos individualmente cada función recogida de las importaciones y en cada sitio que vayamos a usar middlewares solo debemos llamar al index del directorio middlewares.
module.exports = {
	...validarCampos,
	...validarJWT,
	...validarRoles,
};
