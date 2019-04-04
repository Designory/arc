// thank you Constantin Pojoga! 
// https://codepen.io/pojoga84/pen/xybGeV?editors=0110
module.exports = (req) => {
   let res = [...req];
   let last = [];

   for (let i = 0; i < res.length; i++) {
      const id = req[i].indentLevel;
      const key = req[i].keyOverride || req[i].key
      last[id] = key;
      res[i].url = `${[...last.slice(0, id), key].join('/')}`;
   }
   return res
};