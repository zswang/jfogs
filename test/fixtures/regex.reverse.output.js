
(function ($fog$0, $fog$1, $fog$2, $fog$3) {
  
var $fog$4 = arguments;
var $fog$6 = $fog$4.length;
var $fog$5;
        
for ($fog$5 = 0; $fog$5 < $fog$6; $fog$5++) {
  if (typeof $fog$4[$fog$5] === 'string') {
    $fog$4[$fog$5] = $fog$4[$fog$5].split('').reverse().join('');
  }
}
        
for ($fog$5 = 0; $fog$5 < $fog$6 / 2; $fog$5++) {
  var $fog$7 = $fog$4[$fog$5];
  $fog$4[$fog$5] = $fog$4[$fog$6 - $fog$5 - 1];
  $fog$4[$fog$6 - $fog$5 - 1] = $fog$7;
}
        
  console[$fog$3]($fog$1[$fog$2]($fog$0));
})("gol", "tset", /\w/img, "olleh");
     