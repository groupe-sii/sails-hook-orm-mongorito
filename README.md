![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png)

# sails-hook-orm-mongorito

An hook to override default Waterline orm in Sails.js with Mongorito.

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
mongorito: {
  adapter: 'mongorito',
  host: 'localhost',
  port: 27017,
  user: 'test',
  password: 'testest',
  database: 'test'
}
```

> **Warning**
>
> The adapter must be of type `mongorito` in oder to be detected by the hook

Like with other Sails.js connections, remember to use it in your `config/models.js` file:

```json
connection: 'mongorito'
```

## License

The sails-hook-orm-mongorito module is released under the ICS license.

https://github.com/groupe-sii/sails-generate-gulp/blob/master/LICENSE
