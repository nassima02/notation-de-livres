const mongoose = require ('mongoose');
const bookSchema = mongoose.Schema({
	userId : {type: String, required: true},
	title : {type: String, required: true},
	author : {type: String, required: true},
	imageUrl : {type: String, required: true},
	year: {type: Number, required: true},
	genre:{type: String, required: true},
	ratings : [
		{
			userId : {type: String, required: true},
			grade : {type: Number, required: true},
		}
	],
	averageRating: { type: Number, default: 0 },
});
// La fonction de mise à jour de la note moyenne du livre en fonction des nouvelles évaluations
bookSchema.methods.updateAverageRating = function () {
	// Calcul de la somme totale des évaluations
	const totalRating = this.ratings.reduce((sum, ratingObj) => sum + ratingObj.grade, 0);
	// Mise à jour de la note moyenne en évitant la division par zéro
	this.averageRating = this.ratings.length > 0 ? totalRating / this.ratings.length : 0;
};
// Création du modèle 'Book' basé sur le schéma défini
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;