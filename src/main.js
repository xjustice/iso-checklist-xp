import * as XLSX from 'xlsx';

const checklistData = [
  {
    id: 1,
    section: "4. 일반 요구사항",
    items: [
      { id: "4.1", text: "검사 활동의 공평한 수행 및 공평성 관리", category: "공평성" },
      { id: "4.2", text: "독립성 유지 (유형 A, B, C 준수 여부)", category: "독립성" }
    ]
  },
  {
    id: 2,
    section: "5. 구조적 요구사항",
    items: [
      { id: "5.1", text: "법적 지위 및 관리 책임", category: "조직" },
      { id: "5.2", text: "검사원의 권한과 책임 명확화", category: "조직" }
    ]
  },
  {
    id: 3,
    section: "6. 자원 요구사항",
    items: [
      { id: "6.1", text: "검사원의 역량, 교육 및 자격 관리", category: "인원" },
      { id: "6.2", text: "시설 및 장비의 적합성 및 유지관리", category: "설비" }
    ]
  },
  {
    id: 4,
    section: "7. 프로세스 요구사항",
    items: [
      { id: "7.1", text: "검사 방법 및 절차의 문서화와 준수", category: "절차" },
      { id: "7.3", text: "검사 기록의 적절성 및 추적성", category: "기록" },
      { id: "7.4", text: "검사 보고서 및 증명서의 발행", category: "보고" }
    ]
  },
  {
    id: 5,
    section: "8. 경영 시스템 요구사항",
    items: [
      { id: "8.2", text: "품질 매뉴얼 및 문서 관리", category: "시스템" },
      { id: "8.6", text: "내부심사 수행 및 시정조치", category: "심사" }
    ]
  }
];

function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="desktop">
      <div class="window">
        <div class="window-title">
          <span>ISO/IEC 17020:2012 내부심사 체크리스트</span>
          <div class="window-buttons">
            <div class="window-button">_</div>
            <div class="window-button">□</div>
            <div class="window-button close">X</div>
          </div>
        </div>
        <div class="window-body">
          <div class="checklist-container" id="checklist-form">
            ${checklistData.map(renderSection).join('')}
          </div>
          <div style="margin-top: 20px; text-align: right;">
            <button id="export-btn" class="window-button" style="width: auto; padding: 5px 20px;">Excel 추출 (Export)</button>
          </div>
        </div>
      </div>
    </div>
    <div class="taskbar">
      <div class="start-button">start</div>
      <div style="flex: 1; padding-left: 10px;">ISO 17020 Checklist</div>
      <div id="clock"></div>
    </div>
  `;

  document.getElementById('export-btn').addEventListener('click', exportToExcel);
  updateClock();
  setInterval(updateClock, 1000);
}

function renderSection(section) {
  return `
    <div class="checklist-section">
      <div class="section-title">${section.section}</div>
      <div class="checklist-item header">
        <div>ID</div>
        <div>평가 항목</div>
        <div>결과</div>
        <div>비고</div>
      </div>
      ${section.items.map(renderItem).join('')}
    </div>
  `;
}

function renderItem(item) {
  return `
    <div class="checklist-item" data-id="${item.id}">
      <div>${item.id}</div>
      <div>${item.text}</div>
      <div>
        <select class="result-select">
          <option value="C">적합</option>
          <option value="NC">부적합</option>
          <option value="NA">해당없음</option>
        </select>
      </div>
      <div>
        <input type="text" class="remark-input" placeholder="관찰내용 입력..." style="width: 130px;">
      </div>
    </div>
  `;
}

function exportToExcel() {
  const data = [["ISO/IEC 17020:2012 내부심사 체크리스트", "", "", ""]];
  
  const sections = document.querySelectorAll('.checklist-section');
  sections.forEach(sectionEl => {
    const title = sectionEl.querySelector('.section-title').innerText;
    data.push([]);
    data.push([title, "", "", ""]);
    data.push(["ID", "평가 항목", "심사 결과", "관찰 내용(비고)"]);
    
    const items = sectionEl.querySelectorAll('.checklist-item:not(.header)');
    items.forEach(itemEl => {
      const id = itemEl.querySelector('div:first-child').innerText;
      const text = itemEl.querySelector('div:nth-child(2').innerText;
      const result = itemEl.querySelector('.result-select').value;
      const remark = itemEl.querySelector('.remark-input').value;
      data.push([id, text, result, remark]);
    });
  });

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Checklist");
  XLSX.writeFile(wb, "ISO_17020_Internal_Audit.xlsx");
}

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const clockElement = document.getElementById('clock');
  if (clockElement) clockElement.innerText = timeStr;
}

renderApp();
