const Book = require("../models/Book");
const fs = require('fs');
const path = require('path');
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
/*********************************************************
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
			// Delete the previous image
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
