const mongoose = require("mongoose");

// Ref permite estabelecer uma conexão entre o place schema e outro schema, passando o nome do schema

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" }, // Diz ao MongoDB que é um MongoDB Id, Add referência ao lugar para se relacionar
  // Adiciona o user de referência ao creator
});

module.exports = mongoose.model("Place", placeSchema);
