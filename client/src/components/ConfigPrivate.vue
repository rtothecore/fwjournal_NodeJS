<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>개인정보 설정</h1>
      </v-flex>
          
      <v-flex md5 />

      <v-flex xs12 md2 class="text-xs-center" mt-3>
        <v-form ref="form2" v-model="valid2" lazy-validation>
          <v-text-field
            v-model="id"                        
            label="아이디"
            disabled           
          ></v-text-field>

          <v-text-field
            v-model="name"                        
            label="이름"
            disabled
          ></v-text-field>

          <v-text-field
            v-model="birthDate"
            :rules="birthDateRules"
            :counter="10"
            label="생년월일"
            required
            type="number"
          ></v-text-field>

          <v-select
            v-model="select"
            :items="items"
            :rules="[v => !!v || '성별을 선택하세요']"
            label="성별"
            required
          ></v-select>

          <v-text-field
            v-model="phoneNo"            
            :counter="11"
            label="휴대폰번호"
            disabled
            type="number"
          ></v-text-field>

          <v-switch
            :label="`작업일지 공유: ${switch1.toString()}`"
            v-model="switch1"
            v-on:change="onChangeShareFlag"
          ></v-switch>

          <v-btn color="warning" @click="goToChangePhonePage">휴대폰번호 변경</v-btn>
          <v-btn color="info" @click="goToChangePwPage">비밀번호 변경</v-btn>
         
          <v-btn
            :disabled="!valid2"
            @click="submit2"
          >
            저장
          </v-btn>
          <v-btn @click="clear2">지우기</v-btn>
        </v-form>
      </v-flex>

      <v-flex md5 />

      <div/>
                       
    </v-layout>
    <br/><br/><br/>
  </v-container>
</template>

<script>
import UserService from '@/services/UserService'
export default {
  data: () => ({
    switch1: true,
    phoneNo: '',
    name: '',
    id: '',
    userId: '',
    user: '',
    valid: true,
    valid2: true,
    birthDate: '',
    birthDateRules: [
      v => !!v || '생년월일을 입력하세요',
      v => (v && v.length <= 8) || '생년월일은 8자여야 합니다'
    ],
    select: null,
    items: [
      '남',
      '여'
    ]
  }),
  computed: {
  },
  watch: {
  },
  mounted () {
  },
  beforeCreate: function () {
    if (!this.$session.exists()) {
      this.$router.push('/login')
    } else {
    }
  },
  created () {
    this.userId = this.$session.get('userId')
    this.getUser()
  },
  methods: {
    async getUser () {
      const response = await UserService.fetchUser(this.userId)
      this.id = response.data.id
      this.name = response.data.name
      this.birthDate = response.data.birth_date
      this.select = response.data.sex
      this.phoneNo = response.data.phone_no
      if (response.data.share_flag === '0') {
        this.switch1 = false
      } else {
        this.switch1 = true
      }
    },
    async updateUserAgeSex () {
      const response = await UserService.updateUserBirthDateSex({
        id: this.userId,
        birth_date: this.birthDate,
        sex: this.select
      })
      if (response.data.success) {
        this.$swal({
          type: 'success',
          title: '수정 완료!',
          showConfirmButton: false,
          timer: 777
        }).then((result) => {
        })
      }
    },
    async updateUserShareFlag () {
      if (this.switch1) {
        this.shareFlag = 1
      } else {
        this.shareFlag = 0
      }
      await UserService.updateUserShareFlag({
        id: this.userId,
        share_flag: this.shareFlag
      })
    },
    submit2 () {
      if (this.$refs.form2.validate()) {
        this.updateUserAgeSex()
      }
    },
    clear2 () {
      this.$refs.form2.reset()
    },
    goToChangePhonePage () {
      this.$router.push('/changePhoneNo')
    },
    goToChangePwPage () {
      this.$router.push('/changePw')
    },
    onChangeShareFlag () {
      this.updateUserShareFlag()
    }
  }
}
</script>