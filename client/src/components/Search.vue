<template>
<v-container fluid>
  <v-container grid-list-md text-xs-center fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>작업일지 검색</h1>
      </v-flex>

      <v-flex md2 />

       <v-flex xs6 sm6 md2>
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          v-model="menu"
          :nudge-right="40"
          :return-value.sync="startDate"
          lazy
          transition="scale-transition"
          offset-y
        >
          <v-text-field
            slot="activator"
            v-model="startDate"
            :error-messages="errors.collect('startDate')" 
            label="시작날짜"
            prepend-icon="event"
            readonly
            required=""
            data-vv-name="startDate"
          ></v-text-field>
          <v-date-picker v-model="startDate" no-title scrollable locale='euc-kr'>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu.save(startDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs6 sm6 md2>
        <v-menu
          ref="menu2"
          :close-on-content-click="false"
          v-model="menu2"
          :nudge-right="40"
          :return-value.sync="endDate"
          lazy
          transition="scale-transition"
          offset-y
        >
          <v-text-field
            slot="activator"
            v-model="endDate"
            :error-messages="errors.collect('endDate')" 
            label="종료날짜"
            prepend-icon="event"
            readonly
            required=""
            data-vv-name="endDate"
          ></v-text-field>
          <v-date-picker v-model="endDate" no-title scrollable locale='euc-kr'>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu2.save(endDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs4 sm4 md1>        
        <v-text-field
          v-model="searchWord"
          label="검색어"                  
        ></v-text-field>
      </v-flex>    

      <v-flex xs6 sm6 md1>
        <v-select
          :items="landItems"
          v-model="selectLand"
          label="농장명"
          class="input-group--focused"
          item-text="name"
          item-value="_id"
          v-on:change="onChangeLand"
        ></v-select>
      </v-flex>  

      <v-flex xs8 sm8 md2 class="text-xs-left">
        <v-btn
          :loading="loading"
          :disabled="loading"
          color="light-blue"
          class="white--text"
          @click.native="searchJournals"
        >
          검색
        </v-btn>
        <v-btn
          color="orange lighten-3"
          class="white--text"
          @click.native="searchReset"
        >
          초기화
        </v-btn>
      </v-flex>

      <journalModalForEdit></journalModalForEdit>
      <addWorkTypeModal></addWorkTypeModal>
                     
    </v-layout>
  </v-container>

  <v-container fluid pa-0>
    <v-layout row wrap>
    
    <v-flex md2 />

    <v-flex xs12 sm12 md8>      
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
            <td class="text-xs-left">{{ props.item.date }}</td>
            <td class="text-xs-left">{{ props.item.farmName }}</td>
            <td class="text-xs-left">{{ props.item.cropName }}</td>
            <td class="text-xs-left">{{ props.item.workType }}</td>
            <td class="text-xs-left">{{ props.item.workContent }}</td>
            <td class="text-xs-left">{{ props.item.remarks }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
      </div>      
    </v-flex>
    <v-flex md2 />
    </v-layout>
  </v-container>
</v-container>
</template>

<script>
import {bus} from '../main'
import JournalService from '@/services/JournalService'
import LandService from '@/services/LandService'
import ScService from '@/services/ScService'
import WcService from '@/services/WcService'
import DcService from '@/services/DcService'
import ItemService from '@/services/ItemService'
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
        descending: true
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
          width: '15%'
        },
        { text: '농장명', value: 'farmName', align: 'left', width: '5%' },
        { text: '작물명', value: 'cropName', align: 'left', width: '5%' },
        { text: '작업분류', value: 'workType', align: 'left', width: '5%' },
        { text: '작업내용', value: 'workContent', align: 'left', width: '30%' },
        { text: '특기사항', value: 'remarks', align: 'left', width: '30%' },
        { text: '관리', value: 'name', sortable: false, align: 'left', width: '5%' }
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
          }
        }
      }
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
  created () {
    this.userId = this.$session.get('userId')
    this.getJournals()
    this.getLands()
    this.getWorkTypeItems()
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
    },
    async getJournals () {
      const response = await JournalService.fetchJournals({
        userId: this.userId
      })
      var tmpJournals = response.data
      for (var i = 0; i < response.data.length; i++) {
        const response2 = await LandService.fetchNameByLandId({
          landId: response.data[i].landId
        })
        tmpJournals[i].farmName = response2.data[0].name
        tmpJournals[i].cropCode = response2.data[0].cropCode

        const response3 = await DcService.fetchCropNameByCropCode({
          cropCode: response2.data[0].cropCode
        })
        tmpJournals[i].cropName = response3.data[0].text

        const response4 = await WcService.fetchOneTextByCcode({
          code: response.data[i].workCode
        })
        tmpJournals[i].workType = response4.data[0].text

        const response5 = await WcService.fetchWorkCodesByWorkcode({
          code: response.data[i].workCode
        })
        tmpJournals[i].workItems = response5.data

        tmpJournals[i].itemNames = []
        const response6 = await ItemService.fetchItemsByWcode({
          userId: this.userId,
          wCode: response.data[i].workCode
        })
        for (var j = 0; j < response6.data.length; j++) {
          for (var k = 0; k < response6.data[j].itemDetail.length; k++) {
            tmpJournals[i].itemNames.push(response6.data[j].itemDetail[k].itemName)
          }
        }
      }
      this.journals = tmpJournals
    },
    async getJournalsBy4 () {
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

      const response = await JournalService.fetchJournalsBy4LandId({
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
      console.log(this.editedItem.workSTime)
    },
    onChangeWETime: function (event) {
      var tmpStr = event
      this.editedItem.workETime = tmpStr.replace(':', '')
      console.log(this.editedItem.workETime)
    },
    onChangeEditWorkType: function (event) {
      this.getWorkCodeById(event)
    },
    onChangeLand: function (event) {
      /*
      this.selectedLandId = event
      this.getCropCodeByLandId(this.selectedLandId)
      */
    },
    onChangeWorkType: function (event) {
      this.selectedWorkType = event
    },
    onChangeEditItemWorkType: function (event) {
      console.log(event)
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
        this.getJournalsBy4()
      }).catch(() => {})
    },
    searchReset () {
      this.startDate = ''
      this.endDate = ''
      this.searchWord = ''
      this.selectLand = ''
      this.e2 = null
      this.workContent = null
      this.getJournals()
      this.getLands()
      this.$validator.reset()
    }
  }
}
</script>