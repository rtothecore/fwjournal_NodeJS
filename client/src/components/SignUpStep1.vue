<template>
    <v-layout align-center justify-center fill-height flex-column>
      <div
        id="e3"
        :style=mainStyle
        class="grey lighten-3"
      >
        <v-toolbar
          color="blue"
          dark
        >
          <v-icon>fas fa-pen-nib</v-icon>
          <v-toolbar-title>이용약관</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-card style="height:88%">
          <v-container fluid grid-list-lg>
            <v-layout row wrap align-center>
              <v-flex xs6>
                <v-checkbox :label="`서비스 약관`" v-model="checkbox1" @change="onCb1Change"></v-checkbox>
              </v-flex>

              <v-flex xs6>
                <h5><p class="text-lg-right" style="cursor:pointer" @click="showServicePolicy()">상세보기</p></h5>
              </v-flex>

            </v-layout>
            <v-layout row wrap align-center>
              <v-flex xs6>
                <v-checkbox :label="`개인정보 취급방침`" v-model="checkbox2" @change="onCb2Change"></v-checkbox>
              </v-flex>

              <v-flex xs6>
                <h5><p class="text-lg-right" style="cursor:pointer" @click="showPrivatePolicy()">상세보기</p></h5>
              </v-flex>
            </v-layout>
          </v-container> 

          <v-container fluid grid-list-lg>
            <v-layout row wrap align-center>
              <v-flex xs6>
                <v-checkbox :label="`전체동의`" v-model="checkbox3" @change="onCbAllAgreeChange"></v-checkbox>          
              </v-flex>
            </v-layout>
          </v-container> 
          
          <v-flex xs12 style="height:60px"/>

          <v-flex xs12 ma-3>
              <v-btn block color="primary" :disabled="nextButtonDisabled" @click="goToStep2()">다음</v-btn>          
          </v-flex>

        </v-card>
      </div>

    <!-- DIALOG -->
    <div class="text-xs-center">
      <v-dialog
        v-model="dialog"
        width="800"
        height="800"
        scrollable
      >      
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            <!-- {{ policy_title }} -->
            서비스 이용약관
          </v-card-title>
<!--
          <v-card-text style="height: 800px;">
            {{ policy_contents }}
          </v-card-text>
-->
          <v-card-text style="height: 800px;">
            제 1조 (목적)<br/>

이 약관은 ㈜이지정보기술이(이하 "회사"라 함) 운영하는 이지영농일지(이하 “이지영농일지”이라 함)에서 제공하는 모든 서비스(이하 “서비스”라 함)를 이용함에 있어 이용자의 권리, 의무, 책임사항 및 기타 부수 사항에 관하여 규정함을 목적으로 합니다.


<br/>
<br/>
제 2조 (정의)<br/>

1. “이지영농일지”이라 함은 회사가 등록한 "영농일지 기록공간"을 "영농일지 사용자"에게 제공하기 위해 온라인 웹, 모바일 어플리케이션 등 정보통신 소프트웨어를 이용하여 설정한 가상의 영업장을 말하며, 아울러 이를 운영하는 사업자의 의미로도 사용합니다.<br/>

2. “영농일지 기록공간”이라 함은 농작업일지 기록 공간을 말합니다.<br/>

3. “영농일지 사용자”라 함은 “이지영농일지”를 통해 “영농일지 기록공간”의 정보를 탐색하는 자로서, 컴퓨터를 이용하여 “영농일지 기록공간”에 일지를 기록하고자 하는 이용자를 의미합니다.<br/>

4. “이용자”란 “이지영농일지”에 접속하여 이 약관에 따라 "이지영농일지"가 제공하는 서비스를 받는 “회원”을 말합니다.<br/>

5. “회원”이라 함은 "이지영농일지"에 회원등록을 한 자로서, 계속적으로 “이지영농일지”가 제공하는 서비스를 이용할 수 있는 자를 말합니다.<br/>

6. “컨텐츠”라 함은 “이지영농일지”에 게재된 모든 글, 사진 등을 말합니다.


<br/>
<br/>
제 3조 (약관의 명시, 효력과 개정)<br/>

