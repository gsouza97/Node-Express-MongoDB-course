const axios = require("axios"); // Import para enviar requisições HTTP
const HttpError = require("../models/http-error");

const API_KEY = "***********"; // Chave da API

// Função para pegar a coordenada através do address passado.
// O address é passado como parametro, em seguida é feita uma requisição para o google maps API passando o address
// Pegamos o data da resposta e se não tiver data ou se o status for 'Zero_results(passado pelo API)' joga o erro
// Se der tudo certo, pega as coordenadas do local e armazena em coordinates, retornando coordinates.
async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }
  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress; //Exportando como ponteiro
