var mongoose = require("mongoose")
var Schema = mongoose.Schema

var LeaveUserSchema = new Schema({
	id: String,
	leave_date: String,
	leave_reason: String,
	leave_reason_detail: String
})

var LeaveUser = mongoose.model("LeaveUser", LeaveUserSchema)
module.exports = LeaveUser