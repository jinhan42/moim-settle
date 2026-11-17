# 모임 경비 정산 웹앱

식당이나 장소에서 결제할 때 **현재 위치 주변 장소를 바로 검색해 고르고**, 금액만 넣으면 됩니다.
누가 누구에게 얼마를 보내면 되는지 자동으로 계산하고, 초대 링크를 받은 일행은 각자 휴대폰으로 실시간으로 함께 입력합니다.

## 파일 구성

| 파일 | 용도 |
|---|---|
| `index.html` | 앱 본체 (수정할 필요 없음) |
| `config.js` | 카카오 키, Firebase 설정 — **이 파일만 고치면 됩니다** |
| `firestore.rules` | Firestore 보안 규칙 |

설정 없이 열어도 동작합니다. 이때는 장소 검색 없이 **이 기기에만 저장**되는 모드로 돌아갑니다.

---

## 1. 카카오 장소 검색 켜기 (약 10분)

1. https://developers.kakao.com 에 로그인한 뒤 **내 애플리케이션 → 애플리케이션 추가하기**를 누릅니다.
2. 앱 관리 페이지에서 **[카카오맵] → [사용 설정]의 상태를 ON**으로 바꿉니다. 이걸 켜지 않으면 지도가 뜨지 않습니다.
3. **[앱 키]**에서 **JavaScript 키**를 복사합니다. REST API 키가 아닙니다.
4. JavaScript 키 설정의 **JavaScript SDK 도메인**에 앱을 올릴 주소를 등록합니다.
   - 예: `https://moim.example.com`, `https://아이디.github.io`
   - PC에서 테스트할 때 쓸 `http://localhost:8080`도 함께 등록해 두면 편합니다.
5. `config.js`의 `KAKAO_JS_KEY: ''` 따옴표 안에 키를 붙여넣습니다.

> 무료 쿼터는 개발자 계정당 **처음으로 카카오맵을 켠 앱**에만 주어집니다. 사용량은 앱 관리 페이지의 [통계] → [쿼터]에서 확인합니다.
> 카카오 정책상 검색 결과(주소, 좌표 등)는 따로 저장하면 안 됩니다. 그래서 이 앱은 지출에 **장소 이름과 카카오맵 링크만** 남깁니다.

## 2. 일행과 실시간 공유 켜기 — Firebase (약 10분, 무료 플랜으로 충분)

1. https://console.firebase.google.com 에서 **프로젝트 추가**를 누릅니다. Google 애널리틱스는 꺼도 됩니다.
2. **빌드 → Firestore Database → 데이터베이스 만들기**를 누릅니다. 위치는 `asia-northeast3 (서울)`, 모드는 프로덕션을 고릅니다.
3. Firestore의 **규칙** 탭에 `firestore.rules` 내용을 그대로 붙여넣고 **게시**합니다.
4. **프로젝트 설정(톱니바퀴) → 내 앱 → 웹(</>)**에서 앱을 등록하고, 표시되는 `firebaseConfig` 값을 복사합니다.
5. `config.js`의 `FIREBASE: null`을 아래처럼 바꿉니다.
   ```js
   FIREBASE: {
     apiKey: 'AIza...',
     authDomain: '프로젝트ID.firebaseapp.com',
     projectId: '프로젝트ID',
     appId: '1:...:web:...'
   }
   ```
   Firebase 웹 apiKey는 공개되어도 괜찮은 값입니다. 실제 접근은 보안 규칙이 막습니다.

**보안 방식:** 모임마다 20자리 무작위 ID가 붙고, 그 ID가 든 초대 링크를 받은 사람만 읽고 쓸 수 있습니다. 모임 목록 전체를 조회하는 것은 규칙으로 막혀 있습니다.
링크를 받은 사람은 지출을 지우거나 모임을 삭제할 수도 있으니, 링크는 일행에게만 보내세요.

## 3. 사이트에 올리기

위치 검색(GPS)은 브라우저 정책상 **https 주소**에서만 동작합니다. 셋 중 편한 방법을 고르세요.

**A. Firebase Hosting** — Firebase를 쓴다면 가장 간단합니다.
```bash
npm install -g firebase-tools
firebase login
firebase init hosting      # public 폴더로 이 폴더 지정, SPA 질문은 No
firebase deploy
```
배포 후 나오는 `https://프로젝트ID.web.app` 주소를 카카오 JavaScript SDK 도메인에 등록합니다.

**B. GitHub Pages** — 저장소에 세 파일을 올리고 Settings → Pages에서 켜면 `https://아이디.github.io/저장소명/`으로 열립니다.

**C. 회사·개인 서버(nginx 등)** — 정적 파일 3개를 웹 루트에 두기만 하면 됩니다. 인증서(https)는 꼭 적용하세요.

**PC에서 먼저 테스트:** 이 폴더에서 `python3 -m http.server 8080`을 실행하고 http://localhost:8080 을 엽니다. localhost에서는 http여도 위치 검색이 됩니다.

## 쓰는 법

1. **+ 새 모임**에서 이름과 참여자를 넣습니다.
2. **초대**를 누르면 링크가 카카오톡 공유창으로 열립니다. PC에서는 클립보드에 복사됩니다.
3. 결제할 때 **내 주변 식당·장소 찾기**를 누르면 주변 음식점이 가까운 순으로 나옵니다.
   - 카페, 편의점, 숙박 같은 분류를 누르거나 이름으로 검색할 수 있습니다.
   - 장소를 고르면 내용과 분류가 자동으로 채워집니다.
4. 금액, 결제한 사람, 함께 쓴 사람을 고르고 **저장**합니다.
5. **정산** 탭에서 송금 목록을 확인하고 **정산 문구 보내기**로 카톡방에 공유합니다.

휴대폰에서는 브라우저 메뉴의 **홈 화면에 추가**를 누르면 앱처럼 쓸 수 있습니다.

## 데이터 구조 (Firestore)

```
groups/{모임ID}                 name, members[], unit, created
groups/{모임ID}/expenses/{ID}   amount, title, payer, among[], cat, date, ts, place{id,name,url}
```
