var
  parsers = [],
  fs = require("fs"),
  async = require("async");

// load parsers
var files = fs.readdirSync(__dirname + "/parsers");
files.forEach(function(f) {
  if(!/^netscape\.js$/i.test(f)) {
    parsers.push(require("./parsers/" + f));
  }
});
parsers.push(require("./parsers/netscape.js"));

module.exports = exports = function(html, callback) {
  async.eachSeries(parsers, function(parser, next) {
    parser.canParse(html, function(err, can) {
      // ignore error check
      if(!can) {
        return next();
      }
      parser.parse(html, function(err, bookmarks) {
        if(err) {
          return callback(err);
        }
        callback(null, {
          parser: parser.name,
          bookmarks: bookmarks
        });
      });
    });
  });
};