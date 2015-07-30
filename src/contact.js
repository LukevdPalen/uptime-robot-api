'use strict';

import _ from 'lodash';

const PREFIX = 'alertContact';

class Contact {
  constructor(options) {
    this.id = options.id;
    this.friendlyName = options.friendlyname;
    this.type = options.type || '2';
    this.value = options.value;

    this.config = {threshold: 0, recurrence: 0};

  }

  static get singular() {
    return PREFIX;
  }

  static get plural() {
    return `${PREFIX}s`;
  }

  toString() {
    return [this.id, this.config.threshold, this.config.recurrence].join('_');
  }

  validate() {
    if (!_.has(this, 'type')) {
      return Error('`type` not defined');
    } else if (!_.has(this, 'value')) {
      return Error('`type` not defined');
    }

    return true;
  }

  parse() {
    var keys = _.keys(this);

    return _.chain(keys)
        .map(key => {
          if (key === 'config') {
            return null;
          }

          return [PREFIX + key.charAt(0).toUpperCase() + key.slice(1), this[key]];
        })
        .filter()
        .object()
        .value();
  }
}

export default Contact;
