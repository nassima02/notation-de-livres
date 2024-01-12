const express = require('express'); // Importation du framework Express
const mongoose = require('mongoose');
const booksRoutes = require('./routes/routes')
const userRoutes = require('./routes/user')
const { DB_URL } = require('./db_config/db_config');

/* Connexion à la base de données MongoDB */
	//mongoose.connect('mongodb+srv://benasima:3ey1QdtY3ipoevBY@cluster0.eiaz3mk.mongodb.net/?retryWrites=true&w=majority')
async function connect() {
	await mongoose.connect(DB_URL)
}
connect()
		.then(() => console.log('Connexion à MongoDB réussie !'))
		.catch((error) => console.error('Connexion à MongoDB échouée !', error));

const app = express(); // Création d'une instance de l'application Express
app.use(express.json());
app.use('/uploads', express.static("./uploads"));

/* Middleware pour gérer les paramètres liés aux CORS (Cross-Origin Resource Sharing) */
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});


app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

module.exports = app; // Exportation de l'application pour y accéder depuis d'autres fichiers, notamment le serveur Node.js