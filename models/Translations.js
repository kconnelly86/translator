var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var translationSchema = new Schema({
  translate: String,
  translation: String,
  langFull: String
  // ,
  // created: String
});
var Translations = mongoose.model("Translations", translationSchema);
module.exports = Translations;