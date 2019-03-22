<template>
  <div style="width:100%; margin:0 auto;">
    <!-- dummy --> <div style="height:20px"/>
        <b-row>
          <b-col cols="12">
            <b-card>              
              <b-row>
                <b-col cols="12">
                  <div style="width:100%; margin:0 auto;">
            
    <v-layout row wrap pl-2 pr-2>      

      <v-flex md5 />

      <searchAddressModal></searchAddressModal>

        <v-dialog v-model="dialog" max-width="100%">
          <v-btn slot="activator" color="primary" dark class="mb-2">새 농장</v-btn>

          
          <div style="width:100%; margin:0 auto;">
            <!-- dummy --> <div style="height:20px"/>
          <b-row>
            <b-col cols="12">
              <b-card header="영농일지 캘린더" header-tag="header">
                <h3 slot="header" class="mb-0"><strong>{{ formTitle }}</strong></h3>
                <b-row>
                  <b-col cols="12">
                    <div style="width:100%; margin:0 auto;">
<v-container grid-list-xs ma-0 pa-0>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field 
                        v-model="editedItem.name" 
                        :counter="20" 
                        :error-messages="errors.collect('landName')" 
                        label="농장명" 
                        required 
                        v-validate="'required|max:20'" 
                        data-vv-name="landName"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs8>
                    
                    <v-text-field 
                        v-model="editedItem.address"
                        :counter="30"
                        :error-messages="errors.collect('address')"
                        label="주소"
                        required
                        v-validate="'required|max:30'"
                        data-vv-name="address"                        
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                     <v-btn outline color="indigo" @click.native="searchAddr">주소찾기</v-btn>
                  </v-flex>
                  <v-flex xs8 sm8 md8>                    
                    <v-text-field 
                        v-model="editedItem.addressDetail"
                        :counter="20"                        
                        label="상세주소"                        
                        data-vv-name="addressDetail"                      
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4 sm6 md4>                     
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field 
                        v-model="editedItem.size"
                        :counter="10"
                        :error-messages="errors.collect('size')"
                        label="규모"
                        required
                        v-validate="'required|max:10'"
                        data-vv-name="size"
                        type="number"
                    ></v-text-field>
                  </v-flex>                  

                  <v-flex xs6>
                    <v-text-field 
                        v-model="editedItem.sizeDetail"                                                
                        label="규모상세"                                                
                        data-vv-name="sizeDetail"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md5/>

                  <v-flex xs4 sm6 md4>
                    <v-select
                      :items="items0"
                      v-model="editedItem.bcs"
                      label="대분류"
                      class="input-group--focused"
                      v-on:change="onChangeBcs"
                      :error-messages="errors.collect('bcs')"
                      required
                      v-validate="'required'"
                      data-vv-name="bcs"
                      item-text="text"
                      item-value="bCode"
                    ></v-select>
                  </v-flex>
                  <v-flex xs4 sm6 md4>
                    <v-select
                      :items="items1"
                      v-model="editedItem.mcs"
                      label="중분류"
                      class="input-group--focused"
                      v-on:change="onChangeMcs"
                      :error-messages="errors.collect('mcs')"
                      required
                      v-validate="'required'"
                      data-vv-name="mcs"
                      item-text="text"
                      item-value="mCode"
                    ></v-select>
                  </v-flex>
                  <v-flex xs4 sm6 md4>
                    <v-select
                      :items="items2"
                      v-model="editedItem.scs"
                      label="소분류"
                      class="input-group--focused"
                      v-on:change="onChangeScs"
                      :error-messages="errors.collect('scs')"
                      required
                      v-validate="'required'"
                      data-vv-name="scs"
                      item-text="text"
                      item-value="sCode"
                    ></v-select>
                  </v-flex>
                  <v-flex xs4 sm6 md4>                    
                    <v-select
                      :items="items3"
                      v-model="editedItem.cropCode"
                      label="작물,가축명"
                      class="input-group--focused"
                      v-on:change="onChangeSelect2"
                      :error-messages="errors.collect('cropName')"
                      required
                      v-validate="'required'"
                      data-vv-name="cropName"
                      item-text="text"
                      item-value="dCode"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md8/>

                  <v-flex xs6 sm6 md6>
                    <v-btn outline color="indigo" flat @click.native="deleteI">삭제</v-btn>
                  </v-flex> 

                  <v-flex xs6 sm6 md6>
                    <v-btn outline color="indigo" @click.native="close">취소</v-btn>
                    <v-btn color="primary" @click.native="save">저장</v-btn>
                  </v-flex>
                </v-layout>
