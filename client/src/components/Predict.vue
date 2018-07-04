<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 class="text-xs-center" mt-5>
        <!-- <h1>{{Predict_page}}</h1> -->
        <v-date-picker v-model="date" locale="kr" show-current="2013-07-13" v-on:change="onChangeDate"></v-date-picker>
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
            <td>{{ props.item.cropName }}</td>
            <td class="text-xs-right">{{ props.item.workCode }}</td>
            <td class="text-xs-right">{{ props.item.workContent }}</td>
            <td class="text-xs-right">{{ props.item.date }}</td>
            <td class="text-xs-right">{{ props.item.remarks }}</td>
            <td class="text-xs-right">{{ props.item.weather[0].sky }}</td>
            <td class="text-xs-right">{{ props.item.weather[0].t1h }}</td>
            <td class="text-xs-right">{{ props.item.weather[0].reh }}</td>
            <td class="text-xs-right">{{ props.item.weather[0].rn1 }}</td>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
      </div>

    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'
import JournalService from '@/services/JournalService'
import ScService from '@/services/ScService'
import WcService from '@/services/WcService'
export default {
  data () {
    return {
      // Predict_page: moment().format('YYYY년 MM월 DD일'),
      lastYearYM: '',
      date: moment().format('YYYY-MM-DD'),
      startDate: '',
      endDate: '',
      search: '',
      pagination: {},
      selected: [],
      headers: [
        {
          text: '작물명',
          align: 'left',
          sortable: false,
          value: 'cropName'
        },
        { text: '작년작업분류', value: 'workCode' },
        { text: '작년작업내용', value: 'workContent' },
        { text: '작년날짜', value: 'date' },
        { text: '작년특기사항', value: 'remarks' },
        { text: '작년날씨', value: 'sky' },
        { text: '작년온도', value: 't1h' },
        { text: '작년습도', value: 'reh' },
        { text: '작년강수량', value: 'rn1' }
      ],
      journals: []
    }
  },
  methods: {
    async getJournalsByDate () {
      const response = await JournalService.fetchJournalsByDate({
        startDate: this.startDate,
        endDate: this.endDate
      })
      if (response.data.length > 0) {
        var tmpJournals = response.data
        for (var i = 0; i < response.data.length; i++) {
          const response2 = await ScService.fetchCropNameByCropCode({
            cropCode: response.data[i].workCode.substring(0, 11)
          })
          tmpJournals[i].cropName = response2.data[0].text
          const response3 = await WcService.fetchTextByCode({
            code: response.data[i].workCode
          })
          tmpJournals[i].workCode = response3.data[0].text
        }
        this.journals = tmpJournals
      } else {  // 작년 10일이내의 데이터가 없는 경우 작년 해당월의 데이터를 보여줌
        const response4 = await JournalService.fetchJournalsByYM({
          ym: this.lastYearYM
        })
        var tmpJournals2 = response4.data
        for (var j = 0; j < response4.data.length; j++) {
          const response5 = await ScService.fetchCropNameByCropCode({
            cropCode: response4.data[j].workCode.substring(0, 11)
          })
          tmpJournals2[j].cropName = response5.data[0].text
          const response6 = await WcService.fetchTextByCode({
            code: response4.data[j].workCode
          })
          tmpJournals2[j].workCode = response6.data[0].text
        }
        this.journals = tmpJournals2
      }
    },
    onChangeDate: function (event) {
      var today = moment(event, 'YYYY-MM-DD')
      var lastYear = today.subtract(1, 'year')
      var lastYearBefore10 = lastYear.subtract(10, 'day')
      this.startDate = lastYearBefore10.format('YYYY-MM-DD')
      // console.log(this.startDate)
      var lastYearAfter10 = lastYear.add(20, 'day')
      this.endDate = lastYearAfter10.format('YYYY-MM-DD')
      // console.log(this.endDate)
      this.lastYearYM = moment(event, 'YYYY-MM').subtract(1, 'year').format('YYYY-MM')
      // console.log(this.lastYearYM)

      this.getJournalsByDate()
    }
  },
  computed: {
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  }
}
</script>