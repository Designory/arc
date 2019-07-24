// alright here comes a ton of crap 

module.exports = async (arc, pageId, pageDataCode) => {
    return new Promise(async (resolve, reject) => {



        try {       
            
            for (let lang of arc.config.lang.secondaries) {

                await secondaryLangCheck(arc, lang, pageId, pageDataCode)
            
            }

            resolve();

        } catch(err) {
            arc.log('error', err);
        }

    });
};


const secondaryLangCheck = async (arc, lang, pageId, pageDataCode) => {

    return new Promise(async (resolve, reject) => {
        
        try {

            const model = arc.utils.getTreeModel(arc, lang).findById(pageId).exec(async (err, doc) => {

                const newPageData = await arc.langModuleCheckAndUpdate({doc: {pageDataCode:pageDataCode}, lang:lang});

                console.log('datacode ', newPageData.doc.pageDataCode);

                doc.pageDataCode = newPageData.doc.pageDataCode;

                doc.save(function(err){

                    if (err) arc.log('error', err);

                    arc.log(`Finished saving ${lang.path} - ${doc.url}`);

                    return resolve(newPageData);
                
                });

            });
           
        } catch(err) {
            arc.log('error', err);
        }
    });
}