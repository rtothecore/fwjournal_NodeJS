var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ScSchema = new Schema({
	mCode: String,
	sCode: String,
	text: String
})

var Sc = mongoose.model("Sc", ScSchema)
module.exports = Sc