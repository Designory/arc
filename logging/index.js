const log4js = require('log4js')
const logger = function(topic) {
    const f = `logs/${topic}-${new Date().toISOString().substr(0, 10)}.log`
    log4js.configure({
        appenders: {
            out: { type: 'stdout'},
            [topic]: {
                type: 'file', filename: f, maxLogSize: 128*1024*1024, backups: 10, compress: false
            }
        },
        categories: {
            default: { appenders: ['out', topic], level: 'debug' }
        }
    });
    return log4js.getLogger(topic)

};
module.exports = logger('Arc Log');
