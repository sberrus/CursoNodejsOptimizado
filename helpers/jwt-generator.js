const jwt = require("jsonwebtoken");

const generarJWT = (uid = "") => {
	//p*: en el payload del jwt tenemos que tomar en cuenta que es información que, a pesar de estar encriptada, puede ser accedida desde el cliente y se puede acceder a la información que contiene. Una de las cosas que tenemos que tener en cuenta es la seguridad de la misma aplicandole firmas unicas privadas que nos permitan darle una capa extra de seguridad al token.
	//jwt no devuelve pormesas, debido a esto debemos crearla nosotros mismos para poder utilizarla dentro de nuestros controladores.
	return new Promise((resolve, reject) => {
		//En el payload podemos enviar lo que querramos pero hay que tomar en cuenta que por buenas prácticas hay que evitar enviar informaicón sensible al cliente.
		const payload = { uid };
		jwt.sign(
			payload, //payload que se va a enviar al jwt para encriptar
			//GENERAR LLAVE SECRETA: el segundo argumento que se envia a la función sign es la "llave secreta" es un string que nos permite firmar el token para darle más seguridad. Esta llave debe ser completamente privada e inaccesible debido a que si alguien llega a tener esta llave, podra firmar los tokens como si fuera el backend. Se suele usar por seguridad las variables de entorno para evitar estos problemas de seguridad.
			process.env.TOKEN_PRIVATE_KEY,
			//options: Las options es un objeto que nos permite darle ciertas configuraciones al token como puede ser la expiración del mismo.
			{
				expiresIn: "10h",
			},
			//callback
			(err, token) => {
				if (err) {
					console.log(err);
					reject("No se pudo generar el token");
				} else {
					//devolvemos la promesa con el token resuelto
					resolve(token);
				}
			}
		);
	});
};
module.exports = { generarJWT };
