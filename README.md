# ISO/IEC 17020 현장평가 체크리스트 (Windows XP Edition)

KOLAS-R-003 기준에 따른 공인검사기관 내부심사용 **현장평가 체크리스트** 프로그램입니다. 
Windows XP의 레트로한 설치 마법사(Setup Wizard) UI를 통해 심사 업무의 효율성과 즐거움을 동시에 제공합니다.

🔗 **라이브 접속 주소**: [https://xjustice.github.io/iso-checklist-xp/](https://xjustice.github.io/iso-checklist-xp/)

## 🚀 주요 기능

### 1. Windows XP 레트로 인터페이스
- **Classic Setup UI**: 실제 Windows XP 설치 마법사 및 폴더 브라우저 스타일의 디자인.
- **Dynamic Taskbar**: 실시간 진행률(Progress Bar)과 현재 시간, 상태 요약을 보여주는 작업 표시줄.
- **Custom XP Modal**: 리셋 시 나타나는 윈도우 특유의 경고창 및 버튼 디자인 완벽 재현.

### 2. 스마트 심사 도구
- **심사 항목 최적화**: ISO/IEC 17020 (KOLAS-R-003) 4번부터 8번 항목까지의 세부 요구사항 탑재.
- **실시간 필터링**:
  - `전체보기`: 모든 심사 항목 노출.
  - `NC 필터`: '부적합'으로 판정된 항목만 모아보기.
  - `CN 필터`: '유의' 항목만 모아보기.
- **데이터 관리**: 심사 소견 및 증거를 각 항목별로 실시간 입력 및 저장.

### 3. 고속 키보드 내비게이션 (심사 생산성 극대화)
- **Smart Tab**: `Tab` 키를 누르면 다음 항목으로 이동하며, 동시에 해당 항목을 자동으로 **'적합'**으로 표기 (전수 조사 속도 향상).
- **Arrow Keys**: 판정 칸에 포커스가 있을 때 `↑/↓ 방향키`로 '적합/부적합/유의' 판정을 즉시 변경 가능.

### 4. 결과 출력 및 관리
- **Excel 내보내기**: 현재 화면에 보이는 리포트(NC/CN/전체)를 즉시 Excel 파일로 다운로드.
- **GitHub 자동 배포**: 코드 변경 시 GitHub Actions를 통해 실시간으로 웹에 반영.

## 🛠 기술 스택
- **Framework**: React.js
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (XP Theme Engine)
- **Icons**: Lucide React
- **Export**: SheetJS (XLSX)
- **Deployment**: GitHub Pages (Actions)

## 💻 실행 방법

### 로컬 개발 환경
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드 및 배포
```bash
# 정적 파일 빌드
npm run build
```

---
본 프로그램은 공인검사기관의 내부심사 및 현장평가를 지원하기 위해 제작되었습니다.
