
(function ($fog$0, $fog$1, $fog$2, $fog$3, $fog$19, $fog$7, $fog$8, $fog$9, $fog$16, $fog$17, $fog$25, $fog$26, $fog$21, $fog$20, $fog$22, $fog$23, $fog$24, $fog$15, $fog$10, $fog$12, $fog$13, $fog$14, $fog$18) {
  
if ("‮" !== $fog$19) {
  return;
}

var $fog$4 = arguments;
for (var $fog$5 = $fog$12; $fog$5 < $fog$7; $fog$5++) {
  if (typeof $fog$4[$fog$5] !== $fog$8) {
    continue;
  }
  $fog$4[$fog$5] = $fog$4[$fog$5][$fog$9]($fog$16,
    function (a) {
      return {
        '\u200c': $fog$12,
        '\u200d': $fog$13
      }[a];
    }
  )[$fog$9]($fog$17, function (a) {
    return $fog$15[$fog$10]($fog$18(a, $fog$14));
  })[$fog$9](
    $fog$25,
    function(c) {
      var cc = (c[$fog$21]($fog$12) & $fog$23) << $fog$20 | (c[$fog$21]($fog$13) & $fog$24);
      return $fog$15[$fog$10](cc);
    }
  )[$fog$9](
    $fog$26,
    function(c) {
      var cc = (c[$fog$21]($fog$12) & $fog$22) << $fog$20 * $fog$14 | (c[$fog$21]($fog$13) & $fog$24) << $fog$20 | (c[$fog$21](2) & $fog$24);
      return $fog$15[$fog$10](cc);
    }
  );
}
    
  console[$fog$0]($fog$1);
console[$fog$0]($fog$2);
console[$fog$0]($fog$3);
})("‌‍‍‌‍‍‌‌‌‍‍‌‍‍‍‍‌‍‍‌‌‍‍‍", "‌‍‍‌‌‌‌‍‌‍‍‌‌‌‍‌‌‍‍‌‌‌‍‍", "‍‍‍‌‌‍‍‌‍‌‍‍‌‌‌‍‍‌‌‌‍‌‌‍‍‍‍‌‌‍‌‍‍‌‍‌‍‍‌‍‍‌‌‍‌‍‍‍", "‍‍‍‌‌‍‌‌‍‌‍‍‍‍‌‍‍‌‍‌‌‌‌‌‍‍‍‌‌‍‌‍‍‌‍‌‌‍‌‍‍‌‍‍‍‍‌‍", "‮", 4, "string", "replace", /./g, /.{8}/g, /[\u00c0-\u00df][\u0080-\u00bf]/g, /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, "charCodeAt", 6, 31, 31, 63, String, "fromCharCode", 0, 1, 2, parseInt);
     