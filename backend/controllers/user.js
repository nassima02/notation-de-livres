const bcrypt = require ('bcrypt');//package de cryptage des MDP
const jwt = require ('jsonwebtoken')
const User = require('../models/Users');

exports.signup = (req, res, next) => {
//hashé ou crypté le MDP
	bcrypt.hash(req.body.password, 10)//10 le nombre de fois d'exécuté l'algorithme de hashage
		.then(hash => {
			const user = new User ({
				email: req.body.email,
				password:hash,
			});
			//pour enregistrer le suer en BDD
			user.save()
				.then(()=>res.status(201).json({message:'Utilisateur crée!'}))
				.catch(error => res.status(400).json({error}))
		})
		.catch(error => res.status(500).json({error}))
};
/*******************************************************************
 cette fonction permet de vérifier si un utilisateur existe dans la
 base de données et si le MDP transmis correspond à cet utilisateur
 *******************************************************************/

exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.then(user => {
			if (!user) {
				return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
			}
			bcrypt.compare(req.body.password, user.password)
				.then(valid => {
					if (!valid) {
						return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign(
							{userId: user._id},
							'RANDOM_TOKEN_SECRET',
							{ expiresIn: '24h' }
						)
					});
				})
				.catch(error => res.status(500).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};