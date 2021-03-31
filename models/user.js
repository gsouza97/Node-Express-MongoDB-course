const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Ref permite estabelecer uma conexão entre o place schema e outro schema, passando o nome do schema

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],  // Add referência ao lugar para se relacionar
  // Add os places ligados ao Place que o user cirou
});

userSchema.plugin(uniqueValidator); // Add o uniqueValidator como um plugin no schema

module.exports = mongoose.model("User", userSchema);
