var
  jsdom = require("jsdom");

exports.name = "pocket";

exports.canParse = function(html, callback) {
  var can = /<title>Pocket Export<\/title>/i.test(html);
  callback(null, can);
};

exports.parse = function(html, callback) {
  try{
    jsdom.env( html, function( err, window ) {
      if( err ){
        return callback(err);
      }
      var result = [];
      var lists = window.document.getElementsByTagName("ul");
      for(var i = 0; i != lists.length; i++) {
        var list = lists[i];
        var folderTitle;
        var h1 = list;
        while(h1.previousSibling) {
          if(h1.previousSibling.nodeType != window.document.TEXT_NODE) {
            break;
          }
          h1 = h1.previousSibling;
        }
        h1 = h1.previousSibling;
        if(!h1) {
          return callback(new Error("Folder title not found"));
        }
        folderTitle = h1.textContent;
        var folder = {
          type: "folder",
          title: folderTitle,
          children: []
        };
        var lis = list.getElementsByTagName("li");
        for(var j = 0; j != lis.length; j++) {
          var li = lis[j];
          var a = li.querySelector("a");
          if(!a) {
            continue;
          }
          var bookmark = {};
          bookmark.title = a.textContent;
          bookmark.url = a.getAttribute("href");
          bookmark.type = "bookmark";
          folder.children.push(bookmark);
        }
        result.push(folder);
      }
      callback(null, result);
    });
  }
  catch( ex ){
    return callback(ex);
  }
};