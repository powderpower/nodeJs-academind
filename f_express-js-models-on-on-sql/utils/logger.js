const path                  = require('path');
const winston               = require('winston');
const winstonFileRotator    = require('winston-daily-rotate-file');

const logFormat = winston.format.combine(
    winston.format.colorize({
        all: true
    }),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
        info => `${ info.timestamp } ${ info.level }: ${ info.message }\n`
    ),
);

module.exports = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new winstonFileRotator({
            filename: path.join(
                'runtime',
                'logs',
                'log-%DATE%.log',
            ),
            datePattern: 'YYYY-MM-DD',
        }),
    ],
});