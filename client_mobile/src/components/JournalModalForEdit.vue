<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="100%" height="768px" fullscreen hide-overlay transition="dialog-bottom-transition">

       <v-tabs
          v-model="active"
          color="cyan"
          dark
          slider-color="yellow"
       >
          <v-tab            
            :key="1"
            ripple  
            v-if="showWorkJournal"       
          >
            작업일지
          </v-tab>

          <v-tab            
            :key="2"
            ripple             
            v-if="showItemJournal"       
          >
            자재일지
          </v-tab>

          <!-- 작 업 일 지 -->
          <v-tab-item             
            v-if="showWorkJournal"             
          >
          <v-card color="white">
            
            <div style="width:100%; margin:0 auto;">
              <!-- dummy --> <div style="height:20px"/>
        <b-row>
          <b-col cols="12">
            <b-card>              
              <b-row>
                <b-col cols="12">
                  <div style="width:100%; margin:0 auto;">
            
            <!--
            <v-card-title>
              <span class="headline" style="color:black">{{User_Profile}}</span> <v-btn outline color="black" flat @click.native="dialog = false">닫기</v-btn>
            </v-card-title>
            -->
            <span class="headline" style="color:black; padding-left:30px;">{{getDateWithKorean(User_Profile)}}
              <v-btn outline color="indigo" flat @click.native="dialog = false">닫기</v-btn>
            </span>               

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <!-- R O W 1 -->
                  <v-flex xs3>
                    <v-text-field
                      v-model="skyStatus"
                      label="날씨"
                      placeholder="날씨"
                      hint="자동입력"
                      readonly
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs3>
                    <v-text-field
                      v-model="RN1"
                      label="강수량"
                      placeholder="강수량"
                      hint="자동입력"
                      readonly
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6/>
                  <!-- R O W 1 -->

                  <!-- R O W 2 -->
                  <v-flex xs4>
                    <v-text-field
                      v-model="avgT1H"
                      label="평균온도"
                      placeholder="평균온도"
                      hint="자동입력"
                      readonly
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field
                      v-model="maxT1H"
                      label="최대온도"
                      placeholder="최대온도"
                      hint="자동입력"
                      readonly
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field
                      v-model="minT1H"
                      label="최소온도"
                      placeholder="최소온도"
                      hint="자동입력"
                      readonly
                    ></v-text-field>
                  </v-flex>
                  <!-- R O W 2 -->

                  <!-- R O W 3 -->
                  <v-flex xs4>
                    <v-text-field
                      v-model="avgREH"
                      label="평균습도"
                      placeholder="평균습도"
                      hint="자동입력"
                      readonly
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field
                      v-model="maxREH"
                      label="최대습도"
                      placeholder="최대습도"
                      hint="자동입력"
                      readonly
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field
                      v-model="minREH"
                      label="최소습도"
                      placeholder="최소습도"
                      hint="자동입력"
                      readonly
                    ></v-text-field>
                  </v-flex>
                  <!-- R O W 3 -->

                  <!-- R O W 4 -->
                  <v-flex xs6>
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
                  <!--
                  <v-flex xs4>
                    <v-text-field
                      v-model="cropName"
                      label="작물명" 
                      hint="농장명을 선택하면 자동입력됩니다"
                      persistent-hint
                      required                      
                      ></v-text-field>
                  </v-flex>
                  -->
                  <v-flex xs6>
                    <v-select
                      v-validate="'required'"
                      :items="workType"
                      v-model="selectWorkType"
                      :error-messages="errors.collect('selectWorkType')"
                      label="작업분류"
                      data-vv-name="selectWorkType"
                      required
                      v-on:change="onChangeWorkType"
                      item-text="text"
                      item-value="wCode"
                    ></v-select>
                  </v-flex>
                  <!-- R O W 4 -->

                  <!-- R O W 5 -->
                  <v-flex xs6 sm6 md2>
                    <v-text-field
                      v-model="workTime"
                      label="작업시간"
                      placeholder="작업시간"
                      type="number"
                      min="0"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm6 md2>
                    <v-text-field
                      v-model="workerNumber"
                      label="작업인원"
                      placeholder="작업인원"
                      type="number"
                      min="0"
                    ></v-text-field>
                  </v-flex>                  
                  <!-- R O W 5 -->

                  <v-flex xs12>
                    <div slot="label">
                      <h4>발생비용
                      <v-btn outline color="indigo" flat @click.native="addCooRow">추가</v-btn>
                      <v-btn outline color="indigo" flat @click.native="deleteCooRow">삭제</v-btn>
                      </h4>
                    </div>
                  </v-flex>
                  
                  <template v-for="(item, index) in cooItems">
                    <v-flex xs6 :key="'A' + index">
                      <v-text-field
                        label="발생분류"                      
                        v-model="item.category"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs6 :key="'B' + index">
                      <v-text-field
                        label="발생비용"
                        v-model="item.cost"
                        v-on:change="onChangeItemCost"
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-flex> 
                  </template>                                                     

                  <v-flex xs6>                    
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="CooTotal"
                      label="총 발생비용"
                      placeholder="Placeholder"
                      readonly
                    ></v-text-field>
                  </v-flex>    

                  <template v-if='showShipment'>
                    <v-flex xs6>
                      <v-text-field
                        v-model="shipmentAmount"
                        label="출하량"
                        placeholder="출하량"
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="shipmentDetail"
                        label="출하량 상세"
                        placeholder="출하량 상세"
                      ></v-text-field>
                    </v-flex>
                  </template>

                  <template v-if='showIncome'>
                    <v-flex xs6>
                      <v-text-field
                        v-model="incomeAmount"
                        label="수입량"
                        placeholder="수입량"
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="incomeDetail"
                        label="수입량 상세"
                        placeholder="수입량 상세"
                      ></v-text-field>
                    </v-flex>
                  </template>

                  <template v-if='showUsage'>
                    <v-flex xs12>
                      <div slot="label">
                        <h4>사용량
                        <v-btn outline color="indigo" flat @click.native="addUsageRow">추가</v-btn>
                        <v-btn outline color="indigo" flat @click.native="deleteUsageRow">삭제</v-btn>
                        </h4>
                      </div>
                    </v-flex>

                    <template v-for="(item, index) in usageItems">
                      <v-flex xs6 :key="'C' + index">
                        <v-select                          
                          :items="itemNames"
                          v-model="item.itemName"
                          :error-messages="errors.collect('item.itemName')"
                          label="품목명"
                          data-vv-name="item.itemName"
                          required                           
                          hint="품목명 선택"
                          persistent-hint
                          v-on:change="onChangeItemName(item.itemName, index)"                                        
                        ></v-select>
                      </v-flex>
                      <v-flex xs6 :key="'D' + index">
                        <v-text-field
                          label="사용량"
                          v-model="item.usage"
                          type="number"
                          min="0"
                        ></v-text-field>
                      </v-flex>
                    </template>
                  </template>                  

                  <template v-if='showOutput'>
                    <v-flex xs6>
                      <v-text-field
                        v-model="outputAmount"
                        label="생산량"
                        placeholder="생산량"
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="outputDetail"
                        label="생산량 상세"
                        placeholder="생산량 상세"
                      ></v-text-field>
                    </v-flex>
                  </template>
                  
                  <v-flex xs12>
                    <v-textarea
                      v-model="workContent"
                      auto-grow
                      box
                      color="deep-purple"
                      label="작업내용"
                      rows="3"
                    ></v-textarea>
                  </v-flex>

                  <v-flex xs12>
                    <v-textarea
                      v-model="remarks"
                      auto-grow
                      box
                      color="deep-purple"
                      label="특이사항"
                      rows="3"
                    ></v-textarea>
                  </v-flex>

                  <v-flex xs4>                    
                    <!-- https://medium.freecodecamp.org/how-to-build-a-flexible-image-uploader-component-using-vue-js-2-0-5ee7fc77516 -->
                    <image-input v-model="avatar">
                      <div slot="activator">
                        <v-avatar size="100px" v-ripple v-if="!avatar" class="grey lighten-3 mb-3">
                          <span>사진 추가</span>
                        </v-avatar>
                        <v-avatar size="100px" v-ripple v-else class="mb-3">
                          <img :src="avatar.imageURL" alt="avatar">
                        </v-avatar>
                      </div>
                    </image-input> 
                    <v-btn outline color="indigo" flat @click.native="showPic(avatar.imageURL)">크게보기</v-btn>                                     
                  </v-flex>

                  <v-flex xs4>                    
                    <!-- https://medium.freecodecamp.org/how-to-build-a-flexible-image-uploader-component-using-vue-js-2-0-5ee7fc77516 -->
                    <image-input v-model="avatar2">
                      <div slot="activator">
                        <v-avatar size="100px" v-ripple v-if="!avatar2" class="grey lighten-3 mb-3">
                          <span>사진 추가</span>
                        </v-avatar>
                        <v-avatar size="100px" v-ripple v-else class="mb-3">
                          <img :src="avatar2.imageURL" alt="avatar2">
                        </v-avatar>
                      </div>
                    </image-input>                    
                    <v-btn outline color="indigo" flat @click.native="showPic(avatar2.imageURL)">크게보기</v-btn>                                     
                  </v-flex>

                  <v-flex xs4>                    
                    <!-- https://medium.freecodecamp.org/how-to-build-a-flexible-image-uploader-component-using-vue-js-2-0-5ee7fc77516 -->
                    <image-input v-model="avatar3">
                      <div slot="activator">
                        <v-avatar size="100px" v-ripple v-if="!avatar3" class="grey lighten-3 mb-3">
                          <span>사진 추가</span>
                        </v-avatar>
                        <v-avatar size="100px" v-ripple v-else class="mb-3">
                          <img :src="avatar3.imageURL" alt="avatar3">
                        </v-avatar>
                      </div>
                    </image-input> 
                    <v-btn outline color="indigo" flat @click.native="showPic(avatar3.imageURL)">크게보기</v-btn>                                                        
                  </v-flex>
                  
                </v-layout>
              </v-container>
              <!-- <small>*필수 입력 사항입니다</small> -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outline color="indigo" flat @click.native="deleteJ">삭제</v-btn>
              <v-btn outline color="indigo" flat @click.native="dialog = false">취소</v-btn>              
              <v-btn color="primary" @click.native="save">수정</v-btn>
            </v-card-actions>
            
                  </div>
                </b-col>              
              </b-row>              
            </b-card>
          </b-col>
        </b-row>
      </div>

          </v-card>
        </v-tab-item>
        <!-- 작 업 일 지 -->

        <!-- 자 재 일 지 -->
        <v-tab-item                        
            v-if="showItemJournal"
          >
          <v-card color="white">

            <div style="width:100%; margin:0 auto;">
              <!-- dummy --> <div style="height:20px"/>
        <b-row>
          <b-col cols="12">
            <b-card>              
              <b-row>
                <b-col cols="12">
                  <div style="width:100%; margin:0 auto;">            

            <!--
            <v-card-title>
              <span class="headline" style="color:black">{{Item_User_Profile}}</span> <v-btn outline color="black" flat @click.native="dialog = false">닫기</v-btn>
            </v-card-title>
            -->
            <span class="headline" style="color:black; padding-left:30px">{{getDateWithKorean(Item_User_Profile)}}
              <v-btn outline color="indigo" flat @click.native="dialog = false">닫기</v-btn>
            </span>               

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap> 
                  
                <!-- R O W 1 -->
                  <v-flex xs6>
                    <v-select
                      :items="iLandItems"
                      v-model="iSelectLand"
                      :error-messages="errors.collect('iSelectLand')"
                      label="농장명"
                      data-vv-name="iSelectLand"
                      required
                      v-on:change="onChangeILand"
                      item-text="name"
                      item-value="_id"                      
                    ></v-select>
                  </v-flex>

                  <v-flex xs6>
                    <v-select                      
                      :items="items"
                      v-model="selectItem"
                      :error-messages="errors.collect('selectItem')"
                      label="구입품목"
                      data-vv-name="selectItem"
                      required
                      v-on:change="onChangeItem"
                      item-text="text"
                      item-value="wCode"                                                                 
                    ></v-select>
                  </v-flex>
                <!-- R O W 1 -->  
                
                <!-- R O W 2 -->
                  <v-flex xs12>
                    <div slot="label">
                      <h4>품목상세
                      <v-btn outline color="indigo" flat @click.native="addItemRow">추가</v-btn>
                      <v-btn outline color="indigo" flat @click.native="deleteItemRow">삭제</v-btn>
                      </h4>
                    </div>
                  </v-flex>
                <!-- R O W 2 -->

                <!-- R O W 3 -->
                  <template v-for="(item, index) in itemItems">
                    <v-flex xs3 :key="'C' + index">
                      <v-text-field
                        label="품목명"                      
                        v-model="item.itemName"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs2 :key="'D' + index">
                      <v-text-field
                        label="수량"
                        v-model="item.itemAmount"   
                        type="number"
                        min="0"                     
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs3 :key="'E' + index">
                      <v-text-field
                        label="가격"
                        v-model="item.itemPrice"
                        v-on:change="onChangeItemPrice"
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs2 :key="'F' + index">
                      <v-text-field
                        label="사용량"
                        v-model="item.itemUsage"                        
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-flex>  
                    <v-flex xs2 :key="'G' + index">
                      <v-text-field
                        label="재고량"
                        v-model="item.itemStock"                        
                        type="number"
                        min="0"
                      ></v-text-field>
                    </v-flex>  
                  </template>
                <!-- R O W 3 -->                                                     

                <!-- R O W 4 -->
                  <v-flex xs8>                    
                  </v-flex>
                  <v-flex xs4>
                    <v-text-field
                      v-model="itemPriceTotal"
                      label="총 가격"
                      placeholder="총 가격"
                      readonly
                    ></v-text-field>
                  </v-flex>
                <!-- R O W 4 -->                 

                <!-- R O W 5 -->  
                  <v-flex xs12>
                    <v-textarea
                      v-model="purpose"
                      auto-grow
                      box
                      color="deep-purple"
                      label="사용목적"
                      rows="3"
                    ></v-textarea>
                  </v-flex>
                <!-- R O W 5 -->  

                  <v-flex xs4>                    
                    <!-- https://medium.freecodecamp.org/how-to-build-a-flexible-image-uploader-component-using-vue-js-2-0-5ee7fc77516 -->
                    <image-input v-model="iavatar">
                      <div slot="activator">
                        <v-avatar size="100px" v-ripple v-if="!iavatar" class="grey lighten-3 mb-3">
                          <span>사진 추가</span>
                        </v-avatar>
                        <v-avatar size="100px" v-ripple v-else class="mb-3">
                          <img :src="iavatar.imageURL" alt="avatar">
                        </v-avatar>
                      </div>
                    </image-input>     
                    <v-btn outline color="indigo" flat @click.native="showPic(iavatar.imageURL)">크게보기</v-btn>                 
                  </v-flex>

                  <v-flex xs4>                    
                    <!-- https://medium.freecodecamp.org/how-to-build-a-flexible-image-uploader-component-using-vue-js-2-0-5ee7fc77516 -->
                    <image-input v-model="iavatar2">
                      <div slot="activator">
                        <v-avatar size="100px" v-ripple v-if="!iavatar2" class="grey lighten-3 mb-3">
                          <span>사진 추가</span>
                        </v-avatar>
                        <v-avatar size="100px" v-ripple v-else class="mb-3">
                          <img :src="iavatar2.imageURL" alt="avatar2">
                        </v-avatar>
                      </div>
                    </image-input>   
                    <v-btn outline color="indigo" flat @click.native="showPic(iavatar2.imageURL)">크게보기</v-btn>                 
                  </v-flex>

                  <v-flex xs4>                    
                    <!-- https://medium.freecodecamp.org/how-to-build-a-flexible-image-uploader-component-using-vue-js-2-0-5ee7fc77516 -->
                    <image-input v-model="iavatar3">
                      <div slot="activator">
                        <v-avatar size="100px" v-ripple v-if="!iavatar3" class="grey lighten-3 mb-3">
                          <span>사진 추가</span>
                        </v-avatar>
                        <v-avatar size="100px" v-ripple v-else class="mb-3">
                          <img :src="iavatar3.imageURL" alt="avatar3">
                        </v-avatar>
                      </div>
                    </image-input> 
                    <v-btn outline color="indigo" flat @click.native="showPic(iavatar3.imageURL)">크게보기</v-btn>                   
                  </v-flex>
                  
                </v-layout>
              </v-container>
              <!-- <small>*필수 입력 사항입니다</small> -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outline color="indigo" flat @click.native="deleteI">삭제</v-btn>
              <v-btn outline color="indigo" flat @click.native="dialog = false">취소</v-btn>
              <!-- <v-btn color="blue darken-1" flat @click.native="dialog = false" :disabled="!valid">작성</v-btn> -->
              <v-btn color="primary" @click.native="itemSave">작성</v-btn>
            </v-card-actions>
            
                  </div>
                </b-col>              
              </b-row>              
            </b-card>
          </b-col>
        </b-row>
      </div>

          </v-card>
        </v-tab-item>
        <!-- 자 재 일 지 -->

      </v-tabs>

    </v-dialog>
  </v-layout>
