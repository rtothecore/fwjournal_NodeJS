<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">품목명 입력</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs6 sm6 md6>
                <v-text-field
                  v-model="customItemName"
                  label="품목명"                        
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>          
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">취소</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">추가</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {bus} from '../main'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data () {
    return {
      dialog: false,
      from: '',
      selectIdx: 0,
      customItemName: '',
      //
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
    bus.$on('dialogForAddCustomItem', function (value) {
      // console.log(value)
      vm.dialog = true
      vm.selectIdx = value.selectIdx
      vm.from = value.from
      vm.customItemName = ''
    })
  },
  created () {
    // this.getBCS()
  },
  methods: {
    save () {
      this.$validator.validateAll().then((result) => {
        if (!result) {
          return
        }

        this.$swal({
          type: 'success',
          title: '품목명을 입력하였습니다',
          showConfirmButton: false,
          timer: 777
        }).then((result) => {
          var paramForReturn = {}
          paramForReturn.itemName = this.customItemName
          paramForReturn.selectIdx = this.selectIdx
          if (this.from === 'new') {
            bus.$emit('fromAddCustomItemModalNew', paramForReturn)
          } else if (this.from === 'edit') {
            bus.$emit('fromAddCustomItemModalEdit', paramForReturn)
          }
          this.dialog = false
        })
      }).catch(() => {})
    }
  }
}
</script>