'use strict';

const Logger = require('logger');
const RoomAnalyzer = require('roomAnalyzer');
const Tasker = require('tasker';)


//TODO: timing of processess
const Overseer = function() {
  if (!Memory.overseer) Memory.overseer = {};
  this.tasker = new Tasker();
  this.loggers = {};
  this.analyzedRooms = {};
}

// Do whatever is needed at the beginning of the tick
Overseer.prototype.initTick = function(options = {}) {
  this.memory = Memory.overseer;
  this.analyzedRooms = {};
  this.tasker.queue = [];
  this.currentProcess = null;
}

Overseer.prototype.runProcess = function(processFile, options) {
  const id = processFile;
  const processObj = require(processFile);
  const process = new processObj(options);

  if (process.shouldRun()) {
    const previousProcess = this.currentProcess;
    this.currentProcess = process;
    this.currentProcess.run();
    this.currentProcess = previousProcess;
  }
}

Overseer.prototype.runSubprocess = function(id, func) {
  // calculate time and cpu here
  func.call(this.currentProcess);
}

Overseer.prototype.getLogger = function(topic, roomName) {
  const logTo = roomName || 'default';
  if (!this.loggers[logTo]) this.loggers[logTo] = {};
  if (!this.loggers[logTo][topic]) this.loggers[logTo][topic] = new Logger(topic, logTo);
  return this.loggers[logTo][topic];
}

Overseer.prototype.getRoomAnalysis = function(roomName) {
  if (!this.analyzedRooms[roomName]) this.analyzedRooms[roomName] = new RoomAnalyzer(roomName);
  return this.analyzedRooms[roomName];
}


module.exports = Overseer;
