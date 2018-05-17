var mongoose = require("mongoose")
var Schema = mongoose.Schema

var WcSchema = new Schema({
	bCode: String,
	mCode: String,
	sCode: String,
	wCode: String,
	text: String
})

var Wc = mongoose.model("Wc", WcSchema)
module.exports = Wc