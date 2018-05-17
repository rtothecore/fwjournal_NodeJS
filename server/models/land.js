var mongoose = require("mongoose")
var Schema = mongoose.Schema

var LandSchema = new Schema({
	userId: String,
	name: String,
	address: String,
	size: String,
	cropCode: String
})

var Land = mongoose.model("Land", LandSchema)
module.exports = Land