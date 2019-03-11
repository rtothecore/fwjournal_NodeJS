var mongoose = require("mongoose")
var Schema = mongoose.Schema

var LandSchema = new Schema({
	userId: String,
	name: String,
	address: String,
	addressDetail: String,
	size: String,
	sizeDetail: String,
	cropCode: String
})

var Land = mongoose.model("Land", LandSchema)
module.exports = Land