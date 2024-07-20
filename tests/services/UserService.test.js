const UserService = require("../../services/UserService");
const chai = require("chai");
let expect = chai.expect;
const _ = require("lodash");
const passport = require("passport");
var id_user_valid = "";
var tab_id_users = [];
var users = []

describe("addOneUser", () => {
  it("Utilisateur correct. - S", () => {
    var user = {
      firstName: "Edouard",
      lastName: "Dupont",
      email: "edouard.dupont@gmail.com",
      username: "edupont",
      password: "hellogirl"
    };
    UserService.addOneUser(user, null, function (err, value) {
      expect(value).to.be.a("object");
      expect(value).to.haveOwnProperty("_id");
      id_user_valid = value._id;
      //
    });
  });
  it("Utilisateur incorrect. (Sans firstName) - E", () => {
    var user_no_valid = {
      lastName: "Dupont",
      email: "edouard.dupont@gmail.com",
      username: "edupont",
      password: "hellogirl"
    };
    UserService.addOneUser(user_no_valid, null, function (err, value) {
      expect(err).to.haveOwnProperty("msg");
      expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
      expect(err).to.haveOwnProperty("fields");
      expect(err["fields"]).to.haveOwnProperty("firstName");
      expect(err["fields"]["firstName"]).to.equal(
        "Path `firstName` is required."
      );
      users.push(value)
    });
  });
});

describe("addManyUsers", () => {
  it("Utilisateurs à ajouter, non valide. - E", (done) => {
    var users_tab_error = [
      {
        firstName: "Edouard",
        lastName: "Dupont",
        email: "Yima.Olukayode@gmail.com",
        username: "Yoludka",
        password: "hellogirl"
      },
      {
        firstName: "Edouard",
        lastName: "Dupont",
        email: "edouard.dupont@gmail.com",
        username: "",
        testing: true,
        phone: "0645102340",
        password: "hellogirl"
      },
      {
        firstName: "Edouard",
        lastName: "Dupont",
        email: "Robert.dupre@gmail.com",
        username: "robpre",
        testing: true,
        phone: "0645102340",
        password: "hellogirl"
      },
      {
        firstName: "Edouard",
        email: "ed.dunt@gmail.com",
        password: "hellogirl"
      },
    ];

    UserService.addManyUsers(users_tab_error, null, function (err, value) {
      done();
    });
  });
  it("Utilisateurs à ajouter, valide. - S", (done) => {
    var users_tab = [
      {
        firstName: "Louison",
        lastName: "Dupont",
        email: "Big Lou@gmail.com",
        username: "L-Diddy",
        password: "hellogirl"
      },
      {
        firstName: "Jordan",
        lastName: "Dupont",
        email: "The Dupontinator@gmail.com",
        username: "J-Dawg",
        testing: true,
        phone: "0645102340",
        password: "hellogirl"
      },
      {
        firstName: "Mathis",
        lastName: "Dupont",
        email: "The Math Maverickt@gmail.com",
        username: "Matador Mathis",
        testing: true,
        phone: "0645102340",
        password: "hellogirl"
      },
    ];

    UserService.addManyUsers(users_tab, null,function (err, value) {
      tab_id_users = _.map(value, "_id");
      expect(value).lengthOf(3);
      users = [...value, ...users]
      done();
    });
  });
});

describe("findOneUserById", () => {
  it("Chercher un utilisateur existant correct. - S", (done) => {
    UserService.findOneUserById(id_user_valid, null, function (err, value) {
      expect(value).to.be.a("object");
      expect(value).to.haveOwnProperty("_id");
      expect(value).to.haveOwnProperty("lastName");
      done();
    });
  });
  it("Chercher un utilisateur non-existant correct. - E", (done) => {
    UserService.findOneUserById("100", null, function (err, value) {
      expect(err).to.haveOwnProperty("msg");
      expect(err).to.haveOwnProperty("type_error");
      expect(err["type_error"]).to.equal("no-valid");
      done();
    });
  });
});

describe('findOneUser', () => {
  it('Chercher un utilisateur avec un champ autorisé - S', (done) => {
    UserService.findOneUser(['username', 'email'], users[0].username, null, (err, value) => {
      expect(value).to.haveOwnProperty('firstName');
      done();
    });
  });

  it('Chercher un utilisateur avec un champ non autorisé - E', (done) => {
    UserService.findOneUser(['username', 'firstName'], users[0].username, null, (err, value) => {
      expect(err).to.haveOwnProperty('type_error');
      done();
    });
  });

  it('Chercher un utilisateur sans tableau de champ -E', (done) => {
    UserService.findOneUser('email', users[0].username, null, (err, value) => {
      expect(err).to.haveOwnProperty('type_error');
      done();
    });
  });

  it('chercher un utilisateurs inexistant', (done) => {
    UserService.findOneUser(['email'], 'users[0].username', null, (err, value) => {
      expect(err).to.haveOwnProperty('type_error');
      done();
    });
  });
});

describe("findManyUserByIds", () => {
  it("Chercher des utilisateurs existant correct. - S", (done) => {
    UserService.findManyUserByIds(tab_id_users, null, function (err, value) {
      expect(value).lengthOf(3);
      done();
    });
  });
});

