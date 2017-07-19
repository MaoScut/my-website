let express = require('express');
let MongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;
let http = require('http');
let path = require('path');
let session = require('express-session');

const uri = 'mongodb://MaoScut:1253012qwe@cluster0-shard-00-00-38shn.mongodb.net:27017,cluster0-shard-00-01-38shn.mongodb.net:27017,cluster0-shard-00-02-38shn.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
let database = null;

let app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
    app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
  // app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use((req, res, next) => {
    if(req.session.loggedIn) {
      res.locals({'authenticated': true});
      database.collection('inventory').find({
        _id: ObjectID(req.session.loggedIn)
      }).toArray((err, docs) => {
        if(err) return next(err);
        res.locals({'me': docs[0]});
        next();
      })
    } else {
      res.locals({'authenticated': false});
      next();
    }
  })
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', (req, res) => {
	res.render('index');
});
app.get('/login', (req, res) => {
	res.render('login');
});
app.get('/signup', (req, res) => {
	res.render('signup');
});
app.get('/logout', (req, res) => {
  req.session.loggedIn = null;
  res.redirect('/');
})

/**
 * sign up handler
*/
app.post('/signup', (req, res, next) => {
  database.collection('inventory').insertOne(req.body.user, (err, r) => {
    if (err) {
      console.log(err);
      next(err);
    } else {
      console.log('inserted num ' + r.insertedCount);
      res.redirect('login/' + r.ops[0].email);
    }
  })
})
/**
 * log in handler
 */
app.post('/login', (req, res) => {
  console.log(req.body.user);
  database.collection('inventory').find({
    email: req.body.user.email,
    password: req.body.user.password
    }).toArray((err, docs) => {
    if (err) {
      console.log('find error!');
      return;
    } else {
      if (docs.lenght == 0)
        res.send('<p>user no found!</p>')
      else {
        // res.send('ok!');
        console.log('user login successfully!');
        console.log(docs);
        req.session.loggedIn = docs[0]._id.toString();
        res.redirect('/');
      }
    }
  })
    // database.collection('inventory').find(req.body.user).toArray().then(docs=>console.log(docs));
});

 app.get('/login/:signupEmail', (req, res) => {
  res.render('login', { signupEmail: req.params.signupEmail });
 })

console.log('connecting to Mongo...');
MongoClient.connect(uri, (err, db) => {
  console.log('connection finshed!');
  database = db;
  database.collection('inventory').find({
    email: '849345372@qq.com',
    password: '1253012qwe' }).toArray().then(docs=>console.log(docs));
  http.createServer(app).listen(3000, () => {
    console.log('\033[96m + \033[39m app listening on port 3000.');
  })
})
