// alright here comes a ton of crap 
module.exports = async arc => {
    return new Promise(async (resolve, reject) => {

        arc.log('Validating global labels');


        if (!arc.config.lang.config.globalLabelsListName) {
            arc.log('error', 'For lang support, `globalLabelsList` must be defined in the arc init object.');
            process.exit(1);
        }

        let globalLabelsList;
        try {
            globalLabelsList = arc.list(arc.keystonePublish.getList(arc.config.lang.config.globalLabelsListName)).model;
        } catch(err){
            arc.log('error', `Arc can't find ${arc.config.lang.config.globalLabelsListName}. Ensure that the model exists.`);
            arc.log('error', err);
            process.exit(1);
        }

        try {       

            // loop the poop
            const pathsArr = arc.getAllLangs().map(item => {
                return item.path;
            });

            const docs = await getAllGlobalLabels(arc, globalLabelsList, pathsArr);
            const langDiff = compareLists(arc, docs);

            if (!langDiff.length) {
                return resolve();
            }

            const primaryLabels = await getPrimaryLabels(arc, globalLabelsList); // git primary data
            
            for (let item of langDiff) {
                await addItem(arc, globalLabelsList, item, primaryLabels);
            }
             
            resolve();

        } catch(err) {
            arc.log('error', err);
        }

    });
};

const getAllGlobalLabels = (arc, model, paths) => {

    return new Promise((resolve, reject) => {
            
        model.find({path: {$in:paths}}).lean().exec((err, docs) => {
            if (err) {
                arc.log('error', err);
                process.exit(1);
            } 

            resolve(docs);

        }); 

    });
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

const getPrimaryLabels = (arc, model) => {
    
    return new Promise((resolve, reject) => {
            
        model.find({path:arc.config.lang.primary.path}).lean().exec((err, doc) => {
            if (err) {
                arc.log('error', err);
                process.exit(1);
            } 
            
            resolve(doc[0] || {});

        }); 

    });
}

const addItem = (arc, list, lang, defaults) => {
                
    return new Promise(async (resolve, reject) => {

        const createLang = Object.assign({}, defaults, {
            name:lang.label,
            path:lang.path,
            primary:lang.primary || false
        });

        // avoid duplicate key errors where necessary 
        delete createLang._id;

        list.create(createLang, function (err, doc) {
            if (err) {
                arc.log('error', err);
                return reject();
            }  

            arc.log(`Adding new global label --> ${doc.path}`);

            resolve();

        });
    });
}


