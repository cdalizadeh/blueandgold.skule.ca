var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/', function (req, res) {
    console.log(req.body);
    res.status(200).send();
});

var server = app.listen(app.get('port'), function() {
    console.log('Listening.');
});