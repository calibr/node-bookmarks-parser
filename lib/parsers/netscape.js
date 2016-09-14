var
  jsdom = require("jsdom");

exports.name = "netscape";

exports.canParse = function(html, callback) {
  callback(null, true);
};

exports.parse = function(html, callback) {
  var rootFoldersRegEx = /^Menu|Unsorted|Toolbar$/i;
  try{
    jsdom.env( html, function( err, window ) {
      if( err ){
        return callback(err);
      }
      var result = [];

      function _getNodeData( node ){

        var data = {};

        for( var i = 0; i != node.childNodes.length; i++ ){
          if( node.childNodes[i].tagName == "A" ){
            // is bookmark
            data.type = "bookmark";
            data.url = node.childNodes[i].getAttribute("href");
            data.title = node.childNodes[i].textContent;

            var add_date = node.childNodes[i].getAttribute("add_date");
            if( add_date ) {
              data.add_date = add_date;
            }
          }
          else if( node.childNodes[i].tagName == "H3" ){
            // is folder
            data.type = "folder";
            data.title = node.childNodes[i].textContent;

            var add_date = node.childNodes[i].getAttribute("add_date");
            var last_modified = node.childNodes[i].getAttribute("last_modified");

            if( add_date ) {
              data.add_date = add_date;
            }

            if( last_modified ) {
              data.last_modified = last_modified;
            }
          }
          else if( node.childNodes[i].tagName == "DL" ){
            data.__dir_dl = node.childNodes[i];
          }
        }

        return data;

      }

      function processDir( dir, level ){
        var children = dir.childNodes,
            menuRoot = null;
        
        var items = [];

        for( var i = 0; i != children.length; i++ ){
          var child = children[i];
          if(!child.tagName) {
            continue;
          }
          if( child.tagName != "DT" ){
            continue;
          }
          var itemData = _getNodeData( child );
          if( itemData.type ){
            if(level === 0) {
              if(itemData.title == "Unsorted Bookmarks") {
                itemData.title = "Unsorted";
              }
              if(itemData.title == "Bookmarks Menu") {
                itemData.title = "Menu";
              }
              if(itemData.title == "Bookmarks Toolbar") {
                itemData.title = "Toolbar";
              }
            }

            if(level === 0 && !rootFoldersRegEx.test(itemData.title)) {
              // create menu root if need
              if(!menuRoot) {
                menuRoot = {
                  title: "Menu",
                  children: []
                };
              }
              if( itemData.type == "folder" && itemData.__dir_dl ){
                itemData.children = processDir( itemData.__dir_dl, level + 1 );
                delete itemData.__dir_dl;
              }
              menuRoot.children.push(itemData);
            }
            else {
              if( itemData.type == "folder" && itemData.__dir_dl ){
                itemData.children = processDir( itemData.__dir_dl, level + 1 );
                delete itemData.__dir_dl;
              }
              items.push( itemData );
            }
          }
        }
        if(menuRoot) {
          items.push(menuRoot);
        }
        return items;
      }

      var dls = window.document.getElementsByTagName("DL");

      if( dls.length > 0 ){
        callback(null, processDir( dls[0], 0 ));
      }
      else{
        callback(new Error("Bookmarks file malformed"));
      }

    });

  }
  catch( ex ){
    return callback(ex);
  }
};