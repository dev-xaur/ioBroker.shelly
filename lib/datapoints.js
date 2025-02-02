/* jshint -W097 */
/* jshint -W030 */
/* jshint strict:true */
/* jslint node: true */
/* jslint esversion: 6 */
'use strict';

const defaults = require(__dirname + '/devices/default').defaults;
const shelly1 = require(__dirname + '/devices/shelly1').shelly1;
const shelly1pm = require(__dirname + '/devices/shelly1pm').shelly1pm;
const shellyswitch = require(__dirname + '/devices/shellyswitch').shellyswitch;
const shellyswitch25 = require(__dirname + '/devices/shellyswitch25').shellyswitch25;
const shellyht = require(__dirname + '/devices/shellyht').shellyht;
const shellysmoke = require(__dirname + '/devices/shellysmoke').shellysmoke;
const shellybulb = require(__dirname + '/devices/shellybulb').shellybulb;
const shellyrgbww = require(__dirname + '/devices/shellyrgbww').shellyrgbww;
const shellyrgbw2 = require(__dirname + '/devices/shellyrgbw2').shellyrgbw2;
const shelly2led = require(__dirname + '/devices/shelly2led').shelly2led;
const shellyplug = require(__dirname + '/devices/shellyplug').shellyplug;
const shellyplugs = require(__dirname + '/devices/shellyplugs').shellyplugs;
const shelly4pro = require(__dirname + '/devices/shelly4pro').shelly4pro;
const shellysense = require(__dirname + '/devices/shellysense').shellysense;
const shellyem = require(__dirname + '/devices/shellyem').shellyem;
const shellyflood = require(__dirname + '/devices/shellyflood').shellyflood;
const shellydimmer = require(__dirname + '/devices/shellydimmer').shellydimmer;

let devices = {
  shellyswitch: shellyswitch,
  shellyswitch25: shellyswitch25,
  shelly1: shelly1,
  shelly1pm: shelly1pm,
  shellyht: shellyht,
  shellysmoke: shellysmoke,
  shellybulb: shellybulb,
  shellyrgbww: shellyrgbww,
  shellyrgbw2: shellyrgbw2,
  shelly2led: shelly2led,
  shellyplug: shellyplug,
  shelly4pro: shelly4pro,
  shellysense: shellysense,
  'shellyplug-s': shellyplugs,
  shellyem: shellyem,
  shellyflood: shellyflood,
  shellydimmer: shellydimmer,
};

let devicenames = {
  shellyswitch: 'SHSW-21',
  shellyswitch25: 'SHSW-25',
  shelly1: 'SHSW-1',
  shelly1pm: 'SHSW-PM',
  shellyht: 'SHHT-1',
  shellysmoke: 'SHSM-01',
  shellybulb: 'SHBLB-1',
  shellyrgbww: 'SHRGBWW-01',
  shellyrgbw2: 'SHRGBW2',
  shelly2led: 'SH2LED',
  shellyplug: 'SHPLG-1',
  shelly4pro: 'SHSW-44',
  shellysense: 'SHSEN-1',
  'shellyplug-s': 'SHPLG-S',
  shellyem: 'SHEM',
  shellyflood: 'SHWT-1',
  shellydimmer: 'SHDM-1'
};

function clone(obj) {
  if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
    return obj;
  let temp;
  if (obj instanceof Date)
    temp = new obj.constructor(); //or new Date(obj);
  else
    temp = obj.constructor();
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null;
      temp[key] = clone(obj[key]);
      delete obj['isActiveClone'];
    }
  }
  return temp;
}

function deleteNoDisplay(device, protocol) {
  if (protocol === 'coap' || protocol === 'mqtt') {
    for (let key in device) {
      let dev = device[key];
      if (protocol === 'coap' && dev.coap && dev.coap.no_display) {
        delete device[key];
        continue;
      }
      if (protocol === 'mqtt' && dev.mqtt && dev.mqtt.no_display) {
        delete device[key];
        continue;
      }
    }
  }
  return device;
}

function getAll(protocol) {
  let cdevices = clone(devices);
  if (protocol === 'coap' || protocol === 'mqtt') {
    for (let key in cdevices) {
      cdevices[key] = deleteNoDisplay(cdevices[key], protocol);
    }
  }
  return cdevices;
}

function getDeviceByType(type, protocol) {
  let device = clone(Object.assign(devices[type], defaults));
  device = deleteNoDisplay(device, protocol);
  return device;
}

function getDeviceNameForMQTT(name) {
  return devicenames[name];
}

function getDeviceNameForCoAP(name) {
  let value = Object.keys(devicenames).find((key) => devicenames[key] === name);
  return value;
}

module.exports = {
  getAll: getAll,
  getDeviceByType: getDeviceByType,
  getDeviceNameForMQTT: getDeviceNameForMQTT,
  getDeviceNameForCoAP: getDeviceNameForCoAP
};
