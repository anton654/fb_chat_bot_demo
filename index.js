'use strict';

var express      = require('express');
var request      = require('superagent');
var bodyParser   = require('body-parser');
var loger        = require('./utils/loger.js');
var $base        = __dirname+'/';

var path = require('path');
global.appRoot = path.resolve(__dirname);

var pageToken    = 'EAATEuE8IUAEBAOsZC8OrcuvLblxnzG2agJTioKP39GXJx9BZB5m6Gt6rvoIl1kirk1aF8b7ugEp8TfyhDOHeQeTZCmwS0BegjAgp16ZBmvakqrYMtJZCZAfwZBZA1qlnIrWMVRZBWShWbTGO81txRnQ8ZBMNvlofe5Yjl4ajtAvWd31wZDZD';
var verifyToken  = 'HELLO-VEEMS-TEST';

var app          = express();
app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());

var mongoose     = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/fb_chat_bot');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    loger.log("app mongo connected");
    //add message to db
    // var messageDB = {
    //     user_name: 'anton',
    //     user_id: '101',
    //     //message_id: {type: int,required true},
    //     content: "hi"
    // };
    //
    // messageModel.add(messageDB,function(err){
    //     if (!err) {
    //         loger.logf("mongo message added: %j",messageDB);
    //     } else {
    //         loger.log(err);
    //         // if(err.name == 'ValidationError') {
    //         //     res.statusCode = 400;
    //         //     res.send({ error: 'Validation error' });
    //         // } else {
    //         //     res.statusCode = 500;
    //         //     res.send({ error: 'Server error' });
    //         // }
    //         // log.error('Internal error(%d): %s',res.statusCode,err.message);
    //     }
    // });
});

var apiMessage   = require('./routes/api/messageApi');
app.use('/api/messages', apiMessage);

var messageModel = require(appRoot+'/models/messageModel');

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index');
});

app.listen(app.get('port'), function () {
    loger.logf('Node app is running on port', app.get('port'));
});


app.get('/webhook', function (req, res) {
    loger.log('webhook get');

    if (req.query['hub.verify_token'] === verifyToken) {
        return res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

app.post('/webhook', function (req, res) {
    loger.log('webhook post');

    var messagingEvents = req.body.entry[0].messaging;
    messagingEvents.forEach(function (event) {
        var sender = event.sender.id;

        if (event.postback) {
            var text = JSON.stringify(event.postback).substring(0, 200);
            sendTextMessage(sender, 'Postback received: ' + text);
        } else if (event.message && event.message.text) {
            var text = event.message.text.trim().substring(0, 200);

            if (text.toLowerCase() === 'generic') {
                sendGenericMessage(sender);
            } else {
                sendTextMessage(sender, 'Text received, echo: ' + text);
            }
        }
    });

    res.sendStatus(200);
});

function sendMessage(sender, message) {
    request
        .post('https://graph.facebook.com/v2.6/me/messages')
        .query({access_token: pageToken})
        .send({
            recipient: {
                id: sender
            },
            message: message
        })
        .end(function (err, res) {
            if (err) {
                loger.logf('Error sending message: ', err);
            } else if (res.body.error) {
                loger.logf('Error: ', res.body.error);
            }
        });
}

function sendTextMessage(sender, text) {
    sendMessage(sender, {
        text: text
    });
}

function sendGenericMessage(sender) {
    sendMessage(sender, {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [{
                    title: 'First card',
                    subtitle: 'Element #1 of an hscroll',
                    image_url: 'http://messengerdemo.parseapp.com/img/rift.png',
                    buttons: [{
                        type: 'web_url',
                        url: 'https://www.messenger.com/',
                        title: 'Web url'
                    }, {
                        type: 'postback',
                        title: 'Postback',
                        payload: 'Payload for first element in a generic bubble'
                    }]
                }, {
                    title: 'Second card',
                    subtitle: 'Element #2 of an hscroll',
                    image_url: 'http://messengerdemo.parseapp.com/img/gearvr.png',
                    buttons: [{
                        type: 'postback',
                        title: 'Postback',
                        payload: 'Payload for second element in a generic bubble'
                    }]
                }]
            }
        }
    });
}

