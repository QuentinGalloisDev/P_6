const mongoose = require("mongoose");

//Plugin Mongoose qui remonte les erreur de la base de données.
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const ModelsSauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: ["String <userId>"], required: true },
    usersDisliked: { type: ["String <userId>"], required: true }
})

// Plugin mongoose pour la gestion des erreurs.
ModelsSauceSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("ModelsSauce", ModelsSauceSchema);