<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>설정</h1>
      </v-flex>

      <v-flex xs12 class="text-xs-center" mt-3>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="cPass"
            :rules="cPassRules"
            :counter="10"
            label="현재암호"
            required
          ></v-text-field>
          <v-text-field
            v-model="nPass"
            :rules="nPassRules"
            label="새 암호"
            required
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            @click="submit"
          >
            저장
          </v-btn>
          <v-btn @click="clear">지우기</v-btn>
        </v-form>
      </v-flex>

      <v-flex xs12 class="text-xs-center" mt-3>
        <v-form ref="form2" v-model="valid2" lazy-validation>
          <v-text-field
            v-model="age"
            :rules="ageRules"
            :counter="10"
            label="연령"
            required
          ></v-text-field>
          <v-select
            v-model="select"
            :items="items"
            :rules="[v => !!v || '성별을 선택하세요']"
            label="성별"
            required
          ></v-select>
          <v-btn
            :disabled="!valid2"
            @click="submit2"
          >
            저장
          </v-btn>
          <v-btn @click="clear2">지우기</v-btn>
        </v-form>
      </v-flex>

      <div>
        <v-dialog v-model="dialog" max-width="500px">
          <v-btn slot="activator" color="primary" dark class="mb-2">새 농장</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
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
                  <v-flex xs12 sm6 md4>
                    <v-text-field 
                        v-model="editedItem.address"
                        :counter="20"
                        :error-messages="errors.collect('address')"
                        label="주소"
                        required
                        v-validate="'required|max:20'"
                        data-vv-name="address"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
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
                  <v-flex xs12 sm6 md4>
                    <!-- <v-text-field v-model="editedItem.cropCode" label="작물,가축명"></v-text-field> -->
                    <v-select
                      :items="items2"
                      v-model="editedItem.cropCode"
                      label="작물,가축명"
                      class="input-group--focused"
                      item-value="text"
                      v-on:change="onChangeSelect2"
                      :error-messages="errors.collect('cropName')"
                      required
                      v-validate="'required'"
                      data-vv-name="cropName"
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
          <template slot="no-data">
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
        </v-data-table>
      </div>

    </v-layout>
  </v-container>
</template>

<script>
import UserService from '@/services/UserService'
import LandService from '@/services/LandService'
import ScService from '@/services/ScService'
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
          max: '주소는 20자 이하여야 합니다'
        },
        size: {
          required: () => '농장크기를 입력해주세요',
          max: '농장크기는 10자 이하여야 합니다'
        },
        cropName: {
          required: '작물,가축명을 선택해주세요'
        }
      }
    },
    cropCode: '',
    selectedCropName: '',
    dbPassword: '',
    userId: '5af4fa281a1ee4261039149f',
    user: '',
    valid: true,
    valid2: true,
    cPass: '',
    cPassRules: [
      v => !!v || '현재암호를 입력하세요',
      v => (v && v.length <= 10) || '현재암호는 10자 이하여야 합니다'
    ],
    nPass: '',
    nPassRules: [
      v => !!v || '새 암호를 입력하세요',
      v => (v && v.length <= 10) || '새 암호는 10자 이하여야 합니다'
    ],
    age: '',
    ageRules: [
      v => !!v || '연령을 입력하세요',
      v => (v && v.length <= 3) || '연령은 3자 이하여야 합니다'
    ],
    select: null,
    items: [
      '남',
      '여'
    ],
    items2: [],
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
    lands: [],
    editedIndex: -1,
    editedItem: {
      _id: '',
      name: '',
      address: '',
      size: '',
      cropCode: ''
    },
    defaultItem: {
      _id: '',
      name: '',
      address: '',
      size: '',
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
    this.$validator.localize('ko', this.dictionary)
  },

  created () {
    this.initialize()
    this.getUser()
    this.getLands()
    this.getScs()
  },
  methods: {
    async getUser () {
      const response = await UserService.fetchUser(this.userId)
      this.age = response.data.age
      this.select = response.data.sex
    },
    async getUserPassword () {
      const response = await UserService.fetchUser(this.userId)
      this.dbPassword = response.data.password
    },
    async updateUserAgeSex () {
      await UserService.updateUserAgeSex({
        id: this.userId,
        age: this.age,
        sex: this.select
      })
    },
    async updateUserPassword () {
      await UserService.updateUserPassword({
        id: this.userId,
        password: this.nPass
      })
    },
    async getLands () {
      const response = await LandService.fetchLands({
        userId: this.userId
      })
      this.lands = response.data.lands
      for (var i = 0; i < this.lands.length; i++) {
        const response2 = await ScService.fetchCropNameByCropCode({
          cropCode: this.lands[i].cropCode
        })
        this.lands[i].cropCode = response2.data[0].text
      }
    },
    async createNewLand () {
      await LandService.createNewLand({
        userId: this.userId,
        name: this.editedItem.name,
        address: this.editedItem.address,
        size: this.editedItem.size,
        cropCode: this.cropCode
      })
    },
    async updateLand () {
      await LandService.updateLand({
        id: this.editedItem._id,
        name: this.editedItem.name,
        address: this.editedItem.address,
        size: this.editedItem.size,
        cropCode: this.cropCode
      })
    },
    async deleteLand (id) {
      await LandService.deleteLand(id)
    },
    async getScs () {
      const response = await ScService.fetchScs({})
      this.items2 = response.data.scs
    },
    async getCropCode () {
      const response = await ScService.fetchCropCode({
        text: this.selectedCropName
      })
      this.cropCode = response.data[0].bCode + response.data[0].mCode + response.data[0].sCode
    },
    submit () {
      if (this.$refs.form.validate()) {
        this.getUserPassword()
        if (this.dbPassword === this.cPass) {
          this.updateUserPassword()
        } else {
          alert('입력한 암호와 현재암호가 다릅니다')
        }
      }
    },
    clear () {
      this.$refs.form.reset()
    },
    submit2 () {
      if (this.$refs.form2.validate()) {
        this.updateUserAgeSex()
      }
    },
    clear2 () {
      this.$refs.form2.reset()
    },
    initialize () {
    },
    editItem (item) {
      this.editedIndex = this.lands.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.lands.indexOf(item)
      confirm('이 농장을 지우시겠습니까?') && this.lands.splice(index, 1) && this.deleteLand(item._id)
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
          this.lands.push(this.editedItem)
        }
        this.close()
      }).catch(() => {})
    },

    onChangeSelect2: function (event) {
      this.selectedCropName = event
      this.getCropCode()
    }
  }
}
</script>