1. 회사는 이 약관의 내용과 상호 및 대표자 서명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호, 팩스번호, 전자우편주소, 사업자등록번호, 개인정보관리책임자 등을 이용자가 쉽게 알 수 있도록 "이지영농일지"의 초기 서비스화면(전면)에 게시합니다. 다만, 약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.<br/>

2. 회사는 약관의 규제에 관한 법률, 전기통신사업법 및 정보통신망이용촉진 및 정보보호 등에 관한 법률 등 관련법을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.<br/>

3. 약관은 이용자가 "이지영농일지" 서비스에 회원 가입하는 경우 본 계약에 명시된 조건에 동의하는 것으로 간주하며, 그 즉시 효력이 발생합니다.<br/>

4. 회사는 필요한 사유가 발생했을 때 사전 고지 없이 약관을 변경할 수 있습니다. 변경된 약관은 시행일로부터 7일간 "이지영농일지" 온라인 페이지에 게시하는 방법에 의해 공지하고, 명시적으로 회원이 반대하지 않는 한 개정된 약관에 동의한 것으로 간주합니다.<br/>

5. 제4항의 방법으로 변경 고지된 약관은 기존의 회원에게도 유효하게 적용됩니다.


<br/>
<br/>
제 4조 (약관의 해석)<br/>

1. 약관의 해석은 한국어로 작성된 내용을 기준으로 하며, 영어를 비롯한 다른 언어로 번역되어 한국어 내용과 상이한 해석이 발생할 경우, 한국어 해석에 따릅니다.<br/>

2. 약관에 정하지 아니한 사항과 이 약관의 해석에 관하여는 관계법령 및 상관례에 따릅니다.


<br/>
<br/>
제 5조 (회원 가입)<br/>

1. 이용자는 "이지영농일지"가 정한 양식에 따라 회원이 모든 정보를 정확히 기재해 회원가입을 신청하거나 정보제공을 동의하는 경우 회사는 회원 가입을 승낙합니다. 회사는 회원 가입을 신청을 통해 서비스 이용을 승인합니다.<br/>

2. 타인의 정보를 도용하여 회원정보를 기재하는 경우, 서비스 이용이 제한되거나 관련 법령에 의거 처벌받을 수 있습니다.<br/>

3. 회원 가입 계약의 성립 시기는 "이지영농일지"의 승낙이 회원에게 도달한 시점으로 합니다.<br/>

4. 회원은 회원 가입 시 등록한 사항에 변경이 있는 경우, 상당한 기간 이내에 "이지영농일지"에 대하여 회원정보 수정 등의 방법으로 그 변경사항을 알려야 합니다.


<br/>
<br/>
제 6조 (회원 탈퇴 및 자격 상실)<br/>

1. 회원은 "이지영농일지"에 언제든지 탈퇴를 요청할 수 있으며 "이지영농일지"는 즉시 회원탈퇴를 처리합니다.<br/>

2. 회원이 다음 각 호의 사유에 해당하는 경우, "이지영농일지"은 회원자격을 제한 및 정지시킬 수 있습니다.<br/>

가. 가입 신청 시에 허위 내용을 등록한 경우<br/>

나. 다른 사람의 "이지영농일지" 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우<br/>

다. "이지영농일지"을 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우<br/>

라. 기타 서비스 운영을 고의로 방해하는 행위를 하는 경우<br/>

3. "이지영농일지"가 회원 자격을 제한·정지 시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우 "이지영농일지"는 회원자격을 상실시킬 수 있습니다.<br/>

4. "이지영농일지"가 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 이를 통지하고, 회원등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.


<br/>
<br/>
제 7조 (서비스의 제공)<br/>

1. "이지영농일지"는 약관이 정한 바에 따라 안정적으로 서비스를 제공하기 위해 노력하며, 부득이한 이유로 서비스가 중단되면 지체 없이 수리 복구합니다. 단 시스템 점검, 천재지변, 비상사태, 기타 부득이한 경우에는 서비스를 일시적으로 중단할 수 있습니다.<br/>

2. "이지영농일지"가 회원에게 제공하는 서비스는 아래와 같습니다.<br/>

