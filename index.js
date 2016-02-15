const Mongorito = require('mongorito'),
      _ = require('lodash');

/**
 * Validate configurations
 *
 * @private
 */
var _configure = function () {
  var connection = sails.config.models.connection;

  // A connection must be provided
  if (!connection) {
    throw new Error(
      'No `sails.config.models.connection` provided.\n' +
      'Your application won\'t be able to connect to a MongoDB database if you don\'t set one.'
    );
  }

  // The connection adapter must of type `mongorito`
  if (sails.config.connections[connection].adapter !== 'mongorito') {
    throw new Error(
      'The connection adapter must be of type `mongorito`.\n' +
      'This isn\'t the case for your `sails.config.connections.' + connection + '` connection.'
    );
  }

  // An `host` and `database` configuration must at lease be provided
  if (!sails.config.connections[connection].host || !sails.config.connections[connection].database) {
    throw new Error('An `host` and `database` configuration must at lease be provided');
  }
};

module.exports = function (sails) {

  return {

    configure: _configure,

    /**
     * Initialize hook
     *
     * @param cb
     */
    initialize: function (cb) {
      var connection = sails.config.connections[sails.config.models.connection],
        uri,
        options = {};

      // Build URI
      // ======================================

      // Credentials
      if (connection.user && connection.password) {
        uri = connection.user + ':' + connection.password + '@';

        options.uri_decode_auth = true;
      }

      // Host & Port & Database
      uri += connection.host + (connection.port ? ':' + connection.port : '') + '/' + connection.database;

      // Database connection & Models loading
      // ======================================

      Mongorito.connect(uri, options).then(function () {

        // Expose Mongorito Model as global variable
        global['MongoritoModel'] = Mongorito.Model;

        // Load model definitions using the module loader
        sails.log.verbose('Loading the app\'s models from `%s`...', sails.config.paths.models);
        sails.modules.loadModels(function modulesLoaded(err, models) {
          if (err) { return cb(err); }

          sails.models = {};
          _.each(models, function (model) {
            sails.models[model.identity] = model;
            sails.models[model.identity].globalId = model.globalId;
            sails.models[model.identity].identity = model.identity;

            // Expose model as global variable
            global[model.globalId] = model;
          });

          // At this point, we know Mongorito has connected to the database and models has been loaded,
          // everything is ready to go, and we can safely trigger `initialize`'s callback.
          return cb();
        });
      }, function (err) {
        return cb(err);
      });
    }
  }
};
