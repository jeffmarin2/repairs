const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');
const validateManagerRole = require('./validateManagerRole');
const validateUserRole = require('./validateUserRole');

const port = 8081;
const app = express();

app.use(bodyParser.json());

app.all('/api/managers/*', validateManagerRole);
app.all('/api/users/*', validateUserRole);
app.use('/api', api);

app.listen(port);
console.log('react repair server listening on ' + port);