가. 농작업공간에 관한 날씨 등의 기상정보<br/>

나. 농작업기록에 관한 과거 정보 제공<br/>

다. 농축산물 가격 제공 서비스<br/>

라. 타 회원들의 일지 공유 정보<br/>


<br/>
<br/>
제 8조 (서비스 이용)<br/>

1. 이용자는 서비스 접속 및 어플리케이션 다운로드 즉시 제7조 3항에서 열거한 서비스를 이용할 수 있습니다.<br/>

2. 이용자는 서비스 이용 시 불편사항에 관하여 언제든지 회사에 문제제기를 할 수 있습니다. 회사는 회원의 문제 제기가 정당하다고 인정하는 경우 이를 해소하기 위해 노력합니다.<br/>

3. 회원의 아이디와 비밀번호에 대한 모든 관리책임은 회원에게 있고, 회원은 자신의 아이디를 타인에게 양도, 증여할 수 없습니다. 회원이 등록한 아이디 및 비밀번호를 이용하여 발생한 회원, 회사 또는 제3자에 대한 손해 및 손실에 관한 모든 책임은 해당 회원에게 있습니다.


<br/>
<br/>
제 9조 (회사의 의무)<br/>

1. 회사는 본 약관이 정하는 바에 따라 지속적이고 안정적인 서비스를 제공하는데 최선을 다합니다.<br/>

2. 회사는 항상 등록자의 정보를 포함한 개인신상정보에 대하여 관리적, 기술적 안전조치를 강구하여 정보보안에 최선을 다합니다.<br/>

3. 회사는 공정하고 건전한 운영을 통하여 전자상거래 질서유지에 최선을 다하고 지속적인 연구개발을 통하여 양질의 서비스를 제공함으로써 고객만족을 극대화하여 인터넷 사업 발전에 기여합니다.<br/>

4. 회사는 고객으로부터 제기되는 불편사항 및 문제에 대해 정당하다고 판단될 경우 우선적으로 그 문제를 즉시 처리합니다. 단, 신속한 처리가 곤란할 경우, 고객에게 그 사유와 처리일정을 즉시 통보합니다.<br/>

5. 회사는 소비자 보호단체 및 공공기관의 소비자 보호업무의 추진에 필요한 자료 등의 요구에 적극 협력합니다.


<br/>
<br/>
제 10조 (회원의 의무)<br/>

1. 회원은 자신이 게시한 정보에 대해 무한 책임을 집니다.<br/>

2. ID와 비밀번호에 관한 관리 책임은 회원에게 있습니다.<br/>

3. 회원은 아이디와 비밀번호를 제 3 자가 알 수 있도록 해서는 안 됩니다.<br/>

4. 회원은 다음 행위를 하여서는 안 됩니다.<br/>

가. 회원가입 신청 또는 변경 시 허위 내용의 등록<br/>

나. 타인의 정보 도용<br/>

다. 회사가 게시한 정보의 변경<br/>

라. 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시<br/>

마. 회사 와 기타 제 3자의 저작권 등 지적재산권에 대한 침해<br/>

바. 회사 및 기타 제 3자의 명예를 손상 시키거나 업무를 방해하는 행위<br/>

사. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 미풍양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위<br/>

아. 기타 법에 저촉되는 행위 및 회사가 부적절하다고 판단되는 행위<br/>

5. 회원은 본 약관 및 관계법령에서 규정한 사항을 준수합니다.<br/>

6. 회원은 서비스를 이용하여 얻은 정보를 회사의 사전 승낙 없이 복사, 복제, 변경, 번역, 출판 및 기타의 방법으로 사용하거나 이를 타인에게 제공할 수 없습니다.<br/>

7. 회원은 회사 서비스를 해킹하거나 불법 프로그램을 업로드 해서는 안 됩니다.


<br/>
<br/>
제 11조 (서비스 이용제한)<br/>

1. 회원이 다음에 해당하는 행위를 했을 경우 회사는 사전 통지 없이 이용 계약을 해지하거나 서비스 이용을 제한할 수 있습니다.<br/>

가. 제 10조 회원의 의무를 지키지 않은 경우<br/>

