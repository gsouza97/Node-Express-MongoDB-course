const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');    //Importando a rota places

const app = express();

app.use('/api/places', placesRoutes);  //Essa rota passa a ser um middleware => /api/places/...

app.listen(3000);