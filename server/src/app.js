const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const axios = require('axios')
const CircularJSON = require('circular-json')
// https://www.npmjs.com/package/crypto-js
const CryptoJS = require("crypto-js")
var cryptoKey = "doraemon"
/*
// Encrypt
var ciphertext = CryptoJS.AES.encrypt('Hello~ Doraemon', cryptoKey);
console.log("ciphertext:" + ciphertext);

// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), cryptoKey);
var plaintext = bytes.toString(CryptoJS.enc.Utf8);
console.log("plaintext:" + plaintext);
*/

// COOLSMS Legacy START
// http://ksh-code.tistory.com/356
const request = require('async-request') 
const uniqid = require('uniqid')
const { HmacMD5 } = require('crypto-js')

async function sendSMS (data) { 
	const res = await request('https://api.coolsms.co.kr/sms/2/send', { 
		method: 'POST', 
		data 
	}) 
	console.log(res) 
}

async function newGroup (data) {
	const res = await request('https://api.coolsms.co.kr/sms/2/new_group', {
		method: 'GET',
		data	
	})
	console.log(res)
}

const apiKeyForSendSMS = 'NCSFQNXHVWYSPBCT'
const apiSecret = 'AB5QEGA6P8NN8QPGFQUDAPECBAGFFAMU' 
var timestamp = (Math.floor(Date.now() / 1000)).toString() 
var salt = uniqid() 
var signature = HmacMD5(timestamp + salt, apiSecret).toString()

// SEND SMS TEST
// sendSMS({ api_key: apiKeyForSendSMS, signature, salt, timestamp, to: '01032795690', from: '01032795690', text: 'Hello world!' })
// newGroup({ api_key: apiKeyForSendSMS, signature, salt, timestamp })
// COOLSMS Legacy END

// https://momentjs.com/docs/
const moment = require('moment')

const multer = require('multer')

const path = require('path');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(file)
      cb(null, 'journalImgs/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});

//////////////////////////////////////////////FOR HTTPS
// http://blog.saltfactory.net/implements-nodejs-based-https-server/
// https://coderwall.com/p/yo4mqw/creating-a-nodejs-express-https-server
var http = require('http'),
	// https = require('https'),
	fs = require('fs')

axios.defaults.timeout = 20000;

/*
var httpsOptions = {
	key: fs.readFileSync('key.pem')
	, cert: fs.readFileSync('cert.pem')
}
*/

var port1 = 8081
// var port2 = 443

var app = express()
// app.use(express.urlencoded())
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

http.createServer(app).listen(port1, function () {
	console.log('Http server listening on port ' + port1)
})

/*
https.createServer(httpsOptions, app).listen(port2, function () {
	console.log('Https server listening on port ' + port2)
})
*/

///////////////////////////////////////////////////////

var mongoose = require('mongoose')
// https://www.zerocho.com/category/MongoDB/post/59b6228e92f5830019d41ac4
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/fwjournal')
// mongoose.connect('mongodb://192.168.0.73:27017/fwjournal')
// http://mongoosejs.com/docs/connections.html
mongoose.connect('mongodb://journal:journal**@192.168.66.30:27017/fwjournal')
var db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

var User = require("../models/user")
var Land = require("../models/land")
var Dc = require("../models/detailClass")
var Sc = require("../models/smallClass")
var Mc = require("../models/mediumClass")
var Bc = require("../models/bigClass")
var Journal = require("../models/journal")
var Wc = require("../models/workClass")
var SsData = require("../models/sensorData")
var WcData = require("../models/wcData")
var SmsAuth = require("../models/smsAuth")
var JoinUser = require("../models/joinUser")
var LeaveUser = require("../models/leaveUser")
var Item = require("../models/item")

const serviceKey = '73Jjl5lZRvBRKkGsPnGmZ7EL9JtwsWNi3hhCIN8cpVJzMdRRgyzntwz2lHmTKeR1tp7NWzoihNGGazcDEFgh8w%3D%3D'
const serviceKeyForPrice = '8d8857fa9186167880dafee9a8c55dda0d2711b96cd4ae893983f7d870941d2e'

// https://www.zerocho.com/category/NodeJS/post/5950a6c4f7934c001894ea83
/*
app.post('/journalImg/upload', upload.single('file'), (req, res) => {
	// console.log(req.file);
	// console.log(req.body);
	res.status(200).json([{error: "uploaded successfully", imgName: req.file.filename}]);	
});
*/
// https://stackoverflow.com/questions/35847293/uploading-a-file-and-passing-a-additional-parameter-with-multer
app.post('/journalImg/upload', function(req, res) {
	// console.log(req.body)
    var storage = multer.diskStorage({
        destination: 'journalImgs/',
        filename: function (req, file, cb) {
	      cb(null, new Date().valueOf() + path.extname(file.originalname));
	    }	      
    });
    var upload = multer({storage : storage}).any();

    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        } else {
           // console.log(req.body);
           var fileName = ''
           req.files.forEach( function(f) {
             // console.log(f);
             fileName = f.filename
             // Move file to final destination...                                       
             var oldPath = f.path
             var newPath = 'journalImgs/' + req.body.userId
             if (!fs.existsSync(newPath)){
             	fs.mkdirSync(newPath);
			 }
			 newPath += '/' + f.filename
             fs.rename(oldPath, newPath, function (err) { if (err) throw err; console.log('renamed complete'); })
           });
           // res.end("File has been uploaded");           
           res.status(200).json([{error: "uploaded successfully", imgName: fileName}]);
        }
    });
});

// Fetch all data of wcData with aggregate
app.get('/wcData/getAllDataOfAggData/:startDate/:endDate', (req, res) => {
	WcData.aggregate([
		{
			"$unwind" : "$currentData"
		},
        {
            "$group" : {
                "_id" : { "$concat" : [ "$currentData.weather.baseDate", " ", "$currentData.weather.baseTime" ] },
                "baseDate": { "$first": '$currentData.weather.baseDate' },
			  	"baseTime": { "$first": '$currentData.weather.baseTime' },
              	"t1h": { "$first": '$currentData.weather.t1h' },
              	"reh": { "$first": '$currentData.weather.reh' },
              	"rn1": { "$first": '$currentData.weather.rn1' },
              	"pty": { "$first": '$currentData.weather.pty' },
              	"sky": { "$first": '$currentData.weather.sky' }
            }
        },
        {
            "$match" : {
                "_id" : { "$gte" : req.params.startDate, "$lte" : req.params.endDate }
            }
        },
        {
        	"$sort" : { "_id": 1 } 
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.send(result);
        }
    });
})

// Fetch wcData with aggregate
app.get('/wcData/getAggData/:startDate/:endDate', (req, res) => {
	// http://www.fun-coding.org/mongodb_advanced5.html
	// https://stackoverflow.com/questions/18785707/mongodb-aggregate-embedded-document-values
	// https://stackoverflow.com/questions/39158286/mongoose-aggregate-with-unwind-before-group
	WcData.aggregate([
		{
			"$unwind" : "$currentData"
		},
        {
            "$group" : {
                "_id" : { "$substr" : [ "$currentData.insertDate", 0, 10 ] },
                "t1hMin" : { "$min" : "$currentData.weather.t1h" },
	            "t1hMax" : { "$max" : "$currentData.weather.t1h" },
	            "t1hAvg" : { "$avg" : "$currentData.weather.t1h" },
	            "rehMin" : { "$min" : "$currentData.weather.reh" },
	            "rehMax" : { "$max" : "$currentData.weather.reh" },
	            "rehAvg" : { "$avg" : "$currentData.weather.reh" },
	            "sky": { "$first": '$currentData.weather.sky' },
	            "pty": { "$first": '$currentData.weather.pty' },
	            "rn1": { "$first": '$currentData.weather.rn1' }
            }
        },
        {
            "$match" : {
                "_id" : { "$gte" : req.params.startDate, "$lte" : req.params.endDate }
            }
        },
        {
        	"$sort" : { "_id": 1 } 
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.send(result);
        }
    });
})

// Fetch wcData with aggregate
app.get('/wcData/getWeatherAggDataByAddr/:startDate/:endDate/:address', (req, res) => {
	// http://www.fun-coding.org/mongodb_advanced5.html
	// https://stackoverflow.com/questions/18785707/mongodb-aggregate-embedded-document-values
	// https://stackoverflow.com/questions/39158286/mongoose-aggregate-with-unwind-before-group
	console.log(req.params)
	WcData.aggregate([
		{
			"$unwind" : "$currentData"
		},
        {
            "$group" : {
                "_id" : { date : { "$substr" : [ "$currentData.insertDate", 0, 10 ] }, address : "$address" },
                "t1hMin" : { "$min" : "$currentData.weather.t1h" },
	            "t1hMax" : { "$max" : "$currentData.weather.t1h" },
	            "t1hAvg" : { "$avg" : "$currentData.weather.t1h" },
	            "rehMin" : { "$min" : "$currentData.weather.reh" },
	            "rehMax" : { "$max" : "$currentData.weather.reh" },
	            "rehAvg" : { "$avg" : "$currentData.weather.reh" },
	            "sky": { "$first": '$currentData.weather.sky' },
	            "pty": { "$first": '$currentData.weather.pty' },
	            "rn1": { "$first": '$currentData.weather.rn1' }
            }
        },
        {
            "$match" : {
            	"$and" : [
            		{ "_id.date" : { "$gte" : req.params.startDate, "$lte" : req.params.endDate } },
            		{ "_id.address" : req.params.address }
            	]                
            }
        },
        {
        	"$sort" : { "_id.date": 1 } 
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.send(result);
        }
    });
})

// Fetch all data of sensorData with aggregate
app.get('/ssData/getAllDataOfAggData/:startDate/:endDate', (req, res) => {
	SsData.find({}, '', function (error, result) {
		if (error) { console.error(error); }
	    res.send(result)
	})
	.where('date').gte(req.params.startDate + " 00:00:00").lte(req.params.endDate + " 23:59:59")
})


