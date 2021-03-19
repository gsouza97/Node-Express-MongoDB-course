const express = require("express");

const { check } = require("express-validator"); // Import do validator. Só quero o 'check'

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

// A ordem das rotas importam

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(), // Checa se o nome não está vazio
    check("email").normalizeEmail().isEmail(), // Passa para caixa baixa se tiver caixa alta e checa se é email
    check("password").isLength({ min: 6 }), // Checa se o password tem pelo menos 6 caracteres
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

module.exports = router; //Exportando esse arquivo
