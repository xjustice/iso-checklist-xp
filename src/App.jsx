import React, { useState, useMemo, useEffect } from 'react';
import { 
  Folder, X, Minus, Square, CheckSquare, AlertTriangle, 
  Info, Save, Printer, User, Power, LogOut, ChevronRight, Clock,
  FileSpreadsheet, MessageSquare, AlertCircle
} from 'lucide-react';
import { CHECKLIST_DATA } from './data';
import * as XLSX from 'xlsx';

const SECTIONS = ['모든 항목', ...new Set(CHECKLIST_DATA.map(d => d.section))];

export default function App() {
  const [data, setData] = useState(() => CHECKLIST_DATA.map(item => ({ ...item })));
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const [filter, setFilter] = useState('all'); // 'all', 'nc', 'cn'
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = (id, status) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  const handleInputChange = (id, field, value) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const executeReset = () => {
    const resetData = data.map(item => ({
      ...item,
      status: null,
      memo: '',
      evidence: ''
    }));
    setData(resetData);
    setFilter('all');
    setActiveSection('모든 항목');
    setShowConfirm(false);
  };

  const filteredData = useMemo(() => {
    let result = data;
    if (filter === 'nc') {
      result = result.filter(item => item.status === '부적합');
    } else if (filter === 'cn') {
      result = result.filter(item => item.status === '유의');
    } else if (activeSection !== '모든 항목') {
      result = result.filter(item => item.section === activeSection);
    }
    return result;
  }, [data, filter, activeSection]);

  const progress = useMemo(() => {
    const answered = data.filter(item => item.status !== null).length;
    return Math.round((answered / data.length) * 100);
  }, [data]);

  const ncCount = data.filter(item => item.status === '부적합').length;
  const cnCount = data.filter(item => item.status === '유의').length;

  const downloadExcel = () => {
    let fileName = "ISO_17020_Checklist";
    if (filter === 'nc') fileName += "_NC_Only";
    if (filter === 'cn') fileName += "_CN_Only";
    
    const excelData = filteredData.map(item => ({
      '섹션': item.section,
      'ID': item.id,
      '요구사항': item.item,
      '판정': item.status || '미판정',
      '심사 소견 및 증거': item.memo
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Checklist");
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="xp-window">
      {/* Reset Confirmation Dialog */}
      {showConfirm && (
        <div className="xp-modal-overlay">
          <div className="xp-window xp-modal">
            <div className="xp-title-bar">
              <div className="xp-title-text">
                <AlertCircle size={14} style={{ marginRight: '5px' }} />
                초기화 확인
              </div>
              <div className="xp-window-controls">
                <div className="xp-control-btn xp-close" onClick={() => setShowConfirm(false)}><X size={12} /></div>
              </div>
            </div>
            <div className="xp-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <AlertTriangle size={32} color="#fcd34d" fill="#000" />
                <p>모든 입력 데이터가 삭제됩니다.<br />정말 초기화하시겠습니까?</p>
              </div>
              <div className="xp-modal-footer">
                <button className="xp-dialog-btn" onClick={executeReset}>확인</button>
                <button className="xp-dialog-btn" onClick={() => setShowConfirm(false)}>취소</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Title Bar */}
      <div className="xp-title-bar">
        <div className="xp-title-text">
          <CheckSquare size={16} fill="white" color="blue" />
          ISO/IEC 17020 현장평가 체크리스트 - [KOLAS-R-003]
        </div>
        <div className="xp-window-controls">
          <div className="xp-control-btn xp-minimize"><Minus size={12} /></div>
          <div className="xp-control-btn xp-maximize"><Square size={10} /></div>
          <div className="xp-control-btn xp-close"><X size={12} /></div>
        </div>
      </div>

      <div className="xp-app-toolbar">
        <button className={`xp-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => { setFilter('all'); setActiveSection('모든 항목'); }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Folder size={14} color="#fcd34d" fill="#fcd34d" /> 전체보기
          </div>
        </button>
        <button className={`xp-btn ${filter === 'nc' ? 'active' : ''}`} onClick={() => setFilter('nc')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={14} color="#d32f2f" /> NC 필터
          </div>
        </button>
        <button className={`xp-btn ${filter === 'cn' ? 'active' : ''}`} onClick={() => setFilter('cn')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MessageSquare size={14} color="#316ac5" /> CN 필터
          </div>
        </button>
        
        <div style={{ width: '1px', height: '20px', background: '#ccc', margin: '0 5px' }}></div>
        
        <button className="xp-btn" onClick={downloadExcel} style={{ color: '#059669', fontWeight: 'bold' }}>
          <FileSpreadsheet size={14} /> 엑셀 다운로드
        </button>

        <div style={{ flex: 1 }}></div>
        <button className="xp-btn" onClick={() => setShowConfirm(true)} style={{ color: '#d32f2f', fontWeight: 'bold' }}>
          <X size={14} /> 리셋
        </button>
      </div>

      <div className="xp-content">
        <div className="xp-sidebar">
          <div className="sidebar-header">카테고리</div>
          <ul className="sidebar-list">
            {SECTIONS.map(s => (
              <li 
                key={s} 
                className={activeSection === s && filter === 'all' ? 'active' : ''}
                onClick={() => { setActiveSection(s); setFilter('all'); }}
              >
                <Folder size={12} style={{ marginRight: '5px' }} />
                {s}
              </li>
            ))}
          </ul>
          <div className="sidebar-header" style={{ marginTop: 'auto' }}>정보 요약</div>
          <div style={{ padding: '10px', fontSize: '11px', lineHeight: '1.6' }}>
            <div style={{ color: '#d32f2f' }}>● 부적합(NC): <strong>{ncCount}건</strong></div>
            <div style={{ color: '#316ac5' }}>● 유의사항(CN): <strong>{cnCount}건</strong></div>
            <div style={{ marginTop: '10px', color: '#666' }}>
              <Info size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              KOLAS 시스템 기반
            </div>
          </div>
        </div>

        <div className="xp-main-container">
          <div className="checklist-header">
            <h1>
              {filter === 'nc' ? '부적합(NC) 리스트' : filter === 'cn' ? '유의사항(CN) 리스트' : activeSection}
            </h1>
          </div>

          <div className="checklist-scroll">
            <table className="checklist-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>세부 요구사항</th>
                  <th style={{ width: '120px' }}>판정</th>
                  <th>발견내용 및 근거</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id} className={item.status === '부적합' ? 'nc-item' : item.status === '유의' ? 'cn-item' : ''}>
                    <td><strong>{item.id}</strong></td>
                    <td>
                      <div style={{ color: '#666', fontSize: '10px', marginBottom: '2px' }}>{item.sub}</div>
                      <div style={{ lineHeight: '1.4' }}>{item.item}</div>
                    </td>
                    <td>
                      <div 
                        className="radio-group" 
                        tabIndex={0}
                        id={`judgement-${item.id}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab' && !e.shiftKey) {
                            const currentIndex = filteredData.findIndex(d => d.id === item.id);
                            const nextItem = filteredData[currentIndex + 1];
                            if (nextItem) {
                              e.preventDefault();
                              // Automatically mark as '적합' if not already marked
                              if (!nextItem.status) {
                                handleStatusChange(nextItem.id, '적합');
                              }
                              // Focus the next item
                              const nextEl = document.getElementById(`judgement-${nextItem.id}`);
                              if (nextEl) {
                                nextEl.focus();
                              }
                            }
                          }
                        }}
                      >
                        {['적합', '부적합', '유의'].map(opt => (
                          <label key={opt} className="radio-label">
                            <input 
                              type="radio" 
                              name={`status-${item.id}`}
                              checked={item.status === opt} 
                              onChange={() => handleStatusChange(item.id, opt)} 
                            /> {opt}
                          </label>
                        ))}
                      </div>
                    </td>
                    <td>
                      <textarea 
                        className="memo-box" 
                        rows={2} 
                        placeholder="심사 소견 및 증거 입력..."
                        value={item.memo || ''}
                        onChange={(e) => handleInputChange(item.id, 'memo', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="xp-status-footer">
        <div className="status-panel">준비됨</div>
        <div className="status-panel" style={{ flex: 1 }}>
          전체 진행률:
          <div className="progress-mini">
            <div className="progress-mini-bar" style={{ width: `${progress}%` }}></div>
          </div>
          {progress}% 완료
        </div>
        <div className="status-panel">
          NC: <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>{ncCount}</span>
          <span style={{ margin: '0 5px' }}>/</span>
          CN: <span style={{ color: '#316ac5', fontWeight: 'bold' }}>{cnCount}</span>
        </div>
        <div className="status-panel" style={{ borderRight: 'none', minWidth: '80px', textAlign: 'right' }}>
          {time}
        </div>
      </div>
    </div>
  );
}
