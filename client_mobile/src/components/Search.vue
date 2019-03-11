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
          ref="menu"
          :close-on-content-click="false"
          v-model="menu"
          :nudge-right="40"          
          lazy
          transition="scale-transition"
          offset-y
        >
          <v-text-field
            slot="activator"
            v-model="computedDateFormatted"
            :error-messages="errors.collect('startDate')" 
            label="시작날짜"
            prepend-icon="event"
            readonly
            required=""
            v-validate="'required'"
            data-vv-name="startDate"
          ></v-text-field>
          <v-date-picker v-model="startDate" no-title @input="menu = false" locale='euc-kr'>           
          </v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs1/>

      <v-flex xs5>
        <v-menu
          ref="menu2"
          :close-on-content-click="false"
          v-model="menu2"
          :nudge-right="40"          
          lazy
          transition="scale-transition"
          offset-y
        >
          <v-text-field
            slot="activator"
            v-model="computedDateFormatted2"
            :error-messages="errors.collect('endDate')" 
            label="종료날짜"
            prepend-icon="event"
            readonly
            required=""
            v-validate="'required'"
            data-vv-name="endDate"
          ></v-text-field>
          <v-date-picker v-model="endDate" no-title @input="menu2 = false" locale='euc-kr'>           
          </v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs1/>
    <!-- R O W 1 -->

    <!-- R O W 2 -->
      <v-flex xs5>
        <v-select
          :items="landItems"
          v-model="selectLand"
          label="농장명"
          class="input-group--focused"
          item-text="name"
          item-value="_id"
          v-on:change="onChangeLand"
          :error-messages="errors.collect('selectLand')" 
          v-validate="'required'"
          data-vv-name="selectLand"
        ></v-select>
      </v-flex> 

      <v-flex xs1/>     

      <v-flex xs5>        
        <v-text-field
          v-model="searchWord"
          label="검색어"                  
        ></v-text-field>
      </v-flex>   

      <v-flex xs1/>
    <!-- R O W 2 -->

    <!-- R O W 3 -->
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
          :loading="loading"
          :disabled="loading"
          color="primary"
          class="white--text"
          @click.native="searchJournals"
        >
          검색
        </v-btn>        
      </v-flex>
    <!-- R O W 3 -->
      <journalModalForEdit></journalModalForEdit>
      <addWorkTypeModal></addWorkTypeModal>
                     
    </v-layout>
   
    <v-layout row wrap pl-4 pr-4>

    <v-flex xs12 sm12 md12>      
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
                <h4><strong>{{ props.header.text }}</strong></h4>
              </span>
              <span>
                {{ props.header.text }}
              </span>
            </v-tooltip>
          </template>
          <template slot="items" slot-scope="props">
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}" class="text-xs-left" @click="editItem(props.item)"><h5>{{ getDateWithSimple(props.item.date) }}</h5></td>
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}" class="text-xs-left" @click="editItem(props.item)"><h5>{{ props.item.farmName }}</h5></td>          
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}" class="text-xs-left" @click="editItem(props.item)"><h5>{{ props.item.workType }}</h5></td>      
            <!--      
            <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}" class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
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
import JournalService from '@/services/JournalService'
import LandService from '@/services/LandService'
import ScService from '@/services/ScService'
import WcService from '@/services/WcService'
// import DcService from '@/services/DcService'
// import ItemService from '@/services/ItemService'
import ImageInput from './ImageInput.vue'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      selectLand: '',
      landItems: [],
      searchWord: '',
      editWorkCode: '',
      editDate: '',
      e7: null,
      e6: null,
      menu4: false,
      menu5: false,
      editedWorkTypeCode: '',
      editeWorkTypeItems: [],
      selectedCropCode: '',
      selectedLandId: '',
      selectedWorkType: '',
      e2: null,
      WorkTypeitems: [
        /*
          { text: '작물>출하', value: 'BCPW000' },
          { text: '작물>관수', value: 'BCPW001' },
          { text: '작물>비료사용', value: 'BCPW002' },
          { text: '작물>농약사용', value: 'BCPW003' },
          { text: '작물>파종', value: 'BCPW004' },
          { text: '작물>정식', value: 'BCPW005' },
          { text: '작물>제초', value: 'BCPW006' },
          { text: '작물>경운', value: 'BCPW007' },
          { text: '작물>기타 농업활동', value: 'BCPW008' },
          { text: '가축>출하', value: 'BALW000' },
          { text: '가축>관수', value: 'BALW001' },
          { text: '가축>사료사용', value: 'BALW002' },
          { text: '가축>청소', value: 'BALW003' },
          { text: '가축>기타', value: 'BALW004' },
          { text: '가축>병해충방제', value: 'BALW005' }
        */
      ],
      workContent: '',
      userId: '',
      menu: false,
      menu2: false,
      startDate: null,
      endDate: null,
      loader: null,
      loading: false,
      search: '',
      pagination: {
        // https://github.com/vuetifyjs/vuetify/issues/442
        sortBy: 'date',
        descending: true,
        rowsPerPage: 10
      },
      selected: [],
      dialog: false,
      formTitle: '',
      headers: [
        {
          text: '날짜',
          align: 'left',
          sortable: false,
          value: 'date',
          width: '40%'
        },
        { text: '농장명', value: 'farmName', align: 'left', sortable: false, width: '40%' },
        { text: '작업', value: 'workType', align: 'left', sortable: false, width: '20%' }
        // { text: '관리', value: 'name', align: 'left', sortable: false, width: '5%' }
      ],
      editedIndex: -1,
      journals: [],
      dictionary: {
        custom: {
          startDate: {
            required: '검색 시작날짜를 입력해주세요'
          },
          endDate: {
            required: '검색 종료날짜를 입력해주세요'
          },
          selectLand: {
            required: '농장명을 선택해주세요'
          }
        }
      }
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
    var vm = this
    bus.$on('toJournalForUpdate', function (value) {
      vm.getJournalsBy5()
    })
    bus.$on('toJournalForDel', function (value) {
      vm.getJournalsBy5()
    })
  },
  beforeCreate: function () {
    if (!this.$session.exists()) {
      this.$router.push('/login')
    } else {
    }
  },
  created () {
    this.userId = this.$session.get('userId')
    this.init()
    this.getJournals()
    this.getLands()
    this.getWorkTypeItems()
    this.selectLand = '0'
  },
  components: {
    ImageInput: ImageInput
  },
  watch: {
    loader () {
      const l = this.loader
      this[l] = !this[l]
      setTimeout(() => (this[l] = false), 1000)
      this.loader = null
    },
    // https://github.com/vuetifyjs/vuetify/issues/4455
    journals () {
      this.$nextTick(() => {
        this.pagination.totalItems = this.journals.length
      })
    }
  },
  computed: {
    computedDateFormatted () {
      // console.log(this.startDate)
      return this.startDate
    },
    computedDateFormatted2 () {
      // console.log(this.endDate)
      return this.endDate
    },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  },
  methods: {
    async getWorkTypeItems () {
      const response = await WcService.fetchDistinctBCPText({})
      for (var i = 0; i < response.data.length; i++) {
        const response2 = await WcService.fetchBCPDataByText({
          bcpText: response.data[i]
        })
        var tmpItem = {}
        tmpItem.text = '작물>' + response2.data.text
        // tmpItem.value = response2.data.bCode + response2.data.wCode
        tmpItem.value = response2.data.wCode
        this.WorkTypeitems.push(tmpItem)
      }

      const response3 = await WcService.fetchDistinctBALText({})
      for (var j = 0; j < response3.data.length; j++) {
        const response4 = await WcService.fetchBALDataByText({
          balText: response3.data[j]
        })
        var tmpItem2 = {}
        tmpItem2.text = '가축>' + response4.data.text
        // tmpItem2.value = response4.data.bCode + response4.data.wCode
        tmpItem2.value = response4.data.wCode
        this.WorkTypeitems.push(tmpItem2)
      }
    },
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
    async getJournals () {
      const response = await JournalService.fetchJournalLookup({
        startDate: this.startDate,
        endDate: this.endDate,
        userId: this.userId
      })
      var tmpJournals = response.data

      for (var i = 0; i < tmpJournals.length; i++) {
        tmpJournals[i].farmName = tmpJournals[i].landInfo.name
        if (this.userId !== tmpJournals[i].userId) {
          tmpJournals[i].farmName = '👻)' + tmpJournals[i].farmName
        }
        tmpJournals[i].cropName = tmpJournals[i].dcsInfo.text
        tmpJournals[i].workType = tmpJournals[i].wcsInfo.text
      }
      this.journals = tmpJournals
    },
    async getJournalsBy5 () {
      var tmpStartDate = this.startDate
      if (!tmpStartDate) {
        tmpStartDate = 0
      }

      var tmpEndDate = this.endDate
      if (!tmpEndDate) {
        tmpEndDate = 0
      }

      var tmpSearchWord = this.searchWord
      if (!tmpSearchWord) {
        tmpSearchWord = 0
      }

      if (!this.selectLand) {
        this.selectLand = 0
      }

      const response = await JournalService.fetchJournalsBy5LandId({
        userId: this.userId,
        startDate: tmpStartDate,
        endDate: tmpEndDate,
        searchWord: tmpSearchWord,
        landId: this.selectLand
      })
      var tmpJournals = response.data

      for (var i = 0; i < tmpJournals.length; i++) {
        tmpJournals[i].farmName = tmpJournals[i].landInfo.name
        if (this.userId !== tmpJournals[i].userId) {
          tmpJournals[i].farmName = '👻)' + tmpJournals[i].farmName
        }
        tmpJournals[i].cropName = tmpJournals[i].dcsInfo.text
        tmpJournals[i].workType = tmpJournals[i].wcsInfo.text
      }
      this.journals = tmpJournals
      /* ORIGINAL
      var tmpStartDate = this.startDate
      if (!tmpStartDate) {
        tmpStartDate = 0
      }

      var tmpEndDate = this.endDate
      if (!tmpEndDate) {
        tmpEndDate = 0
      }

      var tmpSearchWord = this.searchWord
      if (!tmpSearchWord) {
        tmpSearchWord = 0
      }

      if (!this.selectLand) {
        this.selectLand = 0
      }

      const response = await JournalService.fetchJournalsBy5LandId({
        userId: this.userId,
        startDate: tmpStartDate,
        endDate: tmpEndDate,
        searchWord: tmpSearchWord,
        landId: this.selectLand
      })
      var tmpJournals = response.data

      for (var i = 0; i < response.data.length; i++) {
        // 농장명
        const response4 = await LandService.fetchNameByLandId({
          landId: response.data[i].landId
        })
        tmpJournals[i].farmName = response4.data[0].name
        // 작물명
        const response2 = await LandService.fetchCropNameByLandId({
          landId: response.data[i].landId
        })
        tmpJournals[i].cropName = response2.data[0].text

        const response3 = await WcService.fetchOneTextByCcode({
          code: response.data[i].workCode
        })
        tmpJournals[i].workType = response3.data[0].text
      }
      this.journals = tmpJournals
      */
    },
    async deleteJournal (id) {
      await JournalService.deleteJournal(id)
    },
    async getCropCodeByLandId (landId) {
      const response = await LandService.fetchCropCodeByLandId({
        landId: landId
      })
      this.selectedCropCode = response.data[0].cropCode
      this.getCropNameByCropCode(this.selectedCropCode)
      this.getWorkTypeByCropCode(this.selectedCropCode)
    },
    async getCropNameByCropCode (cropCode) {
      const response = await ScService.fetchCropNameByCropCode({
        cropCode: cropCode
      })
      this.editedItem.cropName = response.data[0].text
    },
    async getWorkTypeByCropCode (cropCode) {
      const response = await WcService.fetchTextByCropCode({
        cropCode: cropCode
      })
      this.editeWorkTypeItems = response.data
    },
    async getIdByWorkCode (workCode) {
      const response = await WcService.fetchIdByWorkCode({
        code: workCode
      })
      this.editedItem.workType = response.data[0]._id
    },
    async getWorkCodeById (workId) {
      const response = await WcService.fetchWorkCodeById({
        id: workId
      })
      this.editedWorkTypeCode = response.data
    },
    onChangeWSTime: function (event) {
      var tmpStr = event
      this.editedItem.workSTime = tmpStr.replace(':', '')
      // console.log(this.editedItem.workSTime)
    },
    onChangeWETime: function (event) {
      var tmpStr = event
      this.editedItem.workETime = tmpStr.replace(':', '')
      // console.log(this.editedItem.workETime)
    },
    onChangeEditWorkType: function (event) {
      this.getWorkCodeById(event)
    },
    onChangeLand: function (event) {
      if (event === '0') {
        this.searchWord = ''
      }
      /*
      this.selectedLandId = event
      this.getCropCodeByLandId(this.selectedLandId)
      */
    },
    onChangeWorkType: function (event) {
      this.selectedWorkType = event
    },
    onChangeEditItemWorkType: function (event) {
      // console.log(event)
    },
    onChangeItemCost: function (event) {
      this.CooTotal = Number('0')
      for (var i = 0; i < this.cooItems.length; i++) {
        this.CooTotal = Number(this.CooTotal)
        this.CooTotal += Number(this.cooItems[i].cost)
      }
    },
    editItem (item) {
      // console.log(item)
      var emitParams = {'journalId': item._id, 'origin': 'fromSearch'}
      bus.$emit('dialogForEdit', emitParams)
    },
    deleteItem (item) {
      const index = this.journals.indexOf(item)
      // confirm('이 일지를 지우시겠습니까?') && this.journals.splice(index, 1) && this.deleteJournal(item._id)
      this.$swal({
        title: '이 일지를 삭제 하시겠습니까?',
        text: '삭제 후에 되돌릴 수 없습니다',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 삭제합니다',
        cancelButtonText: '취소합니다'
      }).then((result) => {
        if (result.value) {
          this.deleteJournal(item._id)
          this.journals.splice(index, 1)
          this.$swal(
            '삭제했습니다!',
            '일지가 삭제되었습니다',
            'success'
          )
        }
      })
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    searchJournals () {
      this.loader = 'loading'
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        // 선택한 농장명이 전체일 경우 검색어를 지우고 검색
        if (this.selectLand === '0') {
          this.searchWord = ''
          this.getJournals()
        } else {
          // 선택한 농장명이 전체가 아닐 경우
          this.getJournalsBy5()
        }
      }).catch(() => {})
    },
    searchReset () {
      this.startDate = ''
      this.endDate = ''
      this.searchWord = ''
      this.selectLand = '0'
      this.e2 = null
      this.workContent = null
      this.init()
      this.getJournals()
      this.getLands()
      this.$validator.reset()
    },
    replaceAt: function (data, index, replacement) {
      return data.substr(0, index) + replacement + data.substr(index + replacement.length)
    },
    getDateWithSimple: function (dataVal) {
      var tmpStr = this.replaceAt(dataVal, 4, '.')
      tmpStr = this.replaceAt(tmpStr, 7, '.')
      tmpStr = tmpStr.substring(2, tmpStr.length)
      return tmpStr
    },
    init: function () {
      this.startDate = moment().year() + '-01-01'
      this.endDate = moment().format('YYYY-MM-DD')
    }
  }
}
</script>