// Fetch sensorData with aggregate
app.get('/ssData/getAggData/:startDate/:endDate', (req, res) => {
	console.log(req.body);
	// http://www.fun-coding.org/mongodb_advanced5.html
	// https://stackoverflow.com/questions/18785707/mongodb-aggregate-embedded-document-values
	// https://stackoverflow.com/questions/39158286/mongoose-aggregate-with-unwind-before-group
	SsData.aggregate([
        {
            "$group" : {
                "_id" : { "$substr" : [ "$date", 0, 8 ] },
                "temMin" : { "$min" : "$temperature" },
	            "temMax" : { "$max" : "$temperature" },
	            "temAvg" : { "$avg" : "$temperature" },
	            "humMin" : { "$min" : "$humidity" },
	            "humMax" : { "$max" : "$humidity" },
	            "humAvg" : { "$avg" : "$humidity" },
	            "co2Min" : { "$min" : "$co2" },
	            "co2Max" : { "$max" : "$co2" },
	            "co2Avg" : { "$avg" : "$co2" }
            }
        },
        {
            "$match" : {
                "_id" : { "$gte" : req.params.startDate, "$lte" : req.params.endDate }
            }
        },
        {
        	"$sort" : { "_id": 1 } 
        }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.send(result);
        }
    });
})

// Fetch sensorData
app.get('/ssData/lastOne', (req, res) => {
	// https://stackoverflow.com/questions/4421207/mongodb-how-to-get-the-last-n-records
	// db.getCollection("sensordatas").find().skip(db.getCollection("sensordatas").count() - 1)
	SsData.count({}, function( err, count){
	    SsData.find({}, 'index temperature humidity co2 date', function (error, sensorDatas) {
	    	res.send(sensorDatas)
	    })
	    .skip(count - 1)
	})
})

function getTodayDate() {
	var todayDate = new Date()
	var todayDateValue = ''
	todayDateValue = leadingZeros(todayDate.getFullYear(), 4) + 
			   		 leadingZeros(todayDate.getMonth() + 1, 2) +
			   		 leadingZeros(todayDate.getDate(), 2)
	return todayDateValue
}

// Fetch agriculture product price
// https://data.mafra.go.kr
// http://211.237.50.150:7080/openapi/8d8857fa9186167880dafee9a8c55dda0d2711b96cd4ae893983f7d870941d2e/xml/Grid_20141221000000000120_1/1/5?PRDLST_NM=%EB%94%B8%EA%B8%B0
app.get('/getProductPrice/:productName', (req, res) => {
	var searchText = encodeURIComponent(req.params.searchText)
	var version = '3.0.0-fwjournal'
	var domain = 'www.ezinfotech.co.kr'
	var productCode = ''
	axios.get('http://211.237.50.150:7080/openapi/' + serviceKeyForPrice +
		'/json/Grid_20141221000000000120_1/1/5' +
		'?PRDLST_NM=' + encodeURIComponent(req.params.productName))
  	.then(function (response) {
  		// console.log(response.data)
  		if (0 == response.data.Grid_20141221000000000120_1.totalCnt) {
  			// console.log('totalCnt is 0')
  			res.send(false)
  			return
  		}
  		productCode = response.data.Grid_20141221000000000120_1.row[0].PRDLST_CD
  		// http://211.237.50.150:7080/openapi/8d8857fa9186167880dafee9a8c55dda0d2711b96cd4ae893983f7d870941d2e/xml/Grid_20150401000000000216_1/1/5?AUCNG_DE=20180613&PRDLST_CD=0804
  		axios.get('http://211.237.50.150:7080/openapi/' + serviceKeyForPrice +
  			'/json/Grid_20150401000000000216_1/1/5?AUCNG_DE=' + getTodayDate() + 
  			'&PRDLST_CD=' + productCode)
  		.then(function (response) {
  			// console.log(response.data)
  			if (0 == response.data.Grid_20150401000000000216_1.totalCnt) {
	  			// console.log('totalCnt is 0')
	  			res.send(false)
	  			return
	  		}

  			res.send(response.data)
  		}).catch(function (error) {
  			console.log(error)
  		})
  	}).catch(function (error) {
    	console.log(error)
  })
})

// Fetch address
// https://www.poesis.org/postcodify/guide/appdev
// https://api.poesis.kr/post/search.php?q=검색어&v=버전&ref=도메인
app.get('/getAddress/:searchText', (req, res) => {
	var searchText = encodeURIComponent(req.params.searchText)
	var version = '3.0.0-fwjournal'
	var domain = 'www.ezinfotech.co.kr'

	axios.get('https://api.poesis.kr/post/search.php?q=' + searchText +
		'&v=' + version +
		'&ref=' + domain)
  	.then(function (response) {  		
  		res.send(response.data)
  		//res.send(CircularJSON.stringify(response.data))
  }).catch(function (error) {
    console.log(error)
  })
})

function getTodayBaseTime() {
	var todayDate = new Date()
	var currentHour = todayDate.getHours()
	var currentMin = todayDate.getMinutes()
	var baseDate = ''
	var baseTime = ''

	if(40 <= currentMin) {
		if(6 <= currentHour) {
			baseDate = leadingZeros(todayDate.getFullYear(), 4) + 
					   leadingZeros(todayDate.getMonth() + 1, 2) +
					   leadingZeros(todayDate.getDate(), 2)
			baseTime = leadingZeros(currentHour, 2) + '00'
		} else if(6 > currentHour) {
			var yesterdayDate = new Date()
			yesterdayDate.setDate(yesterdayDate.getDate() - 1)
			baseDate = leadingZeros(yesterdayDate.getFullYear(), 4) + 
					   leadingZeros(yesterdayDate.getMonth() + 1, 2) +
					   leadingZeros(yesterdayDate.getDate(), 2)
			baseTime = '2300'
		}
	} else if(40 > currentMin) {
		if(6 <= currentHour) {
			baseDate = leadingZeros(todayDate.getFullYear(), 4) + 
					   leadingZeros(todayDate.getMonth() + 1, 2) +
					   leadingZeros(todayDate.getDate(), 2)
			baseTime = leadingZeros((currentHour-1), 2) + '00'
		} else if(6 > currentHour) {
			var yesterdayDate = new Date()
			yesterdayDate.setDate(yesterdayDate.getDate() - 1)
			baseDate = leadingZeros(yesterdayDate.getFullYear(), 4) + 
					   leadingZeros(yesterdayDate.getMonth() + 1, 2) +
					   leadingZeros(yesterdayDate.getDate(), 2)
			baseTime = '2300'
		}
	}
	// console.log(baseDate + ' ' + baseTime)
	return baseDate + '' + baseTime
}

// Fetch weather data
app.get('/ForecastGrib/:nx/:ny', (req, res) => {
	var baseDateTime = getTodayBaseTime()
	var baseDate = baseDateTime.substring(0, 8)
	var baseTime = baseDateTime.substring(8, 12)

	axios.get('http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib?serviceKey=' + serviceKey +
		'&base_date=' + baseDate +
		'&base_time=' + baseTime +
		'&nx=' + req.params.nx +
		'&ny=' + req.params.ny +
		'&numOfRows=10&pageSize=10&pageNo=1&startPage=1&_type=json')
  	.then(function (response) {  		
  		res.send(response.data.response.body.items)
  		// res.send(CircularJSON.stringify(response.data.response.body))
  }).catch(function (error) {
    console.log(error)
  })
})

// Fetch weather data with date, time, nx, ny
app.get('/ForecastGrib/:baseDate/:baseTime/:nx/:ny', (req, res) => {
	axios.get('http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib?serviceKey=' + serviceKey +
		'&base_date=' + req.params.baseDate +
		'&base_time=' + req.params.baseTime +
		'&nx=' + req.params.nx +
		'&ny=' + req.params.ny +
		'&numOfRows=10&pageSize=10&pageNo=1&startPage=1&_type=json')
  	.then(function (response) {
  		res.send(response.data)
  		// res.send(CircularJSON.stringify(response.data.response.body))
  }).catch(function (error) {
    console.log(error)
  })
})

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

function getBaseTime(currentHour) {
	var dateRange = [2, 5, 8, 11, 14, 17, 20, 23]
	var todayYYYYMMDD = ''
	var baseHour = 0
	var baseDate = ''
	for(var i = 0; i < dateRange.length; i++) {
		if (currentHour == dateRange[i]) {
			var todayDate = new Date()
			todayYYYYMMDD = leadingZeros(todayDate.getFullYear(), 4) + 
							leadingZeros(todayDate.getMonth() + 1, 2) +
							leadingZeros(todayDate.getDate(), 2)
			baseHour = dateRange[i]
		}
	}

	if (currentHour < 2) {
		var todayDate = new Date()
		todayDate.setDate(todayDate.getDate() - 1)
		todayYYYYMMDD = leadingZeros(todayDate.getFullYear(), 4) + 
						leadingZeros(todayDate.getMonth() + 1, 2) +
						leadingZeros(todayDate.getDate(), 2)
		baseHour = 23
	} else if(currentHour > 23) {
		var todayDate = new Date()
		todayYYYYMMDD = leadingZeros(todayDate.getFullYear(), 4) + 
						leadingZeros(todayDate.getMonth() + 1, 2) +
						leadingZeros(todayDate.getDate(), 2)
		baseHour = 23
	}

	if (0 != baseHour) {
		return todayYYYYMMDD + '' + leadingZeros(baseHour, 2)
	} else {
		var todayDate = new Date()
		todayYYYYMMDD = leadingZeros(todayDate.getFullYear(), 4) + 
						leadingZeros(todayDate.getMonth() + 1, 2) +
						leadingZeros(todayDate.getDate(), 2)

		if (currentHour < 11) {
			if (currentHour < 5) {
				baseHour = 2
			} else if (currentHour > 8) {
				baseHour = 8
			} else if (5 < currentHour && currentHour < 8) {
				baseHour = 5
			}
		} else if (currentHour > 14) {
			if (currentHour < 17) {
				baseHour = 14
			} else if (currentHour > 20) {
				baseHour = 20
			} else if (17 < currentHour && currentHour < 20) {
				baseHour = 17
			}
		} else if (11 < currentHour && currentHour < 14) {
			baseHour = 11
		}
	}
	return todayYYYYMMDD + '' + leadingZeros(baseHour, 2)
}

