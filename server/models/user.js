var mongoose = require("mongoose")
var Schema = mongoose.Schema

var UserSchema = new Schema({
	id: String,
	password: String,
	name: String,
	birth_date: String,
	sex: String,
	phone_no: String,
	level: String,
	join_date: String,
	pw_date: String,
	tmp_pw_date: String,
	mod_date: String,
	share_flag: String
})

var User = mongoose.model("User", UserSchema)
module.exports = User