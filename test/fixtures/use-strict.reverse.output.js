
(function ($fog$0, $fog$1, $fog$14, $fog$5, $fog$4, $fog$10, $fog$7, $fog$8, $fog$9, $fog$13, $fog$11, $fog$12) {
  
if ("‮" !== $fog$14) {
  return;
}
var $fog$2 = arguments;
var $fog$3;
        
for ($fog$3 = $fog$10; $fog$3 < $fog$5; $fog$3++) {
  if (typeof $fog$2[$fog$3] === $fog$7) {
    $fog$2[$fog$3] = $fog$2[$fog$3][$fog$8]($fog$4)[$fog$9]()[$fog$13]($fog$4);
  }
}
        
for ($fog$3 = $fog$10; $fog$3 < $fog$5 / $fog$12; $fog$3++) {
  var $fog$6 = $fog$2[$fog$3];
  $fog$2[$fog$3] = $fog$2[$fog$5 - $fog$3 - $fog$11];
  $fog$2[$fog$5 - $fog$3 - $fog$11] = $fog$6;
}
        
  (function () {
  'use strict';
  1;
  2;
  var str = $fog$1;
  console[$fog$0]($fog$1, str);
})();

})("tcirts esu", "gol", "‮", 2, "", 0, "string", "split", "reverse", "join", 1, 2);
     