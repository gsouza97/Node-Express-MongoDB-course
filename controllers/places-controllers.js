const uuid = require("uuid").v4;

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
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
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  // Pega o parametro que foi passado e filtra no DUMMY (onde o creator do parâmetro passado é igual ao creator do DUMMY).
  // Se existir, armazena cada lugar na variável (array) places
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });
  if (!places || places.length === 0) {
    //Se place for falso (não existir) mostra a mensagem de error abaixo.
    return next(
      new HttpError("Could not find a places for the provided user id.", 404)
    );
  }
  res.json({ places: places });
};

// Entre {} é os campos que se espera receber do request
// É igual a const title = req.body.title; const description = req.body.description ...
const createPlace = (req, res, next) => {
  const errors = validationResult(req); // Verifica se há algum erro de validação
  // Se houver erro, retorna esse erro
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(), //Cria/gera um unico id
    title: title,
    description: description,
    location: coordinates,
    address: address,
    creator: creator,
  };

  DUMMY_PLACES.push(createdPlace); // Adiciona o lugar criado na lista DUMMY

  // Retorna o status 201 que é pra quando algo foi criado com sucesso
  // e também retorna o lugar criado em JSON
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req); // Verifica se há algum erro de validação na requisição

  if (!errors.isEmpty()) {
    // Se houver erro, retorna esse erro
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;
  //Pega o parâmetro que foi passado e vê se ele existe
  // Antes cria uma cópia com o spread por boa pratica (spread ...)
  // Pega o index do lugar onde o id do place é igual ao id do parâmetro passado
  // e passa o novo titulo e nova descrição
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace; // Atualiza o lugar criado na lista DUMMY

  // Retorna o status 200 e também retorna o JSON do lugar atualizado
  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  // Mostra o erro se o lugar não existir
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    return next(new HttpError("Could not find a place for that id.", 404));
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById; // Exporta como um ponteiro pra essa função
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