나. 불량게시물 규정에 위배되는 행위를 한 경우<br/>

다. 회사에서 제공하는 서비스에 위해를 가하는 등 회사의 업무를 방해하거나 타인의 회사 서비스 이용을 저해하는 경우<br/>

라. 기타 회사에서 더 이상 서비스 제공이 어렵다고 판단할만한 상당한 이유가 있는 경우


<br/>
<br/>
제 12조 (손해배상)<br/>

1. 회사는 무료로 제공되는 서비스 이용과 관련하여 관련법에 특별한 규정이 없는 한 책임을 지지 않습니다.<br/>

2. 회원이 서비스를 이용함에 있어 행한 불법행위로 인하여 회사가 당해 회원 이외의 제3자로부터 손해배상청구, 소송을 비롯한 각종의 이의제기를 받는 경우 당해 회원은 회사의 면책을 위하여 노력하여야 하며, 회사가 면책되지 못한 경우는 당해 회원은 그로 인하여 회사에게 발생한 모든 손해를 배상하여야 합니다.


<br/>
<br/>
제 13조 (면책 범위)<br/>

1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.<br/>

2. 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.<br/>

3. 회사 이외의 타 사업자가 제공하는 정보에 의해 발생하는 피해나 서비스의 장애로 인한 경우에 대하여는 회사는 책임을 지지 않습니다.<br/>

4. 회사는 서비스와 관련하여 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여 법률적인 책임을 지지 않습니다.<br/>

5. 회사가 제공한 서비스를 통해 취득한 정보나 서비스에 게시된 다른 회원의 게시물을 통해 법률적 또는 의학적, 기타 재정적 사항에 관하여 필요한 결정을 하고자 할 때에는 반드시 사전에 전문가와 상의할 것을 권고합니다.<br/>

6. 본 약관의 적용은 이용계약을 체결한 회원에 한하며 제3자에게 어떠한 배상, 소송 등에 대하여 회사는 책임을 면합니다.


<br/>
<br/>
제 14조 (고충처리)<br/>

회사는 전화, 서면, 전자우편 또는 인터넷 홈페이지 등을 통하여 개인정보와 관련한 회원의 의견을 수렴하고 불만사항을 접수하여 이를 처리합니다.


<br/>
<br/>
제 15조 (분쟁해결 및 관할법원)<br/>

1. 회사 및 회원은 개인정보에 관한 분쟁이 있는 경우 신속하고 효과적인 분쟁해결을 위하여 개인정보분쟁조정위원회에 분쟁의 조정을 신청할 수 있습니다.<br/>

2. 서비스 이용으로 발생한 분쟁에 대한 소송은 회사의 본사 소재지를 관할하는 법원을 관할법원으로 합니다.


<br/>
<br/>
제 16조 (법 준수)<br/>

회원은 서비스를 이용함에 있어 국내법이나 규정 정책 및 서비스를 이용함에 있어서 필요한 국제법 및 관련 당사자국의 법을 준수할 책임이 있습니다.


<br/>
<br/>
본 약관은 2019년 03월 07일부터 시행됩니다.
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              @click="dialog = false"
            >
              닫기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <!-- DIALOG -->

    <!-- DIALOG -->
    <div class="text-xs-center">
      <v-dialog
        v-model="dialog2"
        width="800"
        height="800"
        scrollable
      >      
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            <!-- {{ policy_title }} -->
            개인정보 취급방침
          </v-card-title>
<!--
          <v-card-text style="height: 800px;">
            {{ policy_contents }}
          </v-card-text>
