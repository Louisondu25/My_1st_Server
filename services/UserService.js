// Importation du schéma de l'utilisateur (UserSchema) depuis le fichier "../schemas/User"
const UserSchema = require("../schemas/User");
// Importation de la bibliothèque Lodash pour faciliter le traitement des données JavaScript
const _ = require("lodash");
// Importation de la bibliothèque Async pour faciliter la gestion des tâches asynchrones
const async = require("async");
// Importation de la bibliothèque Mongoose pour interagir avec la base de données MongoDB
const mongoose = require("mongoose");

// Définition du modèle "User" en utilisant le schéma "UserSchema"
var User = mongoose.model("User", UserSchema);

// Exportation de la fonction "addOneUser" qui permet d'ajouter un nouvel utilisateur dans la base de données
module.exports.addOneUser = function (user, callback) {
  // Création d'un nouvel utilisateur en utilisant le modèle "User" et les données fournies dans le paramètre "user"
  var new_user = new User(user);
  // Validation des données de l'utilisateur
  var errors = new_user.validateSync();
  // Si des erreurs sont détectées, la fonction "callback" est appelée avec un objet d'erreur en paramètre
  if (errors) {
    errors = errors["errors"];
    // Extraction des messages d'erreur
    var text = Object.keys(errors)
      .map((e) => {
        return errors[e]["properties"]["message"];
      })
      .join(" ");
    // Extraction des noms des champs avec des erreurs
    var fields = _.transform(
      Object.keys(errors),
      function (result, value) {
        result[value] = errors[value]["properties"]["message"];
      },
      {}
    );
    // Création de l'objet d'erreur
    var err = {
      msg: text,
      fields_with_error: Object.keys(errors),
      fields: fields,
    };
    callback(err);
  } else {
    // Si aucune erreur n'est détectée, l'utilisateur est enregistré dans la base de données
    new_user.save();
    // La fonction "callback" est appelée avec un paramètre null pour indiquer qu'aucune erreur n'a été détectée et avec l'utilisateur enregistré en paramètre
    callback(null, new_user.toObject());
  }
};

// Exportation de la fonction "addManyUsers" qui permet d'ajouter plusieurs utilisateurs dans la base de données
module.exports.addManyUsers = function (users, callback) {
  // Initialisation d'un tableau pour stocker les erreurs éventuelles
  var errors = [];
  // Boucle sur chaque utilisateur du tableau "users"
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    // Création d'un nouvel utilisateur en utilisant le modèle "User" et les données fournies dans le paramètre "user"
    var new_user = new User(user);
    // Validation des données de l'utilisateur
    var error = new_user.validateSync();
    // Si des erreurs sont détectées, elles sont stockées dans le tableau "errors"
    if (error) {
      error = error["errors"];
      // Extraction des messages d'erreur
      var text = Object.keys(error)
        .map((e) => {
          return error[e]["properties"]["message"];
        })
        .join(" ");
      // Extraction des noms des champs avec des erreurs
      var fields = _.transform(
        Object.keys(error),
        function (result, value) {
          result[value] = error[value]["properties"]["message"];
        },
        {}
      );
      // Ajout de l'erreur au tableau "errors" avec l'index de l'utilisateur concerné
      errors.push({
        msg: text,
        fields_with_error: Object.keys(error),
        fields: fields,
        index: i,
      });
    }
  }
  // Si des erreurs ont été détectées, la fonction "callback" est appelée avec le tableau d'erreurs en paramètre
  if (errors.length > 0) {
    callback(errors);
  } else {
    // Si aucune erreur n'a été détectée, les utilisateurs sont enregistrés dans la base de données en utilisant la méthode "insertMany" de Mongoose
    User.insertMany(users)
      .then((data) => {
        console.log("OKK"); // Message de débogage
        // La fonction "callback" est appelée avec un paramètre null pour indiquer qu'aucune erreur n'a été détectée et avec les données enregistrées en paramètre
        callback(null, data);
      })
      .catch((e) => {
        // Si une erreur survient lors de l'enregistrement, la fonction "callback" est appelée avec l'erreur en paramètre
        callback(e);
      });
  }
};

// Exportation de la fonction "findOneUser" qui permet de récupérer un utilisateur par son ID
module.exports.findOneUser = function (id, callback) {
  // Recherche d'un utilisateur par son ID en utilisant la méthode "findById" de Mongoose
  User.findById(id, function (err, user) {
    // Si une erreur survient lors de la recherche, la fonction "callback" est appelée avec l'erreur en paramètre
    if (err) {
      return callback(err);
    }
    // Si l'utilisateur n'est pas trouvé, la fonction "callback" est appelée avec un message d'erreur
    if (!user) {
      return callback({ msg: "User not found", fields: {} });
    }
    // Si l'utilisateur est trouvé, la fonction "callback" est appelée avec un paramètre null pour indiquer qu'aucune erreur n'a été détectée et avec l'utilisateur en paramètre
    return callback(null, user.toObject());
  });
};

