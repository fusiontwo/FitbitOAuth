# Fitbit OAuth 2.0 로그인

### 주요 정보
- ClientServer.js: Trackers 웹 애플리케이션 서버
  - passport-fitbit-oauth2 모듈 사용
  - AWS IoT Core 연결 옵션 저장
  - socket.io로 mqtt로 수신한 데이터를 사용자 view에 emit
- /UI/view/login.html: 진입점. 로그인 버튼
- /UI/view/index.ejs: FitbitOAuth 로그인에 성공하면 나오는 메인 화면
  - socket.io로 ClientServer가 emit한 데이터를 받아서 실시간으로 화면에 보여줌.
- AuthServer.js: (만들었는데 쓸 필요가 없었음. 사용 X) Authorization Code와 Token을 발급하는 서버 

### 사용 시 값을 채워야하는 부분
- ClientServer.js: clientID, clientSecret, callbackURL & ENDPOINT, THING_NAME, CERTPATH, KEYPATH, CAROOTPATH
- 아래 URL에서 값을 복사해서 채우면 됨.
  - https://dev.fitbit.com/apps
  - https://dev.fitbit.com/build/reference/web-api/troubleshooting-guide/oauth2-tutorial/

### 주의 사항
- tmux에서 ngrok을 실행하기 때문에 라즈베리파이 전원을 끄면 같이 종료됨.
- 라즈베리파이를 재부팅할 때마다 'ngrok http {라즈베리파이IP}:3000'으로 ngrok URL을 다시 할당받아야 함.
- ClientServer.js과 Fitbit Client App application의 redirect URL을 ngrok의 Forwarding URL로 수정해야 함.

### 설치 모듈 (npm install)
- express
- passport
- express-session
- passport-fitbit-oauth2
- path
- body-parser
- jsonwebtoken
- mqtt
- socket.io
  
