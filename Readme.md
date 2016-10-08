#Parse bookmarks files

This library can parse formats listed below:

- Pocket(http://getpocket.com)
- Netscape Bookmarks(Firefox, Google Chrome, ...)

##Installation

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
- `bookmarks` - an array of bookmarks

Each bookmark is an object with fields:
- `type` - `folder` or `bookmark`
- `title` - title of a bookmark or a folder
- `url` - URL only for bookmarks
- `children` - array of children bookmarks, only for folders

See more examples in tests.




