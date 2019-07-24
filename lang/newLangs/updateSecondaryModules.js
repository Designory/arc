// alright here comes a ton of crap 
module.exports = async arc => {
    return new Promise(async (resolve, reject) => {
        try {

            const primaryTreeData = await getTreeData(arc, null);
            const secondaryTreesData = await getAllTreesData(arc, {idOnly:true});
            const docs = docsToCreate(primaryTreeData, secondaryTreesData);
            
            if (!docs.length) return resolve();

            const docsWithNewModules = await makeNewModulesForDocs(arc, docs);

            let moduleCount = 0;
            const promises = docsWithNewModules.map(item => {
                moduleCount += item.count;

                // avoid duplicate key errors
                delete item.doc.key;
                
                return arc.utils.createTreePage(arc, item.doc, {lang:item.lang});
            });
            
            arc.log('Validating lang pages and modules.');
            arc.log(`Creating ${docsWithNewModules.length} secondary language page(s) with ${moduleCount} module(s).`);

            // arc.config.lang.config.translatableUrl
            // if (!arc.config.lang.config.translatableUrl)

            Promise.all(promises).then(async docsWithNewModules => {
                arc.log(`Done creating secondary languages.`);
                resolve(docsWithNewModules);
            }).catch(function(err) {
                arc.log('error', err);
                resolve(null);
            });

        } catch(err) {
            arc.log('error', err);
        }

    });

};

const getTreeData = async (arc, lang, config = {}) => {

    return new Promise(async (resolve, reject) => {
        
        try {

            const model = arc.utils.getTreeModel(arc, lang);

            model.find().lean().exec((err, docs) => {
            
                if (err) {
                    arc.log('error', err);
                } 
                //console.log(config);

                if (config.idOnly){
                    docs = docs.map(item => {
                        return item._id.toString();
                    });
                }

                if (lang) resolve({lang, docs});
                else resolve(docs);
                
            }); 
        } catch(err) {
            arc.log('error', err);
        }
    });
}

const getAllTreesData = (arc, config) => {

    return new Promise(async (resolve, reject) => {
        
        const promises = arc.config.lang.secondaries.map(item => {
            return getTreeData(arc, item, {idOnly:config.idOnly});
        });

        Promise.all(promises).then(function(docs) {
            resolve(docs);
        }).catch(function(err) {
            arc.log('error', err);
            resolve(null);
        });  

    });
}

const docsToCreate = (primary, secondary) => {
    
    const createArr = [];

    primary.forEach(primaryItem => {

        secondary.forEach(secondaryItem => {
            if (!secondaryItem.docs.includes(primaryItem._id.toString())) {
                createArr.push({doc:Object.assign({}, primaryItem), lang:secondaryItem.lang});
            }
        });

    });

    return createArr;

}

const compareLists = (arc, docs) => {
    
    const configLangs = arc.getAllLangs();
    const createArr = [];

    configLangs.forEach(langItem => {
        let foundLang = false;
        docs.forEach(docItem => {
            if (langItem.path === docItem.path) foundLang = true;
        });
        if (!foundLang) createArr.push(langItem);
    });

    return createArr;
}

const addLangs = (arc, docs) => {
    
    const configLangs = arc.getAllLangs();
    const createArr = [];

    configLangs.forEach(langItem => {
        let foundLang = false;
        docs.forEach(docItem => {
            if (langItem.path === docItem.path) foundLang = true;
        });
        if (!foundLang) createArr.push(langItem);
    });

    return createArr;
}

const makeNewModulesForDocs = (arc, docs) => {
    
    return new Promise((resolve, reject) => {
        
        try {

            const promises = docs.map(item => {
                return arc.langModuleCheckAndUpdate(item);
            });

            Promise.all(promises).then(async docsWithNewModules => {
                resolve(docsWithNewModules);
            }).catch(function(err) {
                arc.log('error', err);
                resolve(null);
            });

        } catch(err) {
            arc.log('error', err);
        }

    });

}


