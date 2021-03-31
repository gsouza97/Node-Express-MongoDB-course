const uuid = require("uuid").v4;

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

// Simplesmente retorna a lista de usuários como JSON
const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed. Please, try again later."
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// Pega os dados do body e cria um novo usuário com o unico id,
// Nome é igual ao nome passado, email é igual ao email passado...
// Depois insere esse novo usuário na lista DUMMY e manda uma resposta como JSON
const signup = async (req, res, next) => {
  const errors = validationResult(req); // Verifica se há algum erro de validação na requisição

  if (!errors.isEmpty()) {
    // Se houver erro, retorna esse erro
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  // Verifica se já existe um usuário checando se já existe algum documento com o email passado
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    error = new HttpError("Signing up failed. Please, try again later.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User already exists.", 422);
    return next(error);
  }

  const createdUser = new User({
    name: name,
    email: email,
    image: "https://www.niemanlab.org/images/Greg-Emerson-edit-2.jpg",
    password: password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    error = new HttpError("Signing up failed. Please, try again later.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

// Pega os dados do body e verifica se na lista DUMMY tem algum usuário com o email igual ao email passado
// Se não tiver, ou o password for diferente do password passado, retorna um erro
// Se der tudo ok, manda uma resposta com a mensagem 'Logged in' como JSON
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;

  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    error = new HttpError("Login failed. Please, try again.", 500);
    return next(error);
  }

  if (!identifiedUser || identifiedUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials. Could not log you in.",
      401
    );
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
