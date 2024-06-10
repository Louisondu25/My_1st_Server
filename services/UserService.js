const UserSchema = require("../schemas/User");
const _ = require("lodash");
const async = require("async");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

var User = mongoose.model("User", UserSchema);

module.exports.addOneUser = function (user, callback) {
  var new_user = new User(user);
  var errors = new_user.validateSync();
  if (errors) {
    errors = errors["errors"];
    var text = Object.keys(errors)
      .map((e) => {
        return errors[e]["properties"]["message"];
      })
      .join(" ");
    var fields = _.transform(
      Object.keys(errors),
      function (result, value) {
        result[value] = errors[value]["properties"]["message"];
      },
      {}
    );
    var err = {
      msg: text,
      fields_with_error: Object.keys(errors),
      fields: fields,
      type_error: "validator",
    };
    callback(err);
  } else {
    new_user.save();
    callback(null, new_user.toObject());
  }
};

module.exports.addManyUsers = function (users, callback) {
  var errors = [];
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    var new_user = new User(user);
    var error = new_user.validateSync();
    if (error) {
      error = error["errors"];
      var text = Object.keys(error)
        .map((e) => {
          return error[e]["properties"]["message"];
        })
        .join(" ");
      var fields = _.transform(
        Object.keys(error),
        function (result, value) {
          result[value] = error[value]["properties"]["message"];
        },
        {}
      );
      errors.push({
        msg: text,
        fields_with_error: Object.keys(error),
        fields: fields,
        index: i,
        type_error: "validator",
      });
    }
  }
  if (errors.length > 0) {
    callback(errors);
  } else {
    User.insertMany(users)
      .then((data) => callback(null, data))
      .catch((e) => callback(e));
    //  User.insertMany(users, callback)
    //callback(null, users)
    /* .then(data => callback(null, data))
        .catch(e => callback(e)); */
  }
};

