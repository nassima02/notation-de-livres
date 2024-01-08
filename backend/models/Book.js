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

bookSchema.methods.updateAverageRating = function () {
	const totalRating = this.ratings.reduce((sum, ratingObj) => sum + ratingObj.grade, 0);
	this.averageRating = this.ratings.length > 0 ? totalRating / this.ratings.length : 0;
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;