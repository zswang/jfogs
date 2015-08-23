
(function ($fog$0, $fog$1) {
  
var $fog$2 = arguments;
var $fog$4 = $fog$2.length;
var $fog$3;
        
for ($fog$3 = 0; $fog$3 < $fog$4 / 2; $fog$3++) {
  var $fog$5 = $fog$2[$fog$3];
  $fog$2[$fog$3] = $fog$2[$fog$4 - $fog$3 - 1];
  $fog$2[$fog$4 - $fog$3 - 1] = $fog$5;
}
        
  function hello(x) {
 return x * $fog$1 + x * $fog$0;
}
})(2, 3);
     