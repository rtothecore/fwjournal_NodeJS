var mongoose = require("mongoose")
var Schema = mongoose.Schema

var WcSchema = new Schema({
	bCode: String,
	mCode: String,
	sCode: String,
	dCode: String,
	wCode: String,
	text: String,
	asItem: String
})

var Wc = mongoose.model("Wc", WcSchema)
module.exports = Wc