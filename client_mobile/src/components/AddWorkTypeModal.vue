<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">작업분류 추가</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md3>
                <v-select
                  v-validate="'required'"
                  :items="bcsItems"
                  v-model="bcs"
                  :error-messages="errors.collect('bcs')"
                  label="대분류"
                  data-vv-name="bcs"
                  required
                  v-on:change="onChangeBcs"
                  item-text="text"
                  item-value="bCode"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-select
                  v-validate="'required'"
                  :items="mcsItems"
                  v-model="mcs"
                  :error-messages="errors.collect('mcs')"
                  label="중분류"
                  data-vv-name="mcs"
                  required
                  v-on:change="onChangeMcs"
                  item-text="text"
                  item-value="mCode"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-select
                  v-validate="'required'"
                  :items="scsItems"
                  v-model="scs"
                  :error-messages="errors.collect('scs')"
                  label="소분류"
                  data-vv-name="scs"
                  required
                  v-on:change="onChangeScs"
                  item-text="text"
                  item-value="sCode"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-text-field 
                  v-validate="'required'"
                  v-model="workType" 
                  :error-messages="errors.collect('workType')"
                  label="작업분류"
                  required
                  data-vv-name="workType">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*필수 입력 사항입니다</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">취소</v-btn>
          <v-btn color="blue darken-1" flat @click.native="checkDuplicatedWorkType">추가</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {bus} from '../main'
