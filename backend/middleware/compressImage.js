const fs = require("fs");
const sharp = require("sharp");
const UPLOAD_DIRECTORY_PATH = './uploads';

module.exports = (req, res, next) => {
	if (!req.file) {
		return next();
	}

	try {
		if (!fs.existsSync(UPLOAD_DIRECTORY_PATH)) {
			fs.mkdirSync(UPLOAD_DIRECTORY_PATH, { mode: 777 });
		}

		const { buffer, originalname } = req.file;
		const timestamp = new Date().getTime();
		const ref = `${UPLOAD_DIRECTORY_PATH}/${originalname}-${timestamp}.webp`;

		sharp(buffer)
			.webp({ quality: 100 })
			.toFile(ref, (err) => {
				if (err) {
					console.error('Erreur lors de la compression de l\'image :', err);
					return res.status(500).json({ error: 'Erreur lors de la compression de l\'image.' });
				}
				req.compressedImagePath = ref; // Stocke le chemin de l'image compressée dans la requête pour y accéder dans le contrôleur
				next();
			});
	} catch (error) {
		console.error('Erreur lors de la compression de l\'image :', error);
		res.status(500).json({ error: 'Erreur lors de la compression de l\'image.' });
	}
};




// const fs = require("fs");
// const sharp = require("sharp");
// const UPLOAD_DIRECTORY_PATH = './uploads';
//
// module.exports = async (req, res, next) =>{
// 	if (!req.file) {
// 		return next();
// 	}
//
// 	try {
// 		if (!fs.existsSync(UPLOAD_DIRECTORY_PATH)) {
// 			fs.mkdirSync(UPLOAD_DIRECTORY_PATH, { mode: 777 });
// 		}
//
// 		const { buffer, originalname } = req.file;
// 		const timestamp = new Date().getTime();
// 		const ref = `${UPLOAD_DIRECTORY_PATH}/${originalname}-${timestamp}.webp`;
//
// 		await sharp(buffer)
// 			.webp({ quality: 100 })
// 			.toFile(ref);
//
// 		req.compressedImagePath = ref; // Stocke le chemin de l'image compressée dans la requête pour y accéder dans le contrôleur
//
// 		next();
// 	} catch (error) {
// 		console.error('Erreur lors de la compression de l\'image :', error);
// 		res.status(500).json({ error: 'Erreur lors de la compression de l\'image.' });
// 	}
// };
