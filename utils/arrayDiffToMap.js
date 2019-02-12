// thank you Constantin Pojoga! 
// https://codepen.io/pojoga84/pen/xybGeV?editors=0110
module.exports = (req) => {
   let res = [];
   let parent = [];
   
   for (let i = 0; i < req.length; i++) {
      const id = req[i].indentLevel - 1;
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