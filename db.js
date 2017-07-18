let MongoClient = require('mongodb').MongoClient;

let uri = 'mongodb://MaoScut:1253012qwe@cluster0-shard-00-00-38shn.mongodb.net:27017,cluster0-shard-00-01-38shn.mongodb.net:27017,cluster0-shard-00-02-38shn.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
MongoClient.connect(uri, (err, db) => {
	if(err) {
		console.log(err);
		return;
	}
})