# Uptime Robot API
A library to interact with Uptime Robot API, written in ES6.

### Features

- CRUD Monitors
- CRUD Contacts

#### Fetching a list of monitors

```javascript
var Client = require('uptime-robot-api').Client;

var client = new Client('u19921-b47e987f*********');

client.list()
  .then(function(list){
    console.dir(list)
  });
```

#### Creating a new monitor

```javascript
var Client = require('uptime-robot-api').Client;
var Monitor = require('uptime-robot-api').Monitor;

var client = new Client('u19921-b47e987f*********');

var importantWebsiteMonitor = new Monitor({
  'friendlyname': 'Foo',
  'url': 'http://foo.bar'
});

client.create(importantWebsiteMonitor)
  .then(function(result){
    console.dir(result)
  });
```


#### Fetching a list of contacts

```javascript
var Client = require('uptime-robot-api').Client;
var Contact = require('uptime-robot-api').Contact;

var client = new Client('u19921-b47e987f*********');

client.list({}, Contact)
  .then(function(list){
    console.dir(list)
  });
```


#### Creating a new contact

```javascript
var Client = require('uptime-robot-api').Client;
var Contact = require('uptime-robot-api').Contact;

var client = new Client('u19921-b47e987f*********');

var person = new Contact({
  'friendlyname': 'Foo',
  'value': 'foo@bar.com'
});

client.create(person)
  .then(function(result){
    console.dir(result)
  });
```

