# QS to Sequelize

This library takes a querystring and turns it into something you can give to Sequelize.

## Example

```javascript
const queryLib = require('../lib/query')();
const User = require('../models/user');

const router = new Router();

router
  .get('', async (req, res) => {
    const query = queryLib(req.query);
    res.json(await User.findAll(query));
  })
```

### Opts

You can pass the following options:

```
{
  max_per_page: 20,
  default_per_page: 10,
}
```

Like so:

```
const queryLib = require('../lib/query')({max_per_page: 20});
```

Opts are new as of version 2.x.x

## API

The querystring params you can pass are:

### per_page
The number of results you want to receive.

`?per_page=10` -> `{ limit: 10 }`

### page
The page you are interested in.

`?page=2&per_page=10` -> `{ offset: 10, limit: 10 }`

### sort
The property you want the results sorted by

`?sort=quantity` -> `{ order: ['quantity', 'ASC'] }`

### -sort
The property you want the results sorted by in descending order

`?sort=-quantity` -> `{ order: ['quantity', 'DESC'] }`

### filter[key]
A property you want to filter by

NB: [Express parses](http://expressjs.com/en/api.html#req.query) `filter[key]` into `{filter: key}` and that's what we expect

`?filter%5Bfoo%5D=bar -> `{ where: { foo: 'bar' } }`

### filter[key]&filter[key]
Many properties you want to filter by

`?filter%5Bfoo%5D=bar&filter%5Bbaz%5D=quux -> `{ where: { foo: 'bar', baz: 'quux' } }`

### updated_since
Only return documents updated since this time

`updated_since=2016-12-19T05%3A34%3A15.518Z` -> `{ where: { updated_at: { $gt: '2016-12-19T05:34:15.518Z' } } }`

### updated_before
Only return documents updated before this time

`updated_before=2016-12-19T05%3A34%3A15.518Z` -> `{ where: { updated_at: { $lt: '2016-12-19T05:34:15.518Z' } } }`

### created_since
Only return documents created since this time

`created_since=2016-12-19T05%3A34%3A15.518Z` -> `{ where: { created_at: { $gt: '2016-12-19T05:34:15.518Z' } } }`

### created_before
Only return documents created before this time

`created_before=2016-12-19T05%3A34%3A15.518Z` -> `{ where: { created_at: { $lt: '2016-12-19T05:34:15.518Z' } } }`

## NB
If the library doesn't like something it's passed, it will `throw` an error back at you.

Use something that handles errors for you like:

https://www.npmjs.com/package/express-async-errors

or

https://www.npmjs.com/package/express-yields

or

Wrap calls in a `try`.

## Dedication

Development of this library was funded by [Ordermentum](http://www.ordermentum.com/)
