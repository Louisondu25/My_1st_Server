// // Users

/* Établissement de la connexion à la base de données */
require("../utils/database");
const mongoose = require('mongoose')

/* Définition d'un bloc de tests pour le service "UserService" */
describe("UserService", () => {
  /* Importation des tests pour le service "UserService" */
  require("./services/UserService.test");
});

/* Définition d'un bloc de tests pour le Controller "UserController" */
describe("UserController", () => {
  /* Importation des tests pour le service "UserController" */
  require("./controllers/UserController.test");
});



/* Définition d'un bloc de tests pour le service "ArticlesService" */
describe("ArticleService", () => {
  /* Importation des tests pour le service "ArticleService" */
  require("./services/ArticleService.test");
});

/* Définition d'un bloc de tests pour le Controller "ArticleController" */
describe("ArticleController", () => {
  /* Importation des tests pour le service "ArticleController" */
  require("./controllers/ArticleController.test");
});

describe('API -Mongo', () => {
  it('Vider Les base datas -S', () => {
    if (process.env.npm_lifecycle_event == 'test') {
      mongoose.connection.db.dropDatabase()
    }
  })
})