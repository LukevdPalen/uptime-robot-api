# Uptime Robot API
A library to ineracting with Uptime Robot API, written in ES6.

### Features

- CRUD Monitors
- CRUD Contacts

#### Fetching a list of monitors

```javascript
var Client = require('../test-dist/uptime').Client;

var client = new Client('u19921-b47e987f*********');

client.list()
  .then(function(list){
    console.dir(list)
  });
```

#### Creating a new monitor

```javascript
var Client = require('../test-dist/uptime').Client;
var Monitor = require('../test-dist/uptime').Monitor;

var client = new Client('u19921-b47e987f*********');

var importantWebsiteMonitor = new Monitor({
  friendlyname: 'Foo',
  'url': 'http://foo.bar'
});

client.create(importantWebsiteMonitor)
  .then(function(result){
    console.dir(result)
  });
```

