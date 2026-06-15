# 아임인 디자인 시스템 문서 (Imin Design System Docs)

아임인 디자인 시스템의 파운데이션(컬러·타이포·간격·이펙트 등)과 컴포넌트를
정리한 문서 사이트입니다.

---

## 화면 보기

### 방법 A. 바로 보기 (개발 환경 불필요) — 권장

이미 빌드된 정적 파일(`out/` 폴더)을 로컬 서버로 띄워 봅니다.
> ⚠️ `out/index.html` 파일을 더블클릭해서 열면 화면이 깨집니다. 반드시 아래처럼 서버로 띄워주세요.

터미널에서 프로젝트 폴더(`design-system-docs`)로 이동 후:

```bash
cd out
python3 -m http.server 8080
```

브라우저에서 **http://localhost:8080** 접속.
(맥은 `python3`이 기본 설치되어 있습니다. 종료는 터미널에서 `Ctrl + C`)

### 방법 B. 직접 실행 / 수정 (개발자용)

[Node.js](https://nodejs.org) 20 이상이 필요합니다.

```bash
npm install      # 최초 1회
npm run dev      # 개발 서버 (http://localhost:3000)
```

문서를 수정한 뒤 정적 파일을 다시 만들려면:

```bash
npm run build    # 결과물이 out/ 폴더에 생성됩니다
```

---

## 참고

- 콘텐츠는 `content/` 폴더의 `.mdx` 파일에 있습니다.
- 디자인 토큰(`tokens.css`)은 `npm run dev` / `npm run build` 시
  디자인 시스템 저장소에서 자동으로 내려받습니다 (인터넷 연결 필요).
- 빌드/배포는 GitHub Pages로 자동화되어 있습니다.
