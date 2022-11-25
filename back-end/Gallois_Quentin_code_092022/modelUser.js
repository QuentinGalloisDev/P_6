const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

//Plugin Mongoose qui remonte les erreur de la base de données.
const mongodbErrorHandler = require('mongoose-mongodb-errors')

// Unique peux générer des erreurs difficiles à résoudre de mongodb donc on installe le plug-in mongoose-unique-validator, 
// on l'importe et on le passe en plug-in à userSchema.
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// Plugin mongoose pour la gestion des erreurs.
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);