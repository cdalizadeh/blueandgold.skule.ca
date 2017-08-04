var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/', function (req, res) {
    var body = req.body;
    if (!body || !body.comments) res.status(400).send();
    else{
        var text = 'Date: ' + (new Date().toLocaleString()) + '\n';
        if (body.name) text += 'Name: ' + body.name + '\n';
        if (body.email) text += 'Email: ' + body.email + '\n';
        text += 'Comments: ' + body.comments;
        sendMail(text, function(err, body){
            if (err) res.status(500).send(err);
            else res.json(body);
        });
    }
});

var server = app.listen(app.get('port'), function() {
    console.log('Listening.');
});

function sendMail(text, cb){
    var headers = {
        'Authorization': 'Basic ' + process.env.MAILGUN_KEY
    };
    var formData = {
        from: 'Automated Feedback Mailer<website@blueandgold.mailgun.org>',
        to: 'cdalizadeh@gmail.com',
        subject: 'Website Feedback Received',
        text: text
    }
    request({
        url: 'https://api.mailgun.net/v3/sandbox2967c7328b27470ca8bbbda44c6291da.mailgun.org/messages',
        method: 'POST',
        headers: headers,
        form: formData,
        callback: function(err, res, body){
            if (err || JSON.parse(body).message != 'Queued. Thank you.') cb('Internal Mailing Error');
            else cb(null, body);
        }
    });
}