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
                    const updatedTree = await this.utils.bulkSetTree(this, payload);
                    const rawTreeResults = await this.utils.getRawTree(this, {select:this.config.treeModelSelect, sort:'sortOrder'});
                    const treeResultsWithUrls = this.utils.mapUrlsToTree(rawTreeResults); 
                    socket.broadcast.emit('updateTree', rawTreeResults);
                });

                socket.on('updateModules', async payload => {
                    // TODO: ensure `payload` is fit for function
                    const pageModel = this.utils.getTreeModel(this);

                    pageModel.findById(payload._id, function (err, pageItem) {
                        if (err) throw err;
                        pageItem.pageDataCode = JSON.stringify(payload.modules);
                        pageItem.save(async function(err) {
                            if (err) throw err;
                            
                            console.log('going to loaded modules');

                            // TODO; add to utils
                            const loadedModules = await arc.utils.getPageModules(arc, this.pageDataCode, {
                                select:'name matchesLive visible state archive key __v', 
                                onRender:null, 
                                consolidateModules:false
                            });

                            socket.broadcast.emit('moduleUpdate', {_id:payload._id, modules:loadedModules});
                        })
                    });


                    // pageModel.findOneAndUpdate({_id:payload._id}, {pageDataCode:JSON.stringify(payload.modules)}, (updateErr, item) => {
                    //     if (updateErr) this.log('error', updateErr);
                    //     item.save((saveErr) => {
                    //         if (updateErr) this.log('error', saveErr);
                            
                    //     })
                    // });
                });

                socket.on('newModule', async payload => {
                    // TODO: ensure `payload` is fit for function
                    const self = this;

                    const pageModel = this.utils.getTreeModel(this);
                    const moduleModel = this.list(this.keystonePublish.getList(payload.type)).model({name:payload.name});

                    moduleModel.save(function (err, module){
                        if(err) throw(err);
                    
                        pageModel.findById(payload._id, function (err, pageItem) {
                            
                            if (err) throw err;

                            const pageDataCode = JSON.parse(pageItem.pageDataCode || '[]')

                            pageDataCode.push({
                                "moduleName":payload.type,
                                "itemIds":[module._id]
                            })

                            pageItem.pageDataCode = JSON.stringify(pageDataCode);
                            
                            pageItem.save(async function (err, page) {
                                if (err) throw err;
                            });   
                        });     
                    });
                });

                // TODO: consolidate add and remove functions
                // payload = {
                //     moduleId: string,
                //     pageId: string
                // }
                //  
                socket.on('removeModuleFromPage', async payload => {
                    // TODO: ensure `payload` is fit for function
                    try {

                        const page = await this.utils.getRawTree(this, {_id:payload.pageId, lean:false});

                        if (!page || !page.pageDataCode) {
                            return this.log('error', 'No database results querying for page modules.');
                        }   

                        page.pageDataCode = this.utils.removeModuleFromList(page.pageDataCode, payload.moduleId);

                        page.save((saveErr) => {
                            if (saveErr) return this.log('error', saveErr);
                        })
                    
                    } catch(error) {
                        return this.log('error', error);
                    }   

                });

                socket.on('pagePublish', async payload => {
                    // TODO: ensure `payload` is fit for function
                    // payload = {
                    //      _id: mongoId
                    // }
                    try {

                        const page = await this.utils.getRawTree(this, {_id:payload.pageId, lean:false});

                        page.publishToProduction = true;
                        
                        page.save((saveErr) => {
                            if (saveErr) return this.log('error', saveErr);
                        })
                    
                    } catch(error) {
                        return this.log('error', error);
                    }   

                });


            }));
        }
        socketConnection(){
            console.log('socket connected');
        }
    };
};
