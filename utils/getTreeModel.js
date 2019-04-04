module.exports = (arc, lang) => {

	const list = (lang) ? arc.config.treeModel + lang.modelPostfix : arc.config.treeModel;

	return arc.list(arc.keystonePublish.getList(list)).model;

};