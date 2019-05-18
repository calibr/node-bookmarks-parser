const { JSDOM } = require('jsdom')

exports.name = "netscape";

exports.canParse = function(html, callback) {
  // first symbol most be <
  for(let i = 0; i < html.length; i++) {
    if(/\s/.test(html[i])) {
      continue
    }
    if(html[i] === '<') {
      break
    }
    else {
      return callback(null, false)
    }
  }
  var can = /<dl/i.test(html) &&
    /<\/dl/i.test(html) &&
    /<dt/i.test(html) &&
    /<a[^<>]href\s*=\s*/i.test(html)
  callback(null, can)
};

exports.parse = function(html, callback) {
  var rootFoldersRegEx = /^Menu|Unsorted|Toolbar$/i;
  try{
    const { window } = new JSDOM(html)
    var result = [];

    // node is a DT element
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

          var icon = node.childNodes[i].getAttribute("icon");
          if( icon ){
            data.icon = icon;
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
          data.ns_root = null
          if(node.childNodes[i].hasAttribute('personal_toolbar_folder')) {
            data.ns_root = 'toolbar'
          }
          if(node.childNodes[i].hasAttribute('unfiled_bookmarks_folder')) {
            data.ns_root = 'unsorted'
          }
        }
        else if( node.childNodes[i].tagName == "DL" ){
          // store DL element reference for further processing the child nodes
          data.__dir_dl = node.childNodes[i];
        }
      }

      // if current item is a folder, but we haven't found DL element for it inside the DT element - check if the next sibling is DD
      // and if so check if it has DL element if yes - we just found the DL element for the folder
      if(data.type === 'folder' && !data.__dir_dl) {
        if(node.nextSibling && node.nextSibling.tagName === 'DD') {
          let dls = node.nextSibling.getElementsByTagName('DL')
          if(dls.length) {
            data.__dir_dl = dls[0]
          }
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
          if(level === 0 && !itemData.ns_root) {
            // create menu root if need
            if(!menuRoot) {
              menuRoot = {
                title: "Menu",
                children: [],
                ns_root: 'menu'
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
      callback(new Error("Bookmarks file malformed(Netscape parser): no DL nodes were found"));
    }

  }
  catch( ex ){
    return callback(ex);
  }
};