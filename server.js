// let connect = require('connect');
// let http = require('http');
// let serveStatic = require('serve-static');

// let app = connect();
// let serve = serveStatic(__dirname + '/website');
// app.use(serve);
// http.createServer(app).listen(3000);
let express = require('express');
let mongodb = require('mongodb');
let http = require('http');
let path = require('path');

let app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  // app.set('view options', { layout: false });
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', (req, res) => {
	res.render('index', { authenticated: false });
});
app.get('/login', (req, res) => {
	res.render('login');
});
app.get('/signup', (req, res) => {
	res.render('signup');
});
let server = new mongodb.Server('127.0.0.1', 27017);
new mongodb.Db('my-websit', server).open((err, client) => {
  if(err) throw err;
  console.log('\033[96m + \033[39m connected to mongodb');
  app.users = new mongodb.Collection(client, 'users');
  // console.log(app.users);
  http.createServer(app).listen(3000, function() {
    console.log('\033[96m + \033[39m app is listening on * 3000');
  })
})