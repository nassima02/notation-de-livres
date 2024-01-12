const express = require ('express');
const router = express.Router();
const multer = require ('../middleware/multer.config')// Importation du module multer pour la gestion des fichiers envoyés via le formulaire
const routeCtrl = require ('../controllers/books');// Importation du contrôleur qui gère les opérations sur les livres
const auth = require('../middleware/auth')
const compressImage = require('../middleware/compressImage.js')

/* Middleware pour gérer les requêtes GET vers "/api/books" en renvoyant tous les livres */
router.get('/', routeCtrl.getAllBook);
/* Middleware pour gérer les requêtes GET vers "/api/books/bestrating" en renvoyant les trois livres les mieux notés */
router.get('/bestrating', routeCtrl.getBestBook);
/* Middleware pour gérer les requêtes GET vers "/api/books/:id" en renvoyant le livre avec l’_id fourni. */
router.get('/:id', routeCtrl.getOneBook);
/* Middleware pour gérer les requêtes PUT vers "/api/books/:id" en mettant à jour le livre avec l’_id fourni. */
router.put('/:id', auth, multer, compressImage, routeCtrl.modifyBook);
/* Middleware pour gérer les requêtes POST vers "/api/books/:id/rating" en notant le livre avec l’_id fourni. */
router.post('/:id/rating', auth, routeCtrl.ratingBook);
/* Middleware pour gérer les requêtes POST vers "/api/books" en ajoutant un livre. */
router.post('/', auth, multer, compressImage, routeCtrl.createBook);
/* Middleware pour gérer les requêtes DELETE vers "/api/books/:id" en supprimant le livre avec l’_id fourni. */
router.delete('/:id', auth, routeCtrl.deleteBook);

module.exports = router;