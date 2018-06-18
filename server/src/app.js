const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const axios = require('axios')
const CircularJSON = require('circular-json')

axios.defaults.timeout = 20000;

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.listen(process.env.PORT || 8081)

//////////////////////////////////////////////FOR HTTPS
// http://blog.saltfactory.net/implements-nodejs-based-https-server/
// https://coderwall.com/p/yo4mqw/creating-a-nodejs-express-https-server
/*
const fs = require('fs')
var httpsOptions = {
	key: fs.readFileSync('key.pem')
	, cert: fs.readFileSync('cert.pem')
}

const appSecure = express(httpsOptions)
appSecure.listen(443)
*/
///////////////////////////////////////////////////////

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/fwjournal')
var db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

var User = require("../models/user")
var Land = require("../models/land")
var Sc = require("../models/smallClass")
var Mc = require("../models/mediumClass")
var Bc = require("../models/bigClass")
var Journal = require("../models/journal")
var Wc = require("../models/workClass")

const serviceKey = '73Jjl5lZRvBRKkGsPnGmZ7EL9JtwsWNi3hhCIN8cpVJzMdRRgyzntwz2lHmTKeR1tp7NWzoihNGGazcDEFgh8w%3D%3D'
const serviceKeyForPrice = '8d8857fa9186167880dafee9a8c55dda0d2711b96cd4ae893983f7d870941d2e'

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
  var db = req.db
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

// Fetch workClass by bCode, mCode, sCode
app.get('/wc/:bCode/:mCode/:sCode', (req, res) => {
  Wc.find({}, 'bCode mCode sCode wCode text', function (error, wcs) {
    if (error) { console.error(error); }
    res.send(wcs)
  })
  .where('bCode').equals(req.params.bCode)
  .where('mCode').equals(req.params.mCode)
  .where('sCode').equals(req.params.sCode)
  .sort({wCode:-1})
})

// Add new workClass
app.post('/wc', (req, res) => {
  // console.log(req.body);
  var bCode = req.body.bCode;
  var mCode = req.body.mCode;
  var sCode = req.body.sCode;
  var wCode = req.body.wCode;
  var text = req.body.text;

  var new_wc = new Wc({
    bCode: bCode,
    mCode: mCode,
    sCode: sCode,
    wCode: wCode,
    text: text
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
  var db = req.db;
  Journal.findById(req.params.id, 'userId name', function (error, journals) {
    if (error) { console.error(error); }

    journals.userId = req.body.userId;
    journals.date = req.body.date;
    journals.landId = req.body.landId;
    journals.workCode = req.body.workCode;
    journals.workContent = req.body.workContent;
    /*
    journals.workSTime = req.body.workSTime;
    journals.workETime = req.body.workETime;
    journals.weather = [];
    for(var i = 0; i < req.body.weather.length; i++) {
	  	journals.weather[i] = new Object();
	  	journals.weather[i].baseTime = req.body.weather[i].baseTime;
	  	journals.weather[i].sky = req.body.weather[i].sky;
	  	journals.weather[i].t1h = req.body.weather[i].t1h;
	  	journals.weather[i].reh = req.body.weather[i].reh;
	  	journals.weather[i].rn1 = req.body.weather[i].rn1;
  	}
  	*/
  	journals.remarks = req.body.remarks

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

// Fetch journals by userId
app.get('/journals/:userId', (req, res) => {
  var db = req.db
  Journal.find({}, 'userId date landId workCode workContent workSTime workETime weather remarks', function (error, journals) {
    if (error) { console.error(error); }
    res.send(journals)
  })
  .where('userId').equals(req.params.userId)
})

// Fetch journal by id
app.get('/journal/:id', (req, res) => {
  var db = req.db
  Journal.find({}, '_id userId date landId workCode workContent workSTime workETime weather remarks', function (error, journals) {
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
  Land.find({}, 'name', function (error, lands) {
    if (error) { console.error(error); }
    res.send(lands)
  })
  .where('_id').equals(req.params.id)
})

// Fetch cropCode by landId
app.get('/lands/getCC/:id', (req, res) => {
  Land.find({}, 'cropCode', function (error, lands) {
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
  var cropCode = req.body.cropCode;
  var new_land = new Land({
    userId: userId,
    name: name,
    address: address,
    size: size,
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
  Land.find({}, 'userId name address size cropCode', function (error, lands) {
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
  var db = req.db;
  Land.findById(req.params.id, 'userId name', function (error, lands) {
    if (error) { console.error(error); }
    lands.name = req.body.name
    lands.address = req.body.address
    lands.size = req.body.size
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
	var db = req.db
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

// Add new user
app.post('/user', (req, res) => {
  var db = req.db;
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

// Fetch single user
app.get('/user/:id', (req, res) => {
  var db = req.db
  User.findById(req.params.id, 'email password age sex', function (error, user) {
    if (error) { console.error(error); }
    res.send(user)
  })
})

// Update a user age & sex
app.put('/userAgeSex/:id', (req, res) => {
  var db = req.db;
  User.findById(req.params.id, 'age sex', function (error, user) {
    if (error) { console.error(error); }
    user.age = req.body.age
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
})

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