// Fetch weather (tomorrown, afterTomorrow) data
app.get('/ForecastSpaceData/:nx/:ny', (req, res) => {
	var todayDate = new Date()
	var currentHour = todayDate.getHours()
	var baseDateTime = getBaseTime(currentHour)
	var baseDate = baseDateTime.substring(0, 8)
	var baseTime = baseDateTime.substring(8, 10) + '00'
	
	axios.get('http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData?serviceKey=' + serviceKey +
		'&base_date=' + baseDate +
		'&base_time=' + baseTime +
		'&nx=' + req.params.nx +
		'&ny=' + req.params.ny +
		'&numOfRows=500&pageSize=500&pageNo=1&startPage=1&_type=json')
  	.then(function (response) {  		
  		res.send(response.data.response.body.items)
  	}).catch(function (error) {
    	console.log(error)
  	})
})

// Fetch air data
app.get('/Airdata/:tmX/:tmY', (req, res) => {
	var stationName = ''
	axios.get('http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getNearbyMsrstnList?' +
		'tmX=' + req.params.tmX +
		'&tmY=' + req.params.tmY +
		'&pageNo=1&numOfRows=10' +
		'&ServiceKey=' + serviceKey +
		'&_returnType=json')
	.then(function (response) {
		stationName = response.data.list[response.data.list.length-1].stationName
		axios.get('http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty' +
			'?numOfRows=10' +
			'&pageNo=1' +
			'&stationName=' + encodeURIComponent(stationName) +
			'&dataTerm=DAILY' +
			'&ver=1.3' +
			'&ServiceKey=' + serviceKey +
			'&_returnType=json')
		.then(function (response2) {
			res.send(response2.data.list[0])
		}).catch(function (error) {
			console.log(error)
		})
	}).catch(function (error) {
    	console.log(error)
  	})
})

// Fetch workCode by _id
app.get('/wc/getWCById/:id', (req, res) => {
  Wc.find({}, '_id text bCode mCode sCode wCode', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs[0].bCode + wcs[0].mCode + wcs[0].sCode + wcs[0].wCode)
  })
  .where('_id').equals(req.params.id)
})

// Fetch _id by workCode 
app.get('/wc/getIdByWC/:code', (req, res) => {
  var db = req.db
  var code = req.params.code
  var bc = code.substring(0, 3)
  var mc = code.substring(3, 7)
  var sc = code.substring(7, 11)
  var wc = code.substring(11, 15)
  Wc.find({}, '_id text bCode mCode sCode wCode', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs)
  })
  .where('bCode').equals(bc)
  .where('mCode').equals(mc)
  .where('sCode').equals(sc)
  .where('wCode').equals(wc)
})

// Fetch _id by workCode 
app.get('/wc/getIdByWC2/:code', (req, res) => {  
  var code = req.params.code  
  Wc.find({}, '', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs)
  })  
  .where('wCode').equals(code)
})

// Fetch workcalss text by cropCode
app.get('/wc/getWCsByWc/:code', (req, res) => {  
  var wCode = req.params.code
  Wc.find({}, '', function (error4, wcs) {
	if (error4) { console.error(error4); }
	Wc.find({}, 'wCode text', function (error3, wcs2) {
		if (error3) { console.error(error3); }
		res.send(wcs2)
	})
	.where('bCode').equals(wcs[0].bCode)
	// res.send(wcs)
  })
  .where('wCode').equals(wCode)
})

// Fetch work codes as item
app.get('/wc/getWCsAsItem', (req, res) => {  
  // var wCode = req.params.code
  Wc.find({}, '', function (error4, wcs) {
	if (error4) { console.error(error4); }	
	res.send(wcs)
  })
  .where('asItem').equals('1')
})

// Fetch workcalss text by cropCode
app.get('/wc/getTxtByCC3/:code', (req, res) => {  
  var dCode = req.params.code
  Dc.find({}, '', function (error, dcs) {
  	if (error) { console.error(error); }
  	// res.send(dcs[0].sCode)  	
  	Sc.find({}, '', function (error2, scs) {
  		if (error2) { console.error(error2); }
  		// res.send(scs[0].mCode)
  		Mc.find({}, '', function (error3, mcs) {
  			if (error3) { console.error(error3); }
  			// res.send(mcs[0].bCode)
  			Wc.find({}, '', function (error4, wcs) {
  				if (error4) { console.error(error4); }
  				res.send(wcs)
  			}).where('bCode').equals(mcs[0].bCode)
  			  .where('asItem').equals('1')
  		}).where('mCode').equals(scs[0].mCode)
  	})
  	.where('sCode').equals(dcs[0].sCode)
  })
  .where('dCode').equals(dCode)
})

// Fetch workcalss text by cropCode
app.get('/wc/getTxtByCC2/:code', (req, res) => {  
  var dCode = req.params.code
  Dc.find({}, '', function (error, dcs) {
  	if (error) { console.error(error); }
  	// res.send(dcs[0].sCode)  	
  	Sc.find({}, '', function (error2, scs) {
  		if (error2) { console.error(error2); }
  		// res.send(scs[0].mCode)
  		Mc.find({}, '', function (error3, mcs) {
  			if (error3) { console.error(error3); }
  			// res.send(mcs[0].bCode)
  			Wc.find({}, '', function (error4, wcs) {
  				if (error4) { console.error(error4); }
  				res.send(wcs)
  			}).where('bCode').equals(mcs[0].bCode)
  		}).where('mCode').equals(scs[0].mCode)
  	})
  	.where('sCode').equals(dcs[0].sCode)
  })
  .where('dCode').equals(dCode)
})

// Fetch workcalss text by cropCode
app.get('/wc/getTxtByCC/:code', (req, res) => {
  var db = req.db
  var code = req.params.code
  var bc = code.substring(0, 3)
  var mc = code.substring(3, 7)
  var sc = code.substring(7, 11)
  Wc.find({}, 'text bCode mCode sCode wCode', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs)
  })
  .where('bCode').equals(bc)
  .where('mCode').equals(mc)
  .where('sCode').equals(sc)
})

// Fetch workclass text by code
app.get('/wc/getText/:code', (req, res) => {
  var db = req.db
  var code = req.params.code
  var bc = code.substring(0, 3)
  var mc = code.substring(3, 7)
  var sc = code.substring(7, 11)
  var wc = code.substring(11, 15)
  Wc.find({}, 'text', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs)
  })
  .where('bCode').equals(bc)
  .where('mCode').equals(mc)
  .where('sCode').equals(sc)
  .where('wCode').equals(wc)
})

// Fetch workclass text by code
app.get('/wc/getTextByCcode/:code', (req, res) => {  
  var code = req.params.code
  
  Wc.find({}, '', function (error, wcs) {
    if (error) { console.error(error); }
    Wc.find({}, '', function (error2, wcs2) {
    	if (error2) { console.error(error2); }
    	res.send(wcs2)
    }).where('bCode').equals(wcs[0].bCode)
    // res.send(wcs)
  })  
  .where('wCode').equals(code)
})

// Fetch workclass text by code
app.get('/wc/getOneTextByCcode/:code', (req, res) => {  
  var code = req.params.code
  
  Wc.find({}, '', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs)
  })  
  .where('wCode').equals(code)
})

// Fetch workClass by bCode, mCode, sCode
app.get('/wc/:bCode/:mCode/:sCode', (req, res) => {
  Wc.find({}, '', function (error, wcs) {
    if (error) { console.error(error); }
    if (0 == wcs.length) {
    	console.log('wcs is zero')
    	Wc.find({}, '', function (error2, wcs2) {
    		if (error2) { console.error(error2); }
    		res.send(wcs2)
    	})
    	.where('bCode').equals(req.params.bCode)
    	.sort({wCode:-1})
    } else {
    	console.log('wcs is not zero')
    	res.send(wcs)
    }    
  })
  .where('bCode').equals(req.params.bCode)
  .where('mCode').equals(req.params.mCode)
  .where('sCode').equals(req.params.sCode)
  .sort({wCode:-1})
})

// Fetch max workClass
app.get('/wc/getMaxWcs', (req, res) => {
  Wc.find({}, '', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs)
  })
  .where('wCode').regex('W')  
  .sort({wCode:-1})
})

// Fetch duplicated workClass
app.get('/wc/getSameWc/:workTypeText', (req, res) => {
  Wc.find({}, '', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs)
  })
  .where('text').equals(req.params.workTypeText)
})

// Fetch workClass with BCP
app.get('/wc/getBCP', (req, res) => {	  
  Wc.distinct('text', {bCode:'BCP'}, function  (error, wcs) {
  	if (error) { console.error(error); }
  	res.send(wcs)
  })
})

// Fetch BCP detail
app.get('/wc/getBCPDetail/:bcpText', (req, res) => {	  
	Wc.findOne({bCode:'BCP', text: req.params.bcpText}, '', function (error, wcs) {
		if (error) { console.error(error) }
		res.send(wcs)
	})
})

// Fetch workClass with BAL
app.get('/wc/getBAL', (req, res) => {	  
  Wc.distinct('text', {bCode:'BAL'}, function  (error, wcs) {
  	if (error) { console.error(error); }
  	res.send(wcs)
  })
})

// Fetch BAL detail
app.get('/wc/getBALDetail/:balText', (req, res) => {	  
	Wc.findOne({bCode:'BAL', text: req.params.balText}, '', function (error, wcs) {
		if (error) { console.error(error) }
		res.send(wcs)
	})
})

// Add new workClass
app.post('/wc', (req, res) => {
  // console.log(req.body);
  var bCode = req.body.bCode;
  var mCode = req.body.mCode;
  var sCode = req.body.sCode;
  var wCode = req.body.wCode;
  var text = req.body.text;
  var asItem = req.body.asItem;

  var new_wc = new Wc({
    bCode: bCode,
    mCode: mCode,
    sCode: sCode,
    wCode: wCode,
    text: text,
    asItem: asItem
  })

  new_wc.save(function (error, result) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Wc saved successfully!',
      result: result
    })
  })
})

