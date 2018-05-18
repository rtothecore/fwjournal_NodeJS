const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.listen(process.env.PORT || 8081)

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
var Journal = require("../models/journal")
var Wc = require("../models/workClass")

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

// Add new journal
app.post('/journals', (req, res) => {
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

  new_journal.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Journal saved successfully!'
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