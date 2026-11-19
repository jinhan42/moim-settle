// 모임 경비 정산 — 설정 파일
// 이 파일만 고치면 됩니다. index.html은 건드리지 않아도 돼요.

window.APP_CONFIG = {
  // 1) 카카오 JavaScript 키 (장소·식당 검색, 지도)
  //    developers.kakao.com > 내 애플리케이션 > 앱 키 > "JavaScript 키"
  //    비워 두면 장소 검색 없이 직접 입력만 됩니다.
  KAKAO_JS_KEY: '',

  // 2) Firebase 설정 (일행과 실시간 공유)
  //    console.firebase.google.com > 프로젝트 설정 > 내 앱(웹) > SDK 설정 및 구성
  //    null 로 두면 "이 기기에만 저장" 모드로 동작합니다.
  FIREBASE: {
    apiKey: 'AIzaSyDcVSn01E4e4sE-H0UPihnE6z8ICNlkgfU',
    authDomain: 'jinhan42.firebaseapp.com',
    projectId: 'jinhan42',
    storageBucket: 'jinhan42.firebasestorage.app',
    messagingSenderId: '851320616057',
    appId: '1:851320616057:web:06d7ad0388a2ecf64050a8'
  }
  // 예시:
  // FIREBASE: {
  //   apiKey: 'AIza...',
  //   authDomain: 'moim-settle.firebaseapp.com',
  //   projectId: 'moim-settle',
  //   appId: '1:1234567890:web:abcdef'
  // }
};