// Update journal
app.put('/journals/:id', (req, res) => { 
  console.log(req.body)  
  Journal.findById(req.params.id, '', function (error, journals) {
    if (error) { console.error(error); }

    journals.userId = req.body.userId;
    journals.date = req.body.date;
    journals.landId = req.body.landId;
    journals.workCode = req.body.workCode;
    journals.workContent = req.body.workContent;
    journals.workTime = req.body.workTime;
    journals.workerNumber = req.body.workerNumber;
    journals.remarks = req.body.remarks;
    journals.COO = req.body.coo;
    journals.shipment = req.body.shipment;
    journals.income = req.body.income;
    journals.usage = req.body.usage;
    journals.output = req.body.output;
    journals.pictureA = req.body.pictureA;
    journals.pictureB = req.body.pictureB;
    journals.pictureC = req.body.pictureC;    

    journals.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })  
})

// Delete journal
app.delete('/journals/:id', (req, res) => {
	var db = req.db
	Journal.remove({
		_id: req.params.id
	}, function(err, lands) {
		if (err) {
			res.send(err)
		}
		res.send({
			success: true
		})
	})
})

// Fetch journals by userId, startDate, endDate, landId
app.get('/journals/searchWorktime/:userId/:startDate/:endDate/:landId', (req, res) => {  
  // console.log(req.params)
  var query = Journal.find({})
  if(0 != req.params.startDate) {
  	query.where('date').gte(req.params.startDate)
  }
  if(0 != req.params.endDate) {
  	query.where('date').lte(req.params.endDate)
  }

  var userId = req.params.userId
  var landId = req.params.landId
 
  if(0 != userId) {
  	query.where('userId').equals(userId)
  }
  if(0 != landId) {
  	query.where('landId').equals(landId)
  }

  query.sort( { 'date': 1 } )

  query.exec().then(result => {
  	res.send(result)
  })
})

// Fetch journals by date, workType
app.get('/journals/searchBy3/:startDate/:endDate/:searchWord', (req, res) => {  
  // console.log(req.params)
  var query = Journal.find({})
  if(0 != req.params.startDate) {
  	query.where('date').gte(req.params.startDate)
  }
  if(0 != req.params.endDate) {
  	query.where('date').lte(req.params.endDate)
  }

  var searchWord = req.params.searchWord  
  if(0 != req.params.searchWord) {
  	query.where('workContent').regex(searchWord)  	
  }

  query.exec().then(result => {
  	res.send(result)
  })
})

// Fetch journals by date, workType, workContent
app.get('/journals/searchBy4/:startDate/:endDate/:workType/:workContent', (req, res) => {
  var db = req.db
  // console.log(req.params)
  var query = Journal.find({})
  if(0 != req.params.startDate) {
  	query.where('date').gte(req.params.startDate)
  }
  if(0 != req.params.endDate) {
  	query.where('date').lte(req.params.endDate)
  }

  var tmpWorkTypePrefix = req.params.workType.substring(0, 3)
  var tmpWorkTypeSuffix = req.params.workType.substring(3, 8)
 
  if(0 != req.params.workType) {
  	query.where('workCode').regex(tmpWorkTypePrefix)
  	query.where('workCode').regex(tmpWorkTypeSuffix)
  }
  if(0 != req.params.workContent) {
  	query.where('workContent').regex(req.params.workContent)
  }

  query.exec().then(result => {
  	res.send(result)
  })
})

// Fetch journals by date, workType, landId
app.get('/journals/searchBy4LandId/:startDate/:endDate/:searchWord/:landId', (req, res) => {
  // console.log(req.params)
  var query = Journal.find({})
  if(0 != req.params.startDate) {
  	query.where('date').gte(req.params.startDate)
  }
  if(0 != req.params.endDate) {
  	query.where('date').lte(req.params.endDate)
  }

  var searchWord = req.params.searchWord  
  if(0 != req.params.searchWord) {
  	query.where('workContent').regex(searchWord)  	
  }

  if(0 != req.params.landId) {
  	query.where('landId').equals(req.params.landId)
  }

  query.exec().then(result => {
  	res.send(result)
  })
})

