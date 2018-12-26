<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 class="text-xs-center" mt-5>
        <!-- <h1>{{Predict_page}}</h1> -->
        <h1>농작업 일정</h1>
        <!-- <v-date-picker v-model="date" locale="kr" show-current="2013-07-13" v-on:change="onChangeDate"></v-date-picker> -->
      </v-flex>
      
      <v-flex xs12 class="text-xs-center" mt-1>
        <v-layout row ma-2 justify-center>
          <v-flex xs6 md2>
            <v-menu
              :close-on-content-click="false"
              v-model="menu1"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="computedDateFormatted"
                label="기준날짜"
                persistent-hint
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="sDate" no-title @input="menu1 = false" v-on:change="onChangeDate" locale='euc-kr'></v-date-picker>
            </v-menu>
          </v-flex>       
        </v-layout>
      </v-flex>

      <div>
        <v-data-table
          :headers="headers"
          :items="journals"
          :search="search"
          :pagination.sync="pagination"
          hide-actions
          class="elevation-1"
        >
          <template slot="headerCell" slot-scope="props">
            <v-tooltip bottom>
              <span slot="activator">
                {{ props.header.text }}
              </span>
              <span>
                {{ props.header.text }}
              </span>
            </v-tooltip>
          </template>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.date }}</td>
            <td class="text-xs-right">{{ props.item.cropName }}</td>
            <td class="text-xs-right">{{ props.item.workType }}</td>
            <td class="text-xs-right">{{ props.item.workContent }}</td>
            <td class="text-xs-right">{{ props.item.sky }}</td>
            <td class="text-xs-right">{{ props.item.t1h }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="showItem(props.item)">
                <v-icon color="teal">remove_red_eye</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
        <predictModalForShow></predictModalForShow>
      </div>      

      <br/><br/><br/>
    </v-layout>
  </v-container>
</template>

<script>
import {bus} from '../main'
import moment from 'moment'
import JournalService from '@/services/JournalService'
// import ScService from '@/services/ScService'
import WcService from '@/services/WcService'
import LandService from '@/services/LandService'
import DcService from '@/services/DcService'
export default {
  data () {
    return {
      // Predict_page: moment().format('YYYY년 MM월 DD일'),
      startDate2: null,
      sDate: null,
      menu1: false,
      userId: '',
      lastYearYM: '',
      date: moment().format('YYYY-MM-DD'),
      startDate: '',
      endDate: '',
      search: '',
      pagination: {},
      selected: [],
      headers: [
        {
          text: '날짜',
          align: 'left',
          sortable: false,
          value: 'date'
        },
        { text: '작물명', value: 'cropName' },
        { text: '작업분류', value: 'workType' },
        { text: '작업내용', value: 'workContent' },
        { text: '날씨', value: 'sky' },
        { text: '온도', value: 't1h' },
        { text: '관리', value: 'name', sortable: false, align: 'left', width: '5%' }
      ],
      journals: []
    }
  },
  beforeCreate: function () {
    if (!this.$session.exists()) {
      this.$router.push('/login')
    } else {
    }
  },
  created: function () {
    this.userId = this.$session.get('userId')
    var today = moment().format('YYYY-MM-DD')
    this.onChangeDate(today)
  },
  methods: {
    async getJournalsByDate () {
      const response = await JournalService.fetchJournalsByDateNUserId({
        startDate: this.startDate,
        endDate: this.endDate,
        userId: this.userId
      })
      if (response.data.length > 0) {
        var tmpJournals = response.data
        for (var i = 0; i < response.data.length; i++) {
          const response2 = await LandService.fetchNameByLandId({
            landId: response.data[i].landId
          })
          tmpJournals[i].cropCode = response2.data[0].cropCode

          const response4 = await DcService.fetchCropNameByCropCode({
            cropCode: tmpJournals[i].cropCode
          })
          tmpJournals[i].cropName = response4.data[0].text

          const response3 = await WcService.fetchOneTextByCcode({
            code: response.data[i].workCode
          })
          tmpJournals[i].workType = response3.data[0].text

          tmpJournals[i].sky = tmpJournals[i].weather.sky
          tmpJournals[i].t1h = tmpJournals[i].weather.avgT1H
        }
        this.journals = tmpJournals
      } else {  // 작년 10일이내의 데이터가 없는 경우 작년 해당월의 데이터를 보여줌
        const response4 = await JournalService.fetchJournalsByYMUserId({
          ym: this.lastYearYM,
          userId: this.userId
        })
        var tmpJournals2 = response4.data
        for (var j = 0; j < response4.data.length; j++) {
          const response5 = await LandService.fetchNameByLandId({
            landId: response4.data[j].landId
          })
          tmpJournals2[j].cropCode = response5.data[0].cropCode

          const response7 = await DcService.fetchCropNameByCropCode({
            cropCode: tmpJournals2[j].cropCode
          })
          tmpJournals2[j].cropName = response7.data[0].text

          const response6 = await WcService.fetchOneTextByCcode({
            code: response4.data[j].workCode
          })
          tmpJournals2[j].workType = response6.data[0].text

          tmpJournals2[j].sky = tmpJournals2[j].weather.sky
          tmpJournals2[j].t1h = tmpJournals2[j].weather.avgT1H
        }
        this.journals = tmpJournals2
      }
    },
    onChangeDate: function (event) {
      var today = moment(event, 'YYYY-MM-DD')
      var lastYear = today.subtract(1, 'year')
      var lastYearBefore10 = lastYear.subtract(10, 'day')
      this.startDate = lastYearBefore10.format('YYYY-MM-DD')
      console.log(this.startDate)
      var lastYearAfter10 = lastYear.add(20, 'day')
      this.endDate = lastYearAfter10.format('YYYY-MM-DD')
      console.log(this.endDate)
      this.lastYearYM = moment(event, 'YYYY-MM').subtract(1, 'year').format('YYYY-MM')
      console.log(this.lastYearYM)

      this.getJournalsByDate()
    },
    showItem (item) {
      console.log(item)
      var emitParams = {'journalId': item._id, 'origin': 'fromPredict'}
      bus.$emit('dialogForShow', emitParams)
    }
  },
  computed: {
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    },
    computedDateFormatted () {
      // console.log(this.sDate)
      return this.sDate
    }
  }
}
</script>