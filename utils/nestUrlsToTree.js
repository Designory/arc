module.exports = (req, expandedList, selected, editOnly) => {
   
   req = [...req];
   
   let res = [];
   let parent = [];
   let activeItem = '';
   let activeIndex = null;
   
   for (let i = 0; i < req.length; i++) {

      req[i].children = [];
      req[i].title = req[i].name;
      req[i].isExpanded = false;
      req[i].indentLevel = parseInt(req[i].indentLevel);
      if (editOnly) req[i].isDraggable = false;

      const nextLevel = (req[i + 1]) ? parseInt(req[i + 1].indentLevel) : null;

      if (req[i].indentLevel === nextLevel  || req[i].indentLevel > nextLevel) req[i].isLeaf = true;
      else {
         if (expandedList && expandedList.includes(req[i]._id)) req[i].isExpanded = true; 
      }

      // enable pulling through of data for actions
      req[i].data = {
         _id: req[i]._id  
      }

      // enable active current page
      if (req[i]._id === selected) { 
         req[i].isSelected = true;
         activeItem = req[i]._id;
         activeIndex = i;
      }
   }

   // we need to make sure that any selected page defaults to expanded parents
   if (activeIndex) {
      
      let currentIndentLevel = req[activeIndex].indentLevel;

      for (var i = activeIndex; i >= 0; i--) {

         if (currentIndentLevel === 1) break;

         if (currentIndentLevel <= req[i].indentLevel) continue;
         else if (currentIndentLevel > req[i].indentLevel) req[i].isExpanded = true;  

         currentIndentLevel = req[i].indentLevel;
      }

   }
   
   // thank you Constantin Pojoga! 
   // https://codepen.io/pojoga84/pen/xybGeV?editors=0110
   // I have no idea how this really works
   for (let i = 0; i < req.length; i++) {
      const id = parseInt(req[i].indentLevel) - 1;
      if (id === 0) {
         res.push(req[i]);
         parent[id] = res.slice(-1)[0];
      } else {
         parent[id - 1].children.push(req[i]);
         parent[id] = parent[id -1].children.slice(-1)[0];
      }
   }
   return res;

};