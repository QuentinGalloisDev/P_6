const express = require('express');

const app = express();

const mongoose = require('mongoose');

const config = require('./config')

const userRoutes = require("./routes/user")

const saucesRoutes = require("./routes/sauces")

const path = require('path');

// Intercepte les requêtes qui contiennent du json et rend disponible ce corps de la reqête sur la requête dans req.body.
app.use(express.json());

mongoose.connect(`mongodb+srv://${config.MONGODB_USER}:${config.MONGODB_PASSWORD}@${config.MONGODB_URL}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à mongodb réussie !'))
    .catch(() => console.log(" Connexion échouée !"));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use("/api/auth", userRoutes);

app.use("/api/sauces", saucesRoutes);

app.use("/images", express.static(path.join(__dirname, 'images')))

module.exports = app;  