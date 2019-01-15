const ArcCore = require('./core')();
const ArcAPI = require('./api')(ArcCore);
const ArcModel = require('./model')(ArcAPI);
const ArcRender = require('./cache')(ArcModel);
const ArcSocket = require('./socket')(ArcRender);
//const Language = require('./socket')(ArcSocket);

const arc = new ArcSocket();

module.exports = arc;
