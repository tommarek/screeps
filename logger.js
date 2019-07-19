'use strict';

const colors = {
  white: '#ffffff',
  black: '#000000',
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
  silver: '#C0C0C0',
  cyan: '#00FFFF',
  orange: '#FFA500',
  yellow: '#FFFF00',
  black: '#000000',
}

const topics = {
  default: {
    name: 'default',
    color: colors.white,
  },
  creep: {
    name: 'creep',
    color: colors.silver,
  }
}

const logLevels = {
  'warning': colors.orange,
  'info': colors.white,
  'error': colors.red,
  'debug': colors.green,
}

const Logger = function(topic, roomName) {
  this.topic = topic;
  this.roomName = roomName;
  this.prefix = this.createPrefix();

  if (topics[topic]) {
    this.name = topics[topic].name;
    this.color = topics[topic].color;
  } else {
    this.name = topic;
    this.color = '#ffffff';
  }

  if (!Memory.logger) Memory.logger = {};
  if (!Memory.logger.settings) Memory.logger.settings = {};
  if (Memory.logger.settings[topic] && Memory.logger.settings[topic].disabled) {
    this.active = false;
  } else {
    this.active = true;
  }
}

Logger.prototype.loggerEnabled = function(enabled) {
  if (!Memory.loggersettings[this.topic]) Memory.loggersettings[this.topic] = {};
  Memory.loggersettings[this.topic].disabled = !enabled;
}

Logger.prototype.enable = function() {
  this.loggerEnabled(true)
};

Logger.prototype.disble = function() {
  this.loggerEnabled(false);
}

Logger.prototype.createPrefix = function() {
  let prefix = '[<font color="' + this.color + '">' + this.name + '</font>]';
  if (this.roomName) {
    let room = Game.rooms[this.roomName];
    let roomColor = colors.silver;
    if (room) {
      if (!room.controller) roomColor = colors.white; // unassigned controller
      if (room.controller.my) roomColor = colors.green; // my controller
      if (room.controller.owner) roomColor = colors.green; // someone elses controller
    }
    prefix += '[<font color="#' + roomColor + '">' + this.roomName + '</font>]';
  }
  return prefix;
}

Logger.prototype.debug = function(...args) {
  const prefix = '<font color="' + colors.green + '">' + this.prefix;
  console.log(prefix, ...args, '</font>');
}

Logger.prototype.info = function(...args) {
  const prefix = '<font color="' + colors.white + '">' + this.prefix;
  console.log(prefix, ...args, '</font>');
}

Logger.prototype.warning = function(...args) {
  const prefix = '<font color="' + colors.orange + '">' + this.prefix;
  console.log(prefix, ...args, '</font>');
}

Logger.prototype.error = function(...args) {
  const prefix = '<font color="' + colors.red + '">' + this.prefix;
  console.log(prefix, ...args, '</font>');
}

module.exports = Logger;
