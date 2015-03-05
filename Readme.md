#Parse bookmarks files

This library now can parse formats listed below:

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

`parse` function obtain two parameters - text of a bookmarks export file and callback.

Second parameter returned in callback is object which has fields:
- `parser` - `netscape` or `pocket`
- `bookmarks` - an array of bookmarks

Each bookmark is object which has field:
- `type` - `folder` or `bookmark`
- `title` - title of bookmark or folder
- `url` - URL only for bookmarks
- `children` - array of child bookmarks, only for folders

See more examples in tests.




