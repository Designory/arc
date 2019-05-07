// alright here comes a ton of crap 

const getTemplateData = async (arc, list) => {

    return new Promise(async (resolve, reject) => {
        
        try {

            const model = arc.arcList(list.listName).model;

            model.find().lean().exec(async (err, docs) => {
            
                if (err) {
                    arc.log('error', err);
                } 

                const results = [];

                for (let doc of docs) {
                    results.concat(...await updateFromPrimaryTemplate(arc, list.listName, doc));
                }

                console.log(results.length)

                resolve(results);
                
            }); 
        } catch(err) {
            arc.log('error', err);
        }
    });
};

const updateFromPrimaryTemplate = async (arc, listName, doc) => {

    return new Promise(async (resolve, reject) => {
        
        const updated = [];

        try {

            const primaryModel = arc.arcList(listName).model;

            const results = [];

            for (let lang of arc.config.lang.secondaries) {
                await checkUpdateEachLang(arc, `${listName}${lang.modelPostfix}`, doc);
            }

            resolve(results);

        } catch(err) {
            arc.log('error', err);
        }
    });
}

const checkUpdateEachLang = async (arc, listName, primaryDoc) => {

    return new Promise(async (resolve, reject) => {
        
        try {

            const langModel = arc.arcList(listName).model;

            langModel.findById(primaryDoc._id).exec((err, doc) => {
            
                if (err) {
                    arc.log('error', err);
                } 

                if (!doc) {        

                    langModel.create(primaryDoc, function (err, newDoc) {
                        if (err) return arc.log('error', err);
                        arc.log(`Added new ${listName}`);
                        return resolve({
                            listName: listName,
                            _id: newDoc._id.toString()
                        });
                      });

                } else {
                    
                    resolve([]);

                }

            });

        } catch(err) {
            arc.log('error', err);
        }
    });
    
}

module.exports = async arc => {
    return new Promise(async (resolve, reject) => {
        try {

            const templates = arc.getModels().filter(item => item.type === 'template' && item.primary && item.listName !== arc.config.treeModel);
            const updateList = {};

            for (let item of templates) {
                updateList[item.listName] = await getTemplateData(arc, item);
            }

        } catch(err) {
            arc.log('error', err);
        }

    });

};