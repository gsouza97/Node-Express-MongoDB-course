const uuid = require("uuid").v4;

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // {pid: 'p1'}    Pega o parâmetro que foi passado pela URL
  let place;
  // Pega o id passado na URL e procura no database
  try {
    place = await Place.findById(placeId); // Procura pelo Id passado na URL
  } catch (err) {
    error = new HttpError("Something went wrong. Could not find a place", 500);
    return next(error);
  }

  if (!place) {
    //Se place for falso (não existir) mostra a mensagem de error abaixo.
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }
  res.json({ place: place.toObject({ getters: true }) }); //Manda a resposta com JSON e 'getters' pra mandar o id sem o '_'
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // Pega o id passado na URL e procura no database
  let places;
  try {
    places = await Place.find({ creator: userId }); // Encontra onde o creator é o usedId
  } catch (err) {
    error = new HttpError(
      "Something went wrong. Could not find any places",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    //Se place for falso (não existir) mostra a mensagem de error abaixo.
    return next(
      new HttpError("Could not find a places for the provided user id.", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })), // Usa o map porque retorna um array
  });
};

// Entre {} é os campos que se espera receber do request
// É igual a const title = req.body.title; const description = req.body.description ...
const createPlace = async (req, res, next) => {
  const errors = validationResult(req); // Verifica se há algum erro de validação
  // Se houver erro, retorna esse erro
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates; // Cria a variável coordinates para armazenar as coordenadas retornada pela função
  try {
    coordinates = await getCoordsForAddress(address); // Passa o address como parâmetro e salva em coordinates
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title: title,
    description: description,
    address: address,
    location: coordinates, // Salva o location como coordinates
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg/330px-Empire_State_Building_from_the_Top_of_the_Rock.jpg",
    creator: creator,
  });

  let user;
  try {
    user = await User.findById(creator); // Checa se o id do usuário logado existe
  } catch (err) {
    const error = new HttpError(
      "Creating place failed. Please, try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find user for the provided id.",
      404
    );
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdPlace.save({ session: session }); // Salva o lugar
    user.places.push(createdPlace); // Salva o lugar criado nos lugares criados pelo usuário
    await user.save({ session: session });
    await session.commitTransaction(); // Salva as mudanças no DB

    // await createdPlace.save(); // Salva o lugar como documento no DB
  } catch (err) {
    const error = new HttpError(
      "Creating place failed. Please, try again.",
      500
    );
    return next(error);
  }

  // Retorna o status 201 que é pra quando algo foi criado com sucesso
  // e também retorna o lugar criado em JSON
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
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
  let updatedPlace;
  try {
    updatedPlace = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Could not update place. Please try again.",
      500
    );
    return next(error);
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Could not update place. Please try again.",
      500
    );
    return next(error);
  }

  // Retorna o status 200 e também retorna o JSON do lugar atualizado
  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  // Mostra o erro se o lugar não existir

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Could not delete place. Please, try again.",
      500
    );
    return next(error);
  }

  // Se o lugar não existir
  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  // Deleta dos lugares e dos lugares do usuário
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess }); // Remover o lugar da coleção places
    place.creator.places.pull(place); // Acessa o lugar salvo no creator (place id) e remove o place do user
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Could not delete place. Please, try again.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById; // Exporta como um ponteiro pra essa função
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
