const _ = require('lodash');
const globalLabels = require('./startups/globalLabels');
const updateSecondaries = require('./startups/updateSecondaries');
const primaryFieldConfigs = require('./primaryFieldConfigs');
const secondaryFieldConfigs = require('./secondaryFieldConfigs');

module.exports = ArcClass => {

    return class ArcLang extends ArcClass {
        constructor() {
            super();
        }

        langInit(configObject){

            if (configObject.lang) return this.resetConfig(configObject.lang);

        }

        resetConfig(configObject) {
            //console.log(this.setLangListItem(configObject.primary, true))

            this.config.lang = {
                config: this.setLangConfig(configObject.config),
                primary: this.setLangListItem(configObject.primary, true),
                secondaries: configObject.secondaries.map(item => {
                    return this.setLangListItem(item);
                })
            };
        }

        getAllLangs(){
            if (!this.config.lang) return [];
            return [...[this.config.lang.primary], ...this.config.lang.secondaries];
        }

        setLangConfig(item){
            if (!item.globalLabelsList) {
                this.log('error', 'A "globalLabelsList" corresponding to the models must be named for multi-language support.');
                process.exit(1);
            }
            return {
                globalLabelsListName:item.globalLabelsList,
                treeItemPrimaryLocks: item.treeItemPrimaryLocks || 'name url keyOverride indentLevel'
            };
        }

        setLangListItem(item, primary){  
            if (!item.path) {
                this.log('error', 'Item path is required for adding multiple languages. Bailing...');
                process.exit(1);
            }
            // if multi-language is used, and the primary language is called,
            // then we do not use a prefix on the model on account of it being 
            // primary. This allows the easy conversion of a site from single to
            // multi language
            let modelPostfix = null;
            if (primary) {
                modelPostfix = (item.modelPostfix) ? '__' + item.modelPostfix : '';
                item.primary = true;
            } else {
                modelPostfix = (item.modelPostfix) ? '__' + item.modelPostfix : '__' + _.upperFirst(_.camelCase(item.path));
            }

            return {
                path:item.path,
                primary: item.primary,
                label: item.label || _.startCase(item.path),
                modelPostfix: modelPostfix,
                fullModel:this.config.treeModel + modelPostfix
            } 
        }

        getLangFromPath(path){
            
            if (path === null || path === 'null' || !this.config.lang) return null;

            if (this.config.lang.primary.path === path) return this.config.lang.primary;

            const secondaryMatch = this.config.lang.secondaries.filter(item => {
                return item.path === path;
            })[0];

            if (secondaryMatch) return secondaryMatch;

            return null;

        }

        setLangShorthand(){
            this.lang = this.config.lang;
        }

        removeSecondaryLangTreeItems(_id) {
            // TDOD: lang make the magic all happen!
        }

        langPrimaryFieldConfig(config){
            return primaryFieldConfigs(config, this);
        }

        langSecondaryFieldConfig(config){
            return secondaryFieldConfigs(config, this);
        }

        langModuleFieldConfig(config){
            if (config.type.indexOf('module') != -1) {

                config.fieldConfig.push({
                    heading:'Module Language Settings'
                });

                config.fieldConfig.push({
                    langParentId: { 
                        type:this.Field.Types.Text,    
                        noedit:true 
                    },
                    langPath: { 
                        type:this.Field.Types.Text,    
                        noedit:true 
                    },
                    lastSavedPageId: {
                        type:this.Field.Types.Text,
                        noedit:true
                    }
                });

                //console.log('config.fieldConfig --->', config.fieldConfig)
            } 

            return config;
        }

        async langStartup(){
            return new Promise(async (resolve, reject) => {
                try {
                    //await globalLabels(this);
                    await updateSecondaries(this);
                    resolve();
                } catch(err){
                    this.log('error', err);
                }
            });
        }

        async langModuleCheckAndUpdate(pageAndLang){
            return new Promise(async (resolve, reject) => {
            
                const pageDataCode = JSON.parse(pageAndLang.doc.pageDataCode);

                const promises = pageDataCode.map(item => {
                    return this.itemCheckOrUpdate(item, pageAndLang.doc, pageAndLang.lang);
                });

                Promise.all(promises).then(async newPageDataCode => {
                    pageAndLang.doc.pageDataCode = JSON.stringify(newPageDataCode);
                    
                    console.log(pageAndLang.doc.pageDataCode);
                    resolve({doc:pageAndLang.doc, lang:pageAndLang.lang, count:newPageDataCode.length});
                }).catch(function(err) {
                    this.log('error', err);
                    resolve(null);
                });
            });
        }

        async itemCheckOrUpdate(item, doc, lang) {
            return new Promise(async (resolve, reject) => {

                const model = this.list(this.keystonePublish.getList(item.moduleName)).model;

                model.findOne({langParentId:item.itemIds[0], langPath:lang.path}).lean().exec((err, moduleDoc) => {

                    if (err) this.log('error', err);
                    
                    if (moduleDoc) {
                        resolve({itemIds:[item.itemIds[0]], moduleName:item.moduleName});
                    } else {
                        
                        model.findById(item.itemIds[0]).lean().exec((err, masterModuleDoc) => { 

                            if (err) this.log('error', err);

                            if (!masterModuleDoc) return resolve(null);

                            // todo...add suffix to relational fields aaaahhh!
                            const updateItem = Object.assign({}, masterModuleDoc);
                            updateItem.langParentId = item.itemIds[0];
                            updateItem.langPath = lang.path;
                            updateItem.name = `${updateItem.name} in ${lang.label}`;

                            delete updateItem._id;
                            delete updateItem.key;

                            model.create(updateItem, (err, createdDoc) => {

                                if (err) this.log('error', err);

                                resolve({itemIds:[createdDoc._id], moduleName:item.moduleName})

                            });

                        });

                    }
                    
                }); 

            });
        }

    };
};