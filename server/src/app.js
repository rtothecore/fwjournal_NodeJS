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

function SENDSMS (from, to, message) {
	timestamp = (Math.floor(Date.now() / 1000)).toString() 
	salt = uniqid() 
	signature = HmacMD5(timestamp + salt, apiSecret).toString()
	sendSMS({ api_key: apiKeyForSendSMS, 
			  signature, 
			  salt, 
			  timestamp, 
			  to: to, 
			  from: from, 
			  text: message 
			})
}

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

////////////////////////////////// L O G /////////////////////////////////////////////////
// https://thisdavej.com/using-winston-a-versatile-logging-library-for-node-js/
// https://lovemewithoutall.github.io/it/winston-example/
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/info_%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxSize: "20m",
  maxFiles: "14d"
});

const exceptionRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/error_%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxSize: "20m",
  maxFiles: "14d"
});

const logger = createLogger({
  // change level if in dev environment versus production
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `[${info.timestamp}] ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    dailyRotateFileTransport
  ]
});

const loggerEx = createLogger({
  // change level if in dev environment versus production
  level: 'error',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(error => `[${error.timestamp}] ${error.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'error',
      format: format.combine(
        format.colorize(),
        format.printf(
          error => `${error.timestamp} ${error.level}: ${error.message}`
        )
      )
    }),
    exceptionRotateFileTransport
  ]
});

// logger.info('Hello world');
// loggerEx.error('Error info');
////////////////////////////////// L O G /////////////////////////////////////////////////

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

/*
mongoose.connect('mongodb://fwjournal:fwjournal**@192.168.66.40:28018/fwjournal')
var db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});
*/
// https://github.com/Automattic/mongoose/issues/4135
mongoose.connect('mongodb://fwjournal:fwjournal**@192.168.66.40:28017/fwjournal')
.then(() => {
	console.log("Connection Succeeded");
})
.catch(err => {
	// loggerEx.error(err.stack);
	loggerEx.error("Mongodb Connection Error");		
	SENDSMS('0647536677', '01032795690', '(주)이지정보기술\n[영농일지]MongoDB커넥션에러.')
})

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
var ItemDetail = require("../models/itemDetail")

const serviceKey = '73Jjl5lZRvBRKkGsPnGmZ7EL9JtwsWNi3hhCIN8cpVJzMdRRgyzntwz2lHmTKeR1tp7NWzoihNGGazcDEFgh8w%3D%3D'
const serviceKeyForPrice = '8d8857fa9186167880dafee9a8c55dda0d2711b96cd4ae893983f7d870941d2e'

// https://expressjs.com/ko/guide/using-middleware.html
/*
app.use(function (req, res, next) {
  // https://stackoverflow.com/questions/19599543/check-mongoose-connection-state-without-creating-new-connection
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  switch (mongoose.connection.readyState) {
  	case 0 :  		
  		loggerEx.error('MongoDB disconnected - ' + req.originalUrl);
        res.status(500).json({ error: 'MongoDB disconnected' });
        // SENDSMS('0647536677', '01032795690', '(주)이지정보기술\n[영농일지]MongoDB disconnected.')
  		break;
  	case 1 :
  		next();
  		break;
  	case 2 :  		
  		loggerEx.error('MongoDB connecting - ' + req.originalUrl);
        res.status(500).json({ error: 'MongoDB connecting' });
        // SENDSMS('0647536677', '01032795690', '(주)이지정보기술\n[영농일지]MongoDB connecting.')
  		break;
  	case 3 :   		
  		loggerEx.error('MongoDB disconnecting - ' + req.originalUrl);
        res.status(500).json({ error: 'MongoDB disconnecting' });
        // SENDSMS('0647536677', '01032795690', '(주)이지정보기술\n[영농일지]MongoDB disconnecting.')
  		break;
  	default :
  		break;
  }    
});
*/

app.get('/checkDB', (req, res) => {
  // https://stackoverflow.com/questions/19599543/check-mongoose-connection-state-without-creating-new-connection
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  switch (mongoose.connection.readyState) {
  	case 0 :  		
  		loggerEx.error('MongoDB disconnected');
        res.status(500).json({ error: 'MongoDB disconnected' });
        SENDSMS('0647536677', '01032795690', '(주)이지정보기술\n[영농일지]MongoDB disconnected.')
  		break;
  	case 1 :
  		res.status(200).json([{error: "MongoDB successfully connected"}]);
  		break;
  	case 2 :  		
  		loggerEx.error('MongoDB connecting');
        res.status(500).json({ error: 'MongoDB connecting' });
        SENDSMS('0647536677', '01032795690', '(주)이지정보기술\n[영농일지]MongoDB connecting.')
  		break;
  	case 3 :   		
  		loggerEx.error('MongoDB disconnecting');
        res.status(500).json({ error: 'MongoDB disconnecting' });
        SENDSMS('0647536677', '01032795690', '(주)이지정보기술\n[영농일지]MongoDB disconnecting.')
  		break;
  	default :
  		break;
  }    
});

// Add new workClass
app.post('/logError', (req, res) => {
  // console.log(req.body.funcName);
  // console.log(req.body.message); 
  loggerEx.error(req.body.errorPage + ' : ' + req.body.funcName + ' : ' + req.body.message); 
  SENDSMS('0647536677', '01032795690', '(주)이지정보기술\n[영농일지]\nERROR-' + req.body.errorPage + '-' + req.body.funcName)
})

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
            // console.log(err);
            loggerEx.error('/journalImg/upload : ' + err.toString());
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
            // next(err);
            loggerEx.error('/wcData/getAllDataOfAggData/:startDate/:endDate : ' + err.toString());
            res.status(500).json({ error: err.toString() });
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
            // next(err);
            loggerEx.error('/wcData/getAggData/:startDate/:endDate : ' + err.toString());
            res.status(500).json({ error: err.toString() });
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
	// console.log(req.params)
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
            // next(err);
            loggerEx.error('/wcData/getWeatherAggDataByAddr/:startDate/:endDate/:address : ' + err.toString());
            res.status(500).json({ error: err.toString() });
        } else {
        	// console.log(result)
            res.send(result);
        }
    });
})

// Fetch all data of sensorData with aggregate
app.get('/ssData/getAllDataOfAggData/:startDate/:endDate', (req, res) => {
	SsData.find({}, '', function (error, result) {
		if (error) { 
			// console.error(error); 
			loggerEx.error('/ssData/getAllDataOfAggData/:startDate/:endDate : ' + error.toString());
            res.status(500).json({ error: error.toString() });
		}
	    res.send(result)
	})
	.where('date').gte(req.params.startDate + " 00:00:00").lte(req.params.endDate + " 23:59:59")
})


// Fetch sensorData with aggregate
app.get('/ssData/getAggData/:startDate/:endDate', (req, res) => {
	// console.log(req.body);
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
            // next(err);
            loggerEx.error('/ssData/getAggData/:startDate/:endDate : ' + err.toString());
            res.status(500).json({ error: err.toString() });
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
	    	if (error) {
	    		loggerEx.error('/ssData/lastOne : ' + error.toString());
            	res.status(500).json({ error: error.toString() });
	    	} else {
	    		res.send(sensorDatas)
	    	}	    	
	    })
	    .skip(count - 1)
	})
})

function getTodayDate() {
	// loggerEx.error('getTodayDate : ' + error.toString());
	var todayDate = new Date()
	var todayDateValue = ''
	todayDateValue = leadingZeros(todayDate.getFullYear(), 4) + 
			   		 leadingZeros(todayDate.getMonth() + 1, 2) +
			   		 leadingZeros(todayDate.getDate(), 2)
	return todayDateValue	
}

function getDateSubtract(subVal) {
	var subDay = moment().subtract(subVal, 'day').format("YYYYMMDD")	
	return subDay
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
	  			// res.send(false)	
	  			/////////////////////////////////////////////////////////////////////////////////  			
	  			axios.get('http://211.237.50.150:7080/openapi/' + serviceKeyForPrice +
		  			'/json/Grid_20150401000000000216_1/1/5?AUCNG_DE=' + getDateSubtract(1) + 
		  			'&PRDLST_CD=' + productCode)
		  		.then(function (response2) {
		  			// console.log(response.data)
		  			if (0 == response2.data.Grid_20150401000000000216_1.totalCnt) {
			  			// console.log('totalCnt is 0')
			  			// res.send(false)
			  			/////////////////////////////////////////////////////////////////////////////////  			
			  			axios.get('http://211.237.50.150:7080/openapi/' + serviceKeyForPrice +
				  			'/json/Grid_20150401000000000216_1/1/5?AUCNG_DE=' + getDateSubtract(2) + 
				  			'&PRDLST_CD=' + productCode)
				  		.then(function (response3) {
				  			// console.log(response.data)
				  			if (0 == response3.data.Grid_20150401000000000216_1.totalCnt) {
					  			// console.log('totalCnt is 0')
					  			// res.send(false)
					  			/////////////////////////////////////////////////////////////////////////////////  			
					  			axios.get('http://211.237.50.150:7080/openapi/' + serviceKeyForPrice +
						  			'/json/Grid_20150401000000000216_1/1/5?AUCNG_DE=' + getDateSubtract(3) + 
						  			'&PRDLST_CD=' + productCode)
						  		.then(function (response4) {
						  			// console.log(response.data)
						  			if (0 == response4.data.Grid_20150401000000000216_1.totalCnt) {
							  			// console.log('totalCnt is 0')
							  			// res.send(false)
							  			/////////////////////////////////////////////////////////////////////////////////  			
							  			axios.get('http://211.237.50.150:7080/openapi/' + serviceKeyForPrice +
								  			'/json/Grid_20150401000000000216_1/1/5?AUCNG_DE=' + getDateSubtract(4) + 
								  			'&PRDLST_CD=' + productCode)
								  		.then(function (response5) {
								  			// console.log(response.data)
								  			if (0 == response5.data.Grid_20150401000000000216_1.totalCnt) {
									  			// console.log('totalCnt is 0')
									  			// res.send(false)
									  			/////////////////////////////////////////////////////////////////////////////////  			
									  			axios.get('http://211.237.50.150:7080/openapi/' + serviceKeyForPrice +
										  			'/json/Grid_20150401000000000216_1/1/5?AUCNG_DE=' + getDateSubtract(5) + 
										  			'&PRDLST_CD=' + productCode)
										  		.then(function (response6) {
										  			// console.log(response.data)
										  			if (0 == response6.data.Grid_20150401000000000216_1.totalCnt) {
											  			// console.log('totalCnt is 0')
											  			res.send(false)
											  			return		  			
											  		}

										  			res.send(response6.data)
										  		}).catch(function (error) {
										  			// console.log(error)
										  			loggerEx.error('/getProductPrice/:productName : ' + error.toString());
        											res.status(500).json({ error: error.toString() });
										  		})
										  		/////////////////////////////////////////////////////////////////////////////////	
										  		return		  			
									  		}

								  			res.send(response5.data)
								  		}).catch(function (error) {
								  			// console.log(error)
								  			loggerEx.error('/getProductPrice/:productName : ' + error.toString());
        									res.status(500).json({ error: error.toString() });
								  		})
								  		/////////////////////////////////////////////////////////////////////////////////
								  		return			  			
							  		}

						  			res.send(response4.data)
						  		}).catch(function (error) {
						  			// console.log(error)
						  			loggerEx.error('/getProductPrice/:productName : ' + error.toString());
        							res.status(500).json({ error: error.toString() });
						  		})
						  		/////////////////////////////////////////////////////////////////////////////////
						  		return			  			
					  		}

				  			res.send(response3.data)
				  		}).catch(function (error) {
				  			// console.log(error)
				  			loggerEx.error('/getProductPrice/:productName : ' + error.toString());
        					res.status(500).json({ error: error.toString() });
				  		})
				  		/////////////////////////////////////////////////////////////////////////////////
				  		return			  			
			  		}

		  			res.send(response2.data)
		  		}).catch(function (error) {
		  			// console.log(error)
		  			loggerEx.error('/getProductPrice/:productName : ' + error.toString());
        			res.status(500).json({ error: error.toString() });
		  		})
		  		/////////////////////////////////////////////////////////////////////////////////
		  		return
	  		}

  			res.send(response.data)
  		}).catch(function (error) {
  			// console.log(error)
  			loggerEx.error('/getProductPrice/:productName : ' + error.toString());
        	res.status(500).json({ error: error.toString() });
  		})
  	}).catch(function (error) {
    	// console.log(error)
    	loggerEx.error('/getProductPrice/:productName : ' + error.toString());
        res.status(500).json({ error: error.toString() });
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
    	// console.log(error)
    	loggerEx.error('/getAddress/:searchText : ' + error.toString());
        res.status(500).json({ error: error.toString() });
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
    	// console.log(error)
    	loggerEx.error('/ForecastGrib/:nx/:ny : ' + error.toString());
        res.status(500).json({ error: error.toString() });
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
    	// console.log(error)
    	loggerEx.error('/ForecastGrib/:baseDate/:baseTime/:nx/:ny : ' + error.toString());
        res.status(500).json({ error: error.toString() });
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
    	// console.log(error)
    	loggerEx.error('/ForecastSpaceData/:nx/:ny : ' + error.toString());
        res.status(500).json({ error: error.toString() });
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
			// console.log(error)
			loggerEx.error('/Airdata/:tmX/:tmY : ' + error.toString());
        	res.status(500).json({ error: error.toString() });
		})
	}).catch(function (error) {
    	// console.log(error)
    	loggerEx.error('/Airdata/:tmX/:tmY : ' + error.toString());
        res.status(500).json({ error: error.toString() });
  	})
})

