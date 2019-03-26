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
                primaryEditOnly:item.primaryEditOnly,
                globalLabelsListName:item.globalLabelsList
            };
        }
        setLangListItem(item){  
            if (!item.path) {
                this.log('error', 'Item path is required for adding multiple languages. Bailing...');
                process.exit(1);
            }

            //process.exit(1);

            return {
                path:item.path,
                primary: item.primary,
                label: item.label || _.startCase(item.path),
                modelPostfix: item.modelPostfix || '__' + _.upperFirst(_.camelCase(item.path))
            } 
        }
    };
};