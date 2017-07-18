let MongoClient = require('mongodb').MongoClient;

let uri = 'mongodb://MaoScut:1253012qwe@cluster0-shard-00-00-38shn.mongodb.net:27017,cluster0-shard-00-01-38shn.mongodb.net:27017,cluster0-shard-00-02-38shn.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
MongoClient.connect(uri, (err, db) => {
	if(err) {
		console.log(err);
		return;
	}
db.collection('inventory').find({ status: "D" }).toArray((err, docs) => {
	console.log(docs);
});
// db.collection('inventory').stats().then(result => {
// 	console.log(result);
// });
// db.collection('inventory').insertMany([
//    // MongoDB adds the _id field with an ObjectId if _id is not present
//    { item: "journal", qty: 25, status: "A",
//        size: { h: 14, w: 21, uom: "cm" }, tags: [ "blank", "red" ] },
//    { item: "notebook", qty: 50, status: "A",
//        size: { h: 8.5, w: 11, uom: "in" }, tags: [ "red", "blank" ] },
//    { item: "paper", qty: 100, status: "D",
//        size: { h: 8.5, w: 11, uom: "in" }, tags: [ "red", "blank", "plain" ] },
//    { item: "planner", qty: 75, status: "D",
//        size: { h: 22.85, w: 30, uom: "cm" }, tags: [ "blank", "red" ] },
//    { item: "postcard", qty: 45, status: "A",
//        size: { h: 10, w: 15.25, uom: "cm" }, tags: [ "blue" ] }
// ])
// .then(function(result) {
//   // process result
//   console.log(result);
// })
})