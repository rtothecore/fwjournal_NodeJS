<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{User_Profile}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-select
                  v-validate="'required'"
                  :items="landItems"
                  v-model="selectLand"
                  :error-messages="errors.collect('selectLand')"
                  label="농장명"
                  data-vv-name="selectLand"
                  required
                  v-on:change="onChangeLand"
                  item-text="name"
                  item-value="_id"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  v-model="cropName"
                  label="작물명" 
                  hint="농장명을 선택하면 자동입력됩니다"
                  persistent-hint
                  required
                  ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-select
                  v-validate="'required'"
                  :items="workType"
                  v-model="selectWorkType"
                  :error-messages="errors.collect('selectWorkType')"
                  label="작업분류"
                  data-vv-name="selectWorkType"
                  required
                  v-on:change="onChangeWorkType"
                  hint="작물명에 따른 작업분류 선택"
                  persistent-hint                  
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="workContent" label="작업내용"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <!-- <v-text-field label="작업시간" type="password" required></v-text-field> -->
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menu2"
                  transition="scale-transition"
                  offset-y
                  :nudge-left="40"
                >
                  <v-text-field
                    v-validate="'required'"
                    v-model="e6"
                    :error-messages="errors.collect('e6')"
                    label="작업시작 시간"
                    data-vv-name="e6"
                    required
                    slot="activator"
                    prepend-icon="access_time"
                    readonly
                    v-on:change="onChangeWSTime"
                  ></v-text-field>
                  <v-time-picker v-model="e6" format="24hr" autosave></v-time-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <!-- <v-text-field label="작업시간" type="password" required></v-text-field> -->
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menu3"
                  transition="scale-transition"
                  offset-y
                  :nudge-left="40"
                >
                  <v-text-field
                    v-validate="'required'"
                    v-model="e7"
                    :error-messages="errors.collect('e7')"
                    label="작업종료 시간"
                    data-vv-name="e7"
                    required
                    slot="activator"
                    prepend-icon="access_time"
                    readonly
                    v-on:change="onChangeWETime"
                  ></v-text-field>
                  <v-time-picker v-model="e7" format="24hr" autosave></v-time-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-text-field 
                  label="날씨" 
                  hint="자동입력"
                  persistent-hint
                  required
                  ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-text-field 
                  label="온도" 
                  hint="자동입력"
                  persistent-hint
                  required
                  ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-text-field 
                  label="습도" 
                  hint="자동입력"
                  persistent-hint
                  required
                  ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-text-field 
                  label="강수량" 
                  hint="자동입력"
                  persistent-hint
                  required
                  ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="remarks" label="특기사항"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*필수 입력 사항입니다</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">취소</v-btn>
          <!-- <v-btn color="blue darken-1" flat @click.native="dialog = false" :disabled="!valid">작성</v-btn> -->
          <v-btn color="blue darken-1" flat @click.native="save">작성</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {bus} from '../main'
import LandService from '@/services/LandService'
import ScService from '@/services/ScService'
import WcService from '@/services/WcService'
import JournalService from '@/services/JournalService'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      newEvent: {},
      journalId: '',
      remarks: '',
      workContent: '',
      selectedWSTime: '',
      selectedWETime: '',
      selectedWorkTypeCode: '',
      selectedLandId: '',
      selectedCropCode: '',
      dialog: false,
      User_Profile: '',
      menu2: false,
      menu3: false,
      e6: null,
      e7: null,
      landItems: [],
      userId: '5af4fa281a1ee4261039149f',
      cropName: '',
      workType: [],
      selectLand: null,
      selectWorkType: null,
      dictionary: {
        custom: {
          e7: {
            required: '작업종료 시간을 입력해주세요'
          },
          e6: {
            required: '작업시작 시간을 입력해주세요'
          },
          selectLand: {
            required: '농장명을 선택해주세요'
          },
          selectWorkType: {
            required: '작업분류를 선택해주세요'
          }
        }
      }
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
    var vm = this
    bus.$on('dialog', function (value) {
      vm.User_Profile = '영농일지 작성 - ' + value
      vm.dialog = true
    })
  },
  created () {
    this.getLands()
  },
  methods: {
    async getLands () {
      const response = await LandService.fetchLands({
        userId: this.userId
      })
      this.landItems = response.data.lands
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
      this.cropName = response.data[0].text
    },
    async getWorkTypeByCropCode (cropCode) {
      const response = await WcService.fetchTextByCropCode({
        cropCode: cropCode
      })
      this.workType = response.data
    },
    async createNewJournal () {
      await JournalService.createJournals({
        userId: this.userId,
        date: this.User_Profile.substring(10, 20),
        landId: this.selectedLandId,
        workCode: this.selectedWorkTypeCode,
        workContent: this.workContent,
        workSTime: this.selectedWSTime,
        workETime: this.selectedWETime,
        weather: [{'baseTime': '1400', 'sky': '00', 't1h': '17', 'reh': '01', 'rn1': '02'}],
        remarks: this.remarks
      })
      this.fetchNameByLandId(this.selectedLandId)
      this.fetchCropNameByCropCode(this.selectedWorkTypeCode.substring(0, 11))
      this.fetchTextByCode(this.selectedWorkTypeCode)
    },
    async fetchNameByLandId (landId) {
      const response = await LandService.fetchNameByLandId({
        landId: landId
      })
      this.newEvent.title = response.data[0].name
    },
    async fetchCropNameByCropCode (cropCode) {
      const response = await ScService.fetchCropNameByCropCode({
        cropCode: cropCode
      })
      this.newEvent.title += ' - ' + response.data[0].text
    },
    async fetchTextByCode (workCode) {
      const response = await WcService.fetchTextByCode({
        code: workCode
      })
      this.newEvent.title += '\n' + response.data[0].text + ' - ' + this.workContent
    },
    onChangeLand: function (event) {
      this.selectedLandId = event
      this.getCropCodeByLandId(this.selectedLandId)
    },
    onChangeWorkType: function (event) {
      this.selectedWorkTypeCode = event.bCode + event.mCode + event.sCode + event.wCode
    },
    onChangeWSTime: function (event) {
      this.newEvent.start = this.User_Profile.substring(10, 20) + ' ' + event
      var tmpStr = event
      this.selectedWSTime = tmpStr.replace(':', '')
      console.log(this.selectedWSTime)
    },
    onChangeWETime: function (event) {
      this.newEvent.end = this.User_Profile.substring(10, 20) + ' ' + event
      var tmpStr = event
      this.selectedWETime = tmpStr.replace(':', '')
      console.log(this.selectedWETime)
    },
    save () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        this.createNewJournal()
        this.$swal({
          type: 'success',
          title: '일지를 작성하였습니다',
          showConfirmButton: false,
          timer: 777
        }).then((result) => {
          bus.$emit('toJournalForNew', this.newEvent)
          this.dialog = false
        })
        // bus.$emit('toJournal', 'test')
        // this.dialog = false
      }).catch(() => {})
    }
  }
}
</script>