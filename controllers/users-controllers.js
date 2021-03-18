const uuid = require("uuid").v4;

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Gabriel Souza",
    email: "test@test.com",
    password: "testers",
  },
];

// Simplesmente retorna a lista de usuários como JSON
const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

// Pega os dados do body e cria um novo usuário com o unico id,
// Nome é igual ao nome passado, email é igual ao email passado...
// Depois insere esse novo usuário na lista DUMMY e manda uma resposta como JSON
const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const userExist = DUMMY_USERS.find((u) => u.email === email);
  if (userExist) {
    return next(
      new HttpError("Could not create user. Email already exists.", 422)
    );
  }

  const createdUser = {
    id: uuid(),
    name: name,
    email: email,
    password: password,
  };
  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

// Pega os dados do body e verifica se na lista DUMMY tem algum usuário com o email igual ao email passado
// Se não tiver, ou o password for diferente do password passado, retorna um erro
// Se der tudo ok, manda uma resposta com a mensagem 'Logged in' como JSON
const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError("Could not identify user.", 401));
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
