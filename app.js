const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes"); //Importando a rota places
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

// Vai passar qualquer incoming request body e extrairá qualquer dado JSON que tiver lá depois
// vai converter pra JavaScript e chama a proxima middleware (que é a de baixo) e vai adicionar os dados JSON lá
// Foi criado para o método POST
app.use(bodyParser.json());

app.use("/api/places", placesRoutes); //Essa rota passa a ser um middleware => /api/places/...

app.use("/api/users", usersRoutes); //Essa rota passa a ser um middleware => /api/users/...

// Erro padrão para rotas não suportadas
// Essa middleware só é acessível se não obtivermos uma resposta (next)
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  return next(error);
});

//Executada em requisições que tem um erro atrelado a ela
app.use((error, req, res, next) => {
  if (res.headerSent) {
    //Checa se a resposta já foi enviada
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unkown error occurred." }); // Manda a mensagem do erro ou a mensagem padrão
});

// Estabelecer conexão com o banco de dados
// Se a conexão for bem sucedida, escuta a porta 3000
mongoose
  .connect(
    "mongodb+srv://gabriel:backendtest@cluster0.axkfi.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
