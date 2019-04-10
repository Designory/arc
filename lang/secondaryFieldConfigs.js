const _ = require('lodash');

module.exports = (config, arc) => {

    if (arc.config.lang.config.treeItemPrimaryLocks && config.baseListName === arc.config.treeModel) {

        lockedFieldArr = arc.config.lang.config.treeItemPrimaryLocks.trim().split(' '); 

        lockedFieldArr.forEach(lockItem => {

            config.fieldConfig = config.fieldConfig.map(fieldItem => {
                if (fieldItem[lockItem]) fieldItem[lockItem].noedit = true;
                return fieldItem;
            });

        });

    }
};