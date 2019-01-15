module.exports = (arc) => {
	return arc.list(arc.keystonePublish.getList(arc.config.treeModel)).model;
};