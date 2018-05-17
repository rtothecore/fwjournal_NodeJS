var mongoose = require("mongoose")
var Schema = mongoose.Schema

var WeatherSchema = new Schema({
	baseTime: String,
	sky: String,
	t1h: String,
	reh: String,
	rn1: String
})

var JournalSchema = new Schema({
	userId: String,
	date: String,
	landId: String,
	workCode: String,
	workContent: String,
	workSTime: String,
	workETime: String,
	weather: [WeatherSchema],
	remarks: String
})

var Journal = mongoose.model("Journal", JournalSchema)
module.exports = Journal