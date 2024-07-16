const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./../../server')
const UserService = require('../../services/UserService')
const _ = require('lodash')
const id_user = "6683f4120531895b2aac801f"
var articles = []

var expect = chai.expect
var should = chai.should()

chai.use(chaiHttp)

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
    var rdm_id = tab[Math.floor(Math.random() * tab.length)];
    return rdm_id;
}

describe("POST - /article", () => {
    it("Ajouter un Article. - S", (done) => {
        chai.request(server).post('/article').send({
            name: "Carottes",
            description: "blabla",
            price: 2.50,
            quantity: 500,
            user_id: rdm_users(tab_id_users),
            password: "higuys"
        }).end((err, res) => {
            res.should.have.status(201)
            //  expect(res).to.be.a('object')
            articles.push(res.body)
            done()
        });
    })
    it("Ajouter un Article incorrect. (Sans firstName) - E", (done) => {
        chai.request(server).post('/article').send({
            lastName: 'Us',
            articlename: 'dwarfSlayr',
            email: 'lutfu.us@gmil.com',
            user_id: rdm_users(tab_id_users),
            password: "higuys"
        }).end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    it("Ajouter un Article incorrect. (Avec un articlename existant) - E", (done) => {
        chai.request(server).post('/article').send({
            firstName: "luf",
            lastName: "Us",
            articlename: "dwarfSlayer",
            email: "lutfu.us@gmai.com",
            user_id: rdm_users(tab_id_users),
            password: "higuys"
        }).end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    it("Ajouter un Article incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/article').send({
            firstName: "luffu",
            lastName: "",
            articlename: "dwarfSlaye",
            email: "lufu.us@gmai.com",
            user_id: rdm_users(tab_id_users),
            password: "higuys"
        }).end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("POST - /articles", () => {
    it("Ajouter plusieurs Articles. - S", (done) => {
        chai.request(server).post('/articles').send([{
            name: "Carottes",
            description: "blabla",
            price: 2.50,
            quantity: 500,
            user_id: rdm_users(tab_id_users),
            password: "higuys"
        },

        {
            name: "Pomme de terre",
            description: "blabla",
            price: 2.80,
            quantity: 800,
            user_id: rdm_users(tab_id_users),
            password: "higuys"
        }]
        ).end((err, res) => {
            res.should.have.status(201)

            articles = [...articles, ...res.body]
            done()
        });
    })
    it("Ajouter plusieurs Articles incorrect. - E", (done) => {
        chai.request(server).post('/articles').send([
            {
                lastName: 'Us',
                arname: 'dwarfSlayr',
                email: 'lutfu.us@gmil.com',
                user_id: rdm_users(tab_id_users),
                password: "higuys"
            },

            {
                lastName: 'Us',
                articlename: 'dwarfSlaycdsr',
                email: 'lutffqzdsu.us@gmil.com',
                user_id: rdm_users(tab_id_users),
                password: "higuys"
            }
        ]).end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    it("Ajouter plusieurs Articles incorrect. (Avec un articlename existant) - E", (done) => {
        chai.request(server).post('/articles').send([{
            firstName: "luf",
            lastName: "Us",
            articlename: "dwarfSlayer",
            email: "lutfu.us@gmai.com",
            user_id: rdm_users(tab_id_users),
            password: "higuys"
        }]).end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    it("Ajouter plusieurs Articles incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/articles').send([{
            firstName: "luffu",
            lastName: "",
            articlename: "dwarfSlaye",
            email: "lufu.us@gmai.com",
            user_id: rdm_users(tab_id_users),
            password: "higuys"
        }]).end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe('PUT - /article/:id', () => {
    it('Modifier un Article -S', (done) => {
        chai.request(server).put(`/article/${articles[0]._id}`).send({ firstName: 'Jeanne', lastName: 'Lu' })
            .end((err, res) => {
                res.should.status(200)
                expect(res.body).to.be.a('object')
                done()
            })
    })

    it('Modifier un Article avec un id non valide -E', (done) => {
        chai.request(server).put('/article/86156100').send({ firstName: 'Marie', lastName: 'fils' })
            .end((err, res) => {
                res.should.status(405)
                expect(res.body).to.be.a('object')
                done()
            })
    })
    it('Modifier un Article avec un id invalide -E', (done) => {
        chai.request(server).put('/article/66795a41761cc1544b34b3b6').send({ firstName: 'emilie', lastname: 'severe' })
            .end((err, res) => {
                res.should.status(404)
                done()
            })
    })
    it('Modifier un Article avec un champ requis vide -E', (done) => {
        chai.request(server).put(`/article/${articles[0]._id}`).send({ name: '', description: 'senerve' })
            .end((err, res) => {
                res.should.status(405)
                done()
            })
    })
})

describe('PUT /articles', () => {
    it('Modifier plusieurs Articles - S', (done) => {
        chai.request(server).put('/articles').query({ id: _.map(articles, '_id') }).send({ firstName: 'James' })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    })

    it('Modifier plusieurs Articles avec un Id non valide - E', (done) => {
        chai.request(server).put('/articles').query({ id: ['84655616846865', '84517613'] }).send({ firstName: 'James' })
            .end((err, res) => {
                res.should.have.status(405);
                expect(res.body).to.be.an('object');
                done();
            });
    })

    it('Modifier plusieurs Articles  avec des ids inexistant- E', (done) => {
        chai.request(server).put('/articles').query({ id: ['667a698caca06606d0ce8708', '667a699d521dd12877f36ec2'] }).send({ name: 'James' })
            .end((err, res) => {
                res.should.have.status(404);
                expect(res.body).to.be.an('object');
                done();
            });
    })

    it('Modifier plusieurs Articles  avec un champ requis vide - E', (done) => {
        chai.request(server).put('/articles').query({ id: _.map(articles, '_id') }).send({ name: '' })
            .end((err, res) => {
                res.should.have.status(405);
                expect(res.body).to.be.an('object');
                done();
            });
    })
})

describe('GET - /article/:id', () => {
    it('Rechercher un Article existant -S', (done) => {
        chai.request(server).get(`/article/${articles[0]._id}`)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    it('Rechercher un Article non valide - E', (done) => {
        const articleId = '145';
        chai.request(server).get(`/article/${articleId}`)
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });

    it('Chercher un Article non trouver - E', (done) => {
        const articleId = '6675723101608233e810e10a';
        chai.request(server).get(`/article/${articleId}`)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});

describe('GET - /article', () => {
    it('Chercher un Article par un champ selectionné -S', (done) => {
        chai.request(server).get('/article').query({ fields: ['description'], values: articles[0].articlename })
            .end((err, res) => {
                res.should.status = (200)
                done()
            })
    })
    it('Chercher un Article par un champ non autorisé -E', (done) => {
        chai.request(server).get('/article').query({ fields: ['name'], values: articles[0].articlename })
            .end((err, res) => {
                res.should.status = (405)
                done()
            })
    })
    it('Chercher un Article sans query -E', (done) => {
        chai.request(server).get('/article')
            .end((err, res) => {
                res.should.status = (405)
                done()
            })
    })
    it('Chercher un Article inexistant -E', (done) => {
        chai.request(server).get('/article').query({ fields: ['description'], values: 'helloguys' })
            .end((err, res) => {
                res.should.status = (404)
                done()
            })
    })
})

describe('GET - /articles_by_filters', () => {
    it('Rechercher des Articles -S', (done) => {
        chai.request(server).get('/articles_by_filters').query({ page: 1, limit: 2 })
            .end((err, res) => {

                res.should.have.status(200);
                expect(res.body.results).to.be.an('array');
                done();
            });
    });

    it('Rechercher des Articles avec une query vide -S', (done) => {
        chai.request(server).get('/articles_by_filters')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.results).to.be.an('array');
                expect(res.body.count).to.equal(3);
                done();
            });
    });

    it('Recherher plusieurs Articles avec une chaine de caracteres dans une page -E', (done) => {
        chai.request(server).get('/articles_by_filters').query({ page: 'une phrase', limit: 3 })
            .end((err, res) => {
                res.should.status = (405)
                done()
            })
    });
});

describe('GET - /articles', () => {
    it('Rechercher plusieurs Articles existants -S', (done) => {
        chai.request(server).get('/articles').query({ id: _.map(articles, '_id') })
            .end((err, res) => {
                res.should.have.status(200)
                done();
            });
    });

    it('Rechercher plusieurs Articles avec un seul ID', (done) => {
        chai.request(server).get('/articles').query({ id: ['1458781', '656216532'] })
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });

    it('Rechercher plusieurs Articles inexistants - E', (done) => {
        chai.request(server).get('/articles').query({ id: ['66792ded5e7a5a2a893297dc', '66792e10e6e3f8af2280bc7d'] })
            .end((err, res) => {
                res.should.have.status(404);
                expect(res.body).to.have.property('type_error', 'no-found');
                done();
            });
    });

    it('Rechercher plusieurs Articles avec IDs non valides - 405', (done) => {
        const articleIds = ['invalid-id-format-1', 'invalid-id-format-2'];
        chai.request(server)
            .get('/articles')
            .query({ id: articleIds })
            .end((err, res) => {
                res.should.have.status(405);
                expect(res.body).to.have.property('type_error', 'no-valid');
                done();
            });
    });
});

describe("DELETE - /article", () => {
    it("Supprimer un Article. - S", (done) => {
        chai.request(server).delete('/article/' + articles[0]._id)
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("supprimer un Article incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/article/665f18739d3e172be5daf092')
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("supprimer un Article incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/article/123')
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
})

describe("DELETE - /articles", () => {
    it("Supprimer plusieurs Articles. - S", (done) => {
        chai.request(server).delete('/articles').query({ id: _.map(articles, '_id') })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
    it("Supprimer plusieurs Articles incorrects (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/articles/665f18739d3e172be5daf092&665f18739d3e172be5daf093')
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
    it("Supprimer plusieurs Articles incorrects (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/articles').query({ id: ['123', '456'] })
            .end((err, res) => {
                res.should.have.status(405)
                done()
            })
    })
})

it('Supprimer des Utilisateurs fictifs', (done) => {
    UserService.deleteManyUsers(tab_id_users, null, function (err, value) {
        done()
    })
})