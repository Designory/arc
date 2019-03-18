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

                        console.log(1);

                        //return false;

                        // Note: right now we are emaking a concerted effort to err on 
                        // the side of making the most immediate updates to  
                        //socket.broadcast.emit('TREECHANGE', {tree:payload});
                        socket.broadcast.emit('LOCKTREE', true);

                        
                        
                        
                        console.log(2);

                        // if ()

                        // // pull new items from list
                        // let newTreeItems = [];

                        // updatedTree = updatedTree.filter(item => {
                        //     // if undefined, we need to add to the create list 
                        //     if (item._id === undefined) {
                        //         delete item._id;
                        //         newTreeItems.push(item);
                        //         return false;
                        //     } else {
                        //         return true;
                        //     }
                        // });

                        // console.log(3);

                        // // if updated tree array has length after update that means 
                        // // that there are new items to add to the tree
                        // if (newTreeItems.length) {
                        //     // add new items prior to bulk updates
                        //     for (let item of newTreeItems) {
                        //         await this.utils.createTreePage(this, item, 'en-us');
                        //     }
                        // }
                        
                        let newTreeItem = null;
                        if (payload.undefined) {
                            const newTreeItem = await this.utils.createTreePage(this, payload.undefined, {lang:'en-us', stopPostSaveHook:true});
                            delete payload.undefined;
                        }

                        let updatedTree = await this.utils.bulkSetTree(this, payload);

                        socket.broadcast.emit('TREECHANGE', {tree:(!newTreeItem) ? payload : Object.assign(payload, {[newTreeItem._id]:newTreeItem})});

                        console.log(4);
                        return;
                        // const rawTreeResults = await this.utils.getRawTree(this, {select:this.config.treeModelSelect, sort:'sortOrder'});
                        // const treeResultsWithUrls = this.utils.mapUrlsToTree(rawTreeResults); 

                        // console.log(treeResultsWithUrls);

                        
                        socket.broadcast.emit('LOCKTREE', false);

                        console.log(5);

                    } catch(err) {
                        this.log('error', err);
                    }
                      
                });

                socket.on('createAndAddModule', async payload => {
                    
                    //return console.log(payload);

                    if (!payload.listName) return this.log('error', '`payload.listName` is required.');
                    await this.utils.createAndAddModuleItem(payload.pageId, payload.listName, {name:`${this.utils.awesomeWords()} New Module`}, this);

                }); 



                socket.on('duplicateAndAddModule', async payload => {
                    
                    // TODO: support multiples in an array for bulk duplicate    

                    //{pageId:this.pageId, listName:listName, moduleData:data}
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
                // socket.on('updateModules', async payload => {
                //     // TODO: ensure `payload` is fit for function
                //     const pageModel = this.utils.getTreeModel(this);

                //     pageModel.findById(payload._id, function (err, pageItem) {
                //         if (err) throw err;
                //         pageItem.pageDataCode = JSON.stringify(payload.modules);
                //         pageItem.save(async function(err) {
                //             if (err) throw err;
                            
                //             console.log('going to loaded modules');

                //             // TODO; add to utils
                //             const loadedModules = await arc.utils.getPageModules(arc, this.pageDataCode, {
                //                 select:'name matchesLive visible state archive key __v', 
                //                 onRender:null, 
                //                 consolidateModules:false
                //             });

                //             socket.broadcast.emit('moduleUpdate', {_id:payload._id, modules:loadedModules});
                //         })
                //     });


                //     // pageModel.findOneAndUpdate({_id:payload._id}, {pageDataCode:JSON.stringify(payload.modules)}, (updateErr, item) => {
                //     //     if (updateErr) this.log('error', updateErr);
                //     //     item.save((saveErr) => {
                //     //         if (updateErr) this.log('error', saveErr);
                            
                //     //     })
                //     // });
                // });

                
                
                
                // socket.on('newModule', async payload => {
                //     // TODO: ensure `payload` is fit for function
                //     const self = this;

                //     const pageModel = this.utils.getTreeModel(this);
                //     const moduleModel = this.list(this.keystonePublish.getList(payload.type)).model({name:payload.name});

                //     moduleModel.save(function (err, module){
                //         if(err) throw(err);
                    
                //         pageModel.findById(payload._id, function (err, pageItem) {
                            
                //             if (err) throw err;

                //             const pageDataCode = JSON.parse(pageItem.pageDataCode || '[]')

                //             pageDataCode.push({
                //                 "moduleName":payload.type,
                //                 "itemIds":[module._id]
                //             })

                //             pageItem.pageDataCode = JSON.stringify(pageDataCode);
                            
                //             pageItem.save(async function (err, page) {
                //                 if (err) throw err;
                //             });   
                //         });     
                //     });
                // });

                // // TODO: consolidate add and remove functions
                // // payload = {
                // //     moduleId: string,
                // //     pageId: string
                // // }
                // //  
                // socket.on('removeModuleFromPage', async payload => {
                //     // TODO: ensure `payload` is fit for function
                //     try {

                //         const page = await this.utils.getRawTree(this, {_id:payload.pageId, lean:false});

                //         if (!page || !page.pageDataCode) {
                //             return this.log('error', 'No database results querying for page modules.');
                //         }   

                //         page.pageDataCode = this.utils.removeModuleFromList(page.pageDataCode, payload.moduleId);

                //         page.save((saveErr) => {
                //             if (saveErr) return this.log('error', saveErr);
                //         })
                    
                //     } catch(error) {
                //         return this.log('error', error);
                //     }   

                // });

                // socket.on('pagePublish', async payload => {
                //     // TODO: ensure `payload` is fit for function
                //     // payload = {
                //     //      _id: mongoId
                //     // }
                //     try {

                //         const page = await this.utils.getRawTree(this, {_id:payload.pageId, lean:false});

                //         page.publishToProduction = true;
                        
                //         page.save((saveErr) => {
                //             if (saveErr) return this.log('error', saveErr);
                //         })
                    
                //     } catch(error) {
                //         return this.log('error', error);
                //     }   

                // });


            }));
        }
        socketConnection(){
            console.log('socket connected');
        }
    };
};
