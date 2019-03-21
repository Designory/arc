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

                        socket.broadcast.emit('LOCKTREE', true);
                        
                        // new items can only be added one call at a time, 
                        // and they are identified by having a key of undefined since they are created
                        // from the arc tree
                        // eventually, we need to have the frontend generate temp keys so that we 
                        // can bulk generate new pages as needed
    

                        let newTreeItem = null;
                        if (payload.undefined) {
                            newTreeItem = await this.utils.createTreePage(this, payload.undefined, {lang:'en-us', stopPostSaveHook:true});
                            delete payload.undefined;
                        }

                        let updatedTree = await this.utils.bulkSetTree(this, payload);

                        console.log('updatedTree ===>> ', {[newTreeItem._id]:newTreeItem});

                        socket.broadcast.emit('TREECHANGE', {tree:(!newTreeItem) ? payload : Object.assign(payload, {[newTreeItem._id]:newTreeItem})});
                        
                        socket.broadcast.emit('LOCKTREE', false);

                    } catch(err) {
                        this.log('error', err);
                    }
                      
                });

                socket.on('createAndAddModule', async payload => {

                    if (!payload.listName) return this.log('error', '`payload.listName` is required.');
                    await this.utils.createAndAddModuleItem(payload.pageId, payload.listName, {name:`${this.utils.awesomeWords()} New Module`}, this);

                }); 



                socket.on('duplicateAndAddModule', async payload => {
                    
                    // TODO: support multiples in an array for bulk duplicate    

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

                    // LANG: treeModelSelect will become a function to pass in lang
                    const treeDeleteItem = await this.utils.getRawTree(this, {_id:payload.pageId, select:this.config.treeModelSelect, lean:false});

                    treeDeleteItem.remove((err) => {

                    });

                });


                socket.on('publishItem', async payload => {
                    // TODO: add function to ensure proper payload
                    const publishObj = {
                        listName:payload.listName || null, 
                        _id:payload._id, 
                        publish:true, 
                        lang:payload.lang || null
                    }

                    await this.utils.publishUnPublishItem(publishObj, this);

                });

                socket.on('unPublishItem', async payload => {
                    // TODO: add function to ensure proper payload
                    const publishObj = {
                        listName:payload.listName || null, 
                        _id:payload._id, 
                        publish:false, 
                        lang:payload.lang || null
                    }

                    await this.utils.publishUnPublishItem(publishObj, this);

                });

                socket.on('updateModules', async payload => {
                    // TODO: add function to ensure proper payload
                    
                    const modules = payload.modules.filter(item => {
                        console.log(item);
                    });

                    await this.utils.setModuleOrder(payload._id, null, payload.modules, this);

                });

            }));
        }
        socketConnection(){
            console.log('socket connected');
        }
    };
};
