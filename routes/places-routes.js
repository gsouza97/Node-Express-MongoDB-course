const express = require("express");

const { check } = require("express-validator"); // Import do validator. Só quero o 'check'

const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

// A ordem das rotas importam
// Pode registrar multiplas middlewares no mesmo método HTTP

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(), // Checa se o título não está vazio
    check("description").isLength({ min: 5 }), // Checa se a descrição tem no mínimo 5 caracteres
    check("address").not().isEmpty(), // Checa se o endereço não está vazio
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(), // Checa se o título não está vazio
    check("description").isLength({ min: 5 }), // Checa se a descrição tem no mínimo 5 caracteres
  ],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router; //Exportando esse arquivo