// Fetch work codes as item
app.get('/wc/getWCsAsItem', (req, res) => {  
  // var wCode = req.params.code
  Wc.find({}, '', function (error4, wcs) {
	if (error4) { 
		// console.error(error); 
		loggerEx.error('/wc/getWCsAsItem : ' + error4.toString());
        res.status(500).json({ error: error4.toString() });
	}	
	res.send(wcs)
  })
  .where('asItem').equals('1')
})

// Fetch workcalss text by cropCode
app.get('/wc/getTxtByCC3/:code', (req, res) => {  
  var dCode = req.params.code
  Dc.find({}, '', function (error, dcs) {
  	if (error) { 
  		// console.error(error); 
  		loggerEx.error('/wc/getTxtByCC3/:code : ' + error.toString());
        res.status(500).json({ error: error.toString() });
  	}  	
  	Sc.find({}, '', function (error2, scs) {
  		if (error2) { 
  			// console.error(error2); 
  			loggerEx.error('/wc/getTxtByCC3/:code : ' + error2.toString());
        	res.status(500).json({ error: error2.toString() });
  		}  	
  		Mc.find({}, '', function (error3, mcs) {
  			if (error3) { 
  				// console.error(error3); 
  				loggerEx.error('/wc/getTxtByCC3/:code : ' + error3.toString());
        		res.status(500).json({ error: error3.toString() });
  			}  			
  			Wc.find({}, '', function (error4, wcs) {
  				if (error4) { 
  					// console.error(error4); 
  					loggerEx.error('/wc/getTxtByCC3/:code : ' + error4.toString());
        			res.status(500).json({ error: error4.toString() });
  				}
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
  	if (error) { 
  		// console.error(error); 
  		loggerEx.error('/wc/getTxtByCC2/:code : ' + error.toString());
        res.status(500).json({ error: error.toString() });
  	}
  	Sc.find({}, '', function (error2, scs) {
  		if (error2) { 
  			// console.error(error2); 
  			loggerEx.error('/wc/getTxtByCC2/:code : ' + error2.toString());
        	res.status(500).json({ error: error2.toString() });
  		}  		
  		Mc.find({}, '', function (error3, mcs) {
  			if (error3) { 
  				// console.error(error3); 
  				loggerEx.error('/wc/getTxtByCC2/:code : ' + error3.toString());
        		res.status(500).json({ error: error3.toString() });
  			}  			
  			Wc.find({}, '', function (error4, wcs) {
  				if (error4) { 
  					// console.error(error4); 
  					loggerEx.error('/wc/getTxtByCC2/:code : ' + error4.toString());
        			res.status(500).json({ error: error4.toString() });
  				}
  				res.send(wcs)
  			}).where('bCode').equals(mcs[0].bCode)
  		}).where('mCode').equals(scs[0].mCode)
  	})
  	.where('sCode').equals(dcs[0].sCode)
  })
  .where('dCode').equals(dCode)
})

// Fetch workclass text by code
app.get('/wc/getTextByCcode/:code', (req, res) => {  
  var code = req.params.code
  
  Wc.find({}, '', function (error, wcs) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/wc/getTextByCcode/:code : ' + error.toString());
        res.status(500).json({ error: error.toString() });
    }
    Wc.find({}, '', function (error2, wcs2) {
    	if (error2) { 
    		// console.error(error2);
    		loggerEx.error('/wc/getTextByCcode/:code : ' + error2.toString());
        	res.status(500).json({ error: error2.toString() });
    	}
    	res.send(wcs2)
    }).where('bCode').equals(wcs[0].bCode)    
  })  
  .where('wCode').equals(code)
})

// Fetch workclass text by code
app.get('/wc/getOneTextByCcode/:code', (req, res) => {  
  var code = req.params.code
  
  Wc.find({}, '', function (error, wcs) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/wc/getOneTextByCcode/:code : ' + error.toString());
        res.status(500).json({ error: error.toString() });
    }
    res.send(wcs)
  })  
  .where('wCode').equals(code)
})

// Fetch max workClass
app.get('/wc/getMaxWcs', (req, res) => {
  Wc.find({}, '', function (error, wcs) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/wc/getMaxWcs : ' + error.toString());
        res.status(500).json({ error: error.toString() });
    }
    res.send(wcs)
  })
  .where('wCode').regex('W')  
  .sort({wCode:-1})
})

// Fetch duplicated workClass
app.get('/wc/getSameWc/:workTypeText', (req, res) => {
  Wc.find({}, '', function (error, wcs) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/wc/getSameWc/:workTypeText : ' + error.toString());
        res.status(500).json({ error: error.toString() });
    }
    res.send(wcs)
  })
  .where('text').equals(req.params.workTypeText)
})

// Fetch workClass with BCP
app.get('/wc/getBCP', (req, res) => {	  
  Wc.distinct('text', {bCode:'BCP'}, function  (error, wcs) {
  	if (error) { 
  		// console.error(error); 
  		loggerEx.error('/wc/getBCP : ' + error.toString());
        res.status(500).json({ error: error.toString() });
  	}
  	res.send(wcs)
  })
})

// Fetch BCP detail
app.get('/wc/getBCPDetail/:bcpText', (req, res) => {	  
	Wc.findOne({bCode:'BCP', text: req.params.bcpText}, '', function (error, wcs) {
		if (error) { 
			// console.error(error) 
			loggerEx.error('/wc/getBCPDetail/:bcpText : ' + error.toString());
        	res.status(500).json({ error: error.toString() });
		}
		res.send(wcs)
	})
})

// Fetch workClass with BAL
app.get('/wc/getBAL', (req, res) => {	  
  Wc.distinct('text', {bCode:'BAL'}, function  (error, wcs) {
  	if (error) { 
  		// console.error(error); 
  		loggerEx.error('/wc/getBAL : ' + error.toString());
        res.status(500).json({ error: error.toString() });
  	}
  	res.send(wcs)
  })
})

