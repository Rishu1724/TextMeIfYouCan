// Simple logger utility
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFilePath = path.join(logsDir, 'app.log');

const log = (level, message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
  
  // Log to console
  console.log(logEntry.trim());
  
  // Log to file
  fs.appendFileSync(logFilePath, logEntry);
};

const info = (message) => log('info', message);
const error = (message) => log('error', message);
const warn = (message) => log('warn', message);
const debug = (message) => log('debug', message);

module.exports = {
  info,
  error,
  warn,
  debug
};