const express = require("express");

const router = express.Router();

const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

// A ordem das rotas importam

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid; // {pid: 'p1'}    Pega o parâmetro que foi passado pela URL
  // Pega o parametro que foi passado e vê se existe ele no DUMMY (onde o id do parâmetro passado é igual ao id do DUMMY).
  // Se existir, armazena na variável place
  // Função executada em todos os elementos do array
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId; //Se existir, se for igual. RETORNA TRUE OU FALSE.
  });
  if (!place) {
    //Se place for falso (não existir) mostra a mensagem de error abaixo.
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  res.json({ place: place }); //Manda a resposta com JSON
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  // Pega o parametro que foi passado e vê se existe ele no DUMMY (onde o creator do parâmetro passado é igual ao creator do DUMMY).
  // Se existir, armazena na variável place
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });
  if (!place) {
    //Se place for falso (não existir) mostra a mensagem de error abaixo.
    return next(
        new HttpError("Could not find a place for the provided user id.", 404)
      );
  }
  res.json({ place: place });
});

module.exports = router; //Exportando esse arquivo