// Fetch journals by year, month
app.get('/journals/searchByYM/:ym', (req, res) => {
  console.log(req.params)
  Journal.find({}, 'userId date landId workCode workContent workSTime workETime weather remarks', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('date').regex(req.params.ym)
})

// Fetch journals by year, month, userId
app.get('/journals/searchByYMUserId/:ym/:userId', (req, res) => {
  console.log(req.params)
  Journal.find({}, '', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('date').regex(req.params.ym)
  .where('userId').equals(req.params.userId)
})

// Fetch journals by year, month, userId, landId
app.get('/journals/searchByYMUserIdLandId/:ym/:userId/:landId', (req, res) => {
  console.log(req.params)
  Journal.find({}, '', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('date').regex(req.params.ym)
  .where('userId').equals(req.params.userId)
  .where('landId').equals(req.params.landId)
})

// Fetch journals by date
app.get('/journals/:startDate/:endDate', (req, res) => {
  var db = req.db
  console.log(req.params)
  Journal.find({}, 'userId date landId workCode workContent workSTime workETime weather remarks', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('date').gte(req.params.startDate).lte(req.params.endDate)
})

// Fetch journals by date & userId
app.get('/journals/:startDate/:endDate/:userId', (req, res) => {
  console.log(req.params)
  Journal.find({}, '', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('date').gte(req.params.startDate).lte(req.params.endDate)
  .where('userId').equals(req.params.userId)
})

// Fetch journals by date & userId
app.get('/journalsByYMNUserId/:startYM/:endYM/:userId', (req, res) => {
  console.log(req.params)
  Journal.find({}, '', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('date').gte(req.params.startYM + '-01 00:00:00').lte(req.params.endYM + '-31 23:59:59')
  .where('userId').equals(req.params.userId)
  .where('income.amount').ne('')
  .where('income.amount').ne(null)
})

// Fetch journals by date & userId & Coo.cost != null
app.get('/journalsByYMNUserIdAndCoo/:startYM/:endYM/:userId', (req, res) => {
  console.log(req.params)
  Journal.find({}, '', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('date').gte(req.params.startYM + '-01 00:00:00').lte(req.params.endYM + '-31 23:59:59')
  .where('userId').equals(req.params.userId)
  .where('COO.cost').ne('')
  .where('COO.cost').ne(null)
  .sort({'date': 1})
})

// Fetch journals by date, userId, landId
app.get('/journals/searchBy4_2/:startDate/:endDate/:userId/:landId', (req, res) => {  
  console.log(req.params)
  var query = Journal.find({})
  if(0 != req.params.startDate) {
  	query.where('date').gte(req.params.startDate)
  }
  if(0 != req.params.endDate) {
  	query.where('date').lte(req.params.endDate)
  }  
  if(0 != req.params.userId) {
  	query.where('userId').equals(req.params.userId)
  }
  if(0 != req.params.landId) {
  	query.where('landId').regex(req.params.landId)
  }

  query.exec().then(result => {
  	res.send(result)
  })
})

// Fetch journals by userId
app.get('/journals/:userId', (req, res) => {
  var db = req.db
  Journal.find({}, '', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('userId').equals(req.params.userId)
})

// Fetch journal by id
app.get('/journal/:id', (req, res) => {
  var db = req.db
  Journal.find({}, '', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('_id').equals(req.params.id)
})

// Add new journal
app.post('/journals', (req, res) => {
  // console.log(req.body);
  var db = req.db;
  var userId = req.body.userId;
  var date = req.body.date;
  var landId = req.body.landId;
  var workCode = req.body.workCode;
  var workContent = req.body.workContent;
  var workSTime = req.body.workSTime;
  var workETime = req.body.workETime;
  var weather = [];
  for(var i = 0; i < req.body.weather.length; i++) {
  	weather[i] = new Object();
  	weather[i].baseTime = req.body.weather[i].baseTime;
  	weather[i].sky = req.body.weather[i].sky;
  	weather[i].t1h = req.body.weather[i].t1h;
  	weather[i].reh = req.body.weather[i].reh;
  	weather[i].rn1 = req.body.weather[i].rn1;
  }
  var remarks = req.body.remarks

  var new_journal = new Journal({
    userId: userId,
    date: date,
    landId: landId,
    workCode: workCode,
    workContent: workContent,
    workSTime: workSTime,
    workETime: workETime,
    weather: weather,
    remarks: remarks
  })

  new_journal.save(function (error, result) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Journal saved successfully!',
      result: result
    })
  })
})

// Add new journal
app.post('/journal', (req, res) => {
  console.log(req.body);  
  var userId = req.body.userId;
  var date = req.body.date;
  var landId = req.body.landId;
  var workCode = req.body.workCode;
  var workContent = req.body.workContent;
  var workTime = req.body.workTime;
  var workerNumber = req.body.workerNumber;
  var weather = req.body.weather;
  var remarks = req.body.remarks;
  var coo = req.body.coo;
  var shipment = req.body.shipment;
  var income = req.body.income;
  var usage = req.body.usage;
  var output = req.body.output;
  var pictureA = req.body.pictureA;
  var pictureB = req.body.pictureB;
  var pictureC = req.body.pictureC;
  /*
  for(var i = 0; i < req.body.coo.length; i++) {
  	coo[i] = new Object();
  	coo[i].minT1H = req.body.coo[i].minT1H;
  	coo[i].sky = req.body.weather[i].sky;
  	coo[i].t1h = req.body.weather[i].t1h;
  	coo[i].reh = req.body.weather[i].reh;
  	coo[i].rn1 = req.body.weather[i].rn1;
  }
  */

  /*
  var weather = [];
  for(var i = 0; i < req.body.weather.length; i++) {
  	weather[i] = new Object();
  	weather[i].baseTime = req.body.weather[i].baseTime;
  	weather[i].sky = req.body.weather[i].sky;
  	weather[i].t1h = req.body.weather[i].t1h;
  	weather[i].reh = req.body.weather[i].reh;
  	weather[i].rn1 = req.body.weather[i].rn1;
  }
  var remarks = req.body.remarks
  */

  var new_journal = new Journal({
    userId: userId,
    date: date,
    landId: landId,
    workCode: workCode,
    workContent: workContent,
    workTime: workTime,
    workerNumber: workerNumber,
    weather: weather,
    remarks: remarks,
    COO: coo,
    shipment: shipment,
    income: income,
    usage: usage,
    output: output,
    pictureA: pictureA,
    pictureB: pictureB,
    pictureC: pictureC
  })

  new_journal.save(function (error, result) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Journal saved successfully!',
      result: result
    })
  })
})

// Fetch smallClass by dCode
app.get('/scByDcode/:dCode', (req, res) => {
  Dc.find({}, '', function (error, dcs) {
    if (error) { console.error(error); }
    res.send({
      dcs: dcs
    })
  })
  .where('dCode').equals(req.params.dCode)
  .sort({text:1})
})

// Fetch detailClass by sCode
app.get('/dcByScode/:sCode', (req, res) => {
  Dc.find({}, 'sCode dCode text', function (error, dcs) {
    if (error) { console.error(error); }
    res.send({
      dcs: dcs
    })
  })
  .where('sCode').equals(req.params.sCode)
  .sort({text:1})
})

// Fetch cropName by cropCode
app.get('/dc/getCN/:cropCode', (req, res) => {
  var db = req.db
  var cropCode = req.params.cropCode
  
  Dc.find({}, 'sCode dCode text', function (error, scs) {
    if (error) { console.error(error); }
    res.send(scs)
  })  
  .where('dCode').equals(cropCode)
})

// Fetch smallClass by sCode
app.get('/scByScode/:sCode', (req, res) => {
  Sc.find({}, 'mCode sCode text', function (error, scs) {
    if (error) { console.error(error); }
    res.send({
      scs: scs
    })
  })
  .where('sCode').equals(req.params.sCode)
  .sort({text:1})
})

// Fetch smallClass by mCode
app.get('/scByMcode/:mCode', (req, res) => {
  Sc.find({}, 'mCode sCode text', function (error, scs) {
    if (error) { console.error(error); }
    res.send({
      scs: scs
    })
  })
  .where('mCode').equals(req.params.mCode)
  .sort({text:1})
})

// Fetch midiumClass by sCode
app.get('/mcByScode/:sCode', (req, res) => {
  Sc.find({}, '', function (error, scs) {
    if (error) { console.error(error); }
    res.send({
      scs: scs
    })
  })
  .where('sCode').equals(req.params.sCode)
  .sort({text:1})
})

// Fetch cropName by cropCode
app.get('/sc/getCN/:cropCode', (req, res) => {
  var db = req.db
  var cropCode = req.params.cropCode
  var bc = cropCode.substring(0, 3)
  var mc = cropCode.substring(3, 7)
  var sc = cropCode.substring(7, 11)
  Sc.find({}, 'bCode mCode sCode text', function (error, scs) {
    if (error) { console.error(error); }
    res.send(scs)
  })
  .where('bCode').equals(bc)
  .where('mCode').equals(mc)
  .where('sCode').equals(sc)
})

// Fetch single smallClass
app.get('/sc/:cropName', (req, res) => {
  var db = req.db
  Sc.find({}, 'bCode mCode sCode text', function (error, scs) {
    if (error) { console.error(error); }
    res.send(scs)
  })
  .where('text').equals(req.params.cropName)
})

// Fetch smallClass by bCode, mCode
app.get('/sc/:bCode/:mCode', (req, res) => {
  Sc.find({}, 'bCode mCode sCode text', function (error, scs) {
    if (error) { console.error(error); }
    res.send({
      scs: scs
    })
  })
  .where('bCode').equals(req.params.bCode)
  .where('mCode').equals(req.params.mCode)
  .sort({text:1})
})

// Fetch all smallClass
app.get('/sc', (req, res) => {
  Sc.find({}, 'bCode mCode sCode text', function (error, scs) {
    if (error) { console.error(error); }
    res.send({
      scs: scs
    })
  })
  .sort({text:1})
})

// Fetch mediumClass by mCode
app.get('/mcByMcode/:mCode', (req, res) => {
  Mc.find({}, 'bCode mCode text', function (error, mcs) {
    if (error) { console.error(error); }
    res.send({
      mcs: mcs
    })
  })
  .where('mCode').equals(req.params.mCode)
  .sort({text:1})
})

// Fetch bigClass by mCode
app.get('/bcByMcode/:mCode', (req, res) => {
  Mc.find({}, '', function (error, mcs) {
    if (error) { console.error(error); }
    res.send({
      mcs: mcs
    })
  })
  .where('mCode').equals(req.params.mCode)
  .sort({text:1})
})

// Fetch mediumClass by bCode
app.get('/mc/:bCode', (req, res) => {
  Mc.find({}, 'bCode mCode text', function (error, mcs) {
    if (error) { console.error(error); }
    res.send({
      mcs: mcs
    })
  })
  .where('bCode').equals(req.params.bCode)
  .sort({text:1})
})

// Fetch mediumClass text by bCode mCode
app.get('/mc/:bCode/:mCode', (req, res) => {
  Mc.find({}, 'bCode mCode text', function (error, mcs) {
    if (error) { console.error(error); }
    res.send({
      mcs: mcs
    })
  })
  .where('bCode').equals(req.params.bCode)
  .where('mCode').equals(req.params.mCode)
  .sort({text:1})
})

// Fetch all mediumClass
app.get('/mc', (req, res) => {
  Mc.find({}, 'bCode mCode text', function (error, mcs) {
    if (error) { console.error(error); }
    res.send({
      mcs: mcs
    })
  })
  .sort({text:1})
})

// Fetch all bigClass
app.get('/bc', (req, res) => {
  Bc.find({}, 'bCode text', function (error, bcs) {
    if (error) { console.error(error); }
    res.send({
      bcs: bcs
    })
  })
  .sort({text:1})
})

// Fetch bigClass text by bCode
app.get('/bc/:bCode', (req, res) => {
  Bc.find({}, 'bCode text', function (error, bcs) {
    if (error) { console.error(error); }
    res.send({
      bcs: bcs
    })
  })
  .where('bCode').equals(req.params.bCode)
  .sort({text:1})
})

// Fetch name by landId
app.get('/lands/getName/:id', (req, res) => {
  Land.find({}, '', function (error, lands) {
    if (error) { console.error(error); }
    res.send(lands)
  })
  .where('_id').equals(req.params.id)
})

// Fetch name by landId
app.get('/lands/getCropName/:id', (req, res) => {
  Land.find({}, '', function (error, lands) {
    if (error) { console.error(error); }
    // res.send(lands[0].cropCode)    
    Dc.find({}, '', function (error2, dcs) {
    	if (error2) { console.error(error2); }
    	res.send(dcs)
    })
    .where('dCode').equals(lands[0].cropCode)    
  })
  .where('_id').equals(req.params.id)
})

// Fetch cropCode by landId
app.get('/lands/getCC/:id', (req, res) => {
  Land.find({}, '', function (error, lands) {
    if (error) { console.error(error); }
    res.send(lands)
  })
  .where('_id').equals(req.params.id)
})

// Add new land
app.post('/lands', (req, res) => {
  var db = req.db;
  var userId = req.body.userId;
  var name = req.body.name;
  var address = req.body.address;
  var size = req.body.size;
  var sizeDetail = req.body.sizeDetail;
  var cropCode = req.body.cropCode;
  var new_land = new Land({
    userId: userId,
    name: name,
    address: address,
    size: size,
    sizeDetail: sizeDetail,
    cropCode: cropCode
  })

  new_land.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Land saved successfully!'
    })
  })
})

// Fetch all lands by userId
app.get('/lands/:id', (req, res) => {
  console.log(req.params)
  Land.find({}, 'userId name address size sizeDetail cropCode', function (error, lands) {
    if (error) { console.error(error); }
    res.send({
      lands: lands
    })
  })
  .where('userId').equals(req.params.id)
  .sort({_id:-1})
})

