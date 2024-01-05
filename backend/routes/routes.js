const express = require ('express');
const router = express.Router(); // création d'un router
const multer = require ('../middleware/multer.config')
const auth = require('../middleware/auth')
const routeCtrl = require ('../controllers/books');
const compressImage = require('../middleware/compressImage')

/* Middleware pour gérer les requêtes GET vers "/api/books" qui Renvoie un tableau de tous les livres de la base de
données.*/
router.get('/', routeCtrl.getAllBook);

/* Middleware pour gérer les requêtes GET vers "/api/books/:id" qui Renvoie le livre avec l’_id fourni. */
router.get('/:id', routeCtrl.getOneBook);

/* Middleware pour gérer les requêtes PUT vers "/api/books/:id" qui mis à jour le livre avec l’_id fourni. */
router.put('/:id', auth, multer, compressImage, routeCtrl.modifyBook);

/* Middleware pour gérer les requêtes POST vers "/api/books" qui ajoute un livre. */
router.post('/',auth,  multer, compressImage, routeCtrl.createBook);
/* Middleware pour gérer les requêtes DELETE vers "/api/books/:id" qui supprime le livre avec l’_id fourni. */
router.delete('/:id', auth, routeCtrl.deleteBook);

module.exports = router;