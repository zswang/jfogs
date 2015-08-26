
(function ($fog$0, $fog$1, $fog$2, $fog$3, $fog$16, $fog$7, $fog$6, $fog$12, $fog$9, $fog$10, $fog$11, $fog$15, $fog$13, $fog$14) {
  
if ("‮" !== $fog$16) {
  return;
}
var $fog$4 = arguments;
var $fog$5;
        
for ($fog$5 = $fog$12; $fog$5 < $fog$7; $fog$5++) {
  if (typeof $fog$4[$fog$5] === $fog$9) {
    $fog$4[$fog$5] = $fog$4[$fog$5][$fog$10]($fog$6)[$fog$11]()[$fog$15]($fog$6);
  }
}
        
for ($fog$5 = $fog$12; $fog$5 < $fog$7 / $fog$14; $fog$5++) {
  var $fog$8 = $fog$4[$fog$5];
  $fog$4[$fog$5] = $fog$4[$fog$7 - $fog$5 - $fog$13];
  $fog$4[$fog$7 - $fog$5 - $fog$13] = $fog$8;
}
        
  console[$fog$3]($fog$1[$fog$2]($fog$0));
})("gol", "tset", /\w/img, "olleh", "‮", 4, "", 0, "string", "split", "reverse", "join", 1, 2);
     