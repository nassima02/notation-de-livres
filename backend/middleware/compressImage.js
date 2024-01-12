const fs = require("fs");
const sharp = require("sharp");
const UPLOAD_DIRECTORY_PATH = './uploads';

module.exports = async (req, res, next) => {
	if (!req.file) {
		return next();
	}

	const {buffer, originalname} = req.file;

	if(!isImage(buffer)) {
		//res.status(500).json({error: 'Invalid image format'});
		return next(new Error('Invalid image format'));
	}

	try {
		if (!fs.existsSync(UPLOAD_DIRECTORY_PATH)) {
			fs.mkdirSync(UPLOAD_DIRECTORY_PATH, {mode: 777});
		}

		const timestamp = new Date().getTime();
		const ref = `${UPLOAD_DIRECTORY_PATH}/${originalname}-${timestamp}.webp`;

		sharp(buffer)
			.webp({quality: 100})
			.toFile(ref, (err) => {
				if (err) {
					console.error('Erreur lors de la compression de l\'image :', err);
					return res.status(500).json({error: 'Erreur lors de la compression de l\'image.'});
				}
				req.compressedImagePath = ref;
				next();
			});
	} catch (error) {
		console.error('Erreur lors de la compression de l\'image :', error);
		res.status(500).json({error: 'Erreur lors de la compression de l\'image.'});
	}
};

function isImage(buffer) {
	// Vérifier les signatures caractéristiques des formats d'image
	const signatures = {
		jpeg: Buffer.from([0xFF, 0xD8, 0xFF]),
		png: Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
		gif: Buffer.from('GIF87a'),  // GIF (old)
		gif89a: Buffer.from('GIF89a'),  // GIF (new)
		bmp: Buffer.from('BM'),  // Bitmap
		tiff: Buffer.from([0x49, 0x49, 0x2A, 0x00]),  // TIFF little-endian
		tiffBig: Buffer.from([0x4D, 0x4D, 0x00, 0x2A]),  // TIFF big-endian
		webp: Buffer.from([0x52, 0x49, 0x46, 0x46, 0x57, 0x45, 0x42, 0x50]),  // WEBP
		ico: Buffer.from([0x00, 0x00, 0x01, 0x00])  // ICO
	};
	// Comparer les premiers octets avec les signatures d'image
	for (const type in signatures) {

		if (buffer.slice(0, signatures[type].length).equals(signatures[type])) {
			return true; // Correspond à la signature d'un type d'image
		}
	}
	return false; // Aucune correspondance avec les signatures d'image connues
}