// Update land
app.put('/lands/:id', (req, res) => {
  console.log(req.body)
  Land.findById(req.params.id, 'userId name', function (error, lands) {
    if (error) { console.error(error); }
    lands.name = req.body.name
    lands.address = req.body.address
    lands.size = req.body.size
    lands.sizeDetail = req.body.sizeDetail
    lands.cropCode = req.body.cropCode
    lands.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete land
app.delete('/lands/:id', (req, res) => {
	// 이 농장과 연계된 작업일지를 모두 삭제	
	Journal.remove({
		landId: req.params.id
	}, function(err2, journals) {
		if (err2) {
			res.send(err2)
		}		
		console.log('journals removed! - ' + journals)
	})

	// 이 농장과 연계된 자재일지를 모두 삭제	
	Item.remove({
		landId: req.params.id
	}, function(err3, items) {
		if (err3) {
			res.send(err3)
		}		
		console.log('items removed! - ' + items)
	})

	Land.remove({
		_id: req.params.id
	}, function(err, lands) {
		if (err) {
			res.send(err)
		}
		res.send({
			success: true
		})
	})
})

/*
// Add new user
app.post('/user', (req, res) => {  
  var email = req.body.email;
  var password = req.body.password;
  var age = req.body.age;
  var sex = req.body.sex;
  var new_user = new User({
    email: email,
    password: password,
    age: age,
    sex: sex
  })

  new_user.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'User saved successfully!'
    })
  })
})
*/

// Fetch single user
app.get('/user/:id', (req, res) => {  
  User.find({}, '', function (error, user) {
    if (error) { console.error(error); }
    res.send(user)
  })
  .where('id').equals(req.params.id)
})

// Update a user age & sex
app.put('/userBirthDateSex/:id', (req, res) => {
	User.find({}, '', function (error, user) {
		if (error) { console.error(error); }
	    user[0].birth_date = req.body.birth_date
	    user[0].sex = req.body.sex
	    user[0].save(function (error) {
	      if (error) {
	        console.log(error)
	      }
	      res.send({
	        success: true
	      })
	    })
	})
	.where('id').equals(req.params.id)
/*
  User.findById(req.params.id, 'birth_date sex', function (error, user) {
    if (error) { console.error(error); }
    user.birth_date = req.body.birth_date
    user.sex = req.body.sex
    user.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
*/
})

/*
// Update a user password
app.put('/userPassword/:id', (req, res) => {
  var db = req.db;
  User.findById(req.params.id, 'age sex', function (error, user) {
    if (error) { console.error(error); }
    user.password = req.body.password

    user.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})
*/

// Update a user phone_no
app.put('/userPhoneNo/:id', (req, res) => {  
	User.find({}, '', function (error, user) {
		if (error) { console.error(error); }
		user[0].phone_no = req.body.phone_no

	    user[0].save(function (error) {
	      if (error) {
	        console.log(error)
	      }
	      res.send({
	        success: true
	      })
	    })
	})
	.where('id').equals(req.params.id)
})

// Update a user share_flag
app.put('/userShareFlag/:id', (req, res) => {
  User.find({}, '', function (error, user) {
    if (error) { console.error(error); }
    user[0].share_flag = req.body.share_flag

    user[0].save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
  .where('id').equals(req.params.id)
})

// Fetch user by email
app.get('/user/byEmail/:email', (req, res) => {
  User.find({}, '_id', function (error, user) {
    if (error) { console.error(error); }
    res.send(user)
  })
  .where('email').equals(req.params.email)
})

/*
// Fetch user by id & pw
app.get('/user/:id/:pw', (req, res) => {
  console.log(req.params)
  User.find({}, '_id', function (error, user) {
    if (error) { console.error(error); }
    res.send(user)
  })
  .where('id').equals(req.params.id)
  .where('password').equals(req.params.pw)
})
*/

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

function getNowDate() {
	var nowDate = new Date()
	var nowDateValue = ''
	nowDateValue = leadingZeros(nowDate.getFullYear(), 4) + '-' +
			   	   leadingZeros(nowDate.getMonth() + 1, 2) + '-' +
			   	   leadingZeros(nowDate.getDate(), 2) + ' ' +
			   	   leadingZeros(nowDate.getHours(), 2) + ':' +
			   	   leadingZeros(nowDate.getMinutes(), 2) + ':' +
			   	   leadingZeros(nowDate.getSeconds(), 2)
	return nowDateValue
}

// Add new smsauth
app.post('/addNewSMSAuth', (req, res) => {	
	console.log(req.body);
  	var phone_no = req.body.phone_no;

  	SmsAuth.remove({
		phone_no: phone_no
	}, function(err, lands) {
		if (err) { res.send(err) }		
	})

  	var auth_code = Math.floor(1000 + Math.random() * 9000);
  	var auth_date = getNowDate();

  	var new_sms_auth = new SmsAuth({
    	phone_no: phone_no,
    	auth_code: auth_code,
    	auth_date: auth_date
  	})
  
  	new_sms_auth.save(function (error, result) {
  		if (error) { console.log(error) }
/*
  		const smsParams = {  		  
		  text: '(주)이지정보기술\n[영농일지]본인인증번호입니다.\n인증번호:[' + auth_code + ']',
		  type: 'SMS', // 발송할 메시지 타입 (SMS, LMS, MMS, ATA, CTA)
		  to: phone_no, // 수신번호 (받는이)
		  from: '01032795690' // 발신번호 (보내는이)
		}
		send(smsParams);
*/
		timestamp = (Math.floor(Date.now() / 1000)).toString() 
		salt = uniqid() 
		signature = HmacMD5(timestamp + salt, apiSecret).toString()

		sendSMS({ api_key: apiKeyForSendSMS, 
				  signature, 
				  salt, 
				  timestamp, 
				  to: phone_no, 
				  from: '0647536677', 
				  text: '(주)이지정보기술\n[영농일지]본인인증번호입니다.\n인증번호:[' + auth_code + ']' 
				})

    	res.send({
	      	success: true,
	      	message: 'SmsAuth saved successfully!',
	      	result: result
    	})
  	})
})

// Fetch auth_code with phone_no
app.get('/getAuthCode/:phone_no', (req, res) => {
	SmsAuth.find({}, '', function (error, result) {
		if (error) { console.error(error); }
	    res.send(result)
	}).where('phone_no').equals(req.params.phone_no)
})

// Delete smsauth
app.delete('/deleteSMSAuth/:phoneNo', (req, res) => {
	SmsAuth.remove({
		phone_no: req.params.phoneNo
	}, function(err, lands) {
		if (err) {
			res.send(err)
		}
		res.send({
			success: true
		})
	})
})

// Fetch joinuser by id
app.get('/joinUser/:id', (req, res) => {
  JoinUser.find({}, '_id', function (error, joinuser) {
    if (error) { console.error(error); }
    res.send(joinuser)
  })
  .where('id').equals(req.params.id)
})

// Add new user, joinusers
app.post('/addNewUser', (req, res) => {
  console.log(req.body);
  var id = req.body.id;  
  var password = CryptoJS.AES.encrypt(req.body.password, cryptoKey)
  var name = req.body.name
  var birth_date = req.body.birth_date;
  var sex = req.body.sex;
  var phone_no = req.body.phone_no;  
  var level = req.body.level;
  var join_date = getNowDate();
  var pw_date = getNowDate();
  var tmp_pw_date = "";
  var mod_date = "";

  var new_user = new User({
    id: id,
    password: password,
    name: name,
	birth_date: birth_date,
	sex: sex,    
    phone_no: phone_no,    
    level: level,
    join_date: join_date,
    pw_date: pw_date,
    tmp_pw_date: tmp_pw_date,   
    mod_date: mod_date    
  })

  var join_user = new JoinUser({
  	id: id,
  	join_date: join_date
  })

  new_user.save(function (error, result) {
    if (error) {
      console.log(error)
    }

    join_user.save(function (error, result2) {
    	if (error) {
	      console.log(error)
	    }
	    // 가입 축하메일 보내기
	    // sendMail(email, "[주차왕파킹]회원가입을 축하드립니다.", "주차왕파킹 회원이 되신것을 진심으로 환영합니다.")
	    // sendMailForJoin(email, "[이지파킹]회원가입을 축하드립니다.", '', name, phone_no)
	    res.send({
	      success: true,
	      message: 'User saved successfully!',
	      result: result
	    })
    })
  })
})

// login with id & password
// https://stackoverflow.com/questions/13397691/how-can-i-send-a-success-status-to-browser-from-nodejs-express
app.put('/login', (req, res) => {
	// console.log(req.body)
	User.find({}, '', function (error, result) {
		if (error) { console.error(error); }

		if (0 == result.length) {
			res.status(201).json([{error: "Invalid id"}]);
		} else {
			// Decrypt
			var bytes  = CryptoJS.AES.decrypt(result[0].password, cryptoKey);			
			var plaintext = bytes.toString(CryptoJS.enc.Utf8);
			if(plaintext == req.body.password) {
				// res.status(200).json([{error: "Password ok"}]);				
				res.send(result)
			} else {				
				res.status(202).json([{error: "Invalid password"}]);				
			}
		}
	})
	.where('id').equals(req.body.id)	
})

// Create random password
// http://ilikefox.tistory.com/6
function createCode(objArr, iLength) {
    var arr = objArr;
    var randomStr = "";
    
    for (var j=0; j<iLength; j++) {
        randomStr += arr[Math.floor(Math.random()*arr.length)];
    }
    
    return randomStr
}

// 대문자
function getRandomBigLetter(iLength) {
	var arr="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(",");
    var rnd = createCode(arr, iLength);
    return rnd;
}

// 소문자
function getRandomSmallLetter(iLength) {
	var arr="a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");
    var rnd = createCode(arr, iLength);    
    return rnd;
}

// 특수문자
function getRandomSpecialLetter(iLength) {
	var arr="!,@,#,$,%,^,&,*".split(",");
    var rnd = createCode(arr, iLength);    
    return rnd;
}

// 숫자
function getRandomNum(iLength) {
	var arr="0,1,2,3,4,5,6,7,8,9".split(",");
    var rnd = createCode(arr, iLength);    
    return rnd;
}

function getRandomCode() {
	return getRandomBigLetter(2) + getRandomSmallLetter(2) + getRandomSpecialLetter(2) + getRandomNum(2)
}

// Find password with id
app.get('/findPassword/:id', (req, res) => {
	User.find({}, '', function (error, result) {
		if (error) { console.error(error); }

		if (0 == result.length) {
			res.status(201).json([{error: "Invalid id"}]);
		} else {
			User.findById(result[0]._id, '', function (error, users) {
		    	if (error) { console.error(error); }
		    	var newPw = getRandomCode()	// 임시비밀번호 생성
			    users.password = CryptoJS.AES.encrypt(newPw, cryptoKey)
			    users.tmp_pw_date = getNowDate()
			    users.save(function (error) {
				    if (error) {
				       	console.log(error)
				    }
				    // 임시비밀번호 이메일로 전송
				    // sendMail(req.params.email, "[주차왕파킹]임시비밀번호가 발급되었습니다.", "임시비밀번호 : " + newPw)
				    // sendMailForTmpPW(req.params.email, "[이지파킹]임시비밀번호가 발급되었습니다.", "", newPw)
				    timestamp = (Math.floor(Date.now() / 1000)).toString() 
					salt = uniqid() 
					signature = HmacMD5(timestamp + salt, apiSecret).toString()

					sendSMS({ api_key: apiKeyForSendSMS, 
							  signature, 
							  salt, 
							  timestamp, 
							  to: users.phone_no, 
							  from: '0647536677', 
							  text: '(주)이지정보기술\n[영농일지]임시비밀번호입니다.\n비밀번호:[' + newPw + ']' 
							})
				    console.log(newPw)

				    res.status(200).json([{error: "Password is sent"}]);
			    })
			})
		}
	})
	.where('id').equals(req.params.id)	
})

// check login process
app.get('/checkPasswordExpired/:id', (req, res) => {
	User.find({}, '', function (error, result) {
		if (error) { console.error(error); }

		if (0 == result.length) {
			res.status(201).json([{error: "Invalid id"}]);
		} else {
			if ("" == result[0].tmp_pw_date) {				
				var pwExpireDate = moment(result[0].pw_date).add(3, 'months').format("YYYY-MM-DD HH:mm:ss")				
				var nowDate = moment().format("YYYY-MM-DD HH:mm:ss")
				if (nowDate > pwExpireDate) {
					// 비번 수정 창으로 이동
					console.log('pwDate expired!')
					res.status(201).json([{error: "Expired password"}]);
				} else {
					// 로그인
					console.log('pwDate not expired!')
					res.status(200).json([{error: "Login success"}]);
				}
			} else {
				var tmpPwExpireDate = moment(result[0].tmp_pw_date).add(1, 'days').format("YYYY-MM-DD HH:mm:ss")				
				var nowDate = moment().format("YYYY-MM-DD HH:mm:ss")
				if (nowDate > tmpPwExpireDate) {
					// 임시비번 재발급 창으로 이동
					console.log('tmpPwDate expired!')
					res.status(202).json([{error: "Expired temp password"}]);
				} else {
					// 비번 수정 창으로 이동
					console.log('tmpPwDate not expired!')
					res.status(203).json([{error: "Move to update temp password"}]);
				}
			}			
		}
	})
	.where('id').equals(req.params.id)	
})

// Update user password
app.put('/updateUserPassword', (req, res) => {
  	console.log(req.body)
  	User.find({}, '', function (error, users) {
    	if (error) { console.error(error); }

    	// 기존 비밀번호 비교    	
    	var inputNowPw = req.body.nowPassword;
		var bytes  = CryptoJS.AES.decrypt(users[0].password, cryptoKey);
		var plaintext = bytes.toString(CryptoJS.enc.Utf8);
		
		if (plaintext === inputNowPw) {
			console.log("same")
		} else {
			console.log("different")
			res.status(201).json([{error: "No match now password"}]);
			return;
		}

	    if (req.body.password == "") {
	    } else {
	    	users[0].password = CryptoJS.AES.encrypt(req.body.password, cryptoKey)	
	    }
	    users[0].tmp_pw_date = ""
	    users[0].pw_date = getNowDate()
	    	    
	    users[0].save(function (error) {
		    if (error) {
		       	console.log(error)
		    }
		    res.send({
		        success: true
		    })
	    })
	})
	.where('id').equals(req.body.id)
})

// Fetch all data of user
app.get('/getAllUser', (req, res) => {
	User.find({}, '', function (error, result) {
		if (error) { console.error(error); }
	    res.send(result)
	})
})

// Fetch users by date, searchType, searchContent
app.get('/users/searchBy4/:startDate/:endDate/:searchType/:searchContent', (req, res) => {
  console.log(req.params)
  var query = User.find({})
  
  if('null' == req.params.startDate) {  	  	
  	console.log('startDate null!')
  } else {
  	query.where('join_date').gte(req.params.startDate + " 00:00:00")
  }
  if('null' == req.params.endDate) {
  	console.log('endDate null!')
  } else {
  	query.where('join_date').lte(req.params.endDate + " 23:59:59")
  }

  if((0 != req.params.searchType) && (0 != req.params.searchContent)) {
  	switch(req.params.searchType) {
  		case 'byId' :
  			query.where('id').regex(req.params.searchContent)
  			break;
  		case 'byPhone' :
  			query.where('phone_no').regex(req.params.searchContent)
  			break;
  		case 'byLevel' :
  			query.where('level').regex(req.params.searchContent)
  			break;
  		default :
  			break;
  	}
  }

  query.exec().then(result => {
  	res.send(result)
  })
})

// Update user
app.put('/updateUser/:id', (req, res) => {
  	User.find({}, '', function (error, user) {
    	if (error) { console.error(error); }
    	user[0].id = req.body.id;
	    if (req.body.password == "") {
	    } else {
	    	user[0].password = CryptoJS.AES.encrypt(req.body.password, cryptoKey)	
	    }	    
	    user[0].birth_date = req.body.birth_date;
	  	user[0].sex = req.body.sex;
	    user[0].phone_no = req.body.phone_no;	    
	  	user[0].level = req.body.level;
	  	user[0].mod_date = getNowDate();
	  	
	    user[0].save(function (error) {
		    if (error) {
		       	console.log(error)
		    }
		    res.send({
		        success: true
		    })
	    })    	
  	})
  	.where('id').equals(req.params.id)  	
})

// Delete user
app.delete('/deleteUser/:id', (req, res) => {	
	User.remove({
		id: req.params.id
	}, function(err, lands) {
		if (err) {
			res.send(err)
		}
		res.send({
			success: true
		})
	})
})

// Fetch items by userId, wCode
app.get('/itemsByWcode/:userId/:wCode', (req, res) => {
  Item.find({}, '', function (error, items) {
    if (error) { console.error(error); }
    res.send(items)
  })
  .where('userId').equals(req.params.userId)
  .where('item').equals(req.params.wCode)
})

// Update item
app.put('/item/:id', (req, res) => { 
  console.log(req.body)  
  Item.findById(req.params.id, '', function (error, item) {
    if (error) { console.error(error); }

    item.userId = req.body.userId;
    item.date = req.body.date;
    item.item = req.body.item;
  	item.itemDetail = req.body.itemDetail;
  	item.purpose = req.body.purpose;
  	item.pictureA = req.body.pictureA;
  	item.pictureB = req.body.pictureB;
  	item.pictureC = req.body.pictureC;    

    item.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })  
})

/*
// Fetch items by userId, landId, item, itemName
app.get('/items/getByUserLandItemName/:userId/:landId/:item/:itemName', (req, res) => {
  console.log(req.params)
  Item.find({}, '', function (error, items) {
    if (error) { console.error(error); }
    res.send(items)
  })
  .where('userId').equals(req.params.userId)
  .where('landId').equals(req.params.landId)
  .where('item').equals(req.params.item)
  .where('itemDetail.itemName').equals(req.params.itemName)
})
*/

// Update item usage
app.put('/itemUpdateUsage', (req, res) => { 
  // console.log(req.body)  
  Item.find({}, '', function (error, item) {
    if (error) { console.error(error); }

    // console.log(item[0].itemDetail)

    for(var i = 0; i < item[0].itemDetail.length; i++) {
    	if(item[0].itemDetail[i].itemName === req.body.itemName) {
    		var itemUsage = item[0].itemDetail[i].itemUsage * 1
    		var journalUsage = req.body.usage * 1    		
    		var totalUsage = itemUsage + journalUsage
    		console.log('totalUsage=' + totalUsage)

    		item[0].itemDetail[i].itemUsage = totalUsage

    		item[0].save(function (error) {
    			if (error) {
			       console.log(error)
			    }
			    res.send({
			        success: true
			    })			
    		})
    	}
    }
  })
  .where('userId').equals(req.body.userId)
  .where('landId').equals(req.body.landId)
  .where('item').equals(req.body.item)
  .where('itemDetail.itemName').equals(req.body.itemName)
})

// Add new item
app.post('/item', (req, res) => {
  // console.log(req.body);
  var userId = req.body.userId;
  var date = req.body.date;
  var landId = req.body.landId;
  var item = req.body.item;
  var itemDetail = req.body.itemDetail;
  var purpose = req.body.purpose;
  var pictureA = req.body.pictureA;
  var pictureB = req.body.pictureB;
  var pictureC = req.body.pictureC;

  var new_item = new Item({
    userId: userId,
    date: date,
    landId: landId,
    item: item,
    itemDetail: itemDetail,
    purpose: purpose,
    pictureA: pictureA,
    pictureB: pictureB,
    pictureC: pictureC
  })

  new_item.save(function (error, result) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Item saved successfully!',
      result: result
    })
  })  
})

// Fetch items by userId
app.get('/items/:userId', (req, res) => {
  Item.find({}, '', function (error, items) {
    if (error) { console.error(error); }
    res.send(items)
  })
  .where('userId').equals(req.params.userId)
})

// Fetch items with aggregate
app.get('/item/agg/:userId/:startDate/:endDate', (req, res) => {	
	Item.aggregate([
		{
			"$unwind" : "$itemDetail"
		},
        {
            "$group" : {
                "_id" : { "_id" : "$_id",
                	      "date" : "$date",
                		  "userId" : "$userId",
                		  "landId" : "$landId", 
		             	  "item" : "$item",
		             	  "itemName" : "$itemDetail.itemName", 
		             	  "itemAmount" : "$itemDetail.itemAmount", 
		             	  "itemPrice" : "$itemDetail.itemPrice", 
		             	  "itemUsage" : "$itemDetail.itemUsage" 
                		}
            }
        },
        {
            "$match" : { "$and" : [ { "_id.userId" : req.params.userId },
            					    { "_id.date" : { "$gte": req.params.startDate, "$lte": req.params.endDate } }            					    
       						  	  ] 
       				   }            	
        },
        { "$sort" : { "_id.date": 1 } }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.send(result);
        }
    });
})

// Fetch items with aggregate by 4
app.get('/item/agg/searchBy5/:userId/:startDate/:endDate/:item/:landId', (req, res) => {	
	Item.aggregate([
		{
			"$unwind" : "$itemDetail"
		},
        {
            "$group" : {
                "_id" : { 
                		  "_id" : "$_id",
                		  "date" : "$date",
                		  "userId" : "$userId",
                		  "landId" : "$landId", 
		             	  "item" : "$item",
		             	  "itemName" : "$itemDetail.itemName", 
		             	  "itemAmount" : "$itemDetail.itemAmount", 
		             	  "itemPrice" : "$itemDetail.itemPrice", 
		             	  "itemUsage" : "$itemDetail.itemUsage" 
                		}
            }
        },
        {
            "$match" : { "$and" : [ { "_id.userId" : req.params.userId },
            					    { "_id.date" : { "$gte": req.params.startDate, "$lte": req.params.endDate } },
            					    { "_id.landId" : req.params.landId },
       						  		{ "_id.item" : req.params.item }
       						  	  ] 
       				   } 	
        },
        { "$sort" : { "_id.date": 1 } }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.send(result);
        }
    });
})

