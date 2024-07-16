const ArticleService = require("../../services/ArticleService");
const UserService = require('../../services/UserService')
const chai = require("chai");
let expect = chai.expect;
const _ = require("lodash");
var id_article_valid = "";
var tab_id_articles = [];
var tab_id_users = [];
var articles = []


var users = [
    {
        firstName: "detenteur  d'article 1",
        lastName: "Iencli",
        username: "oui1",
        email: "Iencli@gmail.com",
        password: "higuys"
    },
    {
        firstName: "detenteur  d'article 2",
        lastName: "Iencli",
        username: "oui2",
        email: "Iencli2@gmail.com",
        password: "higuys"

    }, {
        firstName: "detenteur  d'article 3",
        lastName: "Iencli",
        username: "oui3",
        email: "Iencli3@gmail.com",
        password: "higuys"
    },
    {
        firstName: "detenteur  d'article 4",
        lastName: "Iencli",
        username: "oui4",
        email: "Iencli4@gmail.com",
        password: "higuys"
    },
    {
        firstName: "detenteur  d'article 5",
        lastName: "Iencli",
        username: "oui5",
        email: "Iencli5@gmail.com",
        password: "higuys"
    },
]

it('Creation des Utilisateurs fictif', (done) => {
    UserService.addManyUsers(users, null, function (err, value) {
        tab_id_users = _.map(value, '_id')
        done()
    })
})

function rdm_users(tab) {
    var rdm_id = tab[Math.floor(Math.random() * (tab.length - 1))];
    return rdm_id;
}

describe("addOneArticle", () => {
    it("Article correct. - S", (done) => {
        var article = {
            name: "Carottes",
            description: "blabla",
            price: 2.50,
            quantity: 500,
            created_at: new Date(),
            updated_at: new Date(),
            user_id: rdm_users(tab_id_users),
            password: "higuys"
        };
        ArticleService.addOneArticle(article, null, function (err, value) {
            expect(value).to.be.a("object");
            expect(value).to.haveOwnProperty("_id");
            expect(value).to.haveOwnProperty("user_id");

            id_article_valid = value._id;
            done()
            //
        });
    });
    it("Article incorrect. (Sans Name) - E", (done) => {
        var article_no_valid = {
            description: "blabla",
            price: 2.50,
            quantity: 500,
            created_at: new Date(),
            updated_at: new Date(),
            user_id: rdm_users(tab_id_users),
            password: "higuys"
        };
        ArticleService.addOneArticle(article_no_valid, null, function (err, value) {
            expect(err).to.haveOwnProperty("msg");
            expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
            expect(err).to.haveOwnProperty("fields");
            expect(err["fields"]).to.haveOwnProperty("name");
            expect(err["fields"]["name"]).to.equal(
                "Path `name` is required."
            );
            done()
        });
    });
});

describe("addManyArticles", () => {
    it("Articles à ajouter, non valide. - E", (done) => {
        var articles_tab_error = [
            {
                name: "Carottes",
                description: "Hey Honey",
                price: 2.50,
                quantity: "500",
                created_at: new Date(),
                updated_at: new Date(),
                user_id: rdm_users(tab_id_users),
                password: "higuys"
            },
            {
                name: "Carottes",
                description: "blabla",
                price: 2.50,
                created_at: new Date(),
                updated_at: new Date(),
                user_id: rdm_users(tab_id_users),
                password: "higuys"
            },
            {
                name: "Carottes",
                description: "pookie",
                created_at: new Date(),
                updated_at: new Date(),
                user_id: rdm_users(tab_id_users),
                password: "higuys"
            },
            {
                name: "Carottes",
                description: "blabla",
                user_id: rdm_users(tab_id_users),
                password: "higuys"
            },
        ];
        ArticleService.addManyArticles(articles_tab_error, null, function (err, value) {
            done();
        });
    });

    it("Articles à ajouter, valide. - S", (done) => {
        var articles_tab = [
            {
                name: "Carottes",
                description: "blabla",
                price: 2.50,
                quantity: 500,
                created_at: new Date(),
                updated_at: new Date(),
                user_id: rdm_users(tab_id_users),
                password: "higuys"
            },
            {
                name: "Pomme de terre",
                description: "blabla",
                price: 2.80,
                quantity: 800,
                created_at: new Date(),
                updated_at: new Date(),
                user_id: rdm_users(tab_id_users),
                password: "higuys"
            },
            {
                name: "Navet",
                description: "blabla",
                price: 3.10,
                quantity: 200,
                created_at: new Date(),
                updated_at: new Date(),
                user_id: rdm_users(tab_id_users),
                password: "higuys"
            },
        ];

        ArticleService.addManyArticles(articles_tab, null, function (err, value) {
            tab_id_articles = _.map(value, "_id");
            expect(value).lengthOf(3);
            articles = [...value, ...articles]
            done();
        });
    });
});

