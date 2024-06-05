// Importation du service "UserService"
const UserService = require("../../services/UserService");

// Importation de la bibliothèque "chai" pour les assertions
const chai = require("chai");
let expect = chai.expect;

// Définition d'un bloc de tests pour la méthode "addOneUser"
describe("addOneUser", () => {
  // Test 1 : Ajout d'un utilisateur correct
  it("Utilisateur correct. - S", () => {
    // Définition d'un utilisateur valide
    var user = {
      firstName: "Edouard",
      lastName: "Dupont",
      email: "edouard.dupont@gmail.com",
      username: "edupont",
    };
    // Appel de la méthode "addOneUser" avec l'utilisateur valide
    UserService.addOneUser(user, function (err, value) {
      // Vérification que le résultat est un objet
      expect(value).to.be.a("object");
      // Vérification que l'objet a une propriété "_id"
      expect(value).to.haveOwnProperty("_id");
      //console.log(value) // Affichage du résultat pour débogage
    });
  });

  // Test 2 : Ajout d'un utilisateur incorrect (sans firstName)
  it("Utilisateur incorrect. (Sans firstName) - E", () => {
    // Définition d'un utilisateur invalide (sans firstName)
    var user_no_valid = {
      lastName: "Dupont",
      email: "edouard.dupont@gmail.com",
      username: "edupont",
    };
    // Appel de la méthode "addOneUser" avec l'utilisateur invalide
    UserService.addOneUser(user_no_valid, function (err, value) {
      // Vérification que l'erreur a une propriété "msg"
      expect(err).to.haveOwnProperty("msg");
      // Vérification que l'erreur a une propriété "fields_with_error" avec une longueur de 1
      expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
      // Vérification que l'erreur a une propriété "fields"
      expect(err).to.haveOwnProperty("fields");
      // Vérification que l'erreur a une propriété "firstName" dans "fields"
      expect(err["fields"]).to.haveOwnProperty("firstName");
      // Vérification que le message d'erreur pour "firstName" est correct
      expect(err["fields"]["firstName"]).to.equal("Path `firstName` is required.");
    });
  });
});

// Définition d'un bloc de tests pour la méthode "addManyUsers"
describe("addManyUsers", () => {
  // Test 1 : Ajout de plusieurs utilisateurs, avec des erreurs dans les données - E
  it("Utilisateurs à ajouter, non valide. - E", () => {
    // Définition d'un tableau d'utilisateurs avec des erreurs
    var users_tab_error = [
      {
        // Utilisateur 1 : valide
        firstName: "Edouard",
        lastName: "Dupont",
        email: "edouard.dupont@gmail.com",
        username: "edupont",
      },
      {
        // Utilisateur 2 : erreur, username vide et propriétés supplémentaires non autorisées (testing, phone)
        firstName: "Edouard",
        lastName: "Dupont",
        email: "edouard.dupont@gmail.com",
        username: "",
        testing: true,
        phone: "0645102340",
      },
      {
        // Utilisateur 3 : erreur, username déjà existant et propriétés supplémentaires non autorisées (testing, phone)
        firstName: "Edouard",
        lastName: "Dupont",
        email: "edouard.dupont@gmail.com",
        username: "edupont",
        testing: true,
        phone: "0645102340",
      },
      {
        // Utilisateur 4 : erreur, lastName manquant
        firstName: "Edouard",
        email: "edouard.dupont@gmail.com",
      },
    ];
    // Appel de la méthode addManyUsers avec les utilisateurs erronés
    UserService.addManyUsers(users_tab_error, function (err, value) {});
  });

  // Test 2 : Ajout de plusieurs utilisateurs, avec des erreurs dans les données - E
  it("Utilisateurs à ajouter, valide. - S", () => {
    // Définition d'un tableau d'utilisateurs avec des erreurs
    var users_tab_error = [
      {
        // Utilisateur 1 : erreur, username déjà existant
        firstName: "Louison",
        lastName: "Dupont",
        email: "edouard.dupont@gmail.com",
        username: "edupont",
      },
      {
        // Utilisateur 2 : erreur, username trop court et propriétés supplémentaires non autorisées (testing, phone)
        firstName: "Jordan",
        lastName: "Dupont",
        email: "edouard.dupont@gmail.com",
        username: "La",
        testing: true,
        phone: "0645102340",
      },
      {
        // Utilisateur 3 : erreur, username déjà existant et propriétés supplémentaires non autorisées (testing, phone)
        firstName: "Mathis",
        lastName: "Dupont",
        email: "edouard.dupont@gmail.com",
        username: "edupont",
        testing: true,
        phone: "0645102340",
      },
    ];
    // Appel de la méthode addManyUsers avec les utilisateurs erronés
    UserService.addManyUsers(users_tab_error, function (err, value) {
      // Vérification des erreurs pour chaque utilisateur
      expect(err[0]).to.haveOwnProperty("msg");
      expect(err[0]).to.haveOwnProperty("fields_with_error");
      expect(err[0]).to.haveOwnProperty("fields");
      expect(err[0]["fields"]).to.haveOwnProperty("username");
      expect(err[1]).to.haveOwnProperty("msg");
      expect(err[1]).to.haveOwnProperty("fields_with_error");
      expect(err[1]).to.haveOwnProperty("fields");
      expect(err[1]["fields"]).to.haveOwnProperty("username");
      expect(err[1]["fields"]).to.haveOwnProperty("lastname");
      console.log(err, value); // Affichage des erreurs et du résultat pour débogage
    });
  });
});

