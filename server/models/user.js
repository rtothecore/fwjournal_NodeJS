var mongoose = require("mongoose")
var Schema = mongoose.Schema

var UserSchema = new Schema({
	email: String,
	password: String,
	age: String,
	sex: String
})

var User = mongoose.model("User", UserSchema)
module.exports = User