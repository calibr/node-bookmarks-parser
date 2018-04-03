[![Build Status](https://travis-ci.org/calibr/node-bookmarks-parser.svg?branch=master)](https://travis-ci.org/calibr/node-bookmarks-parser)

# Parse bookmarks files

This library can parse formats listed below:

- Netscape Bookmarks(Firefox, Google Chrome, ...)
- Pocket(http://getpocket.com)

## Installation

`npm install bookmarks-parser`

Example:

```javascript

var parse = require("bookmarks-parser");
parse('<title>Pocket Export</title><h1>Unread</h1>'+
      '<ul><li><a href="http://example.com">Example!</a></li></ul>', function(err, res) {
  console.log(err);
  console.log(res.parser);
  console.log(res.bookmarks);
});

```

`parse` function receives two parameters - text of a exported bookmarks file and callback.

Second parameter returned in the callback is an object with fields:
- `parser` - `netscape` or `pocket`
- `bookmarks` - an array of parsed bookmarks

Each bookmark is an object with fields:
- `type` - `folder` or `bookmark`
- `title` - title of a bookmark or a folder
- `url` - URL only for bookmarks
- `children` - array of children bookmarks, only for folders
- `ns_root` - if the folder is a root this field will contain one of the values: `menu`, `toolbar`, `unsorted`, otherwise `null`. Applicable only for `netscape` parser.

If you have found out any bugs or have any questions please feel free to submit it into the issues.

See more examples in the tests.