-->
          <v-card-text style="height: 800px;">
            (㈜이지정보기술(이하 “회사”라 함)은 통신비밀보호법, 전기통신사업법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 정보통신서비스 제공자가 준수하여야 할 관련 법령상의 개인정보보호 규정을 준수하며, 관련 법령에 의거한 개인정보 취급방침을 정하여 이용자 권익 보호에 최선을 다하고 있습니다. 본 개인정보취급방침은 회사에서 제공하는 온라인 웹 및 모바일 어플리케이션 서비스에 적용되며 다음과 같은 내용을 담고 있습니다. <br/><br/>

제 1조 (개인정보 수집동의 및 수집항목)<br/>

1. 회사는 이용자가 ”이지영농일지”에 최초 로그인을 시도할 때 애플리케이션 승인을 하면 개인정보 수집에 대해 동의한 것으로 봅니다.<br/>

2. 회사가 원활한 서비스 제공을 위해 수집하는 이용자의 개인정보 항목은 다음과 같습니다.<br/>

가. 이용자 생년월일, 휴대폰번호 및 성별<br/>

나. "이지영농일지" 서비스 회원가입 시 회원 아이디 및 비밀번호<br/>

다. 상기의 항목을 필수항목으로 하며, 서비스 제공을 위한 필요에 따라 이용자의 동의 하에 추가적인 정보들을 요청하고 수집할 수 있습니다.
<br/><br/>
제 2조 (개인정보 수집목적 및 활용방식)<br/>

1. 회사는 회사에서 제공하는 서비스의 원활한 제공을 위하여 이용자의 동의 하에 이용자의 개인정보를 수집하고 있습니다. 회사가 수집한 개인정보는 다음의 목적을 위해 활용합니다.<br/>

가. 관련 해당 서비스 이용 권한<br/>

나. 휴대폰 번호 – 고지사항 전달<br/>

다. 불만 처리 등을 위한 원활한 의사소통 경로의 확보<br/>

라. 새로운 서비스 및 행사 정보 등의 안내<br/>

2. 회사는 위의 목적 이외에는 수집된 개인정보를 사용할 수 없습니다. 다만 추후 개인정보의 사용목적과 용도가 변경될 경우에는 공지합니다.<br/>

3. 회사는 어떠한 경우라도 이용자의 개인정보를 사전에 밝힌 목적 이외의 다른 목적으로 사용하지 않으며, 해당 정보를 위부로 유출시키지 않습니다. 그러나 회사의 서비스 또는 광고 배너 등으로 링크되어 있는 타 사이트에서 이용자의 동의를 거쳐 개인정보를 수집하는 행위에 대해서는 본 개인정보보호정책이 적용되지 않음을 알려드립니다.
<br/><br/>
제 3조 (수집한 개인정보 보유 및 이용기간)<br/>

1. 이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.<br/>

가. 회원탈퇴 시 보존 개인정보<br/>

– 보존항목 : 최초 접속 시 제공한 정보

– 보존근거 : 불량 이용자의 재가입 방지, 부정 이용 방지, 명예훼손 등 권리침해 분쟁 및 수사협조

– 보존기간 : 회원탈퇴 후 3개월

나. 이용자가 회사에서 제공하는 서비스를 이용하는 동안은 회사는 이용자의 개인정보를 지속적으로 보유하며 편리한 서비스의 제공을 위한 기초 자료로 이용합니다. 다만 이용자 본인이 개인정보를 변경하거나 삭제 요청을 하는 경우는 회사에서 정책에 따라서 삭제하여 추후 열람이나 이용이 불가능한 상태로 처리하고 있습니다.
<br/><br/>
제 4조 (개인정보의 파기 절차 및 방법)<br/>

1. 이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 회사의 개인정보 파기절차 및 방법은 다음과 같습니다.<br/>

2. 파기 절차<br/>

가. 이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조)일정 기간 저장된 후 파기됩니다.<br/>

나. 동 개인정보는 법률에 의한 경우가 아니고서는 보유되는 이외의 다른 목적으로 이용되지 않습니다.<br/>

3. 파기 방법<br/>

가. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.<br/>

나. 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
<br/><br/>
제 5조 (개인정보 제공 및 공유)<br/>

1. 개인정보는 원칙적으로 서비스와 무관한 제 3자에게 이용자의 동의 없이 제공될 수 없습니다.<br/>

2. 회사는 약관에 의거하여 다음과 같은 경우 개인정보를 이용자의 동의 없이 제공, 판매할 수 있습니다.<br/>

가. 특정 개인을 식별할 수 없는 형태로 가공되어 회사와 계약한 개인 또는 고객에게 제공되는 경우<br/>

나. 통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로써 특정 개인을 식별할 수 없는 형태로 제공하는 경우<br/>

