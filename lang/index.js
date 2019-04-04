const _ = require('lodash');
const startup = require('./startup');

module.exports = ArcClass => {
    return class ArcLang extends ArcClass {
        constructor() {
            super();
        }

        langInit(configObject){

            if (configObject.lang) return this.resetConfig(configObject.lang);

        }

        resetConfig(configObject) {
            console.log(this.setLangListItem(configObject.primary, true))

            this.config.lang = {
                config: this.setLangConfig(configObject.config),
                primary: this.setLangListItem(configObject.primary, true),
                secondaries: configObject.secondaries.map(item => {
                    return this.setLangListItem(item);
                })
            };

            console.log()
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
                modelPostfix: modelPostfix
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

        multilangStartup(){

        }
    };
};