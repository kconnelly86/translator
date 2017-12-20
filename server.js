/* Translator
* backend
* ==================== */
// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require("mongoose");
// Set the app up with morgan, body-parser, and a static folder
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
extended: false
}));
app.use(express.static("public"));
// Database config with mongoose
// define local mongodb uri
var databaseUri = "mongodb://localhost/translator";

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect(databaseUri);
}
var db = mongoose.connection;

db.on('error', function(err) {
	console.log('Mongoose Error: ', err);
});

db.once('open', function() {
	console.log('Mongoose connection successful. ');
});


// Database configuration
var databaseUrl = "translator";
var collections = ["translations"];
// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);
// Log any mongojs errors to console
db.on("error", function(error) {
console.log("Database Error:", error);
});








// Routes
// ======
// Simple index route
app.get("/", function(req, res) {
res.send(index.html);
});
//this section doesnt affect the translation aspect, it affects the send to the database. HAVE TO HAVE
// Handle form submission, save submission to mongo
app.post("/submit", function(req, res) {
// Insert the translation into the translations collection
db.translations.insert(req.body, function(error, saved) {
// Log any errors
if (error) {
console.log(error);
}
// Otherwise, send the translation back to the browser
// This will fire off the success function of the ajax request
else {
res.send(saved);
}
});
});
//if you dont have this it wont populate your results box from your database in local host. HAVE TO HAVE
// Retrieve results from mongo
app.get("/all", function(req, res) {
// Find all translations in the translations collection
db.translations.find({}, function(error, found) {
// Log any errors
if (error) {
console.log(error);
}
// Otherwise, send json of the translations back to user
// This will fire off the success function of the ajax request
else {
console.log("retrieving" + JSON.stringify(found));
res.json(found);

}
});
});
// must have to find one/ and update the front end and populate
// Select just one translation by an id
app.get("/find/:id", function(req, res) {
// When searching by an id, the id needs to be passed in
// as (mongojs.ObjectId(IDYOUWANTTOFIND))
// Find just one result in the translations collection
db.translations.findOne({
// Using the id in the url
"_id": mongojs.ObjectId(req.params.id)
}, function(error, found) {
// log any errors
if (error) {
console.log(error);
res.send(error);
}
// Otherwise, send the translation to the browser
// This will fire off the success function of the ajax request
else {
res.send(found);
}
});
});
// Delete One from the DB
app.get("/delete/:id", function(req, res) {
// Remove a translation using the objectID
db.translations.remove({
"_id": mongojs.ObjectID(req.params.id)
}, function(error, removed) {
// Log any errors from mongojs
if (error) {
console.log(error);
res.send(error);
}
// Otherwise, send the mongojs response to the browser
// This will fire off the success function of the ajax request
else {
console.log(removed);
res.send(removed);
}
});
});
// Clear the DB
app.get("/clearall", function(req, res) {
// Remove every translation from the translations collection
db.translations.remove({}, function(error, response) {
// Log any errors to the console
if (error) {
console.log(error);
res.send(error);
}
// Otherwise, send the mongojs response to the browser
// This will fire off the success function of the ajax request
else {
console.log(response);
res.send(response);
}
});
});
// Listen on port 3000
app.listen(port, function() {
console.log("App running on port 3000!");
});