// function checkSchemaUser(user, callback) {
//     var element_check = _.pick(user, UserSchema.authorized)
//     var required_isnt_include = _.difference(UserSchema.required.sort(), _.keys(_.pick(element_check, UserSchema.required)).sort())
//     var required_is_empty = _.filter(UserSchema.required, (e) => { return _.isEmpty(element_check[e]) })
//     required_is_empty = _.difference( required_is_empty, required_isnt_include)
//     var text_error = ""
//     if (required_isnt_include.length > 0)
//         text_error += `Une des propriétés requis (${required_isnt_include.join(', ')}) n'est pas inclus. `
//     if (required_is_empty.length > 0)
//         text_error += `Une des propriétés requis (${required_is_empty.join(', ')}) est inclus mais vide.`
//     var error = {
//         msg: text_error,
//         key_required_not_include: required_isnt_include,
//         key_required_empty:required_is_empty
//     }
//     if (required_isnt_include.length > 0 || required_is_empty.length > 0) {
//         callback(error)
//     }
//     else {
//         callback(null, element_check)
//     }
// }

// // La fonction permet d'ajouter un utilisateur.
// module.exports.addOneUser = function(user, callback) {
//     checkSchemaUser(user, function(err, value) {
//         if (err)
//             callback(err)
//         else {
//             value.id = _.uniqueId()
//             UserSchema.elements.push(value)
//             callback(null, value)
//         }
//     })
// }

// // La fonction permet d'ajouter plusieurs utilisateurs.
// module.exports.addManyUsers = function(users, callback) {
//     var i = 0;
//     async.map(users, function(user, next) {
//         checkSchemaUser(user, function(err, value) {
//             if (err) {
//                 err.index = i;
//                 next(null, err);
//             } else {
//                 next(null, null);
//             }
//             i++;
//         });
//     }, function(err, val) {
//         if (err) {
//             return callback(err);
//         }

//         var error = _.filter(val, (e) => { return !_.isEmpty(e) });
//         if (error.length > 0) {
//             return callback(error);
//         }

//         async.map(users, checkSchemaUser, function(err, val) {
//             console.log(val);
//             var tab = _.map(val, (e) => { e.id = _.uniqueId(); return e; });
//             UserSchema.elements = [...UserSchema.elements, ...tab];
//             callback(null, val);
//         });
//     });
// };

// // La fonction permet de chercher un utilisateur.
// module.exports.findOneUser = function (id, callback) {
//     var user = _.find(UserSchema.elements, ["id", id])
//     console.log(user)
//     if (user) {
//         callback(null, user)
//     }
//     else {
//         callback({error: true,msg: 'Utilisateur not found.', error_type: 'Not-Found'})
//     }
// }

// // La fonction permet de chercher plusieurs utilisateurs.
// module.exports.findManyUsers = function(ids, callback) {
//     var users = _.filter(UserSchema.elements, (e) => {
//         return ids.indexOf(e.id) > -1
//         })
//         callback(null, users)
// }

// // La fonction permet de supprimer un utilisateur.
// module.exports.deleteOneUser = function(id, callback) {
//     var user_index = _.findIndex(userSchema.elements, ["id", String(id)])
//     if (user_index > -1) {
//         UserSchema.elements.splice(user_index, 1)
//         callback(null, {msg: "Elément supprimé"})
//     } else {
//         callback({error: true, msg: "L'utilisateur à effacter n'a pas été trouvé. (Id invalide"})
//     }
// }

// // La fonction permet de supprimer plusieurs utilisateurs.
// module.exports.deleteManyUsers = function() {
//     var count_remove = 0;
//     for (var i = 0; i < ids.length; i++) {
//         var user_index = _.findIndex(UserSchema.elements, ["id", ids[i]])
//         if (user_index > -1) {
//             count_remove++;
//             UserSchema.elements.splice(user_index, 1)
//         }
//     }
//     callback(null, {msg: `${count_remove} éléments supprimés`})
// }

// // La fonction permet de modifier un utilisateur.
// module.exports.updateOneUser = function(id, user_edition, callback) {
//     var user_index = _.findIndex(UserSchema.elements, ["id", id])
//     var user_tmp = {... UserSchema.elements[user_index],...user_edition }
//     checkSchemaUser(user_tmp, function(err, value) {
//         if (err)
//             callback(err)
//         else {
//             UserSchema.elements[user_index] = {... UserSchema.elements[user_index],...value }
//             callback(null, UserSchema.elements[user_index])
//         }
//     })
// }

// // La fonction permet de modifier plusieurs utilisateurs.
// module.exports.updateManyUsers = function() {

// }
