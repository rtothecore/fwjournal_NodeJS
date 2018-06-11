var mongoose = require("mongoose")
var Schema = mongoose.Schema

var BcSchema = new Schema({
	bCode: String,
	text: String
})

var Bc = mongoose.model("Bc", BcSchema)
module.exports = Bc