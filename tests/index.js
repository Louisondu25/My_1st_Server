/* Établissement de la connexion à la base de données */
require("../utils/database");

/* Définition d'un bloc de tests pour le service "UserService" */
describe("UserService", () => {
  /* Importation des tests pour le service "UserService" */
  require("./services/UserService.test");
});

/* Définition d'un bloc de tests pour le Controller "UserController" */
describe("UserController", () => {
  /* Importation des tests pour le service "UserController" */
  require("./services/UserController.test");
});