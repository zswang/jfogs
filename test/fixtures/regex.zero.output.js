
(function ($fog$0, $fog$1, $fog$2, $fog$3) {
  
var $fog$4 = arguments;
for (var $fog$5 = 0; $fog$5 < $fog$4.length; $fog$5++) {
  if (typeof $fog$4[$fog$5] !== 'string') {
    continue;
  }
  $fog$4[$fog$5] = $fog$4[$fog$5].replace(/./g,
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
    
  console[$fog$0]($fog$2[$fog$1]($fog$3));
})("‍‍‌‍‍‌‌‍‍‌‍‍‍‍‍‍‌‌‍‍‍", "‍‍‍‌‍‌‌‍‍‌‌‍‌‍‍‍‍‌‌‍‍‍‍‍‌‍‌‌", /\w/img, "‍‍‌‍‌‌‌‍‍‌‌‍‌‍‍‍‌‍‍‌‌‍‍‌‍‍‌‌‍‍‌‍‍‍‍");
     