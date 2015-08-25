
(function ($fog$0, $fog$13, $fog$4, $fog$3, $fog$9, $fog$6, $fog$7, $fog$8, $fog$12, $fog$10, $fog$11) {
  
if ('\u202e' !== $fog$13) {
  return;
}
var $fog$1 = arguments;
var $fog$2;
        
for ($fog$2 = $fog$9; $fog$2 < $fog$4; $fog$2++) {
  if (typeof $fog$1[$fog$2] === $fog$6) {
    $fog$1[$fog$2] = $fog$1[$fog$2][$fog$7]($fog$3)[$fog$8]()[$fog$12]($fog$3);
  }
}
        
for ($fog$2 = $fog$9; $fog$2 < $fog$4 / $fog$11; $fog$2++) {
  var $fog$5 = $fog$1[$fog$2];
  $fog$1[$fog$2] = $fog$1[$fog$4 - $fog$2 - $fog$10];
  $fog$1[$fog$4 - $fog$2 - $fog$10] = $fog$5;
}
        
  var a = {
  "name": $fog$0
};
})("eulav", "‮", 1, "", 0, "string", "split", "reverse", "join", 1, 2);
     