describe("findOneArticleById", () => {
    it("Chercher un Article existant correct. - S", (done) => {
        ArticleService.findOneArticleById(id_article_valid, null, function (err, value) {
            expect(value).to.be.a("object");
            expect(value).to.haveOwnProperty("_id");
            expect(value).to.haveOwnProperty("description");
            done();
        });
    });
    it("Chercher un Article non-existant correct. - E", (done) => {
        ArticleService.findOneArticleById("100", null, function (err, value) {
            expect(err).to.haveOwnProperty("msg");
            expect(err).to.haveOwnProperty("type_error");
            expect(err["type_error"]).to.equal("no-valid");
            done();
        });
    });
});

describe('findOneArticle', () => {
    it('Chercher un Article avec un champ autorisé - S', (done) => {
        ArticleService.findOneArticle(['name'], articles[0].name, null, (err, value) => {
            expect(value).to.haveOwnProperty('name');
            done();
        });
    });

    it('Chercher un Article avec un champ non autorisé - E', (done) => {
        ArticleService.findOneArticle(['articlename', 'firstName'], articles[0].name, null, (err, value) => {
            expect(err).to.haveOwnProperty('type_error');
            done();
        });
    });

    it('Chercher un Article sans tableau de champ -E', (done) => {
        ArticleService.findOneArticle('email', articles[0].name, null, (err, value) => {
            expect(err).to.haveOwnProperty('type_error');
            done();
        });
    });

    it('chercher un Article inexistant', (done) => {
        ArticleService.findOneArticle(['email'], 'articles[0].articlename', null, (err, value) => {
            expect(err).to.haveOwnProperty('type_error');
            done();
        });
    });
});

describe('findManyArticles', () => {
    it('Retourne 3 Articles sur les 4 - S ', (done) => {
        ArticleService.findManyArticles(null, 1, 3, null, function (err, value,) {

            expect(value).to.haveOwnProperty('count')
            expect(value).to.haveOwnProperty('results')
            expect(value['count']).to.be.equal(4)
            expect(value['results']).lengthOf(3)
            expect(err).to.be.null
            done()
        })
    })
    it('Envoi chaine de caractere sur page - E ', (done) => {
        ArticleService.findManyArticles(null, 'hi', 3, null, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            expect(value).to.be.undefined
            done()
        })
    })
})

