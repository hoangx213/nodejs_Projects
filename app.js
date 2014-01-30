
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

var mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('localhost:27017/chatuser');

var server = http.createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var checkAuth = function(req, res, next){
    if(!req.session.user_id){
        res.redirect('/login');
    } else {
        next();
    }
}

app.get('/', checkAuth, routes.chat);
app.get('/users', user.list);
app.get('/newuser', routes.newuser);
app.post('/adduser', routes.adduser(db));
app.get('/login', routes.login);
app.post('/login', routes.trylogin(db));
app.get('/chat', checkAuth, routes.chat);
app.get('/logout', routes.logout);

io.sockets.on("connection", function(socket){
    socket.on('chat', function(data){
        console.log(data);
        io.sockets.emit('chat', data);
    });
});



server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
