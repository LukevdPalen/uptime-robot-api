var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('uptime-robot'), require('bluebird'), require('lodash'), require('request')) : typeof define === 'function' && define.amd ? define(['exports', 'uptime-robot', 'bluebird', 'lodash', 'request'], factory) : factory(global['null'] = {}, global.Client, global.bluebird, global._, global.request);
})(this, function (exports, Client, bluebird, _, _request) {
  'use strict';

  Client = 'default' in Client ? Client['default'] : Client;
  bluebird = 'default' in bluebird ? bluebird['default'] : bluebird;
  _ = 'default' in _ ? _['default'] : _;
  _request = 'default' in _request ? _request['default'] : _request;

  'use strict';

  var UptimeRobotServerError = (function (_Error) {
    _inherits(UptimeRobotServerError, _Error);

    function UptimeRobotServerError(statusCode, message) {
      _classCallCheck(this, UptimeRobotServerError);

      _get(Object.getPrototypeOf(UptimeRobotServerError.prototype), 'constructor', this).call(this);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.message = message;
    }

    return UptimeRobotServerError;
  })(Error);

  var UptimeRobotError = UptimeRobotServerError;

  'use strict';

  var Monitor__PREFIX = 'monitor';

  var contactArray;

  var Monitor = (function () {
    function Monitor(options) {
      _classCallCheck(this, Monitor);

      this.id = options.id;
      this.friendlyName = options.friendlyname;
      this.URL = options.url;
      this.type = options.type || '1';
      this.subType = options.subtype;
      this.keywordType = options.keywordtype;
      this.keywordValue = options.keywordvalue;
      this.HTTPUsername = options.httpusername;
      this.HTTPPassword = options.httppassword;
      this.log = options.log || [];
      this.alertContacts = this.contacts;
      this.interval = options.interval;

      contactArray = [];
    }

    _createClass(Monitor, [{
      key: 'validate',
      value: function validate() {
        if (!_.has(this, 'friendlyName')) {
          return Error('`monitorFriendlyName` not defined');
        } else if (!_.has(this, 'URL')) {
          return Error('`monitorURL` not defined');
        }

        return true;
      }
    }, {
      key: 'parse',
      value: function parse() {
        var _this = this;

        var keys = _.keys(this);

        return _.chain(keys).map(function (key) {
          if (key == 'log' || key.charAt(0) === '_') {
            return null;
          }

          return [Monitor__PREFIX + key.charAt(0).toUpperCase() + key.slice(1), _this[key]];
        }).object().value();
      }
    }, {
      key: 'contact',
      set: function set(contact) {

        contactArray.push(contact);
      }
    }, {
      key: 'contacts',
      get: function get() {
        return _.map(contactArray, function (contact) {
          return contact.toString();
        }).join('-');
      }
    }], [{
      key: 'singular',
      get: function get() {
        return Monitor__PREFIX;
      }
    }, {
      key: 'plural',
      get: function get() {
        return Monitor__PREFIX + 's';
      }
    }]);

    return Monitor;
  })();

  exports.Monitor = Monitor;

  'use strict';

  var Contact__PREFIX = 'alertContact';

  var Contact = (function () {
    function Contact(options) {
      _classCallCheck(this, Contact);

      this.id = options.id;
      this.friendlyName = options.friendlyname;
      this.type = options.type || '2';
      this.value = options.value;

      this.config = { threshold: 0, recurrence: 0 };
    }

    _createClass(Contact, [{
      key: 'toString',
      value: function toString() {
        return [this.id, this.config.threshold, this.config.recurrence].join('_');
      }
    }, {
      key: 'validate',
      value: function validate() {
        if (!_.has(this, 'type')) {
          return Error('`type` not defined');
        } else if (!_.has(this, 'value')) {
          return Error('`type` not defined');
        }

        return true;
      }
    }, {
      key: 'parse',
      value: function parse() {
        var _this2 = this;

        var keys = _.keys(this);

        return _.chain(keys).map(function (key) {
          if (key === 'config') {
            return null;
          }

          return [Contact__PREFIX + key.charAt(0).toUpperCase() + key.slice(1), _this2[key]];
        }).filter().object().value();
      }
    }], [{
      key: 'singular',
      get: function get() {
        return Contact__PREFIX;
      }
    }, {
      key: 'plural',
      get: function get() {
        return Contact__PREFIX + 's';
      }
    }]);

    return Contact;
  })();

  exports.Contact = Contact;

  'use strict';

  var BASE = 'http://api.uptimerobot.com/';

  var client__Client = (function () {
    function client__Client(apiKey) {
      _classCallCheck(this, client__Client);

      if (apiKey === '' || typeof apiKey !== 'string') {
        throw new Error('Uptime Robot API Key must be provided');
      }

      this.apiKey = apiKey;
    }

    _createClass(client__Client, [{
      key: 'request',
      value: function request(method, endpoint) {
        var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        var payload = {
          method: method,
          uri: BASE + endpoint
        };

        payload.json = true;

        params.apiKey = this.apiKey;
        params.noJsonCallback = 1;
        params.format = 'json';

        if (method === 'GET') {
          payload.qs = params;
        } else {
          payload.form = params;
        }

        return new bluebird(function (resolve, reject) {

          _request(payload, function (error, response, body) {
            if (error) {
              return reject(error);
            } else if (response.statusCode && response.statusCode !== 200) {
              return reject(new UptimeRobotError(response.statusCode, 'Server responded with an ' + response.statusCode + ' status code!'));
            } else if (body.stat !== 'ok') {
              return reject(new UptimeRobotError(body.id, body.message));
            }

            return resolve(body);
          });
        });
      }
    }, {
      key: 'list',
      value: function list() {
        var _this3 = this;

        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var Instance = arguments.length <= 1 || arguments[1] === undefined ? Monitor : arguments[1];

        return new bluebird(function (resolve, reject) {
          var params = {};
          if (Instance.name == Monitor.name) {
            if (!options.logs && options.alertContacts) {
              return reject(new Error('logs is required if alert contacts is true.'));
            }

            if (options.monitors) {
              params.monitors = options.monitors.join('-');
            }
            if (options.customUptimeRatio) {
              params.customUptimeRatio = options.customUptimeRatio.join('-');
            }
            if (options.logs) {
              params.logs = '1';
            }
            if (options.alertContacts) {
              params.alertContacts = '1';
            }
            if (options.showMonitorAlertConcats) {
              params.showMonitorAlertConcats = '1';
            }
            if (options.showTimezone) {
              params.showTimezone = '1';
            }
          } else if (Instance.name == Contact.name) {

            if (options.alertcontacts) {
              params.alertcontacts = options.alertcontacts.join('-');
            }
            if (options.offset) {
              params.offset = options.offset;
            }
            if (options.limit) {
              params.limit = options.limit;
            }
          }

          var endpoint = 'get' + Instance.plural.charAt(0).toUpperCase() + Instance.plural.slice(1);
          return _this3.request('GET', endpoint, params).then(function (response) {

            var results = _.map(response[Instance.plural.toLowerCase()][Instance.singular.toLowerCase()], function (result) {
              return new Instance(result);
            });

            resolve(results);
          })['catch'](reject);
        });
      }
    }, {
      key: 'create',
      value: function create(instance) {
        var _this4 = this;

        return new bluebird(function (resolve, reject) {

          switch (true) {
            case instance instanceof Monitor:
            case instance instanceof Contact:
              if (!instance.validate()) {
                return reject(instance.validate());
              }
              break;

            default:
              //let type = Object.prototype.toString.call(new Monitor);
              return reject(typeof instance + ' is an unsupported instance');
          }

          var instanceName = instance.constructor.singular;
          var endpoint = 'new' + instanceName.charAt(0).toUpperCase() + instanceName.slice(1);

          _this4.request('GET', endpoint, instance.parse()).then(function (response) {
            return response[instance.singular];
          });
        });
      }
    }, {
      key: 'edit',
      value: function edit(instance) {
        var _this5 = this;

        return new bluebird(function (resolve, reject) {

          switch (true) {
            case instance instanceof Monitor:
            case instance instanceof Contact:
              {
                if (!instance.validate()) {
                  return reject(instance.validate());
                }
              }

            default:
              {
                return reject('This is an unsupported instance');
              }

          }

          var instanceName = instance.constructor.singular;
          var endpoint = 'edit' + instanceName.charAt(0).toUpperCase() + instanceName.slice(1);

          return _this5.request('GET', endpoint, instance.parse()).then(function (response) {
            resolve(response[instance.singular]);
          })['catch'](reject);
        });
      }
    }, {
      key: 'remove',
      value: function remove(instance) {
        var instanceName = instance.constructor.singular;
        var endpoint = 'delete' + instanceName.charAt(0).toUpperCase() + instanceName.slice(1);

        return this.request('GET', endpoint, { monitorID: instance.id }).then(function (response) {
          return response[instance.singular];
        });
      }
    }]);

    return client__Client;
  })();

  var client = client__Client;

  exports.Client = client;

  'use strict';

  /**
   * Created by Luke on 30/06/15.
   */
});
//# sourceMappingURL=./uptime-robot-dist.js.map