describe("updateOneArticle", () => {
    it("Modifier un Article correct. - S", (done) => {
        ArticleService.updateOneArticle(
            id_article_valid,
            { name: "Choux", description: "Hello" },
            null,
            function (err, value) {
                expect(value).to.be.a("object");
                expect(value).to.haveOwnProperty("_id");
                expect(value).to.haveOwnProperty("name");
                expect(value).to.haveOwnProperty("description");
                expect(value["name"]).to.be.equal("Choux");
                expect(value["description"]).to.be.equal("Hello");
                done();
            }
        );
    });
    it("Modifier un Article avec id incorrect. - E", (done) => {
        ArticleService.updateOneArticle(
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
    it("Modifier un Article avec des champs requis vide. - E", (done) => {
        ArticleService.updateOneArticle(
            id_article_valid,
            { name: "", description: "Hello" }, null,
            function (err, value) {
                expect(value).to.be.undefined;
                expect(err).to.haveOwnProperty("msg");
                expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
                expect(err).to.haveOwnProperty("fields");
                expect(err["fields"]).to.haveOwnProperty("name");
                expect(err["fields"]["name"]).to.equal("Path `name` is required.");
                done();
            }
        );
    });
});

describe("updateManyArticles", () => {
    it("Modifier plusieurs Articles correctement. - S", (done) => {
        ArticleService.updateManyArticles(tab_id_articles, { name: "Choux", description: "Hello" }, null, function (err, value) {
            expect(value).to.haveOwnProperty("modifiedCount");
            expect(value).to.haveOwnProperty("matchedCount");
            expect(value["matchedCount"]).to.be.equal(tab_id_articles.length);
            expect(value["modifiedCount"]).to.be.equal(tab_id_articles.length);
            done();
        }
        );
    });
    it("Modifier plusieurs Articles avec id incorrect. - E", (done) => {
        ArticleService.updateManyArticles("1200", { firstName: "Jean", lastName: "Luc" }, null, function (err, value) {
            expect(err).to.be.a("object");
            expect(err).to.haveOwnProperty("msg");
            expect(err).to.haveOwnProperty("type_error");
            expect(err["type_error"]).to.be.equal("no-valid");
            done();
        }
        );
    });
    it("Modifier plusieurs Articles avec des champs requis vide. - E", (done) => {
        ArticleService.updateManyArticles(
            tab_id_articles,
            { name: "", description: "Luc" }, null,
            function (err, value) {
                expect(value).to.be.undefined;
                expect(err).to.haveOwnProperty("msg");
                expect(err).to.haveOwnProperty("fields_with_error").with.lengthOf(1);
                expect(err).to.haveOwnProperty("fields");

                done();
            }
        );
    });
});

describe("deleteOneArticle", () => {
    it("Supprimer un Article correctement. - S", () => {
        ArticleService.deleteOneArticle(id_article_valid, null, function (err, value) {
            expect(value).to.be.a('Object')
            expect(value).to.haveOwnProperty("firstName");
            expect(value).to.haveOwnProperty("lastName");
        });
    });
    it("Supprimer un Articles avec id incorrect. - E", (done) => {
        ArticleService.deleteOneArticle("1200", null, function (err, value) {
            expect(err).to.be.a("object");
            expect(err).to.haveOwnProperty("msg");
            expect(err).to.haveOwnProperty("type_error");
            expect(err["type_error"]).to.be.equal("no-valid");
            done();
        });
    });
    it("Supprimer un Article qui n'existe pas. - E", () => {
        ArticleService.deleteOneArticle(id_article_valid, null, function (err, value) {
            expect(err).to.be.a("object");
            expect(err).to.haveOwnProperty("msg");
            expect(err).to.haveOwnProperty("type_error");
            expect(err["type_error"]).to.be.equal("no-found");
        });
    });
});

describe("deleteManyArticles", () => {
    it("Supprimer plusieurs Articles correctement. - S", (done) => {
        ArticleService.deleteManyArticles(tab_id_articles, null, (err, value) => {
            expect(value).to.be.a("object");
            expect(value).to.haveOwnProperty("deletedCount");
            expect(value.deletedCount).to.equal(tab_id_articles.length);
            done();
        });
    });

    it("Supprimer plusieurs Articles avec id incorrect. - E", (done) => {
        ArticleService.deleteManyArticles("1200", null, (err, value) => {
            expect(err).to.be.a("object");
            expect(err).to.haveOwnProperty("msg");
            expect(err).to.haveOwnProperty("type_error");
            expect(err.type_error).to.equal("no-valid");
            done();
        });
    });
});

it('Supprimer des Utilisateurs fictifs', (done) => {
    UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
        done()
    })
})