3. 회사는 약관에 의거하여 다음과 같은 경우 개인정보를 이용자의 동의 없이 제 3자에게 제공할 수 있습니다.<br/>

가. 이용자가 서비스를 이용하여 타인에게 정신적 또는 물질적 피해를 줌으로써 그에 대한 법적인 조치를 취하기 위하여 개인정보를 공개해야 한다고 판단되는 충분한 근거가 있는 경우<br/>

나. 이용자의 법령 또는 약관의 위반을 포함하여 부정행위 확인 등의 정보보호 업무를 위해 필요한 경우<br/>

다. 법에 의거하여 적법한 절차에 의한 수사기관이나 기타 정부기관으로부터 정보제공을 요청 받은 경우<br/>

라. 기타 법률에 의해 요구되는 경우
<br/><br/>
제 6조 (개인정보 위탁처리 업체)<br/>

1. 회사는 현재 개인정보의 취급위탁을 하지 않고 있습니다. 다만, 향후 서비스 향상을 위해서 개인정보를 위탁할 수 있으며, 그러한 경우 이용자에 대하여 위탁처리기관, 업무내용 및 개인정보의 보유 및 이용기간 등을 명확히 공지하는 등 관계법령을 준수합니다.
<br/><br/>
제 7조 (이용자 및 법정대리인의 권리와 그 행사방법)<br/>

1. 이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만 아동의 개인정보를 조회하거나 수정할 수 있으며 가입 해지를 요청할 수도 있습니다.<br/>

2. 개인정보관리책임자에게 서면, 전화, email 또는 기타 가능한 방법으로 연락하시면 지체 없이 조치하겠습니다.<br/>

3. 이용자가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다. 또한 잘못된 개인정보를 제3 자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체 없이 통지하여 정정이 이루어지도록 하겠습니다.
<br/><br/>
제 8조 (개인정보보호를 위한 기술적/관리적 대책)<br/>

1. 회사는 이용자들의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록 안전성 확보를 위하여 다음과 같은 기술적/관리적 대책을 강구하고 있습니다.<br/>

2. 기술적 대책<br/>

가. 회원 개개인의 개인정보는 비밀번호에 의해 보호되며, 개인정보 데이터는 별도의 보안기능을 통해 보호 되고 있습니다.<br/>

나. 해킹 등에 대비한 대책 – 회사는 해킹이나 컴퓨터 바이러스 등에 의해 회원의 개인정보가 유출되거나 훼손되는 것을 막기 위해 최선을 다하고 있습니다.<br/>

다. 개인정보의 훼손에 대비해서 자료를 수시로 백업하고 있습니다.<br/>

라. 최신 백신프로그램을 이용하여 이용자들의 개인정보나 자료가 누출되거나 손상되지 않도록 방지하고 있으며, 암호화통신 등을 통하여 네트워크상에서 개인정보를 안전하게 전송할 수 있도록 하고 있습니다.<br/>

마. 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있으며, 기타 시스템적으로 보안성을 확보하기 위한 가능한 모든 기술적 장치를 갖추려 노력하고 있습니다.<br/>

3. 관리적인 대책<br/>

가. 위와 같은 노력 이외에 회원님 스스로도 제3자에게 비밀번호 등이 노출되지 않도록 주의하셔야 합니다. 특히 비밀번호 등이 공공장소에 설치한 PC를 통해 유출되지 않도록 항상 유의하시기 바랍니다. 회원님의 ID와 비밀번호는 반드시 본인만 사용하시고 비밀번호를 자주 바꿔주시는 것이 좋습니다.<br/>

나. 취급 직원의 최소화 및 교육<br/>

– 회사의 개인정보관련 취급 직원은 담당자에 한정시키고 있고 이를 위한 별도의 비밀번호를 부여하여 정기적으로 갱신하고 있으며, 담당자에 대한 수시 교육을 통하여 회사는 개인정보취급방침의 준수를 항상 강조하고 있습니다.

