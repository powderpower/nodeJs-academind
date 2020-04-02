const path      = require('path');

/**
 * process - глобавльная переменная
 * process.mainModule - точка входа в приложение.
 * 
 * Это нужно по большей части для чтения файловой системы,
 * чтобы избежать различие путей \ в виндовс и / в линукс.
 */
module.exports = path.dirname(process.mainModule.filename);