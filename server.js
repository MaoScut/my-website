// let connect = require('connect');
// let http = require('http');
// let serveStatic = require('serve-static');

// let app = connect();
// let serve = serveStatic(__dirname + '/website');
// app.use(serve);
// http.createServer(app).listen(3000);
let express = require('express');
let MongoClient = require('mongodb').MongoClient;
let http = require('http');
let path = require('path');

const uri = 'mongodb://MaoScut:1253012qwe@cluster0-shard-00-00-38shn.mongodb.net:27017,cluster0-shard-00-01-38shn.mongodb.net:27017,cluster0-shard-00-02-38shn.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
let database = null;

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

/**
 * sign up handler
*/
app.post('/signup', (req, res, next) => {
  console.log(req.body.user);
  if(database) {
    database.collection('inventory').insertOne(req.body.user, (err, r) => {
      if(err) {
        console.log(err);
        next(err);
      } else {
        // res.redirect('login/' + )
        console.log(r);
      }
    })
  } else {
    MongoClient.connect(uri, (err, db) => {
      if(err) {
        console.log(err);
        next(err);
      } else {
        database = db;
       db.collection('inventory').insertOne(req.body.user, (err, r) => {
        if(err) {
          console.log(err);
          next(err);
        } else {
          console.log('inserted num ' + r.insertedCount);
          res.redirect('login/' + r.ops[0].email);
        }
      })
      }
    })
  }
  })

/**
 * log in handler
 */
app.post('/login', (req, res) => {
  MongoClient.connect(uri, (err, db) => {
    db.collection('inventory').find({
      email: req.body.user.email,
      password: req.body.user.password
    }).toArray((err, docs) => {
      if (err) {
        console.log('find error!');
        return;
      } else {
        if (docs.length > 0)
          res.send('<p>user no found!</p>')
        else
          res.send('ok!');
      }

    })
  });
});

 app.get('/login/:signupEmail', (req, res) => {
  res.render('login', { signupEmail: req.params.signupEmail });
 })

http.createServer(app).listen(3000);