describe('findManyUsers', () => {
  it('Retourne 3 utilisateurs  sur les 4 - S ', (done) => {
    UserService.findManyUsers(null, 1, 3, null, function (err, value) {
      // 

      expect(value).to.haveOwnProperty('count')
      expect(value).to.haveOwnProperty('results')
      expect(value['count']).to.be.equal(4)
      expect(value['results']).lengthOf(3)
      expect(err).to.be.null
      done()
    })
  })
  it('Envoi chaine de caractere sur page - E ', (done) => {
    UserService.findManyUsers(null, 'hi', 3, null, function (err, value) {
      expect(err).to.haveOwnProperty('type_error')
      expect(err['type_error']).to.be.equal('no-valid')
      expect(value).to.be.undefined
      done()
    })
  })
})

describe("updateOneUser", () => {
  it("Modifier un utilisateur correct. - S", (done) => {
    UserService.updateOneUser(
      id_user_valid,
      { firstName: "Jean", lastName: "Luc" }, null,
      function (err, value) {
        expect(value).to.be.a("object");
        expect(value).to.haveOwnProperty("_id");
        expect(value).to.haveOwnProperty("firstName");
        expect(value).to.haveOwnProperty("lastName");
        expect(value["firstName"]).to.be.equal("Jean");
        expect(value["lastName"]).to.be.equal("Luc");
        done();
      }
    );
  });
  it("Modifier un utilisateur avec id incorrect. - E", (done) => {
    UserService.updateOneUser(
      "1200",
      { firstName: "Jean", lastName: "Luc" }, null,
      function (err, value) {
        expect(err).to.be.a("object");
        expect(err).to.haveOwnProperty("msg");
        expect(err).to.haveOwnProperty("type_error");
        expect(err["type_error"]).to.be.equal("no-valid");
        done();
      }
    );
  });
  it("Modifier un utilisateur avec des champs requis vide. - E", (done) => {
    UserService.updateOneUser(
      id_user_valid,
      { firstName: "", lastName: "Luc" }, null,
      function (err, value) {
        expect(value).to.be.undefined;
        expect(err).to.haveOwnProperty("msg");
        expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
        expect(err).to.haveOwnProperty("fields");
        expect(err["fields"]).to.haveOwnProperty("firstName");
        expect(err["fields"]["firstName"]).to.equal(
          "Path `firstName` is required."
        );
        done();
      }
    );
  });
});

describe("updateManyUsers", () => {
  it("Modifier plusieurs utilisateurs correctement. - S", (done) => {
    UserService.updateManyUsers(tab_id_users, { firstName: "Jean", lastName: "Luc" },  null, function (err, value) {
      expect(value).to.haveOwnProperty("modifiedCount");
      expect(value).to.haveOwnProperty("matchedCount");
      expect(value["matchedCount"]).to.be.equal(tab_id_users.length);
      expect(value["modifiedCount"]).to.be.equal(tab_id_users.length);
      done();
    }
    );
  });
  it("Modifier plusieurs utilisateurs avec id incorrect. - E", (done) => {
    UserService.updateManyUsers("1200", { firstName: "Jean", lastName: "Luc" }, null, function (err, value) {
      expect(err).to.be.a("object");
      expect(err).to.haveOwnProperty("msg");
      expect(err).to.haveOwnProperty("type_error");
      expect(err["type_error"]).to.be.equal("no-valid");
      done();
    }
    );
  });
  it("Modifier plusieurs utilisateurs avec des champs requis vide. - E", (done) => {
    UserService.updateManyUsers(
      tab_id_users,
      { firstName: "", lastName: "Luc" }, null,
      function (err, value) {
        expect(value).to.be.undefined;
        expect(err).to.haveOwnProperty("msg");
        expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
        expect(err).to.haveOwnProperty("fields");
        expect(err["fields"]).to.haveOwnProperty("firstName");
        expect(err["fields"]["firstName"]).to.equal(
          "Path `firstName` is required."
        );
        done();
      }
    );
  });
});

describe("deleteOneUser", () => {
  it("Supprimer un utilisateur correctement. - S", () => {
    UserService.deleteOneUser(id_user_valid, null, function (err, value) {
      expect(value).to.be.a('Object')
      expect(value).to.haveOwnProperty("firstName");
      expect(value).to.haveOwnProperty("lastName");
    });
  });
  it("Supprimer un utilisateur avec id incorrect. - E", (done) => {
    UserService.deleteOneUser("1200", null, function (err, value) {
      expect(err).to.be.a("object");
      expect(err).to.haveOwnProperty("msg");
      expect(err).to.haveOwnProperty("type_error");
      expect(err["type_error"]).to.be.equal("no-valid");
      done();
    });
  });
  it("Supprimer un utilisateur qui n'existe pas. - E", () => {
    UserService.deleteOneUser(id_user_valid, null, function (err, value) {
      expect(err).to.be.a("object");
      expect(err).to.haveOwnProperty("msg");
      expect(err).to.haveOwnProperty("type_error");
      expect(err["type_error"]).to.be.equal("no-found");
    });
  });
});

describe("deleteManyUsers", () => {
  it("Supprimer plusieurs utilisateurs correctement. - S", (done) => {
    UserService.deleteManyUsers(tab_id_users, null, (err, value) => {
      expect(value).to.be.a("object");
      expect(value).to.haveOwnProperty("deletedCount");
      expect(value.deletedCount).to.equal(tab_id_users.length);
      done();
    });
  });

  it("Supprimer plusieurs utilisateur avec id incorrect. - E", (done) => {
    UserService.deleteManyUsers("1200",null, (err, value) => {
      expect(err).to.be.a("object");
      expect(err).to.haveOwnProperty("msg");
      expect(err).to.haveOwnProperty("type_error");
      expect(err.type_error).to.equal("no-valid");
      done();
    });
  });
});