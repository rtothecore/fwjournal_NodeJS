<template>
    <div style="width:100%; margin:0 auto;">
      <!-- dummy --> <div style="height:20px"/>
        <b-row>
          <b-col cols="12">
            <b-card>              
              <b-row>
                <b-col cols="12">
                  <div style="width:100%; margin:0 auto;">
      
    <v-layout row wrap pl-4>

    <!-- R O W 1 -->   
      <v-flex xs5>
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
            :error-messages="errors.collect('sDate')"
            label="기준날짜"
            persistent-hint
            prepend-icon="event"
            readonly
            required=""
            v-validate="'required'"
            data-vv-name="sDate"
          ></v-text-field>
          <v-date-picker v-model="sDate" no-title @input="menu1 = false" v-on:change="onChangeDate" locale='euc-kr'></v-date-picker>
        </v-menu>
      </v-flex>     

      <v-flex xs1/>  
      
      <v-flex xs5>
        <v-select
          :items="landItems"
          v-model="selectLand"
          :error-messages="errors.collect('selectLand')"
          label="농장명"
          class="input-group--focused"
          item-text="name"
          item-value="_id"
          v-on:change="onChangeLand"
          required=""
          v-validate="'required'"
          data-vv-name="selectLand"
        ></v-select>
      </v-flex>

       <v-flex xs1/>
    <!-- R O W 1 -->

    <!-- R O W 2 -->
      <v-flex xs12 class="text-xs-right" pr-3>
        <v-btn
          outline
          color="indigo"
          class="white--text"
          @click.native="searchReset"
        >
          초기화
        </v-btn>
        <v-btn          
          color="primary"
          class="white--text"
          @click.native="searchItems"
        >
          검색
        </v-btn>        
      </v-flex>
    <!-- R O W 2 -->  
      
      </v-layout>
      
      <v-layout row wrap pl-4 pr-4>
      
        <v-flex xs12 sm12 md12>      
        <div>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :pagination.sync="pagination"
          hide-actions
          class="elevation-1"
        >
          <template slot="headerCell" slot-scope="props">
            <v-tooltip bottom>
              <span slot="activator">
                <h4><strong>{{ props.header.text }}</strong></h4>
              </span>
              <span>
                {{ props.header.text }}
              </span>
            </v-tooltip>
          </template>
          <template slot="items" slot-scope="props">
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}" @click="showItem(props.item)"><h5>{{ getDateWithSimple(props.item.date) }}</h5></td>
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}" @click="showItem(props.item)"><h5>{{ props.item.landName }}</h5></td>
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}" @click="showItem(props.item)"><h5>{{ props.item.item }}</h5></td>
            <!--
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}"><h4>{{ props.item.purpose }}</h4></td>
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}"><h4>{{ props.item.itemAmount }}</h4></td>
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}"><h4>{{ props.item.itemUsage }}</h4></td>
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}"><h4>{{ props.item.itemStock }}</h4></td>
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}"><h4>{{ props.item.itemTotalPrice }}</h4></td>
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}" class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="showItem(props.item)">
                <v-icon color="teal">remove_red_eye</v-icon>
              </v-btn>
            </td>
            -->
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
        </div>
        </v-flex>
        <predictItemModalForShow></predictItemModalForShow>
       </v-layout>        
            
                  </div>
                </b-col>              
              </b-row>              
            </b-card>
          </b-col>
        </b-row>
      </div>
</template>

