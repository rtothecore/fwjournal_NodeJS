<template>
  <v-app>
    <v-navigation-drawer v-model="sidebar" app>
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app>
      <span class="hidden-sm-and-up">
        <v-toolbar-side-icon @click="sidebar = !sidebar">
        </v-toolbar-side-icon>
      </span>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
        {{ appTitle }}
        </router-link>
      </v-toolbar-title>

      <v-tooltip bottom>
        <span slot="activator">&nbsp;{{ todaySky }}  {{ todayT1H }}  {{ todayREH }}  {{ todayPm10 }} </span>
        <!-- <span>Tooltip <br/> Tooltip2</span> -->
        <span> {{ tt1Date }} {{ tt1Sky }} {{ tt1T3h }} {{ tt1Reh }} <br/> {{ tt2Date }} {{ tt2Sky }} {{ tt2T3h }} {{ tt2Reh }} </span>
      </v-tooltip>

      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    
    <v-content>
      <router-view></router-view>
    </v-content>
    
  </v-app>
</template>

<script>
  import WeatherService from '@/services/WeatherService'
  import proj4 from 'proj4'
  export default {
    data () {
      return {
        todayPm10: '',
        tt1Date: '',
        tt1Sky: '',
        tt1T3h: '',
        tt1Reh: '',
        tt2Date: '',
        tt2Sky: '',
        tt2T3h: '',
        tt2Reh: '',
        todaySky: '맑음',
        todayT1H: '22℃',
        todayREH: '40%',
        appTitle: '영농일지',
        sidebar: false,
        menuItems: [
          {title: '영농일지', path: '/', icon: 'assignment_turned_in'},
          {title: '일지검색', path: '/search', icon: 'assignment'},
          {title: '작업예측', path: '/predict', icon: 'assignment_late'},
          {title: '통계', path: '/stats', icon: 'assessment'},
          {title: '설정', path: '/config', icon: 'build'}
        ],
        tooltip: '5/31 흐림 22℃',
        tooltip2: '6/1 비 19℃'
      }
    },
    created () {
      this.getLocation()
    },
    methods: {
      async fetchTodayWeather (baseDate, baseTime, nx, ny) {
        const response = await WeatherService.fetchTodayWeather({
          baseDate: baseDate,
          baseTime: baseTime,
          nx: nx,
          ny: ny
        })
        for (var i = 0; i < response.data.item.length; i++) {
          var sky = 'SKY'
          var t1h = 'T1H'
          var reh = 'REH'
          if (sky === response.data.item[i].category) {
            switch (response.data.item[i].obsrValue) {
              case '1' :
                this.todaySky = '맑음'
                break
              case '2' :
                this.todaySky = '구름조금'
                break
              case '3' :
                this.todaySky = '구름많음'
                break
              case '4' :
                this.todaySky = '흐림'
                break
              default :
                break
            }
          } else if (t1h === response.data.item[i].category) {
            this.todayT1H = response.data.item[i].obsrValue + '℃'
          } else if (reh === response.data.item[i].category) {
            this.todayREH = response.data.item[i].obsrValue + '%'
          }
        }
      },
      async fetchWeatherForecast (nx, ny) {
        const response = await WeatherService.fetchWeatherForecast({
          nx: nx,
          ny: ny
        })
        // TOMORROW START
        var todayDate = new Date()
        todayDate.setDate(todayDate.getDate() + 1)
        var todayYYYYMMDD = this.leadingZeros(todayDate.getFullYear(), 4) +
                            this.leadingZeros(todayDate.getMonth() + 1, 2) +
                            this.leadingZeros(todayDate.getDate(), 2) + ''
        this.tt1Date = todayYYYYMMDD.substring(4, 6) + '/' + todayYYYYMMDD.substring(6, 8)
        var onlyFcstDate = []
        for (var i = 0; i < response.data.item.length; i++) {
          if (todayYYYYMMDD === response.data.item[i].fcstDate + '') {
            onlyFcstDate.push(response.data.item[i])
          }
        }

        var onlyFcstTime = []
        var fcstTime = '0900'
        for (var j = 0; j < onlyFcstDate.length; j++) {
          if (fcstTime === onlyFcstDate[j].fcstTime) {
            onlyFcstTime.push(onlyFcstDate[j])
          }
        }

        var sky = 'SKY'
        var t3h = 'T3H'
        var reh = 'REH'
        for (var k = 0; k < onlyFcstTime.length; k++) {
          if (sky === onlyFcstTime[k].category) {
            switch (onlyFcstTime[k].fcstValue + '') {
              case '1' :
                this.tt1Sky = '맑음'
                break
              case '2' :
                this.tt1Sky = '구름조금'
                break
              case '3' :
                this.tt1Sky = '구름많음'
                break
              case '4' :
                this.tt1Sky = '흐림'
                break
              default :
                break
            }
          } else if (t3h === onlyFcstTime[k].category) {
            this.tt1T3h = onlyFcstTime[k].fcstValue + '℃'
          } else if (reh === onlyFcstTime[k].category) {
            this.tt1Reh = onlyFcstTime[k].fcstValue + '%'
          }
        }
        // TOMORROW END
        // AFTER TOMORROW START
        todayDate = new Date()
        todayDate.setDate(todayDate.getDate() + 2)
        todayYYYYMMDD = this.leadingZeros(todayDate.getFullYear(), 4) +
                            this.leadingZeros(todayDate.getMonth() + 1, 2) +
                            this.leadingZeros(todayDate.getDate(), 2) + ''
        this.tt2Date = todayYYYYMMDD.substring(4, 6) + '/' + todayYYYYMMDD.substring(6, 8)
        onlyFcstDate = []
        for (i = 0; i < response.data.item.length; i++) {
          if (todayYYYYMMDD === response.data.item[i].fcstDate + '') {
            onlyFcstDate.push(response.data.item[i])
          }
        }

        onlyFcstTime = []
        fcstTime = '0900'
        for (j = 0; j < onlyFcstDate.length; j++) {
          if (fcstTime === onlyFcstDate[j].fcstTime) {
            onlyFcstTime.push(onlyFcstDate[j])
          }
        }

        for (k = 0; k < onlyFcstTime.length; k++) {
          if (sky === onlyFcstTime[k].category) {
            switch (onlyFcstTime[k].fcstValue + '') {
              case '1' :
                this.tt2Sky = '맑음'
                break
              case '2' :
                this.tt2Sky = '구름조금'
                break
              case '3' :
                this.tt2Sky = '구름많음'
                break
              case '4' :
                this.tt2Sky = '흐림'
                break
              default :
                break
            }
          } else if (t3h === onlyFcstTime[k].category) {
            this.tt2T3h = onlyFcstTime[k].fcstValue + '℃'
          } else if (reh === onlyFcstTime[k].category) {
            this.tt2Reh = onlyFcstTime[k].fcstValue + '%'
          }
        }
        // AFTER TOMORROW END
      },
      async fetchAirData (tmX, tmY) {
        const response = await WeatherService.fetchAirData({
          tmX: tmX,
          tmY: tmY
        })
        // console.log(response.data.pm10Grade)
        switch (response.data.pm10Grade) {
          case '1' :
            this.todayPm10 = '미세먼지:좋음'
            break
          case '2' :
            this.todayPm10 = '미세먼지:보통'
            break
          case '3' :
            this.todayPm10 = '미세먼지:나쁨'
            break
          case '4' :
            this.todayPm10 = '미세먼지:매우나쁨'
            break
          default :
            break
        }
      },
      leadingZeros: function (n, digits) {
        var zero = ''
        n = n.toString()

        if (n.length < digits) {
          for (var i = 0; i < digits - n.length; i++) {
            zero += '0'
          }
        }
        return zero + n
      },
      getLocation: function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition)
        } else {
          console.log('Geolocation is not supported by this browser.')
        }
      },
      showPosition: function (position) {
        var convertedXY = this.dfs_xy_conv('toXY', position.coords.latitude, position.coords.longitude)
        this.fetchTodayWeather('20180601', '0800', convertedXY.x, convertedXY.y)
        this.fetchWeatherForecast(convertedXY.x, convertedXY.y)

        // https://www.npmjs.com/package/proj4
        // http://www.gisdeveloper.co.kr/?p=1854
        var firstProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
        var secondProjection = '+proj=longlat +ellps=bessel +towgs84=-146.43,507.89,681.46 +no_defs'
        var tmXY = proj4(firstProjection, secondProjection, [convertedXY.y, convertedXY.x])
        this.fetchAirData(tmXY[0], tmXY[1])
        // console.log(tmXY[0])
      },
      dfs_xy_conv: function (code, v1, v2) { // http://fronteer.kr/service/kmaxy - 37.579871128849334, 126.98935225645432 => 60, 127
        var RE = 6371.00877 // 지구 반경(km)
        var GRID = 5.0 // 격자 간격(km)
        var SLAT1 = 30.0 // 투영 위도1(degree)
        var SLAT2 = 60.0 // 투영 위도2(degree)
        var OLON = 126.0 // 기준점 경도(degree)
        var OLAT = 38.0 // 기준점 위도(degree)
        var XO = 43 // 기준점 X좌표(GRID)
        var YO = 136 // 기1준점 Y좌표(GRID)

        var DEGRAD = Math.PI / 180.0
        var RADDEG = 180.0 / Math.PI

        var re = RE / GRID
        var slat1 = SLAT1 * DEGRAD
        var slat2 = SLAT2 * DEGRAD
        var olon = OLON * DEGRAD
        var olat = OLAT * DEGRAD

        var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5)
        sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn)
        var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5)
        sf = Math.pow(sf, sn) * Math.cos(slat1) / sn
        var ro = Math.tan(Math.PI * 0.25 + olat * 0.5)
        ro = re * sf / Math.pow(ro, sn)
        var rs = {}
        if (code === 'toXY') {
          rs['lat'] = v1
          rs['lng'] = v2
          var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5)
          ra = re * sf / Math.pow(ra, sn)
          var theta = v2 * DEGRAD - olon
          if (theta > Math.PI) theta -= 2.0 * Math.PI
          if (theta < -Math.PI) theta += 2.0 * Math.PI
          theta *= sn
          rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5)
          rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5)
        } else {
          rs['x'] = v1
          rs['y'] = v2
          var xn = v1 - XO
          var yn = ro - v2 + YO
          ra = Math.sqrt(xn * xn + yn * yn)
          if (sn < 0.0) {
            ra = -ra
          }
          var alat = Math.pow((re * sf / ra), (1.0 / sn))
          alat = 2.0 * Math.atan(alat) - Math.PI * 0.5

          if (Math.abs(xn) <= 0.0) {
            theta = 0.0
          } else {
            if (Math.abs(yn) <= 0.0) {
              theta = Math.PI * 0.5
              if (xn < 0.0) {
                theta = -theta
              }
            } else theta = Math.atan2(xn, yn)
          }
          var alon = theta / sn + olon
          rs['lat'] = alat * RADDEG
          rs['lng'] = alon * RADDEG
        }
        return rs
      }
    }
  }
</script>