// Fetch item by id
app.get('/item/:id', (req, res) => {  
  Item.find({}, '', function (error, item) {
    if (error) { console.error(error); }
    res.send(item)
  })
  .where('_id').equals(req.params.id)
})

// Delete item
app.delete('/item/:id', (req, res) => {
	var db = req.db
	Item.remove({
		_id: req.params.id
	}, function(err, lands) {
		if (err) {
			res.send(err)
		}
		res.send({
			success: true
		})
	})
})

// Fetch items by date, item
app.get('/items/searchBy3/:startDate/:endDate/:item', (req, res) => {  
  console.log(req.params)
  var query = Item.find({})
  if(0 != req.params.startDate) {
  	query.where('date').gte(req.params.startDate)
  }
  if(0 != req.params.endDate) {
  	query.where('date').lte(req.params.endDate)
  }

  var item = req.params.item  
  if(0 != req.params.item) {
  	query.where('item').equals(item)  	
  }

  query.exec().then(result => {
  	res.send(result)
  })
})

// Fetch items by date, item
app.get('/items/searchBy4/:startDate/:endDate/:item/:landId', (req, res) => {  
  console.log(req.params)
  var query = Item.find({})
  if(0 != req.params.startDate) {
  	query.where('date').gte(req.params.startDate)
  }
  if(0 != req.params.endDate) {
  	query.where('date').lte(req.params.endDate)
  }

  var item = req.params.item  
  if(0 != req.params.item) {
  	query.where('item').equals(item)  	
  }

  var landId = req.params.landId
  if(0 != req.params.landId) {
  	query.where('landId').equals(landId)  	
  }

  query.exec().then(result => {
  	res.send(result)
  })
})

