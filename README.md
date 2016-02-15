![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png)

# sails-hook-orm-mongorito

A Sails.js hook to override build-in Waterline ORM by Mongorito.

> **Important**
>
> If you choose to override Waterline (built-in ORM in Sails.js), you should know that the documentation for blueprints, resourceful pubsub and models will **no longer be applicable** for your application.

## Installation

First, install the hook:

```sh
$ npm install sails-hook-orm-mongorito
```

Then, you also need to update your `.sailsrc` file to disable the Waterline related hooks:

```json
{
  "hooks": {
    "orm": false,
    "pubsub": false,
    "blueprints": false
  }
}
```

## Usage

### Connection

To connect to Mongorito, create a new connection in `/config/connections.js` file:

```json
"mongorito": {
  "adapter": "mongorito",
  "host": "localhost",
  "port": 27017,
  "user": "username",
  "password": "password",
  "database": "mydatabase"
}
```

> **Warning**
>
> The adapter must be of type `mongorito` in oder to be detected by the hook

Like with other Sails.js connections, remember to use it in your `config/models.js` file:

```json
connection: 'mongorito'
```

### Models

This hook is loading models according to standard Sails.js conventions. Therefore, you models should be located in `api/models/*.js` in order to be located and loaded by this hook.
The model definition must follow the Mongorito ES-6 syntax with a small difference, your model mustn't extend from `Model` but from `MongoritoModel` which will be globally declared by the hook.

A model example (`api/models/Post.js`):

```js
'use strict';

class Post extends MongoritoModel {

}

module.exports = Post;
```

Models are also globally declared by the hook, so you will be able to access them directly in your Controllers:

```js
'use strict';

const co = require('co');

var MongoritoController = {};

MongoritoController.index = function (req, res) {

  // Create a new Post document
  let post = new Post({
    title: 'Node.js rocks!',
    body: 'Long post body',
    author: {
      name: 'John Doe'
    }
  });

  co(function* () {

    // Saving the document
    yield post.save();

    // Querying all Post documents
    return res.json(yield Post.all());
  });
};

module.exports = MongoritoController;
```

> **Note**
>
> To use the ES-6 syntax, you will always have to use the strict mode by calling `'use strict'` in your scripts or by launching your node.js server in strict mode `node --use_strict`.

For more information about Mongorito, please visit it's [official site](http://mongorito.com/).

## License

The sails-hook-orm-mongorito module is released under the ICS license.

https://github.com/groupe-sii/sails-generate-gulp/blob/master/LICENSE
