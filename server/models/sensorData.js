var mongoose = require("mongoose")
var Schema = mongoose.Schema

var SensorDataSchema = new Schema({
	index: String,
	temperature: String,
	humidity: String,
	co2: String,
	date: String
})

var SensorData = mongoose.model("SensorData", SensorDataSchema)
module.exports = SensorData