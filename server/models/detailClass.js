var mongoose = require("mongoose")
var Schema = mongoose.Schema

var DcSchema = new Schema({	
	sCode: String,
	dCode: String,
	text: String
})

var Dc = mongoose.model("Dc", DcSchema)
module.exports = Dc