const http = require('http');
const app = require('./app');

const normalizePort = val => {
	const port = parseInt(val);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);//pour dire a l'application express sur quel port doit tourner

// Fonction de gestion des erreurs liées à la création du serveur
const errorHandler = (error) => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const server = http.createServer(app);
server.on('error', errorHandler);

// Événement 'listening' pour afficher les détails du serveur lorsqu'il écoute sur un port
server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Server launched, listening on ' + bind);
});
// Lancement du serveur pour écouter les connexions entrantes sur le port spécifié
server.listen(port);