// Fetch items by date, userId, landId
app.get('/items/searchBy4_2/:startDate/:endDate/:userId/:landId', (req, res) => {  
  console.log(req.params)
  var query = Item.find({})
  if(0 != req.params.startDate) {
  	query.where('date').gte(req.params.startDate)
  }
  if(0 != req.params.endDate) {
  	query.where('date').lte(req.params.endDate)
  }  
  if(0 != req.params.userId) {
  	query.where('userId').equals(req.params.userId)
  }
  if(0 != req.params.landId) {
  	query.where('landId').regex(req.params.landId)
  }

  query.exec().then(result => {
  	res.send(result)
  })
})

// Fetch items by year, month, userId
app.get('/items/searchByYMUserId/:ym/:userId', (req, res) => {
  console.log(req.params)
  Item.find({}, '', function (error, items) {
    if (error) { console.error(error); }
    res.send(items)
  })
  .where('date').regex(req.params.ym)
  .where('userId').equals(req.params.userId)
})

// Fetch items by year, month, userId, landId
app.get('/items/searchByYMUserIdLandId/:ym/:userId/:landId', (req, res) => {
  console.log(req.params)
  Item.find({}, '', function (error, items) {
    if (error) { console.error(error); }
    res.send(items)
  })
  .where('date').regex(req.params.ym)
  .where('userId').equals(req.params.userId)
  .where('landId').equals(req.params.landId)
})

// Fetch items by date & userId
app.get('/items/:startDate/:endDate/:userId', (req, res) => {
  console.log(req.params)
  Item.find({}, '', function (error, items) {
    if (error) { console.error(error); }
    res.send(items)
  })
  .where('date').gte(req.params.startDate).lte(req.params.endDate)
  .where('userId').equals(req.params.userId)
})

// Fetch items by date & userId & itemDetail
app.get('/itemsByYMNUserIdAndDetail/:startDate/:endDate/:userId', (req, res) => {
  console.log(req.params)
  Item.find({}, '', function (error, items) {
    if (error) { console.error(error); }
    res.send(items)
  })
  // .where('date').gte(req.params.startDate).lte(req.params.endDate)
  .where('date').gte(req.params.startDate + '-01 00:00:00').lte(req.params.endDate + '-31 23:59:59')
  .where('userId').equals(req.params.userId)
  .where('itemDetail.itemPrice').ne('')
  .where('itemDetail.itemPrice').ne(null)
  .sort({'date' : 1})
})

/*
// Update item usage
app.put('/itemUpdateUsage', (req, res) => { 
  // console.log(req.body)  
  Item.find({}, '', function (error, item) {
    if (error) { console.error(error); }

    // console.log(item[0].itemDetail)

    for(var i = 0; i < item[0].itemDetail.length; i++) {
    	if(item[0].itemDetail[i].itemName === req.body.itemName) {
    		var itemUsage = item[0].itemDetail[i].itemUsage * 1
    		var journalUsage = req.body.usage * 1    		
    		var totalUsage = itemUsage + journalUsage
    		console.log('totalUsage=' + totalUsage)

    		item[0].itemDetail[i].itemUsage = totalUsage

    		item[0].save(function (error) {
    			if (error) {
			       console.log(error)
			    }
			    res.send({
			        success: true
			    })			
    		})
    	}
    }
  })
  .where('userId').equals(req.body.userId)
  .where('landId').equals(req.body.landId)
  .where('item').equals(req.body.item)
  .where('itemDetail.itemName').equals(req.body.itemName)
})
*/

// Fetch items by userId, landId, item, itemName
app.get('/items/getByUserLandItemName/:userId/:landId/:item/:itemName', (req, res) => {
  console.log(req.params)
  Item.find({}, '', function (error, items) {
    if (error) { console.error(error); }

    for(var i = 0; i < items[0].itemDetail.length; i++) {
    	if(items[0].itemDetail[i].itemName === req.params.itemName) {
    		res.send(items[0].itemDetail[i])
    	}
    }
    // console.log(items)
    // res.send(items)
  })
  .where('userId').equals(req.params.userId)
  .where('landId').equals(req.params.landId)
  .where('item').equals(req.params.item)
  .where('itemDetail.itemName').equals(req.params.itemName)
})

// Fetch item with aggregate
app.get('/itemsGetAggData/:userId/:startDate/:endDate', (req, res) => {	
	Item.aggregate([
		{
			"$unwind" : "$itemDetail"
		},
        {
            "$group" : {
                "_id" : { "date" : { "$substr" : [ "$date", 0, 7 ] }, "userId" : "$userId" },
                "totalExpenditure" : { "$sum" : "$itemDetail.itemPrice" },
                "count" : { "$sum" : 1 }
            }
        },
        {
            "$match" : {
            	"$and" : [
            		{ "_id.date" : { "$gte" : req.params.startDate, "$lte" : req.params.endDate } },
                	{ "_id.userId" : req.params.userId }
            	]                
            }
        },
        { "$sort" : { "_id.date": 1 } }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.send(result);
        }
    });
})

// Fetch journal with aggregate
app.get('/journalsGetAggData/:userId/:startDate/:endDate', (req, res) => {	
	Journal.aggregate([
		{
			"$unwind" : "$income"
		},
        {
            "$group" : {
                "_id" : { "date" : { "$substr" : [ "$date", 0, 7 ] }, "userId" : "$userId" },
                "totalIncome" : { "$sum" : "$income.amount" },
                "count": { "$sum" : 1 }
            }
        },
        {
            "$match" : {
            	"$and" : [
            		{ "_id.date" : { "$gte" : req.params.startDate, "$lte" : req.params.endDate } },
            		{ "_id.userId" : req.params.userId }
            	]            	
            }
        },
        { "$sort" : { "_id.date": 1 } }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.send(result);
        }
    });
})

// Fetch journal with aggregate
app.get('/journalsGetCOOAggData/:userId/:startDate/:endDate', (req, res) => {	
	Journal.aggregate([
		{
			"$unwind" : "$COO"
		},
        {
            "$group" : {
                "_id" : { "date" : { "$substr" : [ "$date", 0, 7 ] }, "userId" : "$userId" },
                "totalCooCost" : { "$sum" : "$COO.cost" },
                "count": { "$sum" : 1 }
            }
        },
        {
            "$match" : {
            	"$and" : [
            		{ "_id.date" : { "$gte" : req.params.startDate, "$lte" : req.params.endDate } },
            		{ "_id.userId" : req.params.userId }
            	]            	
            }
        },
        { "$sort" : { "_id.date": 1 } }
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.send(result);
        }
    });
})

// Get report images - https://stackoverflow.com/questions/5823722/how-to-serve-an-image-using-nodejs
app.get('/getJournalImg/:userId/:imgName', (req, res) => {
	var img = fs.readFileSync('journalImgs/' + req.params.userId + '/' + req.params.imgName);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
})

// Leave user
app.put('/leaveUser/:userId', (req, res) => {
	// 1. Insert user to LeaveUser
	var leave_user = new LeaveUser({
    	id: req.params.userId,
    	leave_date: getNowDate(),
    	leave_reason: req.body.reason,
    	leave_reason_detail: req.body.reasonDetail
    })

    leave_user.save(function (error, result) {
    	if (error) {
    		console.error(error);
    	}
    	// 2. Delete Journals
    	Journal.remove({
    		userId: req.params.userId
    	}, function(err, removedJournals) {
    		if (err) { res.send(err) }

    		// 3. Delete Items
    		Item.remove({
    			userId: req.params.userId
    		}, function(err, removedItems) {
    			if (err) { res.send(err) }	    			

    			// 4. Delete Lands
    			Land.remove({
    				userId: req.params.userId
    			}, function(err, removedLands) {
    				if (err) { res.send(err) }

    				// 5. Delete Users
			    	User.remove({
						id: req.params.userId
					}, function(err, removedUsers) {
						if (err) {
							res.send(err)
						}
						res.send({
							success: true
						})
					})
    			})
    		})			
    	})
    })
})