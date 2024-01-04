// Importation des modules nécessaires
const http = require('http'); // Importation du module HTTP de Node.js
const express = require('express');
const app = require('./app'); // Importation du module d'application personnalisé (app)

/* La fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme
d'un numéro ou d'une chaîne */
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

/*Utilisation de process.env.PORT si le port 4000 n'est pas disponible,
puis configuration du port pour l'application */
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Ajout des répertoires statiques pour servir les fichiers publics
// app.use(express.static('public'));

/* La fonction errorHandler recherche les différentes erreurs et les gère de manière
appropriée. Elle est ensuite enregistrée dans le serveur. */
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

/* Création du serveur avec la méthode createServer qui prend comme argument
 la fonction qui sera appelée à chaque requête reçue par le serveur */
const server = http.createServer(app);

// Gestion des événements d'erreur et d'écoute du serveur
server.on('error', errorHandler);
server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Listening on ' + bind);
});

/* Enregistrement d'un écouteur d'événements qui consigne le port ou le canal nommé
sur lequel le serveur s'exécute dans la console. */
server.listen(port);
