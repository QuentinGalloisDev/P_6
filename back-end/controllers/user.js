// On importe bcrypt
const bcrypt = require("bcrypt");

// On importe jsonwebtoken
const jwt = require('jsonwebtoken');

// On importe les variables d'environements.
const config = require('../config')

// Masque pour l'email
let checkEmailValidity = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/;

//Masque pour le mot de passe
// Doit contenir au moins un chiffre , une minuscule, une majuscule, un caractère spécial et faire au moins 6 caractères.
let checkPasswordValidity = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/;

const User = require("../modelUser");
// Nouveau utilisateur
exports.signup = (req, res, next) => {
    // Contrôler la validité du mot de passe et de l'adresse mail.
    if (checkEmailValidity.test(req.body.email) && checkPasswordValidity.test(req.body.password)) {
        // On hache le password avec bcrypt et on le sale 10 fois pour rendre le hachage imprévisible.
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            }
            )
            .catch(error => res.status(500).json({ error }));
    }
    else {
        res.status(400).json({ message: 'Impossible de créer un utilisateur' })
    }
}


exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            // Chaîne de caractère secrète pour crypter notre token
                            `${config.JWT_PRIVATEKEY}`,
                            // On limite la durée de validité du token, l'utilisateur devra se reconnecter au bout de 24 heures
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