module.exports.findOneUser = function (user_id, callback) {
  if (user_id && mongoose.isValidObjectId(user_id)) {
    User.findById(user_id)
      .then((value) => {
        try {
          if (value) {
            callback(null, value.toObject());
          } else {
            callback({
              msg: "Aucun utilisateur trouvé.",
              type_error: "no-found",
            });
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch((err) => {
        callback({
          msg: "Impossible de chercher l'élément.",
          type_error: "error-mongo",
        });
      });
  } else {
    callback({ msg: "ObjectId non conforme.", type_error: "no-valid" });
  }
};

module.exports.findManyUsers = function (users_id, callback) {
  if (users_id && users_id.length > 0) {
    users_id = users_id.map((e) => {
      return new ObjectId(e);
    });
    User.find({ _id: users_id })
      .then((value) => {
        try {
          if (value) {
            callback(null, value);
          } else {
            callback({
              msg: "Aucun utilisateur trouvé.",
              type_error: "no-found",
            });
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch((err) => {
        callback({
          msg: "Impossible de chercher l'élément.",
          type_error: "error-mongo",
        });
      });
  } else {
    callback({ msg: "Tableau non conforme.", type_error: "no-valid" });
  }
};

module.exports.updateOneUser = function (user_id, update, callback) {
  if (user_id && mongoose.isValidObjectId(user_id)) {
    User.findByIdAndUpdate(new ObjectId(user_id), update, {
      returnDocument: "after",
      runValidators: true,
    })
      .then((value) => {
        try {
          callback(null, value.toObject());
        } catch (e) {
          console.log(e);
          callback(e);
        }
      })
      .catch((errors) => {
        errors = errors["errors"];
        var text = Object.keys(errors)
          .map((e) => {
            return errors[e]["properties"]["message"];
          })
          .join(" ");
        var fields = _.transform(
          Object.keys(errors),
          function (result, value) {
            result[value] = errors[value]["properties"]["message"];
          },
          {}
        );
        var err = {
          msg: text,
          fields_with_error: Object.keys(errors),
          fields: fields,
          type_error: "validator",
        };
        callback(err);
      });
  } else {
    callback({ msg: "Id invalide.", type_error: "no-valid" });
  }
};

module.exports.updateManyUsers = function (users_id, update, callback) {
  if (users_id && Array.isArray(users_id) && users_id.length > 0) {
    users_id = users_id.map((e) => {
      return new ObjectId(e);
    });
    User.updateMany({ _id: users_id }, update, { runValidators: true })
      .then((value) => {
        try {
          callback(null, value);
        } catch (e) {
          console.log(e);
          callback(e);
        }
      })
      .catch((errors) => {
        errors = errors["errors"];
        var text = Object.keys(errors)
          .map((e) => {
            return errors[e]["properties"]["message"];
          })
          .join(" ");
        var fields = _.transform(
          Object.keys(errors),
          function (result, value) {
            result[value] = errors[value]["properties"]["message"];
          },
          {}
        );
        var err = {
          msg: text,
          fields_with_error: Object.keys(errors),
          fields: fields,
          type_error: "validator",
        };
        callback(err);
      });
  } else {
    callback({ msg: "Id invalide.", type_error: "no-valid" });
  }
};

module.exports.deleteOneUser = function (user_id, callback) {
  if (user_id && mongoose.isValidObjectId(user_id)) {
    User.findByIdAndDelete({ _id: new ObjectId(user_id) })
      .then((result) => {
        try {
          callback(null, result.toObject());
        } catch (e) {
          console.log(e);
          callback(e);
        }
      })
      .catch((err) => {
        callback({
          msg: "Erreur lors de la suppression de l'utilisateur.",
          type_error: "delete",
        });
      });
  } else {
    callback({ msg: "Id invalide.", type_error: "no-valid" });
  }
};
/* 
function checkSchemaUser(user, callback) {
    //var element_check = user
    var element_check = _.pick(user, UserSchema.authorized)
    var required_isnt_include = _.difference(UserSchema.required.sort(), _.keys(_.pick(element_check, UserSchema.required)).sort())
    var required_is_empty = _.filter(UserSchema.required, (e) => { return _.isEmpty(element_check[e]) })
    required_is_empty = _.difference(required_is_empty, required_isnt_include)
    var text_error = ""
    if (required_isnt_include.length > 0)
        text_error += `Une des propriétés requis (${required_isnt_include.join(', ')}) n'est pas inclus. `
    if (required_is_empty.length > 0)
        text_error += `Une des propriétés requis (${required_is_empty.join(', ')}) est inclus mais vide.`
    var error = {
        msg: text_error,
        key_required_not_include: required_isnt_include,
        key_required_empty: required_is_empty
    }
    if (required_isnt_include.length > 0 || required_is_empty.length > 0) {
        callback(error)
    }
    else {
        callback(null, element_check)
    }
}

// La fonction permet d'ajouter un utilisateur.
module.exports.addOneUser = function (user, callback) {
    checkSchemaUser(user, function (err, value) {
        if (err)
            callback(err)
        else {
            value.id = _.uniqueId()
            UserSchema.elements.push(value)
            callback(null, value)
        }
    })
}

// La fonction permet d'ajouter plusieurs utilisateurs.
module.exports.addManyUsers = function (users, callback) {
    var i = 0;
    async.map(users, function (user, next) {
        checkSchemaUser(user, function (err, value) {
            if (err) {
                err.index = i
                next(null, err)
            }
            else {
                next(null, null)
            }
            i++;
        })
    }, function (err, val) {
        var error = _.filter(val, (e) => { return !_.isEmpty(e) })
        if (error.length > 0) {
            callback(error)
        }
        else {
            async.map(users, checkSchemaUser, function (err, val) {
                var tab = _.map(val, (e) => { e.id = _.uniqueId(); return e })
                UserSchema.elements = [...UserSchema.elements, ...tab]
                callback(null, val)
            })
        }
    });
}

// La fonction permet de chercher un utilisateur.
module.exports.findOneUser = function (id, callback) {
    var user = _.find(UserSchema.elements, ["id", id])
    if (user) {
        callback(null, user)
    }
    else {
        callback({ error: true, msg: 'Utilisateur not found.', error_type: 'Not-Found' })
    }
}

// La fonction permet de chercher plusieurs utilisateurs.
module.exports.findManyUsers = function (ids, callback) {
    var users = _.filter(UserSchema.elements, (e) => {
        return ids.indexOf(e.id) > -1
    })
    callback(null, users)
}

// La fonction permet de supprimer un utilisateur.
module.exports.deleteOneUser = function (id, callback) {
    var user_index = _.findIndex(UserSchema.elements, ["id", String(id)])
    if (user_index > -1) {
        var user_delete = UserSchema.elements.splice(user_index, 1)[0]
        callback(null, {msg: "Element supprimé.", user_delete: user_delete})
    }
    else {
        callback({error: 1, msg: "L'utilisateur à effacé n'a pas été trouvé. (Id invalide)"})
    }
}

// La fonction permet de supprimer plusieurs utilisateurs.
module.exports.deleteManyUsers = function (ids, callback) {
    var count_remove = 0
    for (var i = 0; i < ids.length;i++) {
        var user_index = _.findIndex(UserSchema.elements, ["id", String(ids[i])])
        if (user_index > -1)  {
            count_remove++
            UserSchema.elements.splice(user_index, 1)
        }

    }
    callback(null, {msg: `${count_remove} élément(s) supprimé(s).`, count_remove: count_remove})
}

// La fonction permet de modifier un utilisateur.
module.exports.updateOneUser = function (id, user_edition, callback) {
    var user_index = _.findIndex(UserSchema.elements, ["id", id])
    var user_tmp = { ...UserSchema.elements[user_index], ...user_edition }
    checkSchemaUser(user_tmp, function (err, value) {
        if (err)
            callback(err)
        else {
            UserSchema.elements[user_index] = { ...UserSchema.elements[user_index], ...value }
            callback(null, UserSchema.elements[user_index])
        }
    })
}

// La fonction permet de modifier plusieurs utilisateurs.
module.exports.updateManyUsers = function () {

} */
