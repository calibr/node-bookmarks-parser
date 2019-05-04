var
  should = require("should"),
  parse = require("../lib/bookmarks-parser"),
  fs = require("fs"),
  util = require("util");

describe("Parse bookmarks", function() {
  it("netscape file", function(done) {
    var html = fs.readFileSync(__dirname + "/files/netscape.html", "utf-8");
    var result = fs.readFileSync(__dirname + "/files/netscape.json", "utf-8");
    parse(html, function(err, res) {
      should.not.exists(err);
      res.parser.should.equal("netscape");
      JSON.stringify(res.bookmarks).should.equal(result);
      done();
    });
  });

  it("pocket file", function(done) {
    var html = fs.readFileSync(__dirname + "/files/pocket.html", "utf-8");
    var result = fs.readFileSync(__dirname + "/files/pocket.json", "utf-8");
    parse(html, function(err, res) {
      should.not.exists(err);
      res.parser.should.equal("pocket");
      JSON.stringify(res.bookmarks).should.equal(result);
      done();
    });
  });

  it("netscape complex file", function(done) {
    var html = fs.readFileSync(__dirname + "/files/netscape_complex.html", "utf-8");
    var expected = fs.readFileSync(__dirname + "/files/netscape_complex.json", "utf-8");
    parse(html, function(err, res) {
      should.not.exists(err);
      res.parser.should.equal("netscape");
      var result = JSON.stringify(res.bookmarks, null, 2)
      result.should.equal(expected);
      done();
    });
  });

  it("chrome bookmarks file", function(done) {
    var html = fs.readFileSync(__dirname + "/files/chrome_bookmarks.html", "utf-8");
    var expected = fs.readFileSync(__dirname + "/files/chrome_bookmarks.json", "utf-8");
    parse(html, function(err, res) {
      should.not.exists(err);
      res.parser.should.equal("netscape");
      var result = JSON.stringify(res.bookmarks, null, 2)
      result.should.equal(expected);
      done();
    });
  });

  it("xml file should raise error", function(done) {
    var xml = fs.readFileSync(__dirname + "/files/test.xml", "utf-8");
    parse(xml, function(err, res) {
      should.exists(err);
      done();
    });
  });

  it("can't parse by any processors", function(done) {
    parse('something', function(err, res) {
      should.exists(err);
      done();
    });
  });
});