/* 
describe("UserService", () => {
    describe("addOneUser", () => {
        it("Utilisateur valide. - S", () => {
            var user_valid = {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "edupont"
            }
            UserService.addOneUser(user_valid, function (err, value) {
                expect(value).to.be.a('object');
                expect(value).to.haveOwnProperty('id')
            })
        })
        it("Sans nom d'utilisateur. - E", () => {
            var user_without_username = {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com"
            }
            UserService.addOneUser(user_without_username, function (err, value) {
                expect(err).to.haveOwnProperty('msg')
                expect(err).to.haveOwnProperty('key_required_not_include').with.lengthOf(1)

            })
        })

        it("Avec un champs en trop. - S", () => {
            var user_with_not_authorized_key = {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "edupont",
                testing: true,
                phone: "0645102340"
            }
            UserService.addOneUser(user_with_not_authorized_key, function (err, value) {
                expect(value).to.be.a('object');
                expect(value).to.haveOwnProperty('id')
                expect(value).not.haveOwnProperty('testing')
            })
        })

        it("Avec un champs requis vide. - E", () => {
            var user_with_not_authorized_key = {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "",
                testing: true,
                phone: "0645102340"
            }
            UserService.addOneUser(user_with_not_authorized_key, function (err, value) {
                expect(err).to.haveOwnProperty('msg')
                expect(err).to.haveOwnProperty('key_required_empty').with.lengthOf(1)

            })
        })

    })
    describe("updateOneUser", () => {
        it("Modification d'un utilisateur correct. - S", () => {
            UserService.updateOneUser('1', { lastName: "Maurice" }, function (err, value) {
                expect(value).to.be.a('object');
                expect(value).to.haveOwnProperty('id')
                expect(value).to.haveOwnProperty('lastName')
                expect(value.lastName).to.equal("Maurice")
            })
        })
        it("Modification d'un utilisateur avec un champs requis, vide. - E", () => {
            UserService.updateOneUser('1', { lastName: "" }, function (err, value) {
                expect(err).to.haveOwnProperty('msg')
                expect(err).to.haveOwnProperty('key_required_empty').with.lengthOf(1, "Le tableau n'a pas retourne le nombre correcte d'element empty.")
            })
        })
        it("Modification d'un utilisateur avec un id invalide. - E", () => {
            UserService.updateOneUser('100', { lastName: "Edouard" }, function (err, value) {
                expect(err).to.haveOwnProperty('msg')
                expect(err).to.haveOwnProperty('key_required_empty').with.lengthOf(0)
                expect(err).to.haveOwnProperty('key_required_not_include').with.lengthOf(0)

            })
        })
    })
    describe("addManyUsers", () => {
        it("Ajout de plusieurs utilisateurs non correcte. - E", () => {

            var users_tab_error = [{
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "edupont"
            }, {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "",
                testing: true,
                phone: "0645102340"
            },
            {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "edupont",
                testing: true,
                phone: "0645102340"
            }, {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com"
            }]
            UserService.addManyUsers(users_tab_error, function (err, value) {
                expect(err).to.have.lengthOf(2);
                expect(err[0]).to.haveOwnProperty('msg')
                expect(err[0]).to.haveOwnProperty('key_required_empty').with.lengthOf(1)
                expect(err[1]).to.haveOwnProperty('msg')
                expect(err[1]).to.haveOwnProperty('key_required_empty').with.lengthOf(0)
                expect(err[1]).to.haveOwnProperty('key_required_not_include').with.lengthOf(1)

            })
        })
        it("Ajout de plusieurs utilisateurs tous correct. - S", () => {
            var users_tab_error = [{
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "edupont"
            }, {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "La",
                testing: true,
                phone: "0645102340"
            },
            {
                firstName: "Edouard",
                lastName: "Dupont",
                email: "edouard.dupont@gmail.com",
                username: "edupont",
                testing: true,
                phone: "0645102340"
            }]
            UserService.addManyUsers(users_tab_error, function (err, value) {
                expect(value).to.have.lengthOf(users_tab_error.length);
                value.forEach((e) => {
                    expect(e).to.be.a('object');
                    expect(e).to.haveOwnProperty('id')
                    expect(e).to.haveOwnProperty('lastName')

                })
            })
        })
    })
    describe("findOneUser", () => {
        it("Chercher un utilisateur existant correct. - S", () => {

            UserService.findOneUser("1", function (err, value) {
                expect(value).to.be.a('object');
                //console.log(err)
                expect(value).to.haveOwnProperty('id')
                expect(value).to.haveOwnProperty('lastName')
                expect(value['id']).to.equal('1')
            })
        })
        it("Chercher un utilisateur non-existant correct. - E", () => {

            UserService.findOneUser("100", function (err, value) {
                expect(err).to.haveOwnProperty('msg')
                expect(err).to.haveOwnProperty('error_type')
                expect(err["error_type"]).to.equal('Not-Found')
            })
        })

    })
    describe("findManyUsers", () => {
        it("Chercher plusieurs utilisateurs existants. - S", () => {
            var tabIds = ["1", "2"]
            UserService.findManyUsers(tabIds, function (err, value) {
                expect(value).to.have.lengthOf(tabIds.length);
                value.forEach((e) => {
                    expect(e).to.be.a('object');
                    expect(e).to.haveOwnProperty('id')
                    expect(e).to.haveOwnProperty('lastName')
                })
            })
        })
        it("Chercher plusieurs utilisateurs qui n'existent pas. - S", () => {
            var tabIds = ["100", "200"]
            UserService.findManyUsers(tabIds, function (err, value) {
                expect(value).to.have.lengthOf(0);
            })
        })
    })
    describe("deleteOneUser", () => {
        it("Supprimer un utilisateur qui existe. - S", () => {
            UserService.deleteOneUser("1", function (err, value) {
                expect(value).to.be.a('object');
                expect(value).to.haveOwnProperty('msg')
                expect(value).to.haveOwnProperty('user_delete')
                expect(value['user_delete']).to.haveOwnProperty('id')
                expect(value['user_delete']['id']).to.be.equal('1')
            })
        })
        it("Supprimer un utilisateur qui n'existe pas. - E", () => {
            UserService.deleteOneUser("100", function (err, value) {
                expect(err).to.be.a('object');
                expect(err).to.haveOwnProperty('msg')
            })
        })
    })
    describe("deleteManyUsers", () => {
        it("Supprimer plusieurs utilisateurs tous find. - S", () => {
            var idTab = ["2"]
            UserService.deleteManyUsers(idTab, function (err, value) {
                expect(value).to.be.a('object');
                expect(value).to.haveOwnProperty('msg')
                expect(value).to.haveOwnProperty('count_remove')
                expect(value['count_remove']).to.equal(idTab.length)
            })
        })
        it("Supprimer plusieurs utilisateurs pas tous find. - S", () => {
            var idTab = ["2", "3"]
            UserService.deleteManyUsers(idTab, function (err, value) {
                expect(value).to.be.a('object');
                expect(value).to.haveOwnProperty('msg')
                expect(value).to.haveOwnProperty('count_remove')
                expect(value['count_remove']).to.equal(idTab.length-1)
            })
        })
    })
}) */
