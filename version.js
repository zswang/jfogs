var fs = require('fs');
var path = require('path');

var filename = path.join(__dirname, 'package.json');
var package = JSON.parse(fs.readFileSync(filename));
package.version = package.version.replace(/-?\d+$/, function(value) {
    return parseInt(value) + 1;
});
fs.writeFileSync(filename, JSON.stringify(package, null, '  '));

var bower_filename = path.join(__dirname, 'bower.json');
var bower_package = JSON.parse(fs.readFileSync(bower_filename));
bower_package.name = package.name;
bower_package.keywords = package.keywords;
bower_package.version = package.version;
fs.writeFileSync(bower_filename, JSON.stringify(bower_package, null, '  '));