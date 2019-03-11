var mongoose = require("mongoose")
var Schema = mongoose.Schema

var WeatherSchema = new Schema({	
	minT1H: String,
	maxT1H: String,
	avgT1H: String,
	minREH: String,
	maxREH: String,
	avgREH: String,
	avgRN1: String,
	sky: String
})

var CooSchema = Schema({
	category: String,
	cost: Number
})

var DetailSchema = Schema({
	amount: Number,
	detail: String
})

var ItemDetailSchema = Schema({
	itemId: String,
	usage: Number
})

var JournalSchema = new Schema({
	userId: String,
	date: String,
	landId: Schema.Types.ObjectId,
	workCode: String,
	workContent: String,
	workTime: String,
	workerNumber: String,
	weather: WeatherSchema,
	remarks: String,
	COO: [CooSchema],
	shipment: DetailSchema,
	income: DetailSchema,
	itemDetail: [ItemDetailSchema],
	output: DetailSchema,
	pictureA: String,
	pictureB: String,
	pictureC: String
})

var Journal = mongoose.model("Journal", JournalSchema)
module.exports = Journal