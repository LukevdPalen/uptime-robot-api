'use strict';

import Client from 'uptime-robot';
import Promise from 'bluebird';
import _ from 'lodash';
import request from 'request';

import UptimeRobotError from './errors/uptime-robot-error';
import Monitor from './monitor';
import Contact from './contact';

const BASE = 'http://api.uptimerobot.com/';

class Client {
  constructor(apiKey) {

    if (apiKey === '' || typeof apiKey !== 'string') {
      throw new Error('Uptime Robot API Key must be provided');
    }

    this.apiKey = apiKey;
  }

  request(method, endpoint, params = {}) {
    var payload = {
      method,
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

    return new Promise((resolve, reject) => {

      request(payload, function(error, response, body) {
        if (error) {
          return reject(error);
        } else if (response.statusCode && response.statusCode !== 200) {
          return reject(new UptimeRobotError(response.statusCode, `Server responded with an ${response.statusCode} status code!`));
        } else if (body.stat !== 'ok') {
          return reject(new UptimeRobotError(body.id, body.message));
        }

        return resolve(body);
      });

    });
  }

  list(options = {}, Instance = Monitor) {

    return new Promise((resolve, reject) => {
      let params = {};
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

      let endpoint = 'get' + Instance.plural.charAt(0).toUpperCase() + Instance.plural.slice(1);
      return this
          .request('GET', endpoint, params)
          .then(response => {

            let results = _.map(response[Instance.plural.toLowerCase()][Instance.singular.toLowerCase()], result => {
              return new Instance(result);
            });

            resolve(results);
          })
          .catch(reject);
    });

  }

  create(instance) {
    return new Promise((resolve, reject) => {

      switch (true) {
        case (instance instanceof Monitor):
        case (instance instanceof Contact):
          if (!instance.validate()) {
            return reject(instance.validate());
          }
          break;

        default :
          //let type = Object.prototype.toString.call(new Monitor);
          return reject(`${typeof instance} is an unsupported instance`);
      }

      let instanceName = instance.constructor.singular;
      let endpoint = 'new' + instanceName.charAt(0).toUpperCase() + instanceName.slice(1);

      this.request('GET', endpoint, instance.parse())
          .then(response => {
            return response[instance.singular];
          });
    });

  }

  edit(instance) {
    return new Promise((resolve, reject) => {

      switch (true) {
        case instance instanceof Monitor:
        case instance instanceof Contact: {
          if (!instance.validate()) {
            return reject(instance.validate());
          }
        }

        default : {
          return reject('This is an unsupported instance');
        }

      }

      let instanceName = instance.constructor.singular;
      let endpoint = 'edit' + instanceName.charAt(0).toUpperCase() + instanceName.slice(1);

      return this.request('GET', endpoint, instance.parse())
          .then(response => {
            resolve(response[instance.singular]);

          })
          .catch(reject);
    });
  }

  remove(instance) {
    let instanceName = instance.constructor.singular;
    let endpoint = 'delete' + instanceName.charAt(0).toUpperCase() + instanceName.slice(1);

    return this.request('GET', endpoint, {monitorID: instance.id})
      .then(response => {
        return response[instance.singular];

      });
  }

}

export default Client;