import BcService from '@/services/BcService'
import McService from '@/services/McService'
import ScService from '@/services/ScService'
import WcService from '@/services/WcService'
import DcService from '@/services/DcService'
import LogService from '@/services/LogService'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      duplicateWorkTypeText: false,
      compType: '',
      fromValue: '',
      addedWorkTypeCode: '',
      bcsCode: '',
      mcsCode: '',
      scsCode: '',
      dcsCode: '',
      maxWcs: '',
      bcs: '',
      mcs: '',
      scs: '',
      bcsItems: [],
      mcsItems: [],
      scsItems: [],
      dialog: false,
      userId: '5af4fa281a1ee4261039149f',
      workType: '',
      dictionary: {
        custom: {
          bcs: {
            required: '대분류를 선택해주세요'
          },
          mcs: {
            required: '중분류를 선택해주세요'
          },
          scs: {
            required: '소분류를 선택해주세요'
          },
          workType: {
            required: '작업분류를 입력해주세요'
          }
        }
      }
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
    var vm = this
    bus.$on('dialogForAddWorkType', function (value) {
      // console.log(value)
      vm.fromValue = value.from
      vm.compType = value.compType
      vm.dcsCode = value.cropCode
      vm.dialog = true
      vm.bms = ''
      vm.mcs = ''
      vm.scs = ''
      vm.workType = ''
      vm.getScByDcode()
    })
  },
  created () {
    this.getBCS()
  },
  methods: {
    async logError (page, funcName, message) {
      await LogService.logError({
        errorPage: page,
        funcName: funcName,
        message: message
      })
    },
    async getScByDcode () {
      var response = null
      try {
        response = await DcService.fetchScsByDcode({
          dCode: this.dcsCode
        })
      } catch (e) {
        this.logError('AddWorkTypeModal.vue', 'getScByDcode', e.toString())
        this.$router.push('/500')
      }
      this.scsCode = response.data.dcs[0].sCode
      this.getMcByScode()
    },
    async getMcByScode () {
      var response = null
      try {
        response = await ScService.fetchMcsByScode({
          sCode: this.scsCode
        })
      } catch (e) {
        this.logError('AddWorkTypeModal.vue', 'getMcByScode', e.toString())
        this.$router.push('/500')
      }
      this.mcsCode = response.data.scs[0].mCode
      this.getBcByMcode()
    },
    async getBcByMcode () {
      var response = null
      try {
        response = await McService.fetchBcsByMcode({
          mCode: this.mcsCode
        })
      } catch (e) {
        this.logError('AddWorkTypeModal.vue', 'getBcByMcode', e.toString())
        this.$router.push('/500')
      }
      this.bcsCode = response.data.mcs[0].bCode

      // 대, 중, 소분류 자동선택
      this.getBCS()
      this.getMCS(this.bcsCode)
      this.getSCS(this.mcsCode)
      this.getMaxWCS()
      this.bcs = this.bcsCode
      this.mcs = this.mcsCode
      this.scs = this.scsCode
    },
    async getBCS () {
      var response = null
      try {
        response = await BcService.fetchBcs({})
      } catch (e) {
        this.logError('AddWorkTypeModal.vue', 'getBCS', e.toString())
        this.$router.push('/500')
      }
      this.bcsItems = response.data.bcs
    },
    async getMCS (bCode) {
      var response = null
      try {
        response = await McService.fetchMcsByBCode({
          bCode: bCode
        })
      } catch (e) {
        this.logError('AddWorkTypeModal.vue', 'getMCS', e.toString())
        this.$router.push('/500')
      }
      this.mcsItems = response.data.mcs
    },
    async getSCS (mCode) {
      var response = null
      try {
        response = await ScService.fetchSByM({
          mCode: mCode
        })
      } catch (e) {
        this.logError('AddWorkTypeModal.vue', 'getSCS', e.toString())
        this.$router.push('/500')
      }
      this.scsItems = response.data.scs
    },
    async getMaxWCS () {
      var response = null
      try {
        response = await WcService.fetchMaxWcs({})
      } catch (e) {
        this.logError('AddWorkTypeModal.vue', 'getMaxWCS', e.toString())
        this.$router.push('/500')
      }
      this.maxWcs = response.data[0].wCode
    },
    async addWorkType () {
      // this.maxWcs = (this.maxWcs.replace('W', '') * 1) + 1
      this.maxWcs = (this.maxWcs.substr(1) * 1) + 1
      this.maxWcs = 'W' + this.leadingZeros(this.maxWcs, 3)
      // console.log(this.bcs + ', ' + this.mcs + ', ' + this.scs + ', ' + this.maxWcs + ', ' + this.workType)
      var response = null
      try {
        response = await WcService.createWc({
          bCode: this.bcs,
          mCode: this.mcs,
          sCode: this.scs,
          wCode: this.maxWcs,
          text: this.workType,
          asItem: '0'
        })
      } catch (e) {
        this.logError('AddWorkTypeModal.vue', 'addWorkType', e.toString())
        this.$router.push('/500')
      }
      this.addedWorkTypeCode = response.data.result.wCode
      // console.log(this.addedWorkTypeCode)
    },
    async addWorkTypeForItem () {
      this.maxWcs = (this.maxWcs.substr(1) * 1) + 1
      this.maxWcs = 'W' + this.leadingZeros(this.maxWcs, 3)
      var response = null
      try {
        response = await WcService.createWc({
          bCode: this.bcs,
          mCode: this.mcs,
          sCode: this.scs,
          wCode: this.maxWcs,
          text: this.workType,
          asItem: '1'
        })
      } catch (e) {
        this.logError('AddWorkTypeModal.vue', 'addWorkTypeForItem', e.toString())
        this.$router.push('/500')
      }
      this.addedWorkTypeCode = response.data.result.wCode
    },
    async checkDuplicatedWorkType () {
      var response = null
      try {
        response = await WcService.fetchSameWc({
          workTypeText: this.workType
        })
      } catch (e) {
        this.logError('AddWorkTypeModal.vue', 'checkDuplicatedWorkType', e.toString())
        this.$router.push('/500')
      }
      console.log(response.data)
      if (response.data.length >= 1) {
        console.log('true')
        alert('같은 이름의 분류가 존재합니다')
      } else {
        console.log('false')
        this.save()
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
    onChangeBcs: function (event) {
      this.getMCS(event)
    },
    onChangeMcs: function (event) {
      // console.log(this.bcs + ', ' + event)
      this.getSCS(event)
    },
    onChangeScs: function (event) {
      // console.log(this.bcs + ', ' + this.mcs + ', ' + event)
      this.getMaxWCS(this.bcs, this.mcs, event)
    },
    save () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }

        if (this.fromValue === 'work') {
          this.addWorkType()
        } else {
          this.addWorkTypeForItem()
        }

        this.$swal({
          type: 'success',
          title: '작업분류를 추가하였습니다',
          showConfirmButton: false,
          timer: 777
        }).then((result) => {
          var paramForReturn = {}
          paramForReturn.from = this.fromValue
          paramForReturn.compType = this.compType
          paramForReturn.addedWTC = this.addedWorkTypeCode
          bus.$emit('fromAddWorkTypeModal', paramForReturn)
          this.dialog = false
        })
        // bus.$emit('toJournal', 'test')
        // this.dialog = false
      }).catch(() => {})
    }
  }
}
</script>