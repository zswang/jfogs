npm run dist

node cli test/fixtures/angular.in.js -o test/fixtures/angular.output.js
node cli test/fixtures/angular.in.js -o test/fixtures/angular.reverse.output.js -t reverse
node cli test/fixtures/angular.in.js -o test/fixtures/angular.zero.output.js -t zero

node cli test/fixtures/seajs.input.js -o test/fixtures/seajs.output.js
node cli test/fixtures/seajs.input.js -o test/fixtures/seajs.reverse.output.js -t reverse
node cli test/fixtures/seajs.input.js -o test/fixtures/seajs.zero.output.js -t zero

node cli test/fixtures/jquery.input.js -o test/fixtures/jquery.output.js
node cli test/fixtures/jquery.input.js -o test/fixtures/jquery.reverse.output.js -t reverse
node cli test/fixtures/jquery.input.js -o test/fixtures/jquery.zero.output.js -t zero

node cli test/fixtures/json.input.js -o test/fixtures/json.output.js
node cli test/fixtures/json.input.js -o test/fixtures/json.reverse.output.js -t reverse
node cli test/fixtures/json.input.js -o test/fixtures/json.zero.output.js -t zero

node cli test/fixtures/regex.input.js -o test/fixtures/regex.output.js
node cli test/fixtures/regex.input.js -o test/fixtures/regex.reverse.output.js -t reverse
node cli test/fixtures/regex.input.js -o test/fixtures/regex.zero.output.js -t zero

node cli test/fixtures/nostring.input.js -o test/fixtures/nostring.output.js
node cli test/fixtures/nostring.input.js -o test/fixtures/nostring.reverse.output.js -t reverse
node cli test/fixtures/nostring.input.js -o test/fixtures/nostring.zero.output.js -t zero

node cli test/fixtures/one.input.js -o test/fixtures/one.output.js
node cli test/fixtures/one.input.js -o test/fixtures/one.reverse.output.js -t reverse
node cli test/fixtures/one.input.js -o test/fixtures/one.zero.output.js -t zero

node cli test/fixtures/use-strict.input.js -o test/fixtures/use-strict.output.js
node cli test/fixtures/use-strict.input.js -o test/fixtures/use-strict.reverse.output.js -t reverse
node cli test/fixtures/use-strict.input.js -o test/fixtures/use-strict.zero.output.js -t zero
