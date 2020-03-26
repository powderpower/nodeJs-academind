const path      = require('path');

/**
 * process - глобавльная переменная
 * process.mainModule - точка входа в приложение.
 */
module.exports = path.dirname(process.mainModule.filename);