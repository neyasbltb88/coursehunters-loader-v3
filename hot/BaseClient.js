'use strict';
const EventEmitter = require('./EventEmitter');

/* eslint-disable
  no-unused-vars
*/
module.exports = class BaseClient extends EventEmitter {
    static getClientPath(options) {
        throw new Error('Client needs implementation');
    }
};