</v-container>
                  </div>
                </b-col>              
              </b-row>              
            </b-card>
          </b-col>
        </b-row>
      </div>            
            
        </v-dialog>
      
        <v-flex xs12 sm12 md12>   
          <v-data-table
            :headers="headers"
            :items="lands"
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
              <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}" @click="editItem(props.item)"><h5>{{ props.item.name }}</h5></td>
              <!-- 
              <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}"><h4>{{ props.item.address }}</h4></td> -->
              <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}" @click="editItem(props.item)"><h5>{{ getStrWithComma(props.item.size) }}</h5></td>              
              <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}" @click="editItem(props.item)"><h5>{{ props.item.cropCode }}</h5></td>
              <!--
              <td :style="{backgroundColor: (props.index % 2 ? '#F6F7FE' : 'transparent')}" class="layout px-0">
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
import DBService from '@/services/DBService'
import LogService from '@/services/LogService'
import LandService from '@/services/LandService'
import BcService from '@/services/BcService'
import McService from '@/services/McService'
import ScService from '@/services/ScService'
import DcService from '@/services/DcService'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data: () => ({
    dictionary: {
      custom: {
        landName: {
          required: () => '농장명을 입력해주세요',
          max: '농장명은 20자 이하여야 합니다'
        },
        address: {
          required: () => '주소를 입력해주세요',
          max: '주소는 30자 이하여야 합니다'
        },
        size: {
          required: () => '농장크기를 입력해주세요',
          max: '농장크기는 10자 이하여야 합니다'
        },
        cropName: {
          required: '작물,가축명을 선택해주세요'
        },
        bcs: {
          required: '대분류를 선택해주세요'
        },
        mcs: {
          required: '중분류를 선택해주세요'
        }
      }
    },
    cropCode: '',
    selectedCropName: '',
    dbPassword: '',
    userId: '',
    user: '',
    valid: true,
    valid2: true,
    select: null,
    items0: [],
    items1: [],
    items2: [],
    items3: [],
    selectedCropCode: '',
    dialog: false,
    headers: [
      {
        text: '농장명',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: '규모', sortable: false, value: 'size' },
      { text: '작물,가축명', sortable: false, value: 'cropCode' }
      //  { text: 'Actions', value: 'name', sortable: false }
    ],
    lands: [],
    editedIndex: -1,
    editedItem: {
      _id: '',
      name: '',
      address: '',
      addressDetail: '',
      size: '',
      sizeDetail: '',
      bcs: '',
      mcs: '',
      scs: '',
      cropCode: ''
    },
    defaultItem: {
      _id: '',
      name: '',
      address: '',
      addressDetail: '',
      size: '',
      sizeDetail: '',
      bcs: '',
      mcs: '',
      scs: '',
      cropCode: ''
    }
  }),
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '새 농장' : '농장정보 수정'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  mounted () {
    var vm = this
    this.$validator.localize('ko', this.dictionary)
    bus.$on('dialogForSearchAddressReturn', function (value) {
      // console.log(value)
      vm.editedItem.address = value
      // vm.dialog = true
    })
  },
  beforeCreate: function () {
    if (!this.$session.exists()) {
      this.$router.push('/login')
    } else {
    }
  },
  created () {
    if (this.checkDB()) {
      this.userId = this.$session.get('userId')
      this.getLands()
      this.getBCS()
    }
  },
  methods: {
    async logError (page, funcName, message) {
      await LogService.logError({
        errorPage: page,
        funcName: funcName,
        message: message
      })
    },
    async getBCS () {
      var response = null
      try {
        response = await BcService.fetchBcs({})
      } catch (e) {
        this.logError('ConfigLand.vue', 'getBCS', e.toString())
        this.$router.push('/500')
      }
      this.items0 = response.data.bcs
    },
    async getMCS (bCode) {
      var response = null
      try {
        response = await McService.fetchMcsByBCode({
          bCode: bCode
        })
      } catch (e) {
        this.logError('ConfigLand.vue', 'getMCS', e.toString())
        this.$router.push('/500')
      }
      this.items1 = response.data.mcs
    },
    async getSCS (mCode) {
      var response = null
      try {
        response = await ScService.fetchSByM({
          mCode: mCode
        })
      } catch (e) {
        this.logError('ConfigLand.vue', 'getSCS', e.toString())
        this.$router.push('/500')
      }
      this.items2 = response.data.scs
    },
    async getDCS (sCode) {
      var response = null
      try {
        response = await DcService.fetchDcsByScode({
          sCode: sCode
        })
      } catch (e) {
        this.logError('ConfigLand.vue', 'getDCS', e.toString())
        this.$router.push('/500')
      }
      this.items3 = response.data.dcs
    },
    async getLands () {
      var response = null
      try {
        response = await LandService.fetchLands({
          userId: this.userId
        })
      } catch (e) {
        this.logError('ConfigLand.vue', 'getLands', e.toString())
        this.$router.push('/500')
      }
      this.lands = response.data.lands
      for (var i = 0; i < this.lands.length; i++) {
        this.lands[i].dcsCode = this.lands[i].cropCode
        var response2 = null
        try {
          response2 = await DcService.fetchCropNameByCropCode({
            cropCode: response.data.lands[i].cropCode
          })
        } catch (e) {
          this.logError('ConfigLand.vue', 'getLands', e.toString())
          this.$router.push('/500')
        }
        this.lands[i].cropCode = response2.data[0].text

        this.lands[i].scsCode = response2.data[0].sCode
        var response3 = null
        try {
          response3 = await ScService.fetchTextBySCode({
            sCode: response2.data[0].sCode
          })
        } catch (e) {
          this.logError('ConfigLand.vue', 'getLands', e.toString())
          this.$router.push('/500')
        }
        this.lands[i].scs = response3.data.scs[0].text

        this.lands[i].mcsCode = response3.data.scs[0].mCode
        var response4 = null
        try {
          response4 = await McService.fetchTextByMCode({
            mCode: response3.data.scs[0].mCode
          })
        } catch (e) {
          this.logError('ConfigLand.vue', 'getLands', e.toString())
          this.$router.push('/500')
        }
        this.lands[i].mcs = response4.data.mcs[0].text
        this.lands[i].bcsCode = response4.data.mcs[0].bCode
      }
    },
    async createNewLand () {
      try {
        await LandService.createNewLand({
          userId: this.userId,
          name: this.editedItem.name,
          address: this.editedItem.address,
          addressDetail: this.editedItem.addressDetail,
          size: this.editedItem.size,
          sizeDetail: this.editedItem.sizeDetail,
          cropCode: this.cropCode
        })
      } catch (e) {
        this.logError('ConfigLand.vue', 'createNewLand', e.toString())
        this.$router.push('/500')
      }
      this.getLands()
      this.getBCS()
    },
    async updateLand () {
      this.cropCode = this.editedItem.cropCode
      try {
        await LandService.updateLand({
          id: this.editedItem._id,
          name: this.editedItem.name,
          address: this.editedItem.address,
          addressDetail: this.editedItem.addressDetail,
          size: this.editedItem.size,
          sizeDetail: this.editedItem.sizeDetail,
          cropCode: this.cropCode
        })
      } catch (e) {
        this.logError('ConfigLand.vue', 'updateLand', e.toString())
        this.$router.push('/500')
      }
      this.getLands()
      this.getBCS()
    },
    async deleteLand (id) {
      try {
        await LandService.deleteLand(id)
      } catch (e) {
        this.logError('ConfigLand.vue', 'deleteLand', e.toString())
        this.$router.push('/500')
      }
    },
    async getCropName () {
      var response2 = null
      try {
        response2 = await DcService.fetchCropNameByCropCode({
          cropCode: this.editedItem.cropCode
        })
      } catch (e) {
        this.logError('ConfigLand.vue', 'getCropName', e.toString())
        this.$router.push('/500')
      }
      this.editedItem.cropCode = response2.data[0].text
    },
    async checkDB () {
      try {
        await DBService.checkDB({})
      } catch (e) {
        this.$router.push('/500')
        return false
      }
      return true
    },
    initialize () {
    },
    editItem (item) {
      // console.log(item)
      if (this.checkDB()) {
        this.editedIndex = this.lands.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.editedItem.bcs = item.bcsCode
        this.getMCS(item.bcsCode)
        this.editedItem.mcs = item.mcsCode
        this.getSCS(item.mcsCode)
        this.editedItem.scs = item.scsCode
        this.getDCS(item.scsCode)
        this.editedItem.cropCode = item.dcsCode
        this.dialog = true
      }
    },
    deleteI () {
      const index = this.editedIndex
      this.$swal({
        title: '이 농장을 삭제 하시겠습니까?',
        text: '이 농장과 연계된 모든작업, 자재일지가 같이 삭제됩니다',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 삭제합니다',
        cancelButtonText: '취소합니다'
      }).then((result) => {
        if (result.value) {
          this.lands.splice(index, 1)
          this.deleteLand(this.editedItem._id)
          this.$swal(
            '삭제했습니다!',
            '일지가 삭제되었습니다',
            'success'
          )
          this.dialog = false
        }
      })
    },
    deleteItem (item) {
      const index = this.lands.indexOf(item)
      // confirm('이 농장을 지우시겠습니까?') && this.lands.splice(index, 1) && this.deleteLand(item._id)
      this.$swal({
        title: '이 농장을 삭제 하시겠습니까?',
        text: '이 농장과 연계된 모든작업, 자재일지가 같이 삭제됩니다',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 삭제합니다',
        cancelButtonText: '취소합니다'
      }).then((result) => {
        if (result.value) {
          this.lands.splice(index, 1)
          this.deleteLand(item._id)
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
    save () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        if (this.editedIndex > -1) {
          this.updateLand()
          Object.assign(this.lands[this.editedIndex], this.editedItem)
        } else {
          this.createNewLand()
        }
        this.close()
      }).catch(() => {})
    },
    searchAddr () {
      bus.$emit('dialogForSearchAddress', 'test')
    },
    onChangeBcs: function (event) {
      this.getMCS(event)
    },
    onChangeMcs: function (event) {
      this.getSCS(event)
    },
    onChangeScs: function (event) {
      this.getDCS(event)
    },
    onChangeSelect2: function (event) {
      this.cropCode = event
      // console.log(event)
    },
    getStrWithComma: function (dataVal) {
      var tmpStr = dataVal + ''
      tmpStr = tmpStr.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return tmpStr
    }
  }
}
</script>