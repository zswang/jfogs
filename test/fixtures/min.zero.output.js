
(function ($fog$0, $fog$16, $fog$4, $fog$5, $fog$6, $fog$13, $fog$14, $fog$12, $fog$7, $fog$9, $fog$10, $fog$11, $fog$15) {
  
if ("‮" !== $fog$16) {
  return;
}
var $fog$1 = arguments;
for (var $fog$2 = 0; $fog$2 < $fog$4; $fog$2++) {
  if (typeof $fog$1[$fog$2] !== $fog$5) {
    continue;
  }
  $fog$1[$fog$2] = $fog$1[$fog$2][$fog$6]($fog$13,
    function (a) {
      return {
        '\u200c': $fog$9,
        '\u200d': $fog$10
      }[a];
    }
  ).replace($fog$14, function (a) {
    return $fog$12[$fog$7]($fog$15(a, $fog$11));
  });
}
    
  (function(){return $fog$0 in{};})();
})("‍‍‌‍‍‌‌‍‍‌‌‍‌‍‍‍‌‍‍‍‌‍‍‌‌‍‍‍‍‍‍‌‍‌‌‍‍‌‍‌‌‌", "‮", 1, "string", "replace", /./g, /.{7}/g, String, "fromCharCode", 0, 1, 2, parseInt);
     