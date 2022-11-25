const sauce = require("../ModelsSauce");

const fs = require('fs');

// Fonction pour calculer la valeur de likes ou dislikes suivant la longueur des tableaux contenant les utilisateurs 
function computeLike(sauce) {
    sauce.likes = sauce.usersLiked.length
    sauce.dislikes = sauce.usersDisliked.length
    return sauce
}

exports.sauce = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then(computeLike)
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));

};

exports.sauces = (req, res, next) => {
    sauce.find()
        .then(sauces => sauces.map(computeLike))
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

exports.createSauces = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    const Sauce = new sauce({
        name: sauceObject.name,
        description: sauceObject.description,
        manufacturer: sauceObject.manufacturer,
        mainPepper: sauceObject.mainPepper,
        heat: sauceObject.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    Sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistrée' }) })
        .catch(error => { res.status(400).json({ error }) })

}


exports.modifySauces = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    console.log(sauceObject)

    sauce.findOne({ _id: req.params.id })
        .then((Sauce) => {
            if (Sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé' });
            }
            else {
                sauce.updateOne({ _id: req.params.id }, sauceObject)
                    .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
                    .catch((error) => {
                        console.log(error);
                        res.status(400).json({ error });
                    })
            }
        })
        .catch((error) => {

            res.status(400).json({ error });
        })
}

exports.suppSauces = (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
        .then(Sauce => {
            if (Sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé' });
            }
            else {
                const filename = Sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée' }) })
                        .catch(error => res.status(401).json({ error }));
                })
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
}

exports.likeSauces = (req, res, next) => {
    console.log(req.params)
    console.log(req.body)
    // Recherche de la sauce
    sauce.findOne({ _id: req.params.id })
        .then((theSauce) => {
            // On supprime l'utilisateur des tableaux usersDisliked et usersLiked 
            theSauce.usersDisliked = theSauce.usersDisliked.filter((userId) => userId != req.auth.userId)
            theSauce.usersLiked = theSauce.usersLiked.filter((userId) => userId != req.auth.userId)
            // Si like =1 on push l'utilisateur dans le tableau usersLiked
            if (req.body.like == 1) {
                theSauce.usersLiked.push(req.auth.userId)
                // Si like = -1 on push l'utilisateur dans le tableau usersDisliked
            } else if (req.body.like == -1) {
                theSauce.usersDisliked.push(req.auth.userId)
            }
            return sauce.updateOne({ _id: req.params.id }, theSauce)
        })
        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
        .catch((error) => {
            console.log(error);
            res.status(400).json({ error });
        })

}

