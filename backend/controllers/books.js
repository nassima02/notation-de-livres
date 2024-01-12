const Book = require("../models/Book");
const fs = require('fs');

/*********************************************************
 				 Ajouter un livre
 * *******************************************************/

exports.createBook = async (req, res, next) => {
	const bookObject = JSON.parse(req.body.book)
	delete bookObject._id;
	delete bookObject.userId;

	const book = new Book({
		...bookObject,
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get('host')}/${req.compressedImagePath}`
	})
	book.save()
		.then(() => {
			res.status(201).json({message: 'Objet enregistré !'})
		})
		.catch(error => {
			res.status(400).json({error})
		})
};
/****************************************************
 				Obtenir un livre
 * *******************************************************/

exports.getOneBook = ('/:id', (req, res, next) => {
	Book.findOne({_id: req.params.id})
		.then(book => res.status(200).json(book))
		.catch(error => res.status(404).json({error}));
});

/*********************************************************
 				Obtenir des livres
 * *******************************************************/

exports.getAllBook = ('/', (req, res, next) => {
	Book.find()
		.then(books => res.status(200).json(books))
		.catch(error => res.status(400).json({error}));
});

/*********************************************************
 		Supprimer un livre + l'image correspondante
 * *******************************************************/

exports.deleteBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (!book) {
				return res.status(404).json({ message: 'Objet non trouvé' });
			}

			if (book.userId !== req.auth.userId) {
				return res.status(401).json({ message: 'Non autorisé' });
			}

			// Si le livre existe et l'utilisateur est autorisé, on peut le supprimer
			return Book.deleteOne({ _id: req.params.id }).then(() => book);
		})
		.then((deletedBook) =>  {

			const imageFileName = deletedBook.imageUrl.split('/').pop();

			// Supprimer l'image associée
			const imagePath = `./uploads/${imageFileName}`;
			fs.unlink(imagePath, (err) => {
				if (err) {
					console.error(err);
				}
			});

			res.status(200).json({ message: 'Objet supprimé avec succès' });
		})
		.catch(error => res.status(400).json({ error }));
};

/*********************************************************
 				Modifier un livre
 * *******************************************************/

exports.modifyBook = (req, res, next) => {
	const bookObject = req.file
		? {
			...JSON.parse(req.body.book),
			imageUrl: `${req.protocol}://${req.get('host')}/${req.compressedImagePath}`,
		}
		: { ...req.body };

	delete bookObject.userId;

	let previousImageUrl; // Variable pour stoker URL de l'image précédente

	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (!book) {
				return res.status(404).json({ message: 'Objet non trouvé' });
			}

			if (book.userId !== req.auth.userId) {
				return res.status(401).json({ message: 'Non autorisé' });
			}

			previousImageUrl = book.imageUrl; // stoker URL de l'image actuel avant de charger la nouvelle

			// Modifier le livre
			return Book.updateOne({ _id: req.params.id }, { $set: bookObject }).then(() => book);
		})
		.then(() => {
			//supprimer l'image précédente
			const imageFileName = previousImageUrl.split('/').pop();
			const imagePath = `./uploads/${imageFileName}`;

			fs.unlink(imagePath, (err) => {
				if (err) {
					console.error(err);
				}
			});

			res.status(200).json({ message: 'Objet modifié avec succès' });
		})
		.catch((error) => res.status(400).json({ error }));
};

/*********************************************************
 				Noter un livre
 * *******************************************************/

exports.ratingBook = (req, res, next) => {
	const rating = req.body.rating;
	const userId = req.auth.userId;

	// Rechercher le livre
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (!book) {
				return res.status(404).json({ message: 'Objet non trouvé' });
			}

			// Vérifier si l'utilisateur a déjà noté ce livre
			const userHasRated = book.ratings.some((ratingObj) => ratingObj.userId === userId);

			if (userHasRated) {
				return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
			}

			//Ajouter la nouvelle notation au tableau
			const newRatingObj = { userId: userId, grade: rating };
			book.ratings.push(newRatingObj);

			// Mettre à jour la note moyenne
			book.updateAverageRating();

			// Mettre à jour le livre avec les nouvelles notations et la nouvelle note moyenne
			book.save()
				.then(() => {
					res.status(200).json(book);
				})
				.catch((error) => {
					res.status(500).json({ message: 'Erreur lors de la mise à jour de la notation', error: error });
				});
		})
		.catch((error) => {
			res.status(500).json({ message: 'Erreur lors de la recherche du livre', error: error });
		});
};

/*********************************************************
       Obtenir les trois livres les mieux notés
 * *******************************************************/

exports.getBestBook  = (req, res, next) => {
	Book.find()
		.sort({ averageRating: -1 })// Tri des livres en fonction de la note moyenne dans l'ordre décroissant
		.limit(3)
		.then(books => {
			res.status(200).json(books);       })
		.catch(error => {
			res.status(500).json({ error: 'Erreur lors de la récupération des livres les mieux notés' });
		});
};



