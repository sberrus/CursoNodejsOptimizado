const mongoose = require("mongoose");

//Hay que tomar en cuenta que la ruta al final de la url, es la bbdd. Si existe en mongo trabajará en ella, de lo contrario la creará.
const _dbUrl = process.env.CNN_MONGOOSE;

const dbConection = async () => {
	try {
		await mongoose.connect(_dbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("BBDD Conectada");
	} catch (error) {
		console.log(error);
		throw new Error("Error al conectar con la bbdd");
	}
};

module.exports = {
	dbConection,
};
