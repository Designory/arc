/**
 * Remove prefix from string
 * @param {string} str - String to remove prefix from
 * @param {string} prefix - Prefix to remove from string, defaults to 'Str'
 */
module.exports = (str, prefix = 'Stg') => {
	const returnString = str.toLowerCase();
	return returnString.replace(prefix.toLowerCase(), '').replace('-', '');
};
