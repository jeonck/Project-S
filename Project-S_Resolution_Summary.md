# 프로젝트 해결 내역 (Project-S)

이 문서는 프로젝트 진행 중 발생한 주요 문제점과 그 해결 과정을 요약합니다.

## 1. 프로젝트 명칭 변경 (`Project-S`)

### 문제
초기 프로젝트 명칭을 'Project-S'로 변경하고 싶었으며, 웹 애플리케이션의 타이틀 바와 헤더에 적용이 필요했습니다.

### 해결
- **`index.html` 파일 수정:** `<title>` 태그의 내용을 'Project-S'로 변경했습니다.
- **`src/components/Header.jsx` 파일 수정:** 헤더 컴포넌트 내의 'ProjectPRO' 텍스트를 'Project-S'로 변경했습니다.

---

## 2. 리소스 플래너 기능 구현

### 문제
사용자가 엑셀 스프레드시트로 관리하던 프로젝트 담당자 및 일정 매핑 작업을 웹 애플리케이션 'Project-S'로 통합하고 싶어했습니다.

### 해결
다음과 같은 단계로 리소스 플래너 기능을 구현했습니다:

-   **`src/context/DataContext.jsx` 업데이트:**
    -   `teamMembers` 상태를 추가하고, `localStorage`를 통한 데이터 영속성을 구현했습니다.
    -   초기 `teamMembers` 데이터를 설정하고, `tasks` 데이터의 담당자(`assignee`)를 실제 팀원 이름과 매칭되도록 수정했습니다.
    -   `teamMembers`에 대한 CRUD(생성, 읽기, 업데이트, 삭제) 함수를 추가했습니다.
-   **`src/pages/TeamMembers.jsx` 생성:**
    -   팀원 정보를 관리(추가, 보기, 수정, 삭제)할 수 있는 UI 컴포넌트를 구현했습니다.
-   **`src/pages/ResourcePlanner.jsx` 생성:**
    -   `frappe-gantt-react` 라이브러리를 활용하여 팀원별 할당된 태스크를 시각화하는 타임라인 뷰를 구현했습니다. 각 팀원별로 별도의 Gantt 차트가 표시됩니다.
-   **라우팅 및 내비게이션 업데이트:**
    -   `src/App.jsx`에 `/teammembers` 및 `/resourceplanner` 경로에 대한 라우트를 추가했습니다.
    -   `src/components/Sidebar.jsx`에 '팀원 관리' 및 '리소스 플래너' 메뉴 링크를 추가하여 접근성을 높였습니다.
-   **`src/pages/Tasks.jsx` 수정:**
    -   작업(Task) 추가/수정 모달에서 '담당자' 필드를 팀원 목록(`teamMembers`)에서 선택할 수 있는 드롭다운 메뉴로 변경하여 할당 기능을 개선했습니다.

---

## 3. 기술적 오류 해결

### 3.1. SASS 전처리기 오류

### 문제
`frappe-gantt-react` 라이브러리가 SASS를 사용하지만, 프로젝트에 SASS가 설치되어 있지 않아 빌드 시 `[plugin:vite:css] Preprocessor dependency "sass" not found` 오류가 발생했습니다.

### 해결
-   `sass` 개발 종속성을 설치하여 Vite가 SASS 파일을 올바르게 처리할 수 있도록 했습니다.
    ```bash
    npm install -D sass
    ```

### 3.2. 모듈 임포트 `SyntaxError`

### 문제
`src/pages/ResourcePlanner.jsx`에서 `frappe-gantt-react` 라이브러리를 임포트하는 방식이 잘못되어 `Uncaught SyntaxError: The requested module ... does not provide an export named 'default'` 오류가 발생했습니다. 이는 라이브러리가 `default` export 대신 `named` export를 사용하기 때문이었습니다.

### 해결
-   `src/pages/ResourcePlanner.jsx` 파일의 임포트 구문을 `default` import에서 `named` import로 변경하고, `FrappeGantt` 컴포넌트를 `Gantt`로 앨리어싱(aliasing)하여 사용했습니다.
    ```diff
    - import Gantt from 'frappe-gantt-react';
    + import { FrappeGantt as Gantt } from 'frappe-gantt-react';
    ```

### 3.3. Favicon 404 오류

### 문제
브라우저가 `favicon.ico` 파일을 자동으로 요청했지만 프로젝트 루트 경로에 해당 파일이 없어 `favicon.ico:1 GET http://localhost:5173/favicon.ico 404 (Not Found)` 오류가 발생했습니다.

### 해결
-   `index.html` 파일의 `<head>` 섹션에 `public/vite.svg` 파일을 파비콘으로 지정하는 `<link>` 태그를 추가하여 브라우저가 올바른 파비콘을 찾도록 했습니다.
    ```diff
    --- a/index.html
    +++ b/index.html
    @@ -2,6 +2,7 @@
     <html lang="ko">
     <head>
         <meta charset="UTF-8">
    +    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Project-S</title>
         <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    ```

이 문서에 요약된 해결 과정을 통해 Project-S 애플리케이션의 안정성과 기능성이 향상되었습니다.
