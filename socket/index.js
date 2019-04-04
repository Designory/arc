const socketIo = require('socket.io');

module.exports = ArcClass => {
    return class ArcSocket extends ArcClass {
        constructor() {
            super();
        }
        socketInit(server){
            this.io = socketIo(server);
            this.io.on('connection', (socket => {

                this.socketConnection();

                socket.on('updateTree', async payload => {
                    
                    // TODO: ensure `payload` is fit for function
                    
                    try {

                        const langObj = this.getLangFromPath(payload.lang);

                        // so far, we are not using LOCKTREE, but we have it here
                        // for when the time is right to add it
                        socket.broadcast.emit('LOCKTREE', true);
                        
                        // new items can only be added one call at a time, 
                        // and they are identified by having a key of undefined since they are created
                        // from the arc tree
                        // eventually, we need to have the frontend generate temp keys so that we 
                        // can bulk generate new pages as needed
                        let newTreeItem = null;
                        if (payload.data.undefined) {
                            newTreeItem = await this.utils.createTreePage(this, payload.data.undefined, {lang:langObj, stopPostSaveHook:true});
                            delete payload.undefined;
                        }

                        if (langObj) paload.lang = langObj;

                        let updatedTree = await this.utils.bulkSetTree(this, payload.data, langObj);

                        socket.broadcast.emit('TREECHANGE', {lang: langObj, tree:(!newTreeItem) ? payload.tree : Object.assign(payload.tree, {[newTreeItem._id]:newTreeItem})});
                        
                        socket.broadcast.emit('LOCKTREE', false);

                        if (newTreeItem) socket.emit('TREECHANGE', {lang: langObj, tree:{[newTreeItem._id]:newTreeItem}});

                    } catch(err) {
                        this.log('error', err);
                    }
                      
                });

                socket.on('createAndAddModule', async payload => {

                    const langObj = this.getLangFromPath(payload.lang);

                    if (!payload.listName) return this.log('error', '`payload.listName` is required.');
                    await this.utils.createAndAddModuleItem(payload.pageId, payload.listName, {name:`${this.utils.awesomeWords()} New Module`}, langObj, this);

                }); 



                socket.on('duplicateAndAddModule', async payload => {
                    
                    // TODO: support multiples in an array for bulk duplicate    
                    const langObj = this.getLangFromPath(payload.lang);

                    try {

                        if (!payload.listName) return this.log('error', '`payload.listName` is required.');

                        // TODO: consolidate to utils function
                        const moduleData = await this.utils.getPageModules(this, [{
                            "moduleName":payload.listName,
                            "itemIds":[payload.moduleData._id]
                        }], 
                        {
                            consolidateModules:false,
                            select:"-key",
                            lean:true
                        });

                        if (moduleData[0].name.indexOf(' Duplicate') != -1) {

                            const nameArr = moduleData[0].name.split(' Duplicate');
                            const duplicateIterator = nameArr.pop();
                            const newDuplicateIterator = (duplicateIterator) ? parseInt(duplicateIterator) + 1 : 1;

                            moduleData[0].name = nameArr.join('') + ' Duplicate ' + newDuplicateIterator;

                        } else {

                            moduleData[0].name = moduleData[0].name + ' Duplicate';

                        }

                        await this.utils.createAndAddModuleItem(payload.pageId, payload.listName, moduleData[0], this);
  
                    } catch(err) {
                        this.log('error', err);
                    }

                    
                });

                socket.on('removePage', async payload => {
                    // TODO: add function to ensure proper payload

                    const langObj = this.getLangFromPath(payload.lang);

                    // LANG: treeModelSelect will become a function to pass in lang
                    const treeDeleteItem = await this.utils.getRawTree(this, {_id:payload.pageId, select:this.config.treeModelSelect, lean:false, lang:langObj});

                    treeDeleteItem.remove((err) => {
                        if (err) this.log('error', err);
                    });

                });


                socket.on('publishItem', async payload => {
                    // TODO: add function to ensure proper payload
                    const langObj = this.getLangFromPath(payload.lang);

                    const publishObj = {
                        listName:payload.listName || null, 
                        _id:payload._id, 
                        publish:true, 
                        lang:langObja || null
                    }

                    await this.utils.publishUnPublishItem(publishObj, this);

                });

                socket.on('unPublishItem', async payload => {
                    // TODO: add function to ensure proper payload
                    const langObj = this.getLangFromPath(payload.lang);
                    
                    const publishObj = {
                        listName:payload.listName || null, 
                        _id:payload._id, 
                        publish:false, 
                        lang:langObj || null
                    }

                    await this.utils.publishUnPublishItem(publishObj, this);

                });

                socket.on('updateModules', async payload => {
                    // TODO: add function to ensure proper payload
                    
                    // not sure what this was supposed to be doing....commenting out for now
                    // const modules = payload.modules.filter(item => {
                    //     console.log(item);
                    // });

                    await this.utils.setModuleOrder(payload._id, null, payload.modules, this);

                });

            }));
        }
        socketConnection(){
            console.log('socket connected');
        }
    };
};
