# Fitbit OAuth 2.0 로그인

### 주요 정보
- ClientServer.js: Trackers 웹 애플리케이션 서버 (passport-fitbit-oauth2 모듈 사용)
- AuthServer.js: Authorization Code와 Token을 발급하는 서버
- /UI/view/login.html: 진입점. 로그인 버튼
- /UI/view/index.ejs: FitbitOAuth 로그인에 성공하면 나오는 메인 화면
- /UI/view/mqtt.js: index.ejs의 MQTT 프로토콜 구현.

### 사용 시 값을 채워야하는 부분
- AuthServer.js: CLIENT_ID, CLIENT_SECRET, AUTH_CODE, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
- ClientServer.js: clientID, clientSecret, callbackURL
- 아래 URL에서 값을 복사해서 채우면 됨.
  - https://dev.fitbit.com/apps
  - https://dev.fitbit.com/build/reference/web-api/troubleshooting-guide/oauth2-tutorial/

### 설치 모듈 (npm install)
- express
- passport
- express-session
- passport-fitbit-oauth2
- path
- body-parser
- jsonwebtoken