</template>

<script>
import {bus} from '../main'
import LandService from '@/services/LandService'
// import ScService from '@/services/ScService'
import WcService from '@/services/WcService'
import DcService from '@/services/DcService'
import JournalService from '@/services/JournalService'
import ItemService from '@/services/ItemService'
import ImageInput from './ImageInput.vue'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      iSelectLand: '',
      iLandItems: [],
      //
      imgCommonPreview: new Image(),
      //
      showWorkJournal: true,
      showItemJournal: true,
      //
      selectedItem: '',
      iavatar3: {},
      iavatar2: {},
      iavatar: {},
      purpose: '',
      itemPriceTotal: 0,
      itemItems: [
        {
          itemName: '',
          itemAmount: '',
          itemPrice: ''
        }
      ],
      selectItem: '',
      items: [],
      Item_User_Profile: '',
      itemId: '',
      //
      origin: '',
      updatedEvent: {},
      outputDetail: '',
      outputAmount: '',
      incomeDetail: '',
      incomeAmount: '',
      shipmentDetail: '',
      shipmentAmount: '',
      CooTotal: '',
      workTime: '',
      workerNumber: '',
      minREH: '',
      maxREH: '',
      avgREH: '',
      minT1H: '',
      maxT1H: '',
      avgT1H: '',
      RN1: '',
      skyStatus: '',
      selectedWorkTypeText: '',
      itemNames: [],
      showOutput: false,
      showUsage: false,
      showIncome: false,
      showShipment: false,
      sCode: '',
      usageItems: [
        {
          itemName: '',
          usage: ''
        }
      ],
      cooItems: [
        {
          category: '',
          cost: ''
        }
      ],
      avatar3: {},
      avatar2: {},
      avatar: {},
      saving: false,
      saved: false,
      active: null,
      weatherData: [],
      convertedXY: {},
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
      userId: '',
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
  watch: {
    avatar: {
      handler: function () {
        this.saved = false
        // console.log(this.avatar.uploadedFilename)
      },
      deep: true
    }
  },
  mounted () {
    this.$validator.localize('ko', this.dictionary)
    var vm = this
    bus.$on('dialogForEdit', function (value) {
      Object.assign(vm.$data, vm.$options.data.call(vm))  // initialize this data
      // console.log(value)
      vm.journalId = value.journalId
      vm.itemId = value.itemId
      vm.eventIndex = value.eventIndex
      vm.origin = value.origin  // 어디서 호출했는지?
      vm.dialog = true
      vm.userId = this.$session.get('userId')
      if (vm.itemId) {
        // console.log('i am item')
        vm.showWorkJournal = false
        vm.showItemJournal = true
        // vm.active = 1
        vm.getLands()
        vm.getItem()
      } else {
        // console.log('i am journal')
        vm.showWorkJournal = true
        vm.showItemJournal = false
        // vm.active = 0
        vm.getJournal()
        vm.getLands()
      }
    })
    bus.$on('fromAddWorkTypeModal', function (value) {
      if (value.compType === 'edit') {
        if (value.from === 'work') {
          vm.onChangeLand(vm.selectedLandId)
          vm.selectWorkType = value.addedWTC
        } else {
          vm.onChangeILand(vm.selectedLandId)
          vm.selectItem = value.addedWTC
        }
      }
    })
    bus.$on('fromAddCustomItemModalEdit', function (value) {
      vm.itemNames.push(value.itemName)
      vm.usageItems[value.selectIdx].itemName = value.itemName
    })
  },
  created () {
    // this.getLands()
    // this.imgCommonPreview = new Image()
  },
  components: {
    ImageInput: ImageInput
  },
  methods: {
    async getItem () {
      const response = await ItemService.fetchItem({
        id: this.itemId
      })
      // this.Item_User_Profile = '자재관리 수정 - ' + response.data[0].date
      this.Item_User_Profile = response.data[0].date

      // 농장명
      this.iSelectLand = response.data[0].landId
      this.selectedLandId = response.data[0].landId

      // 구입품목
      this.onChangeILand()
      this.selectItem = response.data[0].item

      // 품목상세
      this.itemItems = response.data[0].itemDetail
      this.onChangeItemPrice()

      // 사용목적
      this.purpose = response.data[0].purpose

      // 사진
      if (response.data[0].pictureA) {
        this.iavatar.imageURL = 'http://59.8.37.86:8081/getJournalImg/' + this.userId + '/' + response.data[0].pictureA
        this.iavatar.uploadedFilename = response.data[0].pictureA
      } else {
        this.iavatar = null
      }
      if (response.data[0].pictureB) {
        this.iavatar2.imageURL = 'http://59.8.37.86:8081/getJournalImg/' + this.userId + '/' + response.data[0].pictureB
        this.iavatar2.uploadedFilename = response.data[0].pictureB
      } else {
        this.iavatar2 = null
      }
      if (response.data[0].pictureC) {
        this.iavatar3.imageURL = 'http://59.8.37.86:8081/getJournalImg/' + this.userId + '/' + response.data[0].pictureC
        this.iavatar3.uploadedFilename = response.data[0].pictureC
      } else {
        this.iavatar3 = null
      }
    },
    async getJournal () {
      const response = await JournalService.fetchJournal({
        id: this.journalId
      })
      // this.User_Profile = '영농일지 수정 - ' + response.data[0].date
      this.User_Profile = response.data[0].date

      this.skyStatus = response.data[0].weather.sky
      switch (this.skyStatus) {
        case '0' :
          this.skyStatus = '맑음'
          break
        case '1' :
          this.skyStatus = '비'
          break
        case '2' :
          this.skyStatus = '비/눈'
          break
        case '3' :
          this.skyStatus = '눈'
          break
      }
      this.RN1 = response.data[0].weather.avgRN1
      this.minT1H = response.data[0].weather.minT1H + '℃'
      this.maxT1H = response.data[0].weather.maxT1H + '℃'
      this.avgT1H = Math.round(response.data[0].weather.avgT1H) + '℃'
      this.minREH = response.data[0].weather.minREH + '%'
      this.maxREH = response.data[0].weather.maxREH + '%'
      this.avgREH = Math.round(response.data[0].weather.avgREH) + '%'

      this.selectLand = response.data[0].landId
      this.selectedLandId = response.data[0].landId
      this.getCropCodeByLandId(this.selectLand)
      this.selectedWorkTypeCode = response.data[0].workCode
      this.selectWorkType = response.data[0].workCode

      this.workTime = response.data[0].workTime
      this.workerNumber = response.data[0].workerNumber

      this.cooItems = response.data[0].COO
      this.onChangeItemCost()

      const response2 = await WcService.fetchOneTextByCcode({
        code: this.selectWorkType
      })
      this.selectedWorkTypeText = response2.data[0].text

      if (this.selectedWorkTypeText === '출하') {
        this.showShipment = true
        this.shipmentAmount = response.data[0].shipment.amount
        this.shipmentDetail = response.data[0].shipment.detail

        this.showIncome = true
        this.incomeAmount = response.data[0].income.amount
        this.incomeDetail = response.data[0].income.detail

        this.showUsage = false
        this.usageItems = []
        this.showOutput = false
      } else if (this.selectedWorkTypeText === '비료' || this.selectedWorkTypeText === '농약' || this.selectedWorkTypeText === '사료') {
        this.showShipment = false
        this.showIncome = false
        this.showUsage = true

        // 셀렉트 박스에 커스텀 입력 사항을 추가
        this.itemNames = []
        for (var i = 0; i < response.data[0].usage.length; i++) {
          this.itemNames.push(response.data[0].usage[i].itemName)
        }

        this.usageItems = response.data[0].usage

        this.fetchItemsByWcodeForEdit(this.selectedWorkTypeCode) //

        this.showOutput = false
      } else if (this.selectedWorkTypeText === '생산') {
        this.showShipment = false
        this.showIncome = false
        this.showUsage = false
        this.usageItems = []
        this.showOutput = true
        this.outputAmount = response.data[0].output.amount
        this.outputDetail = response.data[0].output.detail
      } else {
        this.showShipment = false
        this.showIncome = false
        this.showUsage = false
        this.showOutput = false
      }

      this.workContent = response.data[0].workContent
      this.remarks = response.data[0].remarks

      if (response.data[0].pictureA) {
        this.avatar.imageURL = 'http://59.8.37.86:8081/getJournalImg/' + this.userId + '/' + response.data[0].pictureA
        this.avatar.uploadedFilename = response.data[0].pictureA
      } else {
        this.avatar = null
      }
      if (response.data[0].pictureB) {
        this.avatar2.imageURL = 'http://59.8.37.86:8081/getJournalImg/' + this.userId + '/' + response.data[0].pictureB
        this.avatar2.uploadedFilename = response.data[0].pictureB
      } else {
        this.avatar2 = null
      }
      if (response.data[0].pictureC) {
        this.avatar3.imageURL = 'http://59.8.37.86:8081/getJournalImg/' + this.userId + '/' + response.data[0].pictureC
        this.avatar3.uploadedFilename = response.data[0].pictureC
      } else {
        this.avatar3 = null
      }
    },
    async fetchItemsByWcode (workCode) {
      const response = await ItemService.fetchItemsByWcode({
        userId: this.userId,
        wCode: workCode
      })
      this.itemNames = []
      for (var i = 0; i < response.data.length; i++) {
        for (var j = 0; j < response.data[i].itemDetail.length; j++) {
          this.itemNames.push(response.data[i].itemDetail[j].itemName)
        }
      }
      this.itemNames.push('직접입력')
    },
    async fetchItemsByWcodeForEdit (workCode) {
      const response = await ItemService.fetchItemsByWcode({
        userId: this.userId,
        wCode: workCode
      })
      // this.itemNames = []
      for (var i = 0; i < response.data.length; i++) {
        for (var j = 0; j < response.data[i].itemDetail.length; j++) {
          this.itemNames.push(response.data[i].itemDetail[j].itemName)
        }
      }
      this.itemNames.push('직접입력')
    },
    async getLands () {
      const response = await LandService.fetchLands({
        userId: this.userId
      })
      this.landItems = response.data.lands
      this.iLandItems = response.data.lands
    },
    async getCropCodeByLandId (landId) {
      const response = await LandService.fetchCropCodeByLandId({
        landId: landId
      })
      this.selectedCropCode = response.data[0].cropCode
      this.getCropNameByCropCode(this.selectedCropCode)
      this.getWorkTypeByCropCode(this.selectedCropCode)
    },
    async getWorkTypeByCropCode (cropCode) {
      const response = await WcService.fetchTextByCropCode({
        cropCode: cropCode
      })
      this.workType = response.data
      this.workType.push({text: '새 작업추가'})
    },
    async getCropNameByCropCode (cropCode) {
      const response = await DcService.fetchCropNameByCropCode({
        cropCode: cropCode
      })
      this.cropName = response.data[0].text
    },
    async getWorkTypeByWorkTypeCode (workTypeCode) {
      const response = await WcService.fetchTextByCcode({
        code: workTypeCode
      })
      this.workType = response.data
      this.workType.push({text: '새 작업추가'})
    },
    async updateItem () {
      var pictureAData = ''
      var pictureBData = ''
      var pictureCData = ''

      if (this.iavatar) {
        pictureAData = this.iavatar.uploadedFilename
      }

      if (this.iavatar2) {
        pictureBData = this.iavatar2.uploadedFilename
      }

      if (this.iavatar3) {
        pictureCData = this.iavatar3.uploadedFilename
      }

      await ItemService.updateItem({
        id: this.itemId,
        userId: this.userId,
        // date: this.Item_User_Profile.substring(10, 20),
        date: this.Item_User_Profile,
        item: this.selectItem,
        itemDetail: this.itemItems,
        purpose: this.purpose,
        pictureA: pictureAData,
        pictureB: pictureBData,
        pictureC: pictureCData
      })

      // 작업분류명
      var workTypeVal = ''
      const response2 = await WcService.fetchOneTextByCcode({
        code: this.selectItem
      })
      workTypeVal = response2.data[0].text
      // this.updatedEvent.title = workTypeVal + ' 구입'
      this.updatedEvent.title = workTypeVal
      // this.updatedEvent.start = this.Item_User_Profile.substring(10, 20)
      // this.updatedEvent.end = this.Item_User_Profile.substring(10, 20)
      this.updatedEvent.start = this.Item_User_Profile
      this.updatedEvent.end = this.Item_User_Profile
      this.updatedEvent.itemId = this.itemId
      this.updatedEvent.eventIndex = this.eventIndex
      this.updatedEvent.color = 'orange'
    },
    async updateJournal () {
      var shipment = {'amount': this.shipmentAmount, 'detail': this.shipmentDetail}
      var income = {'amount': this.incomeAmount, 'detail': this.incomeDetail}
      var output = {'amount': this.outputAmount, 'detail': this.outputDetail}

      var pictureAData = ''
      var pictureBData = ''
      var pictureCData = ''

      if (this.avatar) {
        pictureAData = this.avatar.uploadedFilename
      }

      if (this.avatar2) {
        pictureBData = this.avatar2.uploadedFilename
      }

      if (this.avatar3) {
        pictureCData = this.avatar3.uploadedFilename
      }

      await JournalService.updateJournal({
        id: this.journalId,
        userId: this.userId,
        // date: this.User_Profile.substring(10, 20),
        date: this.User_Profile,
        landId: this.selectLand,
        workCode: this.selectedWorkTypeCode,
        workContent: this.workContent,
        workTime: this.workTime,
        workerNumber: this.workerNumber,
        remarks: this.remarks,
        coo: this.cooItems,
        shipment: shipment,
        income: income,
        usage: this.usageItems,
        output: output,
        pictureA: pictureAData,
        pictureB: pictureBData,
        pictureC: pictureCData
      })

      // this.fetchNameByLandId(this.selectLand)
      // this.fetchCropNameByCropCode(this.selectedCropCode)
      this.fetchTextByCode(this.selectedWorkTypeCode)
      // this.updatedEvent.start = this.User_Profile.substring(10, 20)
      // this.updatedEvent.end = this.User_Profile.substring(10, 20)
      this.updatedEvent.start = this.User_Profile
      this.updatedEvent.end = this.User_Profile
      this.updatedEvent.journalId = this.journalId
      this.updatedEvent.eventIndex = this.eventIndex
      this.updatedEvent.textColor = 'white'
    },
    async deleteItem (id) {
      await ItemService.deleteItem(id)
    },
    async deleteJournal (id) {
      await JournalService.deleteJournal(id)
    },
    async fetchNameByLandId (landId) {
      const response = await LandService.fetchNameByLandId({
        landId: landId
      })
      this.updatedEvent.title = response.data[0].name
    },
    async fetchCropNameByCropCode (cropCode) {
      const response = await DcService.fetchCropNameByCropCode({
        cropCode: cropCode
      })
      this.updatedEvent.title += ' - ' + response.data[0].text
    },
    async fetchTextByCode (workCode) {
      const response = await WcService.fetchOneTextByCcode({
        code: workCode
      })
      // this.updatedEvent.title += ' - ' + response.data[0].text
      this.updatedEvent.title = response.data[0].text
    },
    async getIWorkTypeByCropCode (cropCode) {
      const response = await WcService.fetchTextByCropCodeAsItem({
        cropCode: cropCode
      })
      this.items = response.data
      this.items.push({text: '새 작업추가'})
    },
    async getCropCodeByILandId (landId) {
      const response = await LandService.fetchCropCodeByLandId({
        landId: landId
      })
      this.selectedCropCode = response.data[0].cropCode
      this.getIWorkTypeByCropCode(this.selectedCropCode)
    },
    async fetchTextByCcode (workCode) {
      const response = await WcService.fetchOneTextByCcode({
        code: workCode
      })
      this.selectedWorkTypeText = response.data[0].text
      if (this.selectedWorkTypeText === '출하') {
        this.showShipment = true
        this.showIncome = true
        this.showUsage = false
        this.usageItems = [{
          itemName: '',
          usage: ''
        }]
        this.showOutput = false
      } else if (this.selectedWorkTypeText === '비료' || this.selectedWorkTypeText === '농약' || this.selectedWorkTypeText === '사료') {
        this.showShipment = false
        this.showIncome = false
        this.showUsage = true
        this.showOutput = false
      } else if (this.selectedWorkTypeText === '생산') {
        this.showShipment = false
        this.showIncome = false
        this.showUsage = false
        this.usageItems = [{
          itemName: '',
          usage: ''
        }]
        this.showOutput = true
      } else {
        this.showShipment = false
        this.showIncome = false
        this.showUsage = false
        this.showOutput = false
      }
    },
    onChangeILand: function (event) {
      this.getCropCodeByILandId(this.iSelectLand)
    },
    onChangeItemPrice: function (event) {
      this.itemPriceTotal = Number('0')
      for (var i = 0; i < this.itemItems.length; i++) {
        this.itemPriceTotal = Number(this.itemPriceTotal)
        this.itemPriceTotal += Number(this.itemItems[i].itemPrice)
      }
      this.itemPriceTotal += ''
      this.itemPriceTotal = this.itemPriceTotal.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      this.itemPriceTotal = '￦' + this.itemPriceTotal
    },
    onChangeItem: function (event) {
      this.selectedItem = event
      if (event === '새 작업추가') {
        this.addWorkType(1)
      } else {
      }
    },
    onChangeItemCost: function (event) {
      this.CooTotal = Number('0')
      for (var i = 0; i < this.cooItems.length; i++) {
        this.CooTotal = Number(this.CooTotal)
        this.CooTotal += Number(this.cooItems[i].cost)
      }
      this.CooTotal += ''
      this.CooTotal = this.CooTotal.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      this.CooTotal = '￦' + this.CooTotal
    },
    onChangeLand: function (event) {
      this.selectedLandId = event
      this.getCropCodeByLandId(this.selectedLandId)
    },
    onChangeWorkType: function (event) {
      this.selectedWorkTypeCode = event
      if (event === '새 작업추가') {
        this.addWorkType(0)
      } else {
        this.fetchTextByCcode(this.selectedWorkTypeCode)
        this.fetchItemsByWcode(this.selectedWorkTypeCode)
      }
    },
    onChangeItemName: function (event, idx) {
      if (event === '직접입력') {
        this.addCustomItem(idx)
      }
    },
    onChangeWSTime: function (event) {
      var tmpStr = event
      this.selectedWSTime = tmpStr.replace(':', '')
      console.log(this.selectedWSTime)
    },
    onChangeWETime: function (event) {
      var tmpStr = event
      this.selectedWETime = tmpStr.replace(':', '')
      console.log(this.selectedWETime)
    },
    itemSave () {
      this.updateItem()
      this.$swal({
        type: 'success',
        title: '자재를 수정하였습니다',
        showConfirmButton: false,
        timer: 777
      }).then((result) => {
        bus.$emit('toJournalForUpdate', this.updatedEvent)
        this.dialog = false
      })
    },
    save () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }
        this.updateJournal()
        this.$swal({
          type: 'success',
          title: '일지를 수정하였습니다',
          showConfirmButton: false,
          timer: 777
        }).then((result) => {
          bus.$emit('toJournalForUpdate', this.updatedEvent)
          this.dialog = false
        })
        // bus.$emit('toJournal', 'test')
        // this.dialog = false
      }).catch(() => {})
    },
    deleteI () {
      this.$swal({
        title: '이 자재를 삭제 하시겠습니까?',
        text: '삭제 후에 되돌릴 수 없습니다',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '네, 삭제합니다',
        cancelButtonText: '취소합니다'
      }).then((result) => {
        if (result.value) {
          this.deleteItem(this.itemId)
          this.$swal(
            '삭제했습니다!',
            '자재가 삭제되었습니다',
            'success'
          )
          bus.$emit('toJournalForDel', this.eventIndex)
          this.dialog = false
        }
      })
      // bus.$emit('toJournal', 'test')
      // this.dialog = false
    },
    deleteJ () {
      // confirm('이 일지를 지우시겠습니까?') && this.deleteJournal(this.journalId)
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
          this.deleteJournal(this.journalId)
          this.$swal(
            '삭제했습니다!',
            '일지가 삭제되었습니다',
            'success'
          )
          bus.$emit('toJournalForDel', this.eventIndex)
          this.dialog = false
        }
      })
      // bus.$emit('toJournal', 'test')
      // this.dialog = false
    },
    addWorkType (workOrItem) {
      var paramForAWT = {}
      if (workOrItem === 0) {
        paramForAWT.from = 'work' // 작업일지 작성시
      } else {
        paramForAWT.from = 'item' // 자재관리 작성시
      }
      paramForAWT.compType = 'edit'
      paramForAWT.cropCode = this.selectedCropCode
      bus.$emit('dialogForAddWorkType', paramForAWT)
    },
    addCustomItem (idx) {
      var paramForACI = {}
      paramForACI.selectIdx = idx
      paramForACI.from = 'edit'
      bus.$emit('dialogForAddCustomItem', paramForACI)
    },
    addCooRow () {
      this.cooItems.push({
        category: '',
        cost: ''
      })
    },
    deleteCooRow () {
      if (this.cooItems.length > 1) {
        this.cooItems.splice(this.cooItems.length - 1, 1)
        this.onChangeItemCost()
      }
    },
    addUsageRow () {
      this.usageItems.push({
        itemName: '',
        usage: ''
      })
    },
    deleteUsageRow () {
      if (this.usageItems.length > 1) {
        this.usageItems.splice(this.usageItems.length - 1, 1)
      }
    },
    showPic (url) {
      // console.log(url)
      if (url === '') {
        alert('등록된 이미지가 없습니다.')
        return
      }
      this.imgCommonPreview.src = url
      var vm = this
      setTimeout(function () {
        // http://holybell87.tistory.com/17#.XB2tgFwzaUk
        /*
        if (!vm.imgCommonPreview.complete) {
          setTimeout(this.createPreviewWin(this.imgCommonPreview), 100)
          this.createPreviewWin(this.imgCommonPreview)
          return
        }
        */

        var scrollsize = 17
        var swidth = screen.width - 10
        var sheight = screen.height - 90
        var wsize = vm.imgCommonPreview.width
        var hsize = vm.imgCommonPreview.height
        var imageWidth = vm.imgCommonPreview.width
        var imageHeight = vm.imgCommonPreview.height

        if (wsize < 50) {
          wsize = 50
        }
        if (hsize < 50) {
          hsize = 50
        }
        if (wsize > swidth) {
          wsize = swidth
          imageWidth = imageWidth * (1 / 10)
          console.log(imageWidth)
        }

        if (hsize > sheight) {
          hsize = sheight
          imageHeight = imageHeight * (1 / 10)
          console.log(imageHeight)
        }

        if ((wsize < swidth - scrollsize) && hsize >= sheight) {
          wsize += scrollsize
        }
        if ((hsize < sheight - scrollsize) && wsize >= swidth) {
          hsize += scrollsize
        }
        if ((wsize < swidth - scrollsize) && hsize < sheight && (navigator.userAgent.indexOf('MSIE 6.0') > -1 || navigator.userAgent.indexOf('MSIE 7.0') > -1)) {
          wsize += scrollsize
        }

        var mtWidth = document.body.clientWidth
        var mtHeight = document.body.clientHeight
        var scX = window.screenLeft
        var scY = window.screenTop
        var popX = scX + (mtWidth - wsize) / 2 - 50
        var popY = scY + (mtHeight - hsize) / 2 - 50

        var imageWin = window.open('', '', 'top=' + popY + ',left=' + popX + ',width=' + wsize + ',height=' + hsize + ',scrollbars=yes,resizable=yes,status=no')
        imageWin.document.write('<html><title>Preview</title><body style="margin:0;cursor:pointer;" title="Close" onclick="window.close()">')
        // imageWin.document.write('<img src="' + imgCommonPreview.src + '">')
        imageWin.document.write('<img src="' + vm.imgCommonPreview.src + '" width=' + imageWidth + ' height=' + imageHeight + '>')
        imageWin.document.write('</body></html>')
      }, 100)
      // setTimeout(this.createPreviewWin(this.imgCommonPreview), 100)
      // this.createPreviewWin(this.imgCommonPreview)
    },
    /*
    // http://holybell87.tistory.com/17#.XB2tgFwzaUk
    createPreviewWin (imgCommonPreview) {
      if (!this.imgCommonPreview.complete) {
        // setTimeout(this.createPreviewWin(this.imgCommonPreview), 100)
        // this.createPreviewWin(this.imgCommonPreview)
        return
      }

      var scrollsize = 17
      var swidth = screen.width - 10
      var sheight = screen.height - 90
      var wsize = imgCommonPreview.width
      var hsize = imgCommonPreview.height
      var imageWidth = imgCommonPreview.width
      var imageHeight = imgCommonPreview.height

      if (wsize < 50) {
        wsize = 50
      }
      if (hsize < 50) {
        hsize = 50
      }
      if (wsize > swidth) {
        wsize = swidth
        imageWidth = imageWidth * (1 / 10)
        console.log(imageWidth)
      }

      if (hsize > sheight) {
        hsize = sheight
        imageHeight = imageHeight * (1 / 10)
        console.log(imageHeight)
      }

      if ((wsize < swidth - scrollsize) && hsize >= sheight) {
        wsize += scrollsize
      }
      if ((hsize < sheight - scrollsize) && wsize >= swidth) {
        hsize += scrollsize
      }
      if ((wsize < swidth - scrollsize) && hsize < sheight && (navigator.userAgent.indexOf('MSIE 6.0') > -1 || navigator.userAgent.indexOf('MSIE 7.0') > -1)) {
        wsize += scrollsize
      }

      var mtWidth = document.body.clientWidth
      var mtHeight = document.body.clientHeight
      var scX = window.screenLeft
      var scY = window.screenTop
      var popX = scX + (mtWidth - wsize) / 2 - 50
      var popY = scY + (mtHeight - hsize) / 2 - 50

      var imageWin = window.open('', '', 'top=' + popY + ',left=' + popX + ',width=' + wsize + ',height=' + hsize + ',scrollbars=yes,resizable=yes,status=no')
      imageWin.document.write('<html><title>Preview</title><body style="margin:0;cursor:pointer;" title="Close" onclick="window.close()">')
      // imageWin.document.write('<img src="' + imgCommonPreview.src + '">')
      imageWin.document.write('<img src="' + imgCommonPreview.src + '" width=' + imageWidth + ' height=' + imageHeight + '>')
      imageWin.document.write('</body></html>')
    },
    */
    replaceAt: function (data, index, replacement) {
      return data.substr(0, index) + replacement + data.substr(index + replacement.length)
    },
    getDateWithKorean: function (dataVal) {
      var tmpStr = this.replaceAt(dataVal, 4, '년')
      tmpStr = this.replaceAt(tmpStr, 7, '월')
      tmpStr += '일'
      return tmpStr
    }
  }
}
</script>