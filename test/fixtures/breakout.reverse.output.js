
var $fog$16 = {};
(function ($fog$0, $fog$1, $fog$2, $fog$15, $fog$6, $fog$5, $fog$11, $fog$12, $fog$13) {
  
if ("‮" !== $fog$15) {
  return;
}
var $fog$3 = arguments;
var $fog$4;
        
for ($fog$4 = $fog$11; $fog$4 < $fog$6 / $fog$13; $fog$4++) {
  var $fog$7 = $fog$3[$fog$4];
  $fog$3[$fog$4] = $fog$3[$fog$6 - $fog$4 - $fog$12];
  $fog$3[$fog$6 - $fog$4 - $fog$12] = $fog$7;
}
        
  var tt, gloab_variant = $fog$2;

function calc(x) {
 return x * gloab_variant + x * (gloab_variant + $fog$1);
}

tt = $fog$0;
  $fog$16.tt = tt;
$fog$16.gloab_variant = gloab_variant;
$fog$16.calc = calc;
})(2, 1, 6, "‮", 3, "", 0, 1, 2);
var tt = $fog$16.tt;
var gloab_variant = $fog$16.gloab_variant;
var calc = $fog$16.calc;
     