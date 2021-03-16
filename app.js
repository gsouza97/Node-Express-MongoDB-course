const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes"); //Importando a rota places

const app = express();

app.use("/api/places", placesRoutes); //Essa rota passa a ser um middleware => /api/places/...

//Executada em requisições que tem um erro atrelado a ela
app.use((error, req, res, next) => {
  if (res.headerSent) { //Checa se a resposta já foi enviada
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unkown error occurred." }); // Manda a mensagem do erro ou a mensagem padrão
});

app.listen(3000);