<script>
import {bus} from '../main'
import moment from 'moment'
// import JournalService from '@/services/JournalService'
import ItemService from '@/services/ItemService'
import WcService from '@/services/WcService'
import LandService from '@/services/LandService'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      selectLand: '',
      landItems: [],
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
      pagination: {
        // https://github.com/vuetifyjs/vuetify/issues/442
        sortBy: 'date',
        descending: true
      },
      selected: [],
      headers: [
        {
          text: '날짜',
          align: 'left',
          sortable: false,
          value: 'date',
          width: '40%'
        },
        { text: '농장명', sortable: false, value: 'landName', width: '40%' },
        { text: '품목', sortable: false, value: 'item', width: '20%' }
        /*
        { text: '사용목적', sortable: false, value: 'purpose' },
        { text: '구입수량', sortable: false, value: 'itemAmount' },
        { text: '사용수량', sortable: false, value: 'itemUsage' },
        { text: '재고수량', sortable: false, value: 'itemStock' },
        { text: '총 구입가격', sortable: false, value: 'itemTotalPrice' },
        { text: '관리', value: 'name', sortable: false, align: 'left', width: '5%' }
        */
      ],
      items: [],
      dictionary: {
        custom: {
          sDate: {
            required: '검색 기준날짜를 입력해주세요'
          },
          selectLand: {
            required: '농장명을 선택해주세요'
          }
        }
      }
      // journals: []
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
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
    this.sDate = today
    this.onChangeDate(today)
    this.getLands()
    this.getItemsByDate()
    this.selectLand = '0'
  },
  methods: {
    async getLands () {
      const response = await LandService.fetchLands({
        userId: this.userId
      })
      this.landItems = response.data.lands

      var landItemForAll = {}
      landItemForAll._id = '0'
      landItemForAll.name = '전체'
      this.landItems.push(landItemForAll)
    },
    async getItemsByDate () {
      if (!this.startDate) {
        this.startDate = 0
      }
      if (!this.endDate) {
        this.endDate = 0
      }
      if (!this.selectLand) {
        this.selectLand = 0
      }
      const response = await ItemService.fetchItemsByDateNUserIdNLandId({
        startDate: this.startDate,
        endDate: this.endDate,
        userId: this.userId,
        landId: this.selectLand
      })
      if (response.data.length > 0) {
        var tmpItems = response.data
        for (var i = 0; i < response.data.length; i++) {
          //
          const response7 = await LandService.fetchNameByLandId({
            landId: response.data[i].landId
          })

          tmpItems[i].landName = response7.data[0].name
          //
          const response2 = await WcService.fetchOneTextByCcode({
            code: response.data[i].item
          })
          tmpItems[i].item = response2.data[0].text

          tmpItems[i].itemAmount = Number(0)
          tmpItems[i].itemUsage = Number(0)
          tmpItems[i].itemStock = Number(0)
          tmpItems[i].itemTotalPrice = Number(0)
          for (var k = 0; k < tmpItems[i].itemDetail.length; k++) {
            tmpItems[i].itemAmount += Number(tmpItems[i].itemDetail[k].itemAmount)
            tmpItems[i].itemUsage += Number(tmpItems[i].itemDetail[k].itemUsage)
            tmpItems[i].itemStock += Number(tmpItems[i].itemDetail[k].itemStock)
            tmpItems[i].itemTotalPrice += Number(tmpItems[i].itemDetail[k].itemPrice)
          }
        }
        this.items = tmpItems
      } else {  // 작년 10일이내의 데이터가 없는 경우 작년 해당월의 데이터를 보여줌
        const response4 = await ItemService.fetchItemsByYMUserIdLandId({
          ym: this.lastYearYM,
          userId: this.userId,
          landId: this.selectLand
        })
        var tmpItems2 = response4.data
        for (var j = 0; j < response4.data.length; j++) {
          //
          const response8 = await LandService.fetchNameByLandId({
            landId: response4.data[j].landId
          })

          tmpItems2[j].landName = response8.data[0].name
          //
          const response5 = await WcService.fetchOneTextByCcode({
            code: response4.data[j].item
          })
          tmpItems2[j].item = response5.data[0].text

          tmpItems2[j].itemAmount = Number(0)
          tmpItems2[j].itemTotalPrice = Number(0)
          for (var l = 0; l < tmpItems2[j].itemDetail.length; l++) {
            tmpItems2[j].itemAmount += Number(tmpItems2[j].itemDetail[l].itemAmount)
            tmpItems2[j].itemTotalPrice += Number(tmpItems2[j].itemDetail[l].itemPrice)
          }
        }
        this.items = tmpItems2
      }
    },
    onChangeLand: function (event) {
      // console.log(event)
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

      // this.getItemsByDate()
    },
    showItem (item) {
      // console.log(item)
      var emitParams = {'itemId': item._id, 'origin': 'fromPredict'}
      bus.$emit('dialogForShowItem', emitParams)
    },
    searchItems () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        this.getItemsByDate()
      }).catch(() => {})
    },
    searchReset () {
      this.startDate = ''
      this.endDate = ''
      this.sDate = ''
      this.selectLand = '0'
      this.items = []

      var today = moment().format('YYYY-MM-DD')
      this.sDate = today
      this.onChangeDate(today)
      this.getLands()
      this.getItemsByDate()
      this.selectLand = '0'
    },
    replaceAt: function (data, index, replacement) {
      return data.substr(0, index) + replacement + data.substr(index + replacement.length)
    },
    getDateWithSimple: function (dataVal) {
      var tmpStr = this.replaceAt(dataVal, 4, '.')
      tmpStr = this.replaceAt(tmpStr, 7, '.')
      tmpStr = tmpStr.substring(2, tmpStr.length)
      return tmpStr
    }
  },
  watch: {
    // https://github.com/vuetifyjs/vuetify/issues/4455
    items () {
      this.$nextTick(() => {
        this.pagination.totalItems = this.items.length
      })
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