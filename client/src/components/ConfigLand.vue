<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>농장정보 설정</h1>
      </v-flex>

      <v-flex md5 />

      <v-flex xs12 md2 class="text-xs-center" mt-3>    
      </v-flex>

      <v-flex md5 />

      <searchAddressModal></searchAddressModal>

      <!-- <div> -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-btn slot="activator" color="primary" dark class="mb-2">새 농장</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md12>
                    <v-text-field 
                        v-model="editedItem.name" 
                        :counter="10" 
                        :error-messages="errors.collect('landName')" 
                        label="농장명" 
                        required 
                        v-validate="'required|max:10'" 
                        data-vv-name="landName"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs8 sm6 md8>
                    <v-text-field 
                        v-model="editedItem.address"
                        :counter="30"
                        :error-messages="errors.collect('address')"
                        label="주소"
                        required
                        v-validate="'required|max:30'"
                        data-vv-name="address"
                        :disabled="this.editedIndex !== -1"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4 sm6 md4>
                     <v-btn outline color="indigo" @click.native="searchAddr">주소찾기</v-btn>
                  </v-flex>
                  <v-flex xs12 sm6 md12>
                    <v-text-field 
                        v-model="editedItem.size"
                        :counter="10"
                        :error-messages="errors.collect('size')"
                        label="규모"
                        required
                        v-validate="'required|max:10'"
                        data-vv-name="size"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md12>
                    <v-text-field 
                        v-model="editedItem.sizeDetail"                                                
                        label="규모상세"                                                
                        data-vv-name="sizeDetail"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs4 sm6 md3>
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
                  <v-flex xs4 sm6 md3>
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
                  <v-flex xs4 sm6 md3>
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
                  <v-flex xs4 sm6 md3>                    
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
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="close">취소</v-btn>
              <v-btn color="blue darken-1" flat @click.native="save">저장</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      <div>
        <v-data-table
          :headers="headers"
          :items="lands"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.address }}</td>
            <td class="text-xs-right">{{ props.item.size }}</td>
            <td class="text-xs-right">{{ props.item.cropCode }}</td>
            <td class="justify-center layout px-0">
              <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
              </v-btn>
              <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                <v-icon color="pink">delete</v-icon>
              </v-btn>
            </td>
          </template>
          <!--
          <template slot="no-data">
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
          -->
        </v-data-table>
      </div>
      
    </v-layout>
    <br/><br/><br/>
  </v-container>
</template>

<script>
import {bus} from '../main'
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
          max: '농장명은 10자 이하여야 합니다'
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
      { text: '주소', value: 'address' },
      { text: '규모', value: 'size' },
      { text: '작물,가축명', value: 'cropCode' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    headersForMobile: [
      {
        text: '농장명',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: '작물,가축명', value: 'cropCode' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    lands: [],
    editedIndex: -1,
    editedItem: {
      _id: '',
      name: '',
      address: '',
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
      console.log(value)
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
    this.userId = this.$session.get('userId')
    this.getLands()
    this.getBCS()
  },
  methods: {
    async getBCS () {
      const response = await BcService.fetchBcs({})
      this.items0 = response.data.bcs
    },
    async getMCS (bCode) {
      const response = await McService.fetchMcsByBCode({
        bCode: bCode
      })
      this.items1 = response.data.mcs
    },
    async getSCS (mCode) {
      const response = await ScService.fetchSByM({
        mCode: mCode
      })
      this.items2 = response.data.scs
    },
    async getDCS (sCode) {
      const response = await DcService.fetchDcsByScode({
        sCode: sCode
      })
      this.items3 = response.data.dcs
    },
    async getLands () {
      const response = await LandService.fetchLands({
        userId: this.userId
      })
      this.lands = response.data.lands
      for (var i = 0; i < this.lands.length; i++) {
        this.lands[i].dcsCode = this.lands[i].cropCode
        const response2 = await DcService.fetchCropNameByCropCode({
          cropCode: this.lands[i].cropCode
        })
        this.lands[i].cropCode = response2.data[0].text

        this.lands[i].scsCode = response2.data[0].sCode
        const response3 = await ScService.fetchTextBySCode({
          sCode: response2.data[0].sCode
        })
        this.lands[i].scs = response3.data.scs[0].text

        this.lands[i].mcsCode = response3.data.scs[0].mCode
        const response4 = await McService.fetchTextByMCode({
          mCode: response3.data.scs[0].mCode
        })
        this.lands[i].mcs = response4.data.mcs[0].text
        this.lands[i].bcsCode = response4.data.mcs[0].bCode
      }
    },
    async createNewLand () {
      await LandService.createNewLand({
        userId: this.userId,
        name: this.editedItem.name,
        address: this.editedItem.address,
        size: this.editedItem.size,
        sizeDetail: this.editedItem.sizeDetail,
        cropCode: this.cropCode
      })
      this.getLands()
      this.getBCS()
    },
    async updateLand () {
      if (this.cropCode === '') {
        this.cropCode = this.editedItem.dcsCode
      }
      await LandService.updateLand({
        id: this.editedItem._id,
        name: this.editedItem.name,
        address: this.editedItem.address,
        size: this.editedItem.size,
        sizeDetail: this.editedItem.sizeDetail,
        cropCode: this.cropCode
      })
    },
    async deleteLand (id) {
      await LandService.deleteLand(id)
    },
    async getCropName () {
      const response2 = await DcService.fetchCropNameByCropCode({
        cropCode: this.editedItem.cropCode
      })
      this.editedItem.cropCode = response2.data[0].text
    },
    initialize () {
    },
    editItem (item) {
      console.log(item)
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
    }
  }
}
</script>