const mongoose = require ('mongoose');
/* pour éviter d'avoir plusieurs utilisateurs avec la meme adresse mail*/
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true},
	password: { type: String, required: true}
});
// Utilisation du plugin mongoose-unique-validator pour vérifier l'unicité de l'adresse e-mail.
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model ('User', userSchema);