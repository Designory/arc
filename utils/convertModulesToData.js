module.exports = (modules) => {

  const pageDataCode = [];

  [...modules].forEach((module) => {
    let moduleObj = {};
    let itemIds = [];

    let moduleName = module.moduleName;
    itemIds.push(module.data[0]._id);

    moduleObj.moduleName = moduleName;
    moduleObj.itemIds = itemIds;

    pageDataCode.push(moduleObj);

  });

  return pageDataCode;

};