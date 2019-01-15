/**
 * shorthand function for env detection
 */
const dotenv = require('dotenv');
dotenv.load();

module.exports = () => {
	return (process.env.NODE_ENV === 'production');
};
