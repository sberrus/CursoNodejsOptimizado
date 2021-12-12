const dbValidator = require("./db-validators");
const googleVerify = require("./google-verify");
const cargarArchivo = require("./cargarArchivo");
const jwtGenerator = require("./jwt-generator");

module.exports = {
	...dbValidator,
	...googleVerify,
	...cargarArchivo,
	...jwtGenerator,
};
