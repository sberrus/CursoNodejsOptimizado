const auth = require("./auth");
const busquedas = require("./busquedas");
const categories = require("./categories");
const product = require("./product");
const usuarios = require("./usuarios");
const uploads = require("./uploads");

module.exports = {
	...auth,
	...busquedas,
	...categories,
	...product,
	...usuarios,
	...uploads,
};