다. 개인정보보호전담기구의 운영 – 그리고 사내 개인정보보호전담기구 등을 통하여 회사는 개인정보취급방침의 이행사항 및 담당자의 준수여부를 확인하여 문제가 발견될 경우 즉시 수정하고 바로 잡을 수 있도록 노력하고 있습니다. 단, 이용자 본인의 부주의나 인터넷상의 문제로 개인 정보가 유출되어 발생한 문제에 대해 회사는 일체의 책임을 지지 않습니다.
<br/><br/>
제 9조 (개인정보관리책임자 및 담당자의 연락처)<br/>

회사의 서비스를 이용하시며 발생하는 모든 개인정보보호 관련 민원을 개인정보관리책임자 혹은 담당부서로 신고하실 수 있습니다. 회사는 이용자들의 신고사항에 대해 신속하게 충분한 답변을 드릴 것입니다.<br/>

개인정보관리책임자 : (주)이지정보기술 강우석

전화번호 : 064-753-6677

이메일 : bbdib@ezinfotech.co.kr<br/>

기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.<br/>

– 개인정보침해신고센터 (http://www.118.or.kr / 118)<br/>

– 정보보호마크인증위원회 (http://www.eprivacy.or.kr / 02-580-0533~4)<br/>

– 대검찰청 첨단범죄수사과 (http://www.spo.go.kr / 02-3480-2000)<br/>

– 경찰청 사이버테러대응센터 (http://www.ctrc.go.kr/ 02-392-0330)
<br/><br/>
제 10 조 (회사의 연락처) 회사의 상호 및 주소 등은 다음과 같습니다.<br/>

1. 상 호 : (주)이지정보기술<br/>

2. 대 표 자 : 이 성 준<br/>

3. 주 소 : 제주특별자치도 제주시 고마로88<br/>

4. 대표전화 : 064-753-6677
<br/><br/>
부 칙<br/>

제1조 (시행일) 이 약관은 2019년 03월 07일 부터 시행한다.<br/>

제2조 개인정보 관리책임자는 2019년 03월 07일 을 기준으로 다음과 같이 지정합니다.<br/>

1. 이 름 : 강우석<br/>

2. 연 락 처 : 064-753-6677<br/>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              flat
              @click="dialog2 = false"
            >
              닫기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <!-- DIALOG -->

  </v-layout>
</template>

<script>
const { detect } = require('detect-browser')
const browser = detect()
export default {
  data () {
    return {
      mainStyle: 'width: 500px; height: 520px; margin: auto;',
      nextButtonDisabled: true,
      policy_contents: '',
      policy_title: '',
      dialog2: false,
      dialog: false,
      checkbox1: false,
      checkbox2: false,
      checkbox3: false,
      password: '',
      id: '',
      dictionary: {
        custom: {
          id: {
            required: () => '아이디를 입력해주세요'
          },
          password: {
            required: () => '비밀번호를 입력해주세요'
          }
        }
      }
    }
  },
  mounted () {
    if (browser) {
      console.log(browser.name)
      console.log(browser.version)
      console.log(browser.os)
      if (browser.name === 'chrome') {
        this.mainStyle = 'width: 500px; height: 520px; margin: auto;'
      } else if (browser.name === 'ie') {
        this.mainStyle = 'width: 500px; height: 520px; margin-bottom: auto;'
      }
    }
  },
  methods: {
    goToStep2 () {
      this.$router.push('/suStep2')
    },
    onCbAllAgreeChange (newValue, oldValue) {
      this.checkbox1 = newValue
      this.checkbox2 = newValue
      if (newValue) {
        this.nextButtonDisabled = false
      } else {
        this.nextButtonDisabled = true
      }
    },
    showServicePolicy () {
      this.dialog = true
      this.policy_title = '서비스 이용약관'
      this.policy_contents = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    showPrivatePolicy () {
      this.dialog2 = true
      this.policy_title = '개인정보 취급방침'
      this.policy_contents = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    onCb1Change () {
      if (this.checkbox1 && this.checkbox2) {
        this.nextButtonDisabled = false
      } else {
        this.nextButtonDisabled = true
      }
    },
    onCb2Change () {
      if (this.checkbox1 && this.checkbox2) {
        this.nextButtonDisabled = false
      } else {
        this.nextButtonDisabled = true
      }
    }
  },
  computed: {
  }
}
</script>