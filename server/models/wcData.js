var mongoose = require("mongoose")
var Schema = mongoose.Schema

var wf2DataSchema = new Schema({
	fcstDate: String,
	fcstTime: String,
	t3h: String,
	reh: String,
	r06: String,
	pty: String,
	sky: String
})

var afDataSchema = new Schema({
	insertDate: String,
	weather: [wf2DataSchema]
})

var tmDataSchema = new Schema({
	insertDate: String,
	weather: [wf2DataSchema]
})

var wfDataSchema = new Schema({
	fcstDate: String,
	fcstTime: String,
	t1h: String,
	reh: String,
	rn1: String,
	pty: String,
	sky: String
})

var thDataSchema = new Schema({
	insertDate: String,
	weather: [wfDataSchema]
})

var airDataSchema = new Schema({
	dataTime: String,
	so2Value: String,
	coValue: String,
	o3Value: String,
	no2Value: String,
	pm10Value: String,
	pm25Value: String
})

var weatherDataSchema = new Schema({
	baseDate: String,
	baseTime: String,
	t1h: String,
	reh: String,
	rn1: String,
	pty: String,
	sky: String
})

var cDataSchema = new Schema({
	insertDate: String,
	weather: [weatherDataSchema],
	air: [airDataSchema]
})

var WcDataSchema = new Schema({
	address: String,
	nx: String,
	ny: String,
	currentData: [cDataSchema],
	twoHour: thDataSchema,
	tomorrow: tmDataSchema,
	afterTomorrow: afDataSchema
})

var WcData = mongoose.model("WcData", WcDataSchema)
module.exports = WcData