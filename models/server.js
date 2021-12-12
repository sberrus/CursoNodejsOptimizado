const express = require("express");
const cors = require("cors");
const { dbConection } = require("../database/config");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;

		//No optimizado
		// this.usersPath = "/api/users";
		// this.authPath = "/api/auth";
		// this.categoriesPath = "/api/categories";

		//Optimizado
		this.paths = {
			users: "/api/users",
			auth: "/api/auth",
			categories: "/api/categories",
			products: "/api/products",
			busquedas: "/api/busquedas",
		};

		//DB Conection
		this.conectarDB();

		//Middlewares
		this.middlewares();

		//Rutas de la app
		this.routes();
	}

	async conectarDB() {
		await dbConection();
	}

	middlewares() {
		//Directorio público
		this.app.use(express.static("public"));

		//Cors config
		this.app.use(cors());

		//Lectura y parseo del body
		this.app.use(express.json());
	}

	routes() {
		//Se suele ordenar las rutas por orden alfabético.
		this.app.use(this.paths.auth, require("../routes/auth"));
		this.app.use(this.paths.users, require("../routes/user"));
		this.app.use(this.paths.categories, require("../routes/categories"));
		this.app.use(this.paths.products, require("../routes/products"));
		this.app.use(this.paths.busquedas, require("../routes/busquedas"));
	}
	listen() {
		this.app.listen(this.port, () => {
			console.log(`Servidor corriendo en puerto ${this.port}`);
		});
	}
}
module.exports = Server;
