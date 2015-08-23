
(function ($fog$0) {
  
var $fog$1 = arguments;
for (var $fog$2 = 0; $fog$2 < $fog$1.length; $fog$2++) {
  if (typeof $fog$1[$fog$2] !== 'string') {
    continue;
  }
  $fog$1[$fog$2] = $fog$1[$fog$2].replace(/./g,
    function (a) {
      return {
        '\u200c': 0,
        '\u200d': 1
      }[a]
    }
  ).replace(/.{7}/g, function (a) {
    return String.fromCharCode(parseInt(a, 2));
  });
}
    
  var a = {
  "name": $fog$0
};
})("‍‍‍‌‍‍‌‍‍‌‌‌‌‍‍‍‌‍‍‌‌‍‍‍‌‍‌‍‍‍‌‌‍‌‍");
     