// Fetch BAL detail
app.get('/wc/getBALDetail/:balText', (req, res) => {	  
	Wc.findOne({bCode:'BAL', text: req.params.balText}, '', function (error, wcs) {
		if (error) { 
			// console.error(error) 
			loggerEx.error('/wc/getBALDetail/:balText : ' + error.toString());
        	res.status(500).json({ error: error.toString() });
		}
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
      // console.log(error)
      loggerEx.error('/wc : ' + error.toString());
      res.status(500).json({ error: error.toString() });
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
  // console.log(req.body)  
  Journal.findById(req.params.id, '', function (error, journals) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/journals/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }

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
    journals.itemDetail = req.body.itemDetail;
    journals.output = req.body.output;
    journals.pictureA = req.body.pictureA;
    journals.pictureB = req.body.pictureB;
    journals.pictureC = req.body.pictureC;    

    journals.save(function (error) {
      if (error) {
        // console.log(error)
        loggerEx.error('/journals/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
      }
      res.send({
        success: true
      })
    })
  })  
})

// Delete journal
app.delete('/journals/:id', (req, res) => {
	Journal.find({
		_id: req.params.id
	}, function(error, journal) {
		// 1. 서버상에 업로드한 사진 파일들을 모두 삭제한다.		
		if (journal[0].pictureA !== "") {
			var uploadedImgPath = 'journalImgs/' + journal[0].userId + '/' + journal[0].pictureA
			if (fs.existsSync(uploadedImgPath)) {
				fs.unlinkSync(uploadedImgPath)
				console.log('successfully deleted ' + uploadedImgPath);
			}
		}

		if (journal[0].pictureB !== "") {
			var uploadedImgPath = 'journalImgs/' + journal[0].userId + '/' + journal[0].pictureB
			if (fs.existsSync(uploadedImgPath)) {
				fs.unlinkSync(uploadedImgPath)
				console.log('successfully deleted ' + uploadedImgPath);
			}
		}

		if (journal[0].pictureC !== "") {
			var uploadedImgPath = 'journalImgs/' + journal[0].userId + '/' + journal[0].pictureC
			if (fs.existsSync(uploadedImgPath)) {
				fs.unlinkSync(uploadedImgPath)
				console.log('successfully deleted ' + uploadedImgPath);
			}
		}

		// 2. 해당 일지를 삭제한다.
		Journal.remove({
			_id: req.params.id
		}, function(err, lands) {
			if (err) {
				// res.send(err)
				loggerEx.error('/journals/:id : ' + err.toString());
      			res.status(500).json({ error: err.toString() });
			}
			res.send({
				success: true
			})
		})
	})	
})

// Delete journal by itemId
app.delete('/journalsByItemId/:itemId', (req, res) => {	
	// console.log(req.params.itemId)
	// https://docs.mongodb.com/manual/reference/operator/update/pull/
	Journal.update(
		{},
		{ $pull: { itemDetail: { itemId : req.params.itemId } } },
		{ multi: true },
		function(err, doc) {
	        if(err) { 
	        	// console.log(err); 
	        	loggerEx.error('/journalsByItemId/:itemId : ' + err.toString());
      			res.status(500).json({ error: err.toString() });
	        } else {
	          	res.send({success: true})
	        }
	    }
	)
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

// Fetch journals by date, workType, landId
app.get('/journals/searchBy5LandId/:userId/:startDate/:endDate/:searchWord/:landId', (req, res) => {
  // console.log(req.params)
  var matchArray = []
  var searchArray = []
  var searchArray2 = []
  var tmpArrayItem = { "userId" : req.params.userId }
  matchArray.push(tmpArrayItem)
  searchArray.push(tmpArrayItem)
  tmpArrayItem = { "date" : { "$gte": req.params.startDate, "$lte": req.params.endDate } }
  searchArray.push(tmpArrayItem)
  searchArray2.push(tmpArrayItem)

  if (req.params.landId === "0") {		  	
  } else {
  	landIdVal = mongoose.Types.ObjectId(req.params.landId)
  	tmpArrayItem = { "landId" : landIdVal }
  	searchArray.push(tmpArrayItem)
  	var tmpMatchArray = { "_id" : landIdVal }
  	matchArray.push(tmpMatchArray)
  }  

  if (req.params.searchWord === "0") {		  	
  } else {
  	tmpArrayItem = { "workContent" : { "$regex": req.params.searchWord, "$options": 'g' } } 
  	searchArray.push(tmpArrayItem)
  	searchArray2.push(tmpArrayItem)
  }  

  // var userIdForSearch = []
  // userIdForSearch.push(req.params.userId)
	// 1. 나의 share_flag 조회	
	User.find({ "id" : req.params.userId }, '', function (error, user) {
		if (error) { 
			// console.error(error); 
			loggerEx.error('/journals/searchBy5LandId/:userId/:startDate/:endDate/:searchWord/:landId : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
		}
		// console.log(user[0])
		if (user.length > 0 && user[0].share_flag === "1") {	// share_flag가 1인 경우에만 공유 검색
			// 2. lands 콜렉션에서 나의 cropCode를 조회하여 dcs 콜렉션에서 소분류 코드를 얻음
			Land.aggregate([
			    {
				    '$match' : { '$and' : matchArray }
			    },
			    {
			        '$lookup':
			        {
			            from: 'dcs',
					    localField: 'cropCode',
					    foreignField: 'dCode',
					    as: 'dcsInfo'
					}
				},
				{
				    '$unwind' : '$dcsInfo'
				}
			], function (err, lands) {
				if (err) {
					// next(err);
					loggerEx.error('/journals/searchBy5LandId/:userId/:startDate/:endDate/:searchWord/:landId : ' + err.toString());
      				res.status(500).json({ error: err.toString() });
			    } else {
			    	var sCodeArray = []
			    	for (var i = 0; i < lands.length; i++) {
			    		sCodeArray.push(lands[i].dcsInfo.sCode)
			    	}
			    	// 3. lands 콜렉션에서 나의 소분류코드와 같은 userId를 조회
		    		Land.aggregate([
		    			{
					        '$lookup':
					        {
					            from: 'dcs',
							    localField: 'cropCode',
							    foreignField: 'dCode',
							    as: 'dcsInfo'
							}
						},
						{
						    '$unwind' : '$dcsInfo'
						},
						{
						    '$match' : { 'dcsInfo.sCode' : { '$in': sCodeArray }, 'userId': { '$ne': user[0].id } }
						}
		    		], function (err2, lands2) {
						if (err2) {
							// next(err2);
							loggerEx.error('/journals/searchBy5LandId/:userId/:startDate/:endDate/:searchWord/:landId : ' + err2.toString());
      						res.status(500).json({ error: err2.toString() });
					    } else {
					    	var sameScsUsers = []
					    	for (var j = 0; j < lands2.length; j++) {
					    		sameScsUsers.push(lands2[j].userId)
					    	}
					    	// 4. 3에서 얻은 userId들 중 share_flag 가 1 인 userId만 필터링
							User.find({ "id": { "$in": sameScsUsers }, "share_flag": "1" }, '', function (error2, user2) {
								if (error2) { 
									// console.error(error2); 
									loggerEx.error('/journals/searchBy5LandId/:userId/:startDate/:endDate/:searchWord/:landId : ' + error2.toString());
      								res.status(500).json({ error: error2.toString() });
								}
								var userIdForSearch = []
								var userIdForSearch2 = []
								for (var k = 0; k < user2.length; k++) {
									userIdForSearch.push(user2[k].id)
									userIdForSearch2.push(user2[k].id)
								}
								// 자신의 ID를 뺀 타인의 userId만 searchArray2에 push
								var tempUserIds2 = {"$in" : userIdForSearch2}								
								searchArray2.push({"userId": tempUserIds2})								

								userIdForSearch.push(user[0].id)
								var tempUserIds = {"$in" : userIdForSearch}																
								searchArray[0] = {"userId": tempUserIds}																
								// 5. 4에서 얻은 userId들로 검색							
								Journal.aggregate([
								{
								    '$lookup':
								    {
								      from: 'lands',
								      localField: 'landId',
								      foreignField: '_id',
								      as: 'landInfo'
								    }
								},
								{
									"$unwind" : "$landInfo"
								},
						        {
								    '$lookup':
								    {
								      from: 'dcs',
								      localField: 'landInfo.cropCode',
								      foreignField: 'dCode',
								      as: 'dcsInfo'
								    }
								},
								{
									"$unwind" : "$dcsInfo"
								},
								{
								    "$match" : { "dcsInfo.sCode" : { "$in": sCodeArray } }
								},
								{
								    '$lookup':
								    {
								      from: 'wcs',
								      localField: 'workCode',
								      foreignField: 'wCode',
								      as: 'wcsInfo'
								    }
								},
								{
									"$unwind" : "$wcsInfo"
								},
						        {
						            "$match" : { "$and" : searchArray
						       				   }            	
						        },
						        { "$sort" : { "date": 1 } }
							    ], function (err, result) {
							        if (err) {
							            // next(err);
							            loggerEx.error('/journals/searchBy5LandId/:userId/:startDate/:endDate/:searchWord/:landId : ' + err.toString());
      									res.status(500).json({ error: err.toString() });
							        } else {
							            // res.send(result);
							            // 5-2 자신의 Id를 뺀 타인의 userId로만 조회
							            Journal.aggregate([
										{
										    '$lookup':
										    {
										      from: 'lands',
										      localField: 'landId',
										      foreignField: '_id',
										      as: 'landInfo'
										    }
										},
										{
											"$unwind" : "$landInfo"
										},
								        {
										    '$lookup':
										    {
										      from: 'dcs',
										      localField: 'landInfo.cropCode',
										      foreignField: 'dCode',
										      as: 'dcsInfo'
										    }
										},
										{
											"$unwind" : "$dcsInfo"
										},
										{
										    "$match" : { "dcsInfo.sCode" : { "$in": sCodeArray } }
										},
										{
										    '$lookup':
										    {
										      from: 'wcs',
										      localField: 'workCode',
										      foreignField: 'wCode',
										      as: 'wcsInfo'
										    }
										},
										{
											"$unwind" : "$wcsInfo"
										},
								        {
								            "$match" : { "$and" : searchArray2
								       				   }            	
								        },
								        { "$sort" : { "date": 1 } }
									    ], function (err2, result2) {
									        if (err2) {
									            // next(err2);
									            loggerEx.error('/journals/searchBy5LandId/:userId/:startDate/:endDate/:searchWord/:landId : ' + err2.toString());
      											res.status(500).json({ error: err2.toString() });
									        } else {
									        	for (var l = 0; l < result2.length; l++) {
									        		result.push(result2[l])
									        	}									        	
									            res.send(result);
									        }
									    });	
							        }
							    });					
							});				    	
					    }
					})
			    }
			});
		} else {	// share_flag가 0인 경우 자신의 일지만 검색
			Journal.aggregate([
			{
			    '$lookup':
			    {
			      from: 'lands',
			      localField: 'landId',
			      foreignField: '_id',
			      as: 'landInfo'
			    }
			},
			{
				"$unwind" : "$landInfo"
			},
	        {
			    '$lookup':
			    {
			      from: 'dcs',
			      localField: 'landInfo.cropCode',
			      foreignField: 'dCode',
			      as: 'dcsInfo'
			    }
			},
			{
				"$unwind" : "$dcsInfo"
			},
			{
			    '$lookup':
			    {
			      from: 'wcs',
			      localField: 'workCode',
			      foreignField: 'wCode',
			      as: 'wcsInfo'
			    }
			},
			{
				"$unwind" : "$wcsInfo"
			},
	        {
	            "$match" : { "$and" : searchArray
	       				   }            	
	        },
	        { "$sort" : { "date": 1 } }
		    ], function (err, result) {
		        if (err) {
		            // next(err);
		            loggerEx.error('/journals/searchBy5LandId/:userId/:startDate/:endDate/:searchWord/:landId : ' + err.toString());
      				res.status(500).json({ error: err.toString() });
		        } else {
		            res.send(result);
		        }
		    });
		}
	})
})

// Fetch journals lookup by year, month, userId
app.get('/journalsLookupByYMUserId/:ym/:userId', (req, res) => {
  // console.log(req.params)
  Journal.aggregate([
		{
		    '$lookup':
		    {
		      from: 'lands',
		      localField: 'landId',
		      foreignField: '_id',
		      as: 'landInfo'
		    }
		},
		{
			"$unwind" : "$landInfo"
		},
		{
		    '$lookup':
		    {
		      from: 'wcs',
		      localField: 'workCode',
		      foreignField: 'wCode',
		      as: 'wcsInfo'
		    }
		},
		{
			"$unwind" : "$wcsInfo"
		},
        {
            "$match" : { "$and" : [ { "userId" : req.params.userId },
            					    { "date" : { "$regex": req.params.ym } }            					    
       						  	  ] 
       				   }            	
        },
        { "$sort" : { "date": 1 } }
    ], function (err, result) {
        if (err) {
            // next(err);
            loggerEx.error('/journalsLookupByYMUserId/:ym/:userId : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
        } else {
            res.send(result);
        }
    });
})

// Fetch journals lookup by year, month, userId
app.get('/journalsLookupByYMUserIdLandId/:ym/:userId/:landId', (req, res) => {
  // console.log(req.params)
  var matchArray = []
  var searchArray = []
  var searchArray2 = []
  var tmpArrayItem = { "userId" : req.params.userId }
  matchArray.push(tmpArrayItem)
  searchArray.push(tmpArrayItem)
  tmpArrayItem = { "date" : { "$regex": req.params.ym } }
  searchArray.push(tmpArrayItem)
  searchArray2.push(tmpArrayItem)

  if (req.params.landId === "0") {		  	
  } else {	  	
	landIdVal = mongoose.Types.ObjectId(req.params.landId)
	tmpArrayItem = { "landId" : landIdVal }
  	searchArray.push(tmpArrayItem)
  	var tmpMatchArray = { "_id" : landIdVal }
  	matchArray.push(tmpMatchArray)
  }

  // var userIdForSearch = []
  	// userIdForSearch.push(req.params.userId)
	// 1. 나의 share_flag 조회	
	User.find({ "id" : req.params.userId }, '', function (error, user) {
		if (error) { 
			// console.error(error); 
			loggerEx.error('/journalsLookupByYMUserIdLandId/:ym/:userId/:landId : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
		}
		// console.log(user[0])
		if (user.length > 0 && user[0].share_flag === "1") {	// share_flag가 1인 경우에만 공유 검색
			// 2. lands 콜렉션에서 나의 cropCode를 조회하여 dcs 콜렉션에서 소분류 코드를 얻음
			Land.aggregate([
				{
				    '$match' : { '$and' : matchArray }       				              	
			    },
			    {
			        '$lookup':
			        {
			            from: 'dcs',
					    localField: 'cropCode',
					    foreignField: 'dCode',
					    as: 'dcsInfo'
					}
				},
				{
				    '$unwind' : '$dcsInfo'
				}
			], function (err, lands) {
				if (err) {
					// next(err);
					loggerEx.error('/journalsLookupByYMUserIdLandId/:ym/:userId/:landId : ' + err.toString());
      				res.status(500).json({ error: err.toString() });
			    } else {
			    	var sCodeArray = []
			    	for (var i = 0; i < lands.length; i++) {
			    		sCodeArray.push(lands[i].dcsInfo.sCode)
			    	}
			    	// 3. lands 콜렉션에서 나의 소분류코드와 같은 userId를 조회
		    		Land.aggregate([
		    			{
					        '$lookup':
					        {
					            from: 'dcs',
							    localField: 'cropCode',
							    foreignField: 'dCode',
							    as: 'dcsInfo'
							}
						},
						{
						    '$unwind' : '$dcsInfo'
						},
						{
						    '$match' : { 'dcsInfo.sCode' : { '$in': sCodeArray }, 'userId': { '$ne': user[0].id } }
						}
		    		], function (err2, lands2) {
						if (err2) {
							// next(err2);
							loggerEx.error('/journalsLookupByYMUserIdLandId/:ym/:userId/:landId : ' + err2.toString());
      						res.status(500).json({ error: err2.toString() });
					    } else {
					    	var sameScsUsers = []
					    	for (var j = 0; j < lands2.length; j++) {
					    		sameScsUsers.push(lands2[j].userId)
					    	}
					    	// 4. 3에서 얻은 userId들 중 share_flag 가 1 인 userId만 필터링
							User.find({ "id": { "$in": sameScsUsers }, "share_flag": "1" }, '', function (error2, user2) {
								if (error2) { 
									// console.error(error2); 
									loggerEx.error('/journalsLookupByYMUserIdLandId/:ym/:userId/:landId : ' + error2.toString());
      								res.status(500).json({ error: error2.toString() });
								}
								var userIdForSearch = []
								var userIdForSearch2 = []
								for (var k = 0; k < user2.length; k++) {
									userIdForSearch.push(user2[k].id)
									userIdForSearch2.push(user2[k].id)
								}

								// 자신의 Id를 뺀 타인의 userId를 searchArray2에 push
								var tempUserIds2 = {"$in" : userIdForSearch2}
								searchArray2.push({"userId": tempUserIds2})								

								userIdForSearch.push(user[0].id)
								var tempUserIds = {"$in" : userIdForSearch}																
								searchArray[0] = {"userId": tempUserIds}								
								// 5. 4에서 얻은 userId들로 검색							
								Journal.aggregate([
								{
								    '$lookup':
								    {
								      from: 'lands',
								      localField: 'landId',
								      foreignField: '_id',
								      as: 'landInfo'
								    }
								},
								{
									"$unwind" : "$landInfo"
								},
								{
								    '$lookup':
								    {
								      from: 'dcs',
								      localField: 'landInfo.cropCode',
								      foreignField: 'dCode',
								      as: 'dcsInfo'
								    }
								},
								{
									"$unwind" : "$dcsInfo"
								},
								{
								    "$match" : { "dcsInfo.sCode" : { "$in": sCodeArray } }
								},
								{
								    '$lookup':
								    {
								      from: 'wcs',
								      localField: 'workCode',
								      foreignField: 'wCode',
								      as: 'wcsInfo'
								    }
								},
								{
									"$unwind" : "$wcsInfo"
								},
						        {
						            "$match" : { "$and" : searchArray
						       				   }            	
						        },
						        { "$sort" : { "date": 1 } }
							    ], function (err, result) {
							        if (err) {
							            // next(err);
							            loggerEx.error('/journalsLookupByYMUserIdLandId/:ym/:userId/:landId : ' + err.toString());
      									res.status(500).json({ error: err.toString() });
							        } else {
							            // 5-2 농장명 검색조건을 입력하지 않았을경우 
						        		if (req.params.landId === "0") {
						        			res.send(result);						            	
						        		} else {	// 5-3 농장명 검색조건을 입력한 경우
						        			Journal.aggregate([
											{
											    '$lookup':
											    {
											      from: 'lands',
											      localField: 'landId',
											      foreignField: '_id',
											      as: 'landInfo'
											    }
											},
											{
												"$unwind" : "$landInfo"
											},
									        {
											    '$lookup':
											    {
											      from: 'dcs',
											      localField: 'landInfo.cropCode',
											      foreignField: 'dCode',
											      as: 'dcsInfo'
											    }
											},
											{
												"$unwind" : "$dcsInfo"
											},
											{
											    "$match" : { "dcsInfo.sCode" : { "$in": sCodeArray } }
											},
											{
											    '$lookup':
											    {
											      from: 'wcs',
											      localField: 'workCode',
											      foreignField: 'wCode',
											      as: 'wcsInfo'
											    }
											},
											{
												"$unwind" : "$wcsInfo"
											},
									        {
									            "$match" : { "$and" : searchArray2
									       				   }            	
									        },
									        { "$sort" : { "_id.date": 1 } }
									    	], function (err2, result2) {
									        	if (err2) {
									            	// next(err2);
									            	loggerEx.error('/journalsLookupByYMUserIdLandId/:ym/:userId/:landId : ' + err2.toString());
      												res.status(500).json({ error: err2.toString() });
									        	} else {								        		
									            	for (var l = 0; l < result2.length; l++) {
									            		result.push(result2[l])
									            	}								            	
									            	res.send(result)
									        	}
									    	});
						        		}
							        }
							    });				
							});				    	
					    }
					})
			    }
			});
		} else {	// share_flag가 0인 경우 자신의 일지만 검색
			Journal.aggregate([
			{
			    '$lookup':
			    {
			      from: 'lands',
			      localField: 'landId',
			      foreignField: '_id',
			      as: 'landInfo'
			    }
			},
			{
				"$unwind" : "$landInfo"
			},
			{
			    '$lookup':
			    {
			      from: 'dcs',
			      localField: 'landInfo.cropCode',
			      foreignField: 'dCode',
			      as: 'dcsInfo'
			    }
			},
			{
				"$unwind" : "$dcsInfo"
			},
			{
			    '$lookup':
			    {
			      from: 'wcs',
			      localField: 'workCode',
			      foreignField: 'wCode',
			      as: 'wcsInfo'
			    }
			},
			{
				"$unwind" : "$wcsInfo"
			},
	        {
	            "$match" : { "$and" : searchArray
	       				   }            	
	        },
	        { "$sort" : { "date": 1 } }
		    ], function (err, result) {
		        if (err) {
		            // next(err);
		            loggerEx.error('/journalsLookupByYMUserIdLandId/:ym/:userId/:landId : ' + err.toString());
      				res.status(500).json({ error: err.toString() });
		        } else {
		            res.send(result);
		        }
		    });
		}
	})
})

// Fetch lookup journals by date & userId & landId
app.get('/journalsLookupBy4/:startDate/:endDate/:userId/:landId', (req, res) => {
	var matchArray = []
	var searchArray = []
	var searchArray2 = []
	var tmpArrayItem = { "userId" : req.params.userId }
	matchArray.push(tmpArrayItem)
	searchArray.push(tmpArrayItem)
	tmpArrayItem = { "date" : { "$gte": req.params.startDate, "$lte": req.params.endDate } }
	searchArray.push(tmpArrayItem)
	searchArray2.push(tmpArrayItem)

	if (req.params.landId === "0") {		  	
	} else {	  	
		landIdVal = mongoose.Types.ObjectId(req.params.landId)
	  	tmpArrayItem = { "landId" : landIdVal }
  		searchArray.push(tmpArrayItem)
  		var tmpMatchArray = { "_id" : landIdVal }
  		matchArray.push(tmpMatchArray)
	}

	// var userIdForSearch = []
  	// userIdForSearch.push(req.params.userId)
	// 1. 나의 share_flag 조회	
	User.find({ "id" : req.params.userId }, '', function (error, user) {
		if (error) { 
			// console.error(error); 
			loggerEx.error('/journalsLookupBy4/:startDate/:endDate/:userId/:landId : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
		}
		// console.log(user[0])
		if (user.length > 0 && user[0].share_flag === "1") {	// share_flag가 1인 경우에만 공유 검색
			// 2. lands 콜렉션에서 나의 cropCode를 조회하여 dcs 콜렉션에서 소분류 코드를 얻음
			Land.aggregate([				
			    {
			    	'$match' : { '$and' : matchArray }
			    },
			    {
			        '$lookup':
			        {
			            from: 'dcs',
					    localField: 'cropCode',
					    foreignField: 'dCode',
					    as: 'dcsInfo'
					}
				},
				{
				    '$unwind' : '$dcsInfo'
				}
			], function (err, lands) {
				if (err) {
					// next(err);
					loggerEx.error('/journalsLookupBy4/:startDate/:endDate/:userId/:landId : ' + err.toString());
      				res.status(500).json({ error: err.toString() });
			    } else {
			    	var sCodeArray = []
			    	for (var i = 0; i < lands.length; i++) {
			    		sCodeArray.push(lands[i].dcsInfo.sCode)
			    	}
			    	// 3. lands 콜렉션에서 나의 소분류코드와 같은 userId를 조회
		    		Land.aggregate([
		    			{
					        '$lookup':
					        {
					            from: 'dcs',
							    localField: 'cropCode',
							    foreignField: 'dCode',
							    as: 'dcsInfo'
							}
						},
						{
						    '$unwind' : '$dcsInfo'
						},
						{
						    '$match' : { 'dcsInfo.sCode' : { '$in': sCodeArray }, 'userId': { '$ne': user[0].id } }
						}
		    		], function (err2, lands2) {
						if (err2) {
							// next(err2);
							loggerEx.error('/journalsLookupBy4/:startDate/:endDate/:userId/:landId : ' + err2.toString());
      						res.status(500).json({ error: err2.toString() });
					    } else {
					    	var sameScsUsers = []
					    	for (var j = 0; j < lands2.length; j++) {
					    		sameScsUsers.push(lands2[j].userId)
					    	}
					    	// 4. 3에서 얻은 userId들 중 share_flag 가 1 인 userId만 필터링
							User.find({ "id": { "$in": sameScsUsers }, "share_flag": "1" }, '', function (error2, user2) {
								if (error2) { 
									// console.error(error2); 
									loggerEx.error('/journalsLookupBy4/:startDate/:endDate/:userId/:landId : ' + error2.toString());
      								res.status(500).json({ error: error2.toString() });
								}
								var userIdForSearch = []
								var userIdForSearch2 = []
								for (var k = 0; k < user2.length; k++) {
									userIdForSearch.push(user2[k].id)
									userIdForSearch2.push(user2[k].id)
								}

								// 자신의 Id를 뺀 타인의 userId를 searchArray2에 push
								var tempUserIds2 = {"$in" : userIdForSearch2}
								searchArray2.push({"userId": tempUserIds2})

								userIdForSearch.push(user[0].id)
								var tempUserIds = {"$in" : userIdForSearch}																
								searchArray[0] = {"userId": tempUserIds}								
								// 5. 4에서 얻은 userId들로 검색							
								Journal.aggregate([
								{
								    '$lookup':
								    {
								      from: 'lands',
								      localField: 'landId',
								      foreignField: '_id',
								      as: 'landInfo'
								    }
								},
								{
									"$unwind" : "$landInfo"
								},
						        {
								    '$lookup':
								    {
								      from: 'dcs',
								      localField: 'landInfo.cropCode',
								      foreignField: 'dCode',
								      as: 'dcsInfo'
								    }
								},
								{
									"$unwind" : "$dcsInfo"
								},
								{
								    "$match" : { "dcsInfo.sCode" : { "$in": sCodeArray } }
								},
								{
								    '$lookup':
								    {
								      from: 'wcs',
								      localField: 'workCode',
								      foreignField: 'wCode',
								      as: 'wcsInfo'
								    }
								},
								{
									"$unwind" : "$wcsInfo"
								},
						        {
						            "$match" : { "$and" : searchArray
						       				   }            	
						        },
						        { "$sort" : { "_id.date": 1 } }
						    	], function (err, result) {
						        	if (err) {
						            	// next(err);
						            	loggerEx.error('/journalsLookupBy4/:startDate/:endDate/:userId/:landId : ' + err.toString());
      									res.status(500).json({ error: err.toString() });
						        	} else {
						        		// 5-2 농장명 검색조건을 입력하지 않았을경우 
						        		if (req.params.landId === "0") {
						        			res.send(result);						            	
						        		} else {	// 5-3 농장명 검색조건을 입력한 경우
						        			Journal.aggregate([
											{
											    '$lookup':
											    {
											      from: 'lands',
											      localField: 'landId',
											      foreignField: '_id',
											      as: 'landInfo'
											    }
											},
											{
												"$unwind" : "$landInfo"
											},
									        {
											    '$lookup':
											    {
											      from: 'dcs',
											      localField: 'landInfo.cropCode',
											      foreignField: 'dCode',
											      as: 'dcsInfo'
											    }
											},
											{
												"$unwind" : "$dcsInfo"
											},
											{
											    "$match" : { "dcsInfo.sCode" : { "$in": sCodeArray } }
											},
											{
											    '$lookup':
											    {
											      from: 'wcs',
											      localField: 'workCode',
											      foreignField: 'wCode',
											      as: 'wcsInfo'
											    }
											},
											{
												"$unwind" : "$wcsInfo"
											},
									        {
									            "$match" : { "$and" : searchArray2
									       				   }            	
									        },
									        { "$sort" : { "_id.date": 1 } }
									    	], function (err2, result2) {
									        	if (err2) {
									            	// next(err2);
									            	loggerEx.error('/journalsLookupBy4/:startDate/:endDate/:userId/:landId : ' + err2.toString());
      												res.status(500).json({ error: err2.toString() });
									        	} else {								        		
									            	for (var l = 0; l < result2.length; l++) {
									            		result.push(result2[l])
									            	}								            	
									            	res.send(result)
									        	}
									    	});
						        		}						            	
						        	}
						    	});				
							});				    	
					    }
					})
			    }
			});
		} else {	// share_flag가 0인 경우 자신의 일지만 검색
			Journal.aggregate([
			{
			    '$lookup':
			    {
			      from: 'lands',
			      localField: 'landId',
			      foreignField: '_id',
			      as: 'landInfo'
			    }
			},
			{
				"$unwind" : "$landInfo"
			},
	        {
			    '$lookup':
			    {
			      from: 'dcs',
			      localField: 'landInfo.cropCode',
			      foreignField: 'dCode',
			      as: 'dcsInfo'
			    }
			},
			{
				"$unwind" : "$dcsInfo"
			},
			{
			    '$lookup':
			    {
			      from: 'wcs',
			      localField: 'workCode',
			      foreignField: 'wCode',
			      as: 'wcsInfo'
			    }
			},
			{
				"$unwind" : "$wcsInfo"
			},
	        {
	            "$match" : { "$and" : searchArray
	       				   }            	
	        },
	        { "$sort" : { "_id.date": 1 } }
		    ], function (err, result) {
		        if (err) {
		            // next(err);
		            loggerEx.error('/journalsLookupBy4/:startDate/:endDate/:userId/:landId : ' + err.toString());
      				res.status(500).json({ error: err.toString() });
		        } else {
		            res.send(result);
		        }
		    });
		}
	})
})

// Fetch lookup journals by date & userId
app.get('/journalsLookup/:startDate/:endDate/:userId', (req, res) => {
	// console.log("journalsLookup IN!")
	var userIdForSearch = []
	userIdForSearch.push(req.params.userId)
	// 1. 나의 share_flag 조회	
	User.find({ "id" : req.params.userId }, '', function (error, user) {
		if (error) { 
			// console.error(error); 
			loggerEx.error('/journalsLookup/:startDate/:endDate/:userId : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
		}
		// console.log(user[0])
		if (user.length > 0 && user[0].share_flag === "1") {	// share_flag가 1인 경우에만 공유 검색
			// 2. lands 콜렉션에서 나의 cropCode를 조회하여 dcs 콜렉션에서 소분류 코드를 얻음
			Land.aggregate([
				{
				    '$match' : { 'userId' : user[0].id }       				              	
			    },
			    {
			        '$lookup':
			        {
			            from: 'dcs',
					    localField: 'cropCode',
					    foreignField: 'dCode',
					    as: 'dcsInfo'
					}
				},
				{
				    '$unwind' : '$dcsInfo'
				}
			], function (err, lands) {
				if (err) {
					// next(err);
					loggerEx.error('/journalsLookup/:startDate/:endDate/:userId : ' + err.toString());
      				res.status(500).json({ error: err.toString() });
			    } else {
			    	var sCodeArray = []
			    	for (var i = 0; i < lands.length; i++) {
			    		sCodeArray.push(lands[i].dcsInfo.sCode)
			    	}
			    	// 3. lands 콜렉션에서 나의 소분류코드와 같은 userId를 조회
		    		Land.aggregate([
		    			{
					        '$lookup':
					        {
					            from: 'dcs',
							    localField: 'cropCode',
							    foreignField: 'dCode',
							    as: 'dcsInfo'
							}
						},
						{
						    '$unwind' : '$dcsInfo'
						},
						{
						    '$match' : { 'dcsInfo.sCode' : { '$in': sCodeArray }, 'userId': { '$ne': user[0].id } }
						}
		    		], function (err2, lands2) {
						if (err2) {
							// next(err2);
							loggerEx.error('/journalsLookup/:startDate/:endDate/:userId : ' + err2.toString());
      						res.status(500).json({ error: err2.toString() });
					    } else {
					    	var sameScsUsers = []
					    	for (var j = 0; j < lands2.length; j++) {
					    		sameScsUsers.push(lands2[j].userId)
					    	}
					    	// 4. 3에서 얻은 userId들 중 share_flag 가 1 인 userId만 필터링
							User.find({ "id": { "$in": sameScsUsers }, "share_flag": "1" }, '', function (error2, user2) {
								if (error2) { 
									// console.error(error2); 
									loggerEx.error('/journalsLookup/:startDate/:endDate/:userId : ' + error2.toString());
      								res.status(500).json({ error: error2.toString() });
								}
								for (var k = 0; k < user2.length; k++) {
									userIdForSearch.push(user2[k].id)
								}
								// 5. 4에서 얻은 userId들로 검색							
								Journal.aggregate([
									{
							            "$match" : { "$and" : [ { "userId" : { "$in": userIdForSearch } },
							            					    { "date" : { "$gte": req.params.startDate, "$lte": req.params.endDate } }            					    
							       						  	  ] 
							       				   }            	
							        },
									{
									    '$lookup':
									    {
									      from: 'lands',
									      localField: 'landId',
									      foreignField: '_id',
									      as: 'landInfo'
									    }
									},
									{
										"$unwind" : "$landInfo"
									},
							        {
									    '$lookup':
									    {
									      from: 'dcs',
									      localField: 'landInfo.cropCode',
									      foreignField: 'dCode',
									      as: 'dcsInfo'
									    }
									},
									{
										"$unwind" : "$dcsInfo"
									},
									{
									    "$match" : { "dcsInfo.sCode" : { "$in": sCodeArray } }
									},
									{
									    '$lookup':
									    {
									      from: 'wcs',
									      localField: 'workCode',
									      foreignField: 'wCode',
									      as: 'wcsInfo'
									    }
									},
									{
										"$unwind" : "$wcsInfo"
									},
							        { "$sort" : { "_id.date": 1 } }
							    ], function (err, result) {
							        if (err) {
							            // next(err);
							            loggerEx.error('/journalsLookup/:startDate/:endDate/:userId : ' + err.toString());
      									res.status(500).json({ error: err.toString() });
							        } else {
							            res.send(result);
							        }
							    });					
							});				    	
					    }
					})
			    }
			});
		} else {	// share_flag가 0인 경우 자신의 일지만 검색
			Journal.aggregate([
			{
	            "$match" : { "$and" : [ { "userId" : req.params.userId },
	            					    { "date" : { "$gte": req.params.startDate, "$lte": req.params.endDate } }            					    
	       						  	  ] 
	       				   }            	
	        },
			{
			    '$lookup':
			    {
			      from: 'lands',
			      localField: 'landId',
			      foreignField: '_id',
			      as: 'landInfo'
			    }
			},
			{
				"$unwind" : "$landInfo"
			},
	        {
			    '$lookup':
			    {
			      from: 'dcs',
			      localField: 'landInfo.cropCode',
			      foreignField: 'dCode',
			      as: 'dcsInfo'
			    }
			},
			{
				"$unwind" : "$dcsInfo"
			},
			{
			    '$lookup':
			    {
			      from: 'wcs',
			      localField: 'workCode',
			      foreignField: 'wCode',
			      as: 'wcsInfo'
			    }
			},
			{
				"$unwind" : "$wcsInfo"
			},
	        { "$sort" : { "_id.date": 1 } }
	    ], function (err, result) {
	        if (err) {
	            // next(err);
	            loggerEx.error('/journalsLookup/:startDate/:endDate/:userId : ' + err.toString());
      			res.status(500).json({ error: err.toString() });
	        } else {
	            res.send(result);
	        }
	    });
		}
	})	
})

// Fetch journals by date & userId
app.get('/journalsByYMNUserId/:startYM/:endYM/:userId', (req, res) => {
  // console.log(req.params)
  Journal.find({}, '', function (error, journals) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/journalsByYMNUserId/:startYM/:endYM/:userId : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(journals)
  })
  .where('date').gte(req.params.startYM + '-01 00:00:00').lte(req.params.endYM + '-31 23:59:59')
  .where('userId').equals(req.params.userId)
  .where('income.amount').ne('')
  .where('income.amount').ne(null)
})

// Fetch journals by date & userId & Coo.cost != null
app.get('/journalsByYMNUserIdAndCoo/:startYM/:endYM/:userId', (req, res) => {
  // console.log(req.params)
  Journal.find({}, '', function (error, journals) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/journalsByYMNUserIdAndCoo/:startYM/:endYM/:userId : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(journals)
  })
  .where('date').gte(req.params.startYM + '-01 00:00:00').lte(req.params.endYM + '-31 23:59:59')
  .where('userId').equals(req.params.userId)
  .where('COO.cost').ne('')
  .where('COO.cost').ne(null)
  .sort({'date': 1})
})

// Fetch journals lookup by userId
app.get('/journalsLookupByUserId/:userId', (req, res) => {
	Journal.aggregate([
		{
		    '$lookup':
		    {
		      from: 'lands',
		      localField: 'landId',
		      foreignField: '_id',
		      as: 'landInfo'
		    }
		},
		{
			"$unwind" : "$landInfo"
		},        
		{
		    '$lookup':
		    {
		      from: 'wcs',
		      localField: 'workCode',
		      foreignField: 'wCode',
		      as: 'wcsInfo'
		    }
		},
		{
			"$unwind" : "$wcsInfo"
		},
        {
            "$match" : { "userId" : req.params.userId }           	
        },
        { "$sort" : { "date": 1 } }
    ], function (err, result) {
        if (err) {
            // next(err);
            loggerEx.error('/journalsLookupByUserId/:userId : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
        } else {
            res.send(result);
        }
    });
})

// Fetch journal by id
app.get('/journal/:id', (req, res) => {  
  Journal.find({}, '', function (error, journals) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/journal/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(journals)
  })
  .where('_id').equals(req.params.id)
})

// Add new journal
app.post('/journal', (req, res) => {
  // console.log(req.body);  
  var userId = req.body.userId;
  var date = req.body.date;
  // var landId = req.body.landId;
  landIdVal = mongoose.Types.ObjectId(req.body.landId)
  var landId = landIdVal
  var workCode = req.body.workCode;
  var workContent = req.body.workContent;
  var workTime = req.body.workTime;
  var workerNumber = req.body.workerNumber;
  var weather = req.body.weather;
  var remarks = req.body.remarks;
  var coo = req.body.coo;
  var shipment = req.body.shipment;
  var income = req.body.income;
  var itemDetail = req.body.itemDetail;
  var output = req.body.output;
  var pictureA = req.body.pictureA;
  var pictureB = req.body.pictureB;
  var pictureC = req.body.pictureC;
  
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
    itemDetail: itemDetail,
    output: output,
    pictureA: pictureA,
    pictureB: pictureB,
    pictureC: pictureC
  })

  new_journal.save(function (error, result) {
    if (error) {
      // console.log(error)
      loggerEx.error('/journal : ' + error.toString());
      res.status(500).json({ error: error.toString() });
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
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/scByDcode/:dCode : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
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
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/dcByScode/:sCode : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send({
      dcs: dcs
    })
  })
  .where('sCode').equals(req.params.sCode)
  .sort({text:1})
})

// Fetch cropName by cropCode
app.get('/dc/getCN/:cropCode', (req, res) => {  
  var cropCode = req.params.cropCode
  
  Dc.find({}, 'sCode dCode text', function (error, scs) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/dc/getCN/:cropCode : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(scs)
  })  
  .where('dCode').equals(cropCode)
})

// Fetch smallClass by sCode
app.get('/scByScode/:sCode', (req, res) => {
  Sc.find({}, 'mCode sCode text', function (error, scs) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/scByScode/:sCode : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
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
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/scByMcode/:mCode : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
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
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/mcByScode/:sCode : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send({
      scs: scs
    })
  })
  .where('sCode').equals(req.params.sCode)
  .sort({text:1})
})

// Fetch cropName by cropCode
app.get('/sc/getCN/:cropCode', (req, res) => {  
  var cropCode = req.params.cropCode
  var bc = cropCode.substring(0, 3)
  var mc = cropCode.substring(3, 7)
  var sc = cropCode.substring(7, 11)
  Sc.find({}, 'bCode mCode sCode text', function (error, scs) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/sc/getCN/:cropCode : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(scs)
  })
  .where('bCode').equals(bc)
  .where('mCode').equals(mc)
  .where('sCode').equals(sc)
})

// Fetch mediumClass by mCode
app.get('/mcByMcode/:mCode', (req, res) => {
  Mc.find({}, 'bCode mCode text', function (error, mcs) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/mcByMcode/:mCode : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
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
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/bcByMcode/:mCode : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
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
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/mc/:bCode : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send({
      mcs: mcs
    })
  })
  .where('bCode').equals(req.params.bCode)
  .sort({text:1})
})

// Fetch all bigClass
app.get('/bc', (req, res) => {
  Bc.find({}, 'bCode text', function (error, bcs) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/bc : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send({
      bcs: bcs
    })
  })
  .sort({text:1})
})

// Fetch name by landId
app.get('/lands/getName/:id', (req, res) => {
  Land.find({}, '', function (error, lands) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/lands/getName/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(lands)
  })
  .where('_id').equals(req.params.id)
})

// Fetch name by landId
app.get('/lands/getCropName/:id', (req, res) => {
  Land.find({}, '', function (error, lands) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/lands/getCropName/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }    
    Dc.find({}, '', function (error2, dcs) {
    	if (error2) { 
    		// console.error(error2); 
    		loggerEx.error('/lands/getCropName/:id : ' + error2.toString());
      		res.status(500).json({ error: error2.toString() });
    	}
    	res.send(dcs)
    })
    .where('dCode').equals(lands[0].cropCode)    
  })
  .where('_id').equals(req.params.id)
})

// Fetch cropCode by landId
app.get('/lands/getCC/:id', (req, res) => {
  Land.find({}, '', function (error, lands) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/lands/getCC/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
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
  var addressDetail = req.body.addressDetail;
  var size = req.body.size;
  var sizeDetail = req.body.sizeDetail;
  var cropCode = req.body.cropCode;
  var new_land = new Land({
    userId: userId,
    name: name,
    address: address,
    addressDetail: addressDetail,
    size: size,
    sizeDetail: sizeDetail,
    cropCode: cropCode
  })

  new_land.save(function (error) {
    if (error) {
      // console.log(error)
      loggerEx.error('/lands : ' + error.toString());
      res.status(500).json({ error: error.toString() });
    }
    res.send({
      success: true,
      message: 'Land saved successfully!'
    })
  })
})

// Fetch all lands by userId
app.get('/lands/:id', (req, res) => {
  // console.log(req.params)
  Land.find({}, 'userId name address addressDetail size sizeDetail cropCode', function (error, lands) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/lands/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send({
      lands: lands
    })
  })
  .where('userId').equals(req.params.id)
  .sort({_id:-1})
})

// Update land
app.put('/lands/:id', (req, res) => {
  // console.log(req.body)
  Land.findById(req.params.id, 'userId name', function (error, lands) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/lands/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    lands.name = req.body.name
    lands.address = req.body.address
    lands.addressDetail = req.body.addressDetail
    lands.size = req.body.size
    lands.sizeDetail = req.body.sizeDetail
    lands.cropCode = req.body.cropCode
    lands.save(function (error) {
      if (error) {
        // console.log(error)
        loggerEx.error('/lands/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
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
			// res.send(err2)
			loggerEx.error('/lands/:id : ' + err2.toString());
      		res.status(500).json({ error: err2.toString() });
		}		
		// console.log('journals removed! - ' + journals)
	})

	// 이 농장과 연계된 자재일지를 모두 삭제	
	Item.remove({
		landId: req.params.id
	}, function(err3, items) {
		if (err3) {
			// res.send(err3)
			loggerEx.error('/lands/:id : ' + err3.toString());
      		res.status(500).json({ error: err3.toString() });
		}		
		// console.log('items removed! - ' + items)
	})

	Land.remove({
		_id: req.params.id
	}, function(err, lands) {
		if (err) {
			// res.send(err)
			loggerEx.error('/lands/:id : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
		}
		res.send({
			success: true
		})
	})
})

// Fetch single user
app.get('/user/:id', (req, res) => {  
  User.find({}, '', function (error, user) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/user/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(user)
  })
  .where('id').equals(req.params.id)
})

// Update a user age & sex
app.put('/userBirthDateSex/:id', (req, res) => {
	User.find({}, '', function (error, user) {
		if (error) { 
			// console.error(error); 
			loggerEx.error('/userBirthDateSex/:id : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
		}
	    user[0].birth_date = req.body.birth_date
	    user[0].sex = req.body.sex
	    user[0].save(function (error) {
	      if (error) {
	        // console.log(error)
	        loggerEx.error('/userBirthDateSex/:id : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
	      }
	      res.send({
	        success: true
	      })
	    })
	})
	.where('id').equals(req.params.id)
})

// Update a user phone_no
app.put('/userPhoneNo/:id', (req, res) => {  
	User.find({}, '', function (error, user) {
		if (error) { 
			// console.error(error); 
			loggerEx.error('/userPhoneNo/:id : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
		}
		user[0].phone_no = req.body.phone_no

	    user[0].save(function (error) {
	      if (error) {
	        // console.log(error)
	        loggerEx.error('/userPhoneNo/:id : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
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
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/userShareFlag/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    user[0].share_flag = req.body.share_flag

    user[0].save(function (error) {
      if (error) {
        // console.log(error)
        loggerEx.error('/userShareFlag/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
      }
      res.send({
        success: true
      })
    })
  })
  .where('id').equals(req.params.id)
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
	// console.log(req.body);
  	var phone_no = req.body.phone_no;

  	SmsAuth.remove({
		phone_no: phone_no
	}, function(err, lands) {
		if (err) { 
			// res.send(err) 
			loggerEx.error('/addNewSMSAuth : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
		}		
	})

  	var auth_code = Math.floor(1000 + Math.random() * 9000);
  	var auth_date = getNowDate();

  	var new_sms_auth = new SmsAuth({
    	phone_no: phone_no,
    	auth_code: auth_code,
    	auth_date: auth_date
  	})
  
  	new_sms_auth.save(function (error, result) {
  		if (error) { 
  			// console.log(error) 
  			loggerEx.error('/addNewSMSAuth : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
  		}
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
		if (error) { 
			// console.error(error); 
			loggerEx.error('/getAuthCode/:phone_no : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
		}
	    res.send(result)
	}).where('phone_no').equals(req.params.phone_no)
})

// Delete smsauth
app.delete('/deleteSMSAuth/:phoneNo', (req, res) => {
	SmsAuth.remove({
		phone_no: req.params.phoneNo
	}, function(err, lands) {
		if (err) {
			// res.send(err)
			loggerEx.error('/deleteSMSAuth/:phoneNo : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
		}
		res.send({
			success: true
		})
	})
})

// Fetch joinuser by id
app.get('/joinUser/:id', (req, res) => {
  JoinUser.find({}, '_id', function (error, joinuser) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/joinUser/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(joinuser)
  })
  .where('id').equals(req.params.id)
})

// Add new user, joinusers
app.post('/addNewUser', (req, res) => {
  // console.log(req.body);
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
  var share_flag = "0";

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
    mod_date: mod_date,
    share_flag: share_flag   
  })

  var join_user = new JoinUser({
  	id: id,
  	join_date: join_date
  })

  new_user.save(function (error, result) {
    if (error) {
      // console.log(error)
      loggerEx.error('/addNewUser : ' + error.toString());
      res.status(500).json({ error: error.toString() });
    }

    join_user.save(function (error, result2) {
    	if (error) {
	      // console.log(error)
	      loggerEx.error('/addNewUser : ' + error.toString());
      	  res.status(500).json({ error: error.toString() });
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
	User.find({}, '', function (error, result) {
		if (error) { 			
			loggerEx.error('/login : ' + error.toString());
      	  	res.status(500).json({ error: error.toString() });
		}
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

	/*
	User.find({}).where('id').equals(req.body.id)
	.then((result) => {
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
	.catch((error) => {
		loggerEx.error('/login : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
	})
	*/
})

// Create random password
// http://ilikefox.tistory.com/6
function createCode(objArr, iLength) {
    var arr = objArr;
    var randomStr = "";
    
    for (var j = 0; j < iLength; j++) {
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
		if (error) { 
			// console.error(error); 
			loggerEx.error('/findPassword/:id : ' + error.toString());
      	  	res.status(500).json({ error: error.toString() });
		}

		if (0 == result.length) {
			res.status(201).json([{error: "Invalid id"}]);
		} else {
			User.findById(result[0]._id, '', function (error, users) {
		    	if (error) { 
		    		// console.error(error); 
		    		loggerEx.error('/findPassword/:id : ' + error.toString());
      	  			res.status(500).json({ error: error.toString() });
		    	}
		    	var newPw = getRandomCode()	// 임시비밀번호 생성
			    users.password = CryptoJS.AES.encrypt(newPw, cryptoKey)
			    users.tmp_pw_date = getNowDate()
			    users.save(function (error) {
				    if (error) {
				       	// console.log(error)
				       	loggerEx.error('/findPassword/:id : ' + error.toString());
      	  				res.status(500).json({ error: error.toString() });
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
				    // console.log(newPw)

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
		if (error) { 
			// console.error(error); 
			loggerEx.error('/checkPasswordExpired/:id : ' + error.toString());
      	  	res.status(500).json({ error: error.toString() });
		}

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
    	if (error) { 
    		// console.error(error); 
    		loggerEx.error('/updateUserPassword : ' + error.toString());
      	  	res.status(500).json({ error: error.toString() });
    	}

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
		       	// console.log(error)
		       	loggerEx.error('/updateUserPassword : ' + error.toString());
      	  		res.status(500).json({ error: error.toString() });
		    }
		    res.send({
		        success: true
		    })
	    })
	})
	.where('id').equals(req.body.id)
})

// Fetch users by date, searchType, searchContent
app.get('/users/searchBy4/:startDate/:endDate/:searchType/:searchContent', (req, res) => {
  // console.log(req.params)
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
    	if (error) { 
    		// console.error(error); 
    		loggerEx.error('/updateUser/:id : ' + error.toString());
      	  	res.status(500).json({ error: error.toString() });
    	}
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
		       	// console.log(error)
		       	loggerEx.error('/updateUser/:id : ' + error.toString());
      	  		res.status(500).json({ error: error.toString() });
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
			// res.send(err)
			loggerEx.error('/deleteUser/:id : ' + err.toString());
      	  	res.status(500).json({ error: err.toString() });
		}
		res.send({
			success: true
		})
	})
})

// Fetch items by userId, wCode
app.get('/itemsByWcode/:userId/:wCode', (req, res) => {
  Item.find({}, '', function (error, items) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/itemsByWcode/:userId/:wCode : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(items)
  })
  .where('userId').equals(req.params.userId)
  .where('item').equals(req.params.wCode)
})

// Update item
app.put('/item/:id', (req, res) => { 
  // console.log(req.body)  
  Item.findById(req.params.id, '', function (error, item) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/item/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }

    item.userId = req.body.userId;
    item.date = req.body.date;
    item.landId = req.body.landId;
    item.item = req.body.item;
  	item.itemDetail = req.body.itemDetail;
  	item.purpose = req.body.purpose;
  	item.pictureA = req.body.pictureA;
  	item.pictureB = req.body.pictureB;
  	item.pictureC = req.body.pictureC;    

    item.save(function (error) {
      if (error) {
        // console.log(error)
        loggerEx.error('/item/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
      }
      res.send({
        success: true
      })
    })
  })  
})

// Update item usage
app.put('/itemUpdateUsage', (req, res) => { 
  // console.log(req.body)  
  Item.find({}, '', function (error, item) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/itemUpdateUsage : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }

    for(var i = 0; i < item[0].itemDetail.length; i++) {
    	if(item[0].itemDetail[i].itemName === req.body.itemName) {
    		var itemUsage = item[0].itemDetail[i].itemUsage * 1
    		var journalUsage = req.body.usage * 1    		
    		var totalUsage = itemUsage + journalUsage
    		// console.log('totalUsage=' + totalUsage)

    		item[0].itemDetail[i].itemUsage = totalUsage

    		item[0].save(function (error) {
    			if (error) {
			       // console.log(error)
			       loggerEx.error('/itemUpdateUsage : ' + error.toString());
      			   res.status(500).json({ error: error.toString() });
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
  // var landId = req.body.landId;
  landIdVal = mongoose.Types.ObjectId(req.body.landId)
  var landId = landIdVal
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
      // console.log(error)
      loggerEx.error('/item : ' + error.toString());
      res.status(500).json({ error: error.toString() });
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
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/items/:userId : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(items)
  })
  .where('userId').equals(req.params.userId)
})

// Fetch items lookup by userId
app.get('/itemsLookupByUserId/:userId', (req, res) => {
	Item.aggregate([        
		{
		    '$lookup':
		    {
		      from: 'wcs',
		      localField: 'item',
		      foreignField: 'wCode',
		      as: 'wcsInfo'
		    }
		},
		{
			"$unwind" : "$wcsInfo"
		},
        {
            "$match" : { "userId" : req.params.userId }           	
        },
        { "$sort" : { "date": 1 } }
    ], function (err, result) {
        if (err) {
            // next(err);
            loggerEx.error('/itemsLookupByUserId/:userId : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
        } else {
            res.send(result);
        }
    });
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
            // next(err);
            loggerEx.error('/item/agg/:userId/:startDate/:endDate : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
        } else {
            res.send(result);
        }
    });
})

// Fetch items with aggregate by date & landId
app.get('/item/aggByDateNLandId/:userId/:startDate/:endDate/:landId', (req, res) => {
	if(req.params.landId === "0") {		
		req.params.landId = ''
	}
	Item.aggregate([
		{
		    '$lookup':
		    {
		      from: 'itemdetails',
		      localField: 'itemDetail',
		      foreignField: 'itemId',
		      as: 'item_details'
		    }
		},
		{
			"$unwind" : "$item_details"
		},
        {
            "$group" : {
                "_id" : { "_id" : "$_id",
                	      "date" : "$date",
                		  "userId" : "$userId",
                		  "landId" : "$landId", 
		             	  "item" : "$item",
		             	  "itemName" : "$item_details.itemName", 
		             	  "itemAmount" : "$item_details.itemAmount", 
		             	  "itemPrice" : "$item_details.itemPrice", 
		             	  "itemUsage" : "$item_details.itemUsage" 
                		}
            }
        },
        {
            "$match" : { "$and" : [ { "_id.userId" : req.params.userId },
            					    { "_id.date" : { "$gte": req.params.startDate, "$lte": req.params.endDate } },
            					    { "_id.landId" : { "$regex": req.params.landId, "$options": 'g' } }            					    
       						  	  ] 
       				   }            	
        },
        { "$sort" : { "_id.date": 1 } }
    ], function (err, result) {
        if (err) {
            // next(err);
            loggerEx.error('/item/aggByDateNLandId/:userId/:startDate/:endDate/:landId : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
        } else {
            res.send(result);
        }
    });
})

// Fetch items with aggregate by date & landId
app.get('/item/aggByYMNLandId/:userId/:ym/:landId', (req, res) => {
	if(req.params.landId === "0") {		
		req.params.landId = ''
	}	
	Item.aggregate([
		{
		    '$lookup':
		    {
		      from: 'itemdetails',
		      localField: 'itemDetail',
		      foreignField: 'itemId',
		      as: 'item_details'
		    }
		},
		{
			"$unwind" : "$item_details"
		},
        {
            "$group" : {
                "_id" : { "_id" : "$_id",
                	      "date" : "$date",
                		  "userId" : "$userId",
                		  "landId" : "$landId", 
		             	  "item" : "$item",
		             	  "itemName" : "$item_details.itemName", 
		             	  "itemAmount" : "$item_details.itemAmount", 
		             	  "itemPrice" : "$item_details.itemPrice", 
		             	  "itemUsage" : "$item_details.itemUsage" 
                		}
            }
        },
        {
            "$match" : { "$and" : [ { "_id.userId" : req.params.userId },
            					    { "_id.date" : { "$regex": req.params.ym } },
            					    { "_id.landId" : { "$regex": req.params.landId, "$options": 'g' } }            					    
       						  	  ] 
       				   }            	
        },
        { "$sort" : { "_id.date": 1 } }
    ], function (err, result) {
        if (err) {
            // next(err);
            loggerEx.error('/item/aggByYMNLandId/:userId/:ym/:landId : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
        } else {
            res.send(result);
        }
    });
})

// Fetch items with aggregate by 4
app.get('/item/agg/searchBy5/:userId/:startDate/:endDate/:itemName/:landId', (req, res) => {	
	if(req.params.itemName === "0") {		
		req.params.itemName = ''
	}
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
       						  		{ "_id.itemName" : { "$regex": req.params.itemName, "$options": 'g' } }
       						  	  ] 
       				   } 	
        },
        { "$sort" : { "_id.date": 1 } }
    ], function (err, result) {
        if (err) {
            // next(err);
            loggerEx.error('/item/agg/searchBy5/:userId/:startDate/:endDate/:itemName/:landId : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
        } else {
            res.send(result);
        }
    });
})

// Fetch item by id
app.get('/item/:id', (req, res) => {  
  Item.find({}, '', function (error, item) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/item/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(item)
  })
  .where('_id').equals(req.params.id)
})

// Delete item
app.delete('/item/:id', (req, res) => {
  ItemDetail.find({}, '', function (error, ids) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/item/:id : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    
    // 삭제할 itemId 얻기
    var itemIdArray = []
    for (var i = 0; i < ids.length; i++) {
    	itemIdArray.push(ids[i].itemId)
    }

    // journal에서 해당 itemId 삭제
	Journal.update(
		{},
		{ $pull: { itemDetail: { itemId : { $in: itemIdArray } } } },
		{ multi: true },
		function(err, doc) {
	        if(err) { 
	        	// console.log(err); 
	        	loggerEx.error('/item/:id : ' + err.toString());
      			res.status(500).json({ error: err.toString() });
	        }
	        else {
	          Item.find({
					_id: req.params.id
				}, function(error, item) {
					// 서버상에 업로드한 사진 파일들을 모두 삭제한다.		
					if (item[0].pictureA !== "") {
						var uploadedImgPath = 'journalImgs/' + item[0].userId + '/' + item[0].pictureA
						if (fs.existsSync(uploadedImgPath)) {
							fs.unlinkSync(uploadedImgPath)
							console.log('successfully deleted ' + uploadedImgPath);
						}
					}

					if (item[0].pictureB !== "") {
						var uploadedImgPath = 'journalImgs/' + item[0].userId + '/' + item[0].pictureB
						if (fs.existsSync(uploadedImgPath)) {
							fs.unlinkSync(uploadedImgPath)
							console.log('successfully deleted ' + uploadedImgPath);
						}
					}

					if (item[0].pictureC !== "") {
						var uploadedImgPath = 'journalImgs/' + item[0].userId + '/' + item[0].pictureC
						if (fs.existsSync(uploadedImgPath)) {
							fs.unlinkSync(uploadedImgPath)
							console.log('successfully deleted ' + uploadedImgPath);
						}
					}

					// item 삭제
		            Item.remove({
						_id: req.params.id
				    }, function(err, lands) {
						if (err) {
							// res.send(err)
							loggerEx.error('/item/:id : ' + err.toString());
      						res.status(500).json({ error: err.toString() });
						}
						// itemdetails 컬렉션에서 parentId에 해당하는 도큐먼트 삭제
						ItemDetail.remove({parentId: req.params.id}, function(err2, ids2) {
							if (err2) { 
								// res.send(err2) 
								loggerEx.error('/item/:id : ' + err2.toString());
      							res.status(500).json({ error: err2.toString() });
							}
							res.send({success: true})							
						})
				 	})
			  })
	        }
	    }
	)
  })
  .where('parentId').equals(req.params.id)
})

// Fetch items by date, item
app.get('/items/searchBy3/:startDate/:endDate/:item', (req, res) => {  
  // console.log(req.params)
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
  // console.log(req.params)
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
  // console.log(req.params)
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

// Fetch items by date, userId, landId
app.get('/items/searchBy5/:startDate/:endDate/:userId/:landId/:itemName', (req, res) => { 	
	var startDate = req.params.startDate.replace(/-/gi, "")
	startDate += '000000000'	

	var endDate = req.params.endDate.replace(/-/gi, "")
	endDate += '235959999'	

	if ('ALL' == req.params.itemName) {
		req.params.itemName = ""
	}

	var itemDetails = []
	ItemDetail.find({ "itemName" : { $regex: req.params.itemName, $options: 'g' } }, '', function (error, ids) {
	 	if (error) { 
	 		// console.error(error); 
	 		loggerEx.error('/items/searchBy5/:startDate/:endDate/:userId/:landId/:itemName : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
	 	}
	 
	 	var idArray = []
	 	for (var i = 0; i < ids.length; i++) {
	 		idArray.push(ids[i].parentId)
	 	}
	 	var itemResult = getItemByLandId(idArray, req.params.landId)
	 	itemResult.then(function(result) {
 			// console.log(result)
 			for (var j = 0; j < ids.length; j++) {
 				for (var k = 0; k < result.length; k++) {
 					// console.log(ids[j].parentId + '//' + result[k]._id)
 					if (ids[j].parentId == result[k]._id) {
 						var tmpIds = {}			
 						tmpIds.landId = result[k].landId
 						tmpIds.date = result[k].date
 						tmpIds.item = result[k].item
 						tmpIds._id = result[k]._id
 						tmpIds.userId = result[k].userId
 						tmpIds.itemId = ids[j].itemId
 						tmpIds.itemName = ids[j].itemName
 						tmpIds.itemAmount = ids[j].itemAmount
 						tmpIds.itemUsage = ids[j].itemUsage
 						tmpIds.journalUsage = ids[j].journalUsage
 						tmpIds.itemPrice = ids[j].itemPrice 						 						
 						itemDetails.push(tmpIds) 
 					} 					
 				}
 			}
 			// console.log(itemDetails)
 			res.send(itemDetails)						
 		})


	})
	.where('userId').equals(req.params.userId)
	.where('itemId').gte(startDate).lte(endDate)
})

// Fetch items lookup by date, userId, landId
app.get('/items/lookupBy5/:startDate/:endDate/:userId/:landId/:itemName', (req, res) => { 
	// console.log(req.params)
	var searchArray = []
	var tmpArrayItem = { "userId" : req.params.userId }
	searchArray.push(tmpArrayItem)
	tmpArrayItem = { "date" : { "$gte": req.params.startDate, "$lte": req.params.endDate } }
	searchArray.push(tmpArrayItem)

	if (req.params.landId === "0") {		  	
	} else {	  	
		landIdVal = mongoose.Types.ObjectId(req.params.landId)
	  	tmpArrayItem = { "landId" : landIdVal }
  		searchArray.push(tmpArrayItem)
	}  

	if (req.params.itemName === "0") {		  	
	} else {
	  	tmpArrayItem = { "itemDetailInfo.itemName" : { "$regex": req.params.itemName } } 
	  	searchArray.push(tmpArrayItem)
	}  

	Item.aggregate([
		{
			"$unwind" : "$itemDetail"
		},
		{
		    '$lookup':
		    {
		      from: 'itemdetails',
		      localField: 'itemDetail',
		      foreignField: 'itemId',
		      as: 'itemDetailInfo'
		    }
		},
		{
		    '$unwind': '$itemDetailInfo'
		},
		{
		    '$lookup':
		    {
		      from: 'lands',
		      localField: 'landId',
		      foreignField: '_id',
		      as: 'landInfo'
		    }
		},
		{
		    '$unwind': '$landInfo'
		},
		{
		    '$lookup':
		    {
		      from: 'wcs',
		      localField: 'item',
		      foreignField: 'wCode',
		      as: 'wcsInfo'
		    }
		},
		{
		    '$unwind': '$wcsInfo'
		},
		{
		    '$match' : {
		            	'$and' : searchArray      
		               }
		},
		{ '$sort' : { 'date': 1 } }
    ], function (err, result) {
        if (err) {
            // next(err);
            loggerEx.error('/items/lookupBy5/:startDate/:endDate/:userId/:landId/:itemName : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
        } else {
            res.send(result);
        }
    });
})

// Fetch items lookup by date, userId, landId
app.get('/items/lookupBy4/:startDate/:endDate/:userId/:landId', (req, res) => { 
	// console.log(req.params)
	var searchArray = []
	var tmpArrayItem = { "userId" : req.params.userId }
	searchArray.push(tmpArrayItem)
	tmpArrayItem = { "date" : { "$gte": req.params.startDate, "$lte": req.params.endDate } }
	searchArray.push(tmpArrayItem)

	if (req.params.landId === "0") {		  	
	} else {	  	
		landIdVal = mongoose.Types.ObjectId(req.params.landId)
	  	tmpArrayItem = { "landId" : landIdVal }
  		searchArray.push(tmpArrayItem)
	}

	Item.aggregate([
		{
			"$unwind" : "$itemDetail"
		},
		{
		    '$lookup':
		    {
		      from: 'itemdetails',
		      localField: 'itemDetail',
		      foreignField: 'itemId',
		      as: 'itemDetailInfo'
		    }
		},
		{
		    '$unwind': '$itemDetailInfo'
		},
		{
		    '$lookup':
		    {
		      from: 'lands',
		      localField: 'landId',
		      foreignField: '_id',
		      as: 'landInfo'
		    }
		},
		{
		    '$unwind': '$landInfo'
		},
		{
		    '$lookup':
		    {
		      from: 'wcs',
		      localField: 'item',
		      foreignField: 'wCode',
		      as: 'wcsInfo'
		    }
		},
		{
		    '$unwind': '$wcsInfo'
		},
		{
		    '$match' : {
		            	'$and' : searchArray      
		               }
		},
		{ '$sort' : { 'date': 1 } }
    ], function (err, result) {
        if (err) {
            // next(err);
            loggerEx.error('/items/lookupBy4/:startDate/:endDate/:userId/:landId : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
        } else {
            res.send(result);
        }
    });
})

// Fetch items lookup by year, month, userId
app.get('/itmesLookupByYMUserIdLandId/:userId/:ym/:landId', (req, res) => {
  // console.log(req.params)
  var searchArray = []
  var tmpArrayItem = { "userId" : req.params.userId }
  searchArray.push(tmpArrayItem)
  tmpArrayItem = { "date" : { "$regex": req.params.ym } }
  searchArray.push(tmpArrayItem)

  if (req.params.landId === "0") {		  	
  } else {	  	
	landIdVal = mongoose.Types.ObjectId(req.params.landId)
	tmpArrayItem = { "landId" : landIdVal }
  	searchArray.push(tmpArrayItem)
  }

  Item.aggregate([
		{
			"$unwind" : "$itemDetail"
		},
		{
		    '$lookup':
		    {
		      from: 'itemdetails',
		      localField: 'itemDetail',
		      foreignField: 'itemId',
		      as: 'itemDetailInfo'
		    }
		},
		{
		    '$unwind': '$itemDetailInfo'
		},
		{
		    '$lookup':
		    {
		      from: 'lands',
		      localField: 'landId',
		      foreignField: '_id',
		      as: 'landInfo'
		    }
		},
		{
		    '$unwind': '$landInfo'
		},
		{
		    '$lookup':
		    {
		      from: 'wcs',
		      localField: 'item',
		      foreignField: 'wCode',
		      as: 'wcsInfo'
		    }
		},
		{
		    '$unwind': '$wcsInfo'
		},
		{
		    '$match' : {
		            	'$and' : searchArray      
		               }
		},
		{ '$sort' : { 'date': 1 } }
    ], function (err, result) {
        if (err) {
            // next(err);
            loggerEx.error('/itmesLookupByYMUserIdLandId/:userId/:ym/:landId : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
        } else {
            res.send(result);
        }
    });
})

// Fetch items by date, userId, landId
app.get('/items/searchBy5/:startDate/:endDate/:userId/:landId', (req, res) => { 		
	var startDate = req.params.startDate.replace(/-/gi, "")
	startDate += '000000000'	

	var endDate = req.params.endDate.replace(/-/gi, "")
	endDate += '235959999'	

	var itemDetails = []
	ItemDetail.find({}, '', function (error, ids) {
	 	if (error) { 
	 		// console.error(error); 
	 		loggerEx.error('/items/searchBy5/:startDate/:endDate/:userId/:landId : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
	 	}
	 
	 	var idArray = []
	 	for (var i = 0; i < ids.length; i++) {
	 		idArray.push(ids[i].parentId)
	 	}
	 	var itemResult = getItemByLandId(idArray, req.params.landId)
	 	itemResult.then(function(result) {
 			// console.log(result)
 			for (var j = 0; j < ids.length; j++) {
 				for (var k = 0; k < result.length; k++) {
 					// console.log(ids[j].parentId + '//' + result[k]._id)
 					if (ids[j].parentId == result[k]._id) {
 						var tmpIds = {}			
 						tmpIds.landId = result[k].landId
 						tmpIds.date = result[k].date
 						tmpIds.item = result[k].item
 						tmpIds._id = result[k]._id
 						tmpIds.userId = result[k].userId
 						tmpIds.itemId = ids[j].itemId
 						tmpIds.itemName = ids[j].itemName
 						tmpIds.itemAmount = ids[j].itemAmount
 						tmpIds.itemUsage = ids[j].itemUsage
 						tmpIds.journalUsage = ids[j].journalUsage
 						tmpIds.itemPrice = ids[j].itemPrice 						 						
 						itemDetails.push(tmpIds) 
 					} 					
 				}
 			}
 			// console.log(itemDetails)
 			res.send(itemDetails)						
 		})


	})
	.where('userId').equals(req.params.userId)
	.where('itemId').gte(startDate).lte(endDate)
})

async function getItemByLandId(idArray, landId) {
	// const itemResult = []
	if ('0' == landId) {
		const itemResult = await Item.find({ _id: { $in: idArray } }, '', function (error2, items) {
	 		if (error2) { 
	 			// console.error(error2); 
	 			loggerEx.error('getItemByLandId : ' + error2.toString());
      			res.status(500).json({ error: error2.toString() });
	 		}
	 	})
	 	return itemResult
	} else {
		const itemResult = await Item.find({ _id: { $in: idArray } }, '', function (error2, items) {
	 		if (error2) { 
	 			// console.error(error2); 
	 			loggerEx.error('getItemByLandId : ' + error2.toString());
      			res.status(500).json({ error: error2.toString() });
	 		}
	 	})
	 	.where('landId').equals(landId)
	 	return itemResult
	} 	
}

// Fetch items by year, month, userId
app.get('/items/searchByYMUserId/:ym/:userId', (req, res) => {
  // console.log(req.params)
  Item.find({}, '', function (error, items) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/items/searchByYMUserId/:ym/:userId : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(items)
  })
  .where('date').regex(req.params.ym)
  .where('userId').equals(req.params.userId)
})

// Fetch items by year, month, userId, landId
app.get('/items/searchByYMUserIdLandId/:ym/:userId/:landId', (req, res) => {
  // console.log(req.params)
  Item.find({}, '', function (error, items) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/items/searchByYMUserIdLandId/:ym/:userId/:landId : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(items)
  })
  .where('date').regex(req.params.ym)
  .where('userId').equals(req.params.userId)
  .where('landId').equals(req.params.landId)
})

// Fetch items by date & userId
app.get('/items/:startDate/:endDate/:userId', (req, res) => {
  // console.log(req.params)
  Item.find({}, '', function (error, items) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/items/:startDate/:endDate/:userId : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(items)
  })
  .where('date').gte(req.params.startDate).lte(req.params.endDate)
  .where('userId').equals(req.params.userId)
})

// Fetch items by date & userId & itemDetail
app.get('/itemsByYMNUserIdAndDetail/:startDate/:endDate/:userId', (req, res) => {
  // console.log(req.params)
  Item.aggregate([
		{
		    '$lookup':
		    {
		      from: 'itemdetails',
		      localField: 'itemDetail',
		      foreignField: 'itemId',
		      as: 'item_details'
		    }
		},
        {
            "$match" : {
            	"$and" : [
            		{ "date" : { "$gte" : req.params.startDate + '-01 00:00:00', "$lte" : req.params.endDate + '-31 23:59:59'} },
                	{ "userId" : req.params.userId }
            	]                
            }
        },
        { "$sort" : { "date": 1 } }
    ], function (err, result) {
        if (err) {
            // next(err);
            loggerEx.error('/itemsByYMNUserIdAndDetail/:startDate/:endDate/:userId : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
        } else {
            res.send(result);
        }
    });
})

// Fetch items by userId, landId, item, itemName
app.get('/items/getByUserLandItemName/:userId/:landId/:item/:itemName', (req, res) => {
  // console.log(req.params)
  Item.find({}, '', function (error, items) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/items/getByUserLandItemName/:userId/:landId/:item/:itemName : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }

    if (0 < items.length) {
    	for(var i = 0; i < items[0].itemDetail.length; i++) {
	    	if(items[0].itemDetail[i].itemName === req.params.itemName) {
	    		res.send(items[0].itemDetail[i])
	    	}
	    }
    } else {
    	res.send({nodata: true})
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
		    '$lookup':
		    {
		      from: 'itemdetails',
		      localField: 'itemDetail',
		      foreignField: 'itemId',
		      as: 'item_details'
		    }
		},
		{
			"$unwind" : "$item_details"
		},
        {
            "$group" : {
                "_id" : { "date" : { "$substr" : [ "$date", 0, 7 ] }, "userId" : "$userId" },
                "totalExpenditure" : { "$sum" : "$item_details.itemPrice" },
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
            // next(err);
            loggerEx.error('/itemsGetAggData/:userId/:startDate/:endDate : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
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
            // next(err);
            loggerEx.error('/journalsGetAggData/:userId/:startDate/:endDate : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
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
            // next(err);
            loggerEx.error('/journalsGetCOOAggData/:userId/:startDate/:endDate : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
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
    		// console.error(error);
    		loggerEx.error('/leaveUser/:userId : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
    	}
    	// 2. Delete Journals
    	Journal.remove({
    		userId: req.params.userId
    	}, function(err, removedJournals) {
    		if (err) { 
    			// res.send(err) 
    			loggerEx.error('/leaveUser/:userId : ' + err.toString());
      			res.status(500).json({ error: err.toString() });
    		}

    		// 3. Delete Items
    		Item.remove({
    			userId: req.params.userId
    		}, function(err, removedItems) {
    			if (err) { 
    				// res.send(err) 
    				loggerEx.error('/leaveUser/:userId : ' + err.toString());
      				res.status(500).json({ error: err.toString() });
    			}	    			

    			// 4. Delete Lands
    			Land.remove({
    				userId: req.params.userId
    			}, function(err, removedLands) {
    				if (err) { 
    					// res.send(err) 
    					loggerEx.error('/leaveUser/:userId : ' + err.toString());
      					res.status(500).json({ error: err.toString() });
    				}

    				// 5. Delete Users
			    	User.remove({
						id: req.params.userId
					}, function(err, removedUsers) {
						if (err) {
							// res.send(err)
							loggerEx.error('/leaveUser/:userId : ' + err.toString());
      						res.status(500).json({ error: err.toString() });
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

// Add new itemDetail
app.post('/itemDetail', (req, res) => {
  // console.log(req.body);
  var itemDetail = req.body.itemDetail;
  var itemId = itemDetail.createDate + moment().format("HHmmssSSS")	
  // var itemId = moment().format("YYYYMMDDHHmmssSSS")	
  // console.log(itemId)

  var new_itemDetail = new ItemDetail({
  	itemId: itemId,
    userId: itemDetail.userId,
    itemName: itemDetail.itemName,
    itemAmount: itemDetail.itemAmount,
    itemPrice: itemDetail.itemPrice,
    journalUsage: itemDetail.journalUsage,
    itemUsage: itemDetail.itemUsage
  })

  new_itemDetail.save(function (error, result) {
    if (error) {
      // console.log(error)
      loggerEx.error('/itemDetail : ' + error.toString());
      res.status(500).json({ error: error.toString() });
    }
    res.send({
      success: true,
      message: 'ItemDetail saved successfully!',
      result: result
    })
  }) 
})

// Fetch itemDetail by userId, itemId
app.get('/itemDetailByItemId/:userId/:itemId', (req, res) => {
  ItemDetail.find({}, '', function (error, items) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/itemDetailByItemId/:userId/:itemId : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }
    res.send(items)
  })
  .where('userId').equals(req.params.userId)
  .where('itemId').equals(req.params.itemId)
})

// Update item usage
app.put('/itemDetailUpdateItemUsage', (req, res) => { 
  // console.log(req.body.itemDetail)  
  ItemDetail.find({}, '', function (error, item) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/itemDetailUpdateItemUsage : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }

    if (0 < item.length) {	// item이 있을 경우 save
    	item[0].itemUsage = req.body.itemDetail.itemUsage - item[0].journalUsage
	    item[0].itemName = req.body.itemDetail.itemName
	    item[0].itemAmount = req.body.itemDetail.itemAmount
	    item[0].itemPrice = req.body.itemDetail.itemPrice
	    
	    item[0].save(function (error, result) {
	    	if (error) { 
	    		// console.log(error) 
	    		loggerEx.error('/itemDetailUpdateItemUsage : ' + error.toString());
      			res.status(500).json({ error: error.toString() });
	    	}
			res.send({ 
				success: true,
				result: result
			})
	    })
    } else {	// item이 없을 경우 새로 생성
    	var itemId = moment().format("YYYYMMDDHHmmssSSS")
    	var new_itemDetail = new ItemDetail({
    		parentId: req.body.itemDetail.parentId,
    		itemId: itemId,
		    userId: req.body.itemDetail.userId,
		    itemName: req.body.itemDetail.itemName,
		    itemAmount: req.body.itemDetail.itemAmount,
		    itemPrice: req.body.itemDetail.itemPrice,
		    journalUsage: 0,
		    itemUsage: 0
		})

		new_itemDetail.save(function (error, result) {
		    if (error) {
		      // console.log(error)
		      loggerEx.error('/itemDetailUpdateItemUsage : ' + error.toString());
      		  res.status(500).json({ error: error.toString() });
		    }
		    res.send({
		      success: true,
		      message: 'ItemDetail saved successfully!',
		      result: result
		    })
	  	}) 
    }
  })
  .where('userId').equals(req.body.itemDetail.userId)
  .where('itemId').equals(req.body.itemDetail.itemId)
})

// Update journal usage
app.put('/itemDetailUpdateJournalUsage', (req, res) => { 
  console.log(req.body.itemDetail)  
  ItemDetail.find({}, '', function (error, item) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/itemDetailUpdateJournalUsage : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }

    item[0].journalUsage = item[0].journalUsage + (req.body.itemDetail.journalUsage - req.body.itemDetail.originalJournalUsage)
    // item[0].journalUsage = req.body.itemDetail.journalUsage * 1
    item[0].save(function (error, result) {
    	if (error) { 
    		// console.log(error) 
    		loggerEx.error('/itemDetailUpdateJournalUsage : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
    	}
		res.send({ 
			success: true,
			result: result
		})
    })
  })
  .where('userId').equals(req.body.itemDetail.userId)
  .where('itemId').equals(req.body.itemDetail.itemId)
})

// Update itemdeails with parentId by itemId
app.put('/updateItemDetailWithParentId/:itemId/:parentId', (req, res) => {
	ItemDetail.find({}, '', function (error, ids) {
		if (error) { 
			// console.error(error); 
			loggerEx.error('/updateItemDetailWithParentId/:itemId/:parentId : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
		}
	    ids[0].parentId = req.params.parentId
	    ids[0].save(function (error) {
	      if (error) {
	        // console.log(error)
	        loggerEx.error('/updateItemDetailWithParentId/:itemId/:parentId : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
	      }
	      res.send({
	        success: true
	      })
	    })
	})
	.where('itemId').equals(req.params.itemId)
})

// Delete journal usage
app.put('/itemDetailDeleteJournalUsage', (req, res) => { 
  // console.log(req.body.itemDetail)  
  ItemDetail.find({}, '', function (error, item) {
    if (error) { 
    	// console.error(error); 
    	loggerEx.error('/itemDetailDeleteJournalUsage : ' + error.toString());
      	res.status(500).json({ error: error.toString() });
    }

    item[0].journalUsage = item[0].journalUsage - (req.body.itemDetail.journalUsage * 1)
    item[0].save(function (error, result) {
    	if (error) { 
    		// console.log(error)
    		loggerEx.error('/itemDetailDeleteJournalUsage : ' + error.toString());
      		res.status(500).json({ error: error.toString() });
    	}
		res.send({ 
			success: true,
			result: result
		})
    })
  })
  .where('userId').equals(req.body.itemDetail.userId)
  .where('itemId').equals(req.body.itemDetail.itemId)
})

// Delete itemdetail by itemid
app.delete('/deleteItemDetailByItemId/:itemId', (req, res) => {
	ItemDetail.remove({
		itemId: req.params.itemId
	}, function(err, lands) {
		if (err) {
			// res.send(err)
			loggerEx.error('/deleteItemDetailByItemId/:itemId : ' + err.toString());
      		res.status(500).json({ error: err.toString() });
		}
		res.send({
			success: true
		})
	})
})