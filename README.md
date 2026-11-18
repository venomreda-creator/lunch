# 아주한끼

아주대학교 주변의 음식점을 조회하고 오늘의 추천을 보여주는 PC 우선 반응형 웹사이트입니다.

## 실행

별도의 빌드 도구나 패키지 설치가 필요하지 않습니다. `index.html`을 브라우저에서 열거나, 저장소 루트에서 간단한 정적 서버를 실행하세요.

```powershell
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`으로 접속합니다.

## 카카오 Local API 연결

GitHub Pages 정적 사이트에는 Kakao REST API 키를 넣지 않습니다. `worker/`의 Cloudflare Worker가 키를 서버에서 보관하고, 홈페이지에는 검색 결과만 전달합니다.

1. Node.js를 설치한 뒤 터미널에서 `worker` 폴더로 이동합니다.
2. Wrangler를 설치하고 Cloudflare에 로그인합니다.

   ```powershell
   npm install -g wrangler
   wrangler login
   ```

3. Kakao Developers에서 **아주한끼 → 앱 설정 → 플랫폼 키 → REST API 키**를 확인하고, 키를 비밀값으로 등록합니다. 키를 채팅이나 GitHub 파일에 붙여 넣지 마세요.

   ```powershell
   wrangler secret put KAKAO_REST_API_KEY
   ```

   명령이 값을 물으면 카카오의 REST API 키를 터미널에 입력합니다. 입력값은 저장소에 기록되지 않습니다.

4. Worker를 배포합니다.

   ```powershell
   wrangler deploy
   ```

5. Worker 기본 주소는 `https://ajou-hankki-api.venomreda.workers.dev`입니다. 이 주소는 이미 `config.js`에 설정되어 있습니다. 주소에는 `/api/places`를 붙이지 않습니다.

Worker는 아주대학교 중심 반경 1.6km의 음식점을 거리순으로 검색합니다. Kakao Local API는 식당명·주소·업종·좌표·직선거리 등을 제공하지만 메뉴, 가격, 영업시간은 제공하지 않으므로 해당 정보는 직접 확인해 관리해야 합니다.

## 현재 동작

- Worker 주소가 설정되면 실제 음식점 검색 결과를 표시합니다.
- API 주소가 비어 있거나 호출에 실패하면 예시 데이터를 표시하고 안내합니다.
- 날짜별 추천 및 다시 뽑기는 현재 검색 결과 후보를 대상으로 동작합니다.
