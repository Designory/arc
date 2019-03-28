const _ = require('lodash');

module.exports = ArcClass => {
    return class ArcLang extends ArcClass {
        constructor() {
            super();
        }
        langInit(configObject){

            if (configObject.lang) return this.resetConfig(configObject.lang);

        }
        resetConfig(configObject) {
            this.config.lang = {
                config: this.setLangConfig(configObject.config),
                primary: this.setLangListItem(configObject.primary),
                secondaries: configObject.secondaries.map(item => {
                    return this.setLangListItem(item);
                })
            };
        }
        setLangConfig(item){
            if (!item.globalLabelsList) {
                this.log('error', 'A "globalLabelsList" corresponding to the models must be named for multi-language support.');
                process.exit(1);
            }
            return {
                secondaryEditOnly:item.secondaryEditOnly,
                globalLabelsListName:item.globalLabelsList
            };
        }
        setLangListItem(item){  
            if (!item.path) {
                this.log('error', 'Item path is required for adding multiple languages. Bailing...');
                process.exit(1);
            }

            return {
                path:item.path,
                primary: item.primary,
                label: item.label || _.startCase(item.path),
                modelPostfix: item.modelPostfix || '__' + _.upperFirst(_.camelCase(item.path))
            } 
        }
        getLangFromPath(path){
            
            if (path === null || path === 'null' || !this.config.lang) return null;

            if (this.config.lang.primary[path]) return Object.assign(this.config.lang.primary[path], {isPrimary:true});

            const secondaryMatch = this.config.lang.secondaries.filter(item => {
                return item.path === path;
            })[0];

            if (secondaryMatch) return secondaryMatch;

            return null;

        }
    };
};