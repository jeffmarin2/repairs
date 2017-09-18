var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var api = require('./api');
var validateManagerRole = require('./validateManagerRole');
var validateUserRole = require('./validateUserRole');

var port = 8081;
var app = express();

app.use(bodyParser.json());

app.all('/api/managers/*', validateManagerRole);
app.all('/api/users/*', validateUserRole);
app.use('/api',api);

app.listen(port);
console.log('react repair server listening on ' + port);