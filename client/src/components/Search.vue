<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Search page</h1>
      </v-flex>
      
       <v-flex xs12 sm6 md2>
        <v-menu
          ref="menu"
          :close-on-content-click="false"
          v-model="menu"
          :nudge-right="40"
          :return-value.sync="startDate"
          lazy
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="startDate"
            :error-messages="errors.collect('startDate')" 
            label="시작날짜"
            prepend-icon="event"
            readonly
            required=""
            v-validate="'required'" 
            data-vv-name="startDate"
          ></v-text-field>
          <v-date-picker v-model="startDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu.save(startDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs12 sm6 md2>
        <v-menu
          ref="menu2"
          :close-on-content-click="false"
          v-model="menu2"
          :nudge-right="40"
          :return-value.sync="endDate"
          lazy
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="endDate"
            :error-messages="errors.collect('endDate')" 
            label="종료날짜"
            prepend-icon="event"
            readonly
            required=""
            v-validate="'required'" 
            data-vv-name="endDate"
          ></v-text-field>
          <v-date-picker v-model="endDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.menu2.save(endDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs12 sm6 md2>
        <!-- 
        <v-text-field
            v-model="workType"
            label="작업분류 입력"
            required
          ></v-text-field>
        -->
        <v-select
          :items="WorkTypeitems"
          v-model="e2"
          label="작업분류"
          class="input-group--focused"
          item-text="text"
          item-value="value"
          v-on:change="onChangeWorkType"
        ></v-select>
      </v-flex>

      <v-flex xs12 sm6 md2>
        <v-text-field
            v-model="workContent"
            label="작업내용 입력"
            required
          ></v-text-field>
      </v-flex>

      <v-flex xs12 sm6 md2>
        <v-btn
          :loading="loading"
          :disabled="loading"
          color="light-blue"
          class="white--text"
          @click.native="searchJournals"
        >
          검색
        </v-btn>
      </v-flex>
      
      <div>
      
      <v-dialog v-model="dialog" max-width="500px">
      <!-- <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn> -->
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.farmName" label="농장명"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.cropName" label="작물명"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.workType" label="작업분류"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.workContent" label="작업내용"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.workSTime" label="시작시간"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.workETime" label="종료시간"></v-text-field>
              </v-flex>
               <v-flex xs12 sm6 md3>
                <v-text-field v-model="editedItem.sky" label="날씨"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-text-field v-model="editedItem.t1h" label="온도"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-text-field v-model="editedItem.reh" label="습도"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-text-field v-model="editedItem.rn1" label="강수량"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="editedItem.remarks" label="특기사항"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="blue darken-1" flat @click.native="save">저장</v-btn> -->
          <v-btn color="blue darken-1" flat @click.native="close">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            <td class="text-xs-right">{{ props.item.workSTime }}</td>
            <td class="text-xs-right">{{ props.item.remarks }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">speaker_notes</v-icon>
              </v-btn>
            </td>
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
import JournalService from '@/services/JournalService'
import LandService from '@/services/LandService'
import ScService from '@/services/ScService'
import WcService from '@/services/WcService'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      selectedWorkType: '',
      e2: null,
      WorkTypeitems: [
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
      ],
      workContent: '',
      userId: '5af4fa281a1ee4261039149f',
      menu: false,
      menu2: false,
      startDate: null,
      endDate: null,
      loader: null,
      loading: false,
      search: '',
      pagination: {},
      selected: [],
      dialog: false,
      formTitle: '',
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
        { text: '시작시간', value: 'workSTime' },
        { text: '특기사항', value: 'remarks' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        date: '',
        farmName: '',
        cropName: '',
        workType: '',
        workContent: '',
        workSTime: '08',
        workETime: '18',
        sky: '00',
        t1h: '01',
        reh: '02',
        rn1: '03',
        remarks: ''
      },
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
  created () {
    this.getJournals()
  },
  watch: {
    loader () {
      const l = this.loader
      this[l] = !this[l]
      setTimeout(() => (this[l] = false), 1000)
      this.loader = null
    }
  },
  computed: {
    // formTitle () {
      // return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      // return this.journals[0].date
      // var tmpVal = this.editedIndex
      // return this.journals[tmpVal].date
    // },
    pages () {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  },
  methods: {
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

        const response3 = await ScService.fetchCropNameByCropCode({
          cropCode: response.data[i].workCode.substring(0, 11)
        })
        tmpJournals[i].cropName = response3.data[0].text

        const response4 = await WcService.fetchTextByCode({
          code: response.data[i].workCode
        })
        tmpJournals[i].workType = response4.data[0].text
      }
      this.journals = tmpJournals
    },
    async getJournalsBy4 () {
      var tmpWorkType = this.selectedWorkType
      if (!tmpWorkType) {
        tmpWorkType = 0
      }
      var tmpWorkContent = this.workContent
      if (!tmpWorkContent) {
        tmpWorkContent = 0
      }

      const response = await JournalService.fetchJournalsBy4({
        startDate: this.startDate,
        endDate: this.endDate,
        workType: tmpWorkType,
        workContent: tmpWorkContent
      })
      var tmpJournals = response.data
      for (var i = 0; i < response.data.length; i++) {
        const response2 = await LandService.fetchNameByLandId({
          landId: response.data[i].landId
        })
        tmpJournals[i].farmName = response2.data[0].name

        const response3 = await ScService.fetchCropNameByCropCode({
          cropCode: response.data[i].workCode.substring(0, 11)
        })
        tmpJournals[i].cropName = response3.data[0].text

        const response4 = await WcService.fetchTextByCode({
          code: response.data[i].workCode
        })
        tmpJournals[i].workType = response4.data[0].text
      }
      this.journals = tmpJournals
    },
    onChangeWorkType: function (event) {
      this.selectedWorkType = event
    },
    editItem (item) {
      this.editedIndex = this.journals.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.formTitle = '영농일지 - ' + this.journals[this.editedIndex].date
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
    }
  }
}
</script>