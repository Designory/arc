const ArcCore = require('./core')();
const ArcAPI = require('./api')(ArcCore);
const ArcModel = require('./model')(ArcAPI);
const ArcLang = require('./lang')(ArcModel);
const ArcCache = require('./cache')(ArcLang);
const ArcSocket = require('./socket')(ArcCache);
//const Language = require('./socket')(ArcSocket);

const arc = new ArcSocket();

module.exports = arc;
