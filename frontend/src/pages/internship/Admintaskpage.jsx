import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import '../../css/internship.css';
import { DEFAULT_DAY1, DEFAULT_DAY5, SNIPPETS } from './admin_constants';
import '../../css/admintaskpage.css'; // Make sure we have the css

export default function Admintaskpage() {
  const [setup, setSetup] = useState(null);

  const [days, setDays] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentDay = parseInt(searchParams.get('day')) || 1;
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [setupDuration, setSetupDuration] = useState(15);
  const [setupDomain, setSetupDomain] = useState('aiml');
  const [setupType, setSetupType] = useState('internship');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);

  const [importDayNum, setImportDayNum] = useState(1);
  const [importType, setImportType] = useState('learn');
  const [importMd, setImportMd] = useState("");

  const [mdContent, setMdContent] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [activeBtn, setActiveBtn] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState({});

  const editorRef = useRef(null);
  const previewRef = useRef(null);

  const isSyncingLeft = useRef(false);
  const isSyncingRight = useRef(false);

  // Synchronized bidirectional scrolling
  const handleEditorScroll = () => {
    if (isSyncingLeft.current) {
      isSyncingLeft.current = false;
      return;
    }
    isSyncingRight.current = true;

    if (!editorRef.current || !previewRef.current) return;
    const ta = editorRef.current;
    const prev = previewRef.current;

    const scrollMaxTa = ta.scrollHeight - ta.clientHeight;
    if (scrollMaxTa > 0) {
      const percentage = ta.scrollTop / scrollMaxTa;
      prev.scrollTop = percentage * (prev.scrollHeight - prev.clientHeight);
    }
  };

  const handlePreviewScroll = () => {
    if (isSyncingRight.current) {
      isSyncingRight.current = false;
      return;
    }
    isSyncingLeft.current = true;

    if (!editorRef.current || !previewRef.current) return;
    const ta = editorRef.current;
    const prev = previewRef.current;

    const scrollMaxPrev = prev.scrollHeight - prev.clientHeight;
    if (scrollMaxPrev > 0) {
      const percentage = prev.scrollTop / scrollMaxPrev;
      ta.scrollTop = percentage * (ta.scrollHeight - ta.clientHeight);
    }
  };

  // --- Toast ---
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  // --- Markdown Parser ---
  const escapeHtml = (text) => {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  const inlineFormat = (text) => {
    let formatted = text
      .replace(/\*\*(.+?)\*\*/g, '<span class="p-bold">$1</span>')
      .replace(/\*(.+?)\*/g, '<em class="p-em">$1</em>')
      .replace(/`(.+?)`/g, '<code class="p-inline-code">$1</code>');
    return formatted;
  };

  const highlightPython = (code) => {
    let html = escapeHtml(code);
    html = html.replace(/(&quot;.*?&quot;|'.*?')/g, '<span style="color: #ce9178;">$1</span>');
    html = html.replace(/(#.*)/g, '<span style="color: #6a9955;">$1</span>');

    const keywords = ['def', 'class', 'return', 'import', 'from', 'if', 'else', 'elif', 'for', 'while', 'in', 'and', 'or', 'not', 'True', 'False', 'None', 'as', 'with', 'pass', 'break', 'continue', 'try', 'except', 'finally', 'lambda', 'yield'];
    const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b(?![^<]*>)`, 'g');
    html = html.replace(kwRegex, '<span style="color: #569cd6;">$1</span>');

    const builtins = ['print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'open', 'type', 'isinstance', 'sum', 'min', 'max'];
    const bltRegex = new RegExp(`\\b(${builtins.join('|')})\\b(?![^<]*>)`, 'g');
    html = html.replace(bltRegex, '<span style="color: #4ec9b0;">$1</span>');

    html = html.replace(/\b([a-zA-Z_]\w*)(?=\s*\()(?![^<]*>)/g, '<span style="color: #dcdcaa;">$1</span>');
    html = html.replace(/\b(\d+(\.\d+)?)\b(?![^<]*>)/g, '<span style="color: #b5cea8;">$1</span>');

    return html;
  };

  const renderBlock = (type, content) => {
    const lines = content.split('\n');

    if (type === 'concept') {
      let head = '', body = [];
      lines.forEach(l => {
        if (l.match(/^###\s+/)) head = l.replace(/^###\s+/, '');
        else if (l.trim()) body.push(inlineFormat(l.trim()));
      });
      return `<div class="p-card"><div class="p-concept">
        ${head ? `<div class="p-concept-h">${inlineFormat(head)}</div>` : ''}
        ${body.length ? `<div class="p-concept-b">${body.join('<br>')}</div>` : ''}
      </div></div>`;
    }

    if (type === 'analogy') {
      let emoji = '💡', atitle = 'Analogy', abody = [];
      lines.forEach((l, li) => {
        if (li === 0 && l.trim().match(/^\S{1,4}$/)) emoji = l.trim();
        else if (l.match(/^###\s+/)) atitle = l.replace(/^###\s+/, '');
        else if (l.trim()) abody.push(l.trim());
      });
      return `<div class="p-card"><div class="p-analogy"><div class="p-analogy-emoji">${emoji}</div><div><div class="p-analogy-title">${atitle}</div><div class="p-analogy-text">${inlineFormat(abody.join(' '))}</div></div></div></div>`;
    }

    if (type === 'image') {
      let iurl = '', icap = '', ialt = '';
      lines.forEach(l => {
        const lm = l.trim();
        if (lm.startsWith('url:')) iurl = lm.replace('url:', '').trim();
        else if (lm.startsWith('caption:')) icap = lm.replace('caption:', '').trim();
        else if (lm.startsWith('alt:')) ialt = lm.replace('alt:', '').trim();
      });
      return `<div class="p-img-wrap">
        ${iurl ? `<img class="p-img-real" src="${escapeHtml(iurl)}" alt="${escapeHtml(ialt || icap)}" onerror="this.style.display='none';this.nextSibling.style.display='flex'">` : ''}
        <div class="p-img-placeholder" style="${iurl ? 'display:none' : ''}">
          <i class="fa-solid fa-image"></i>
          <span>${iurl ? iurl : 'Image block configured'}</span>
        </div>
        <div class="p-img-caption">${escapeHtml(icap || 'Add caption in markdown')}</div>
      </div>`;
    }

    if (type === 'video') {
      let vurl = '', vtitle = 'Video', vmeta = 'YouTube', vdur = '', vreq = true;
      lines.forEach(l => {
        const lm = l.trim();
        if (lm.startsWith('url:')) vurl = lm.replace('url:', '').trim();
        else if (lm.startsWith('title:')) vtitle = lm.replace('title:', '').trim();
        else if (lm.startsWith('meta:')) vmeta = lm.replace('meta:', '').trim();
        else if (lm.startsWith('duration:')) vdur = lm.replace('duration:', '').trim();
        else if (lm.startsWith('required:')) vreq = lm.replace('required:', '').trim() !== 'false';
      });
      const ytidMatch = vurl.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
      const ytid_val = ytidMatch ? ytidMatch[1] : null;
      return `<div class="p-video">
        <div class="p-video-thumb">
          ${ytid_val ? `<img src="https://img.youtube.com/vi/${ytid_val}/hqdefault.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.65">` : ''}
          <div class="p-play"><i class="fa-solid fa-play"></i></div>
          ${vdur ? `<div class="p-video-dur">${vdur}</div>` : ''}
        </div>
        <div class="p-video-info">
          <div class="p-yt-ic"><i class="fa-brands fa-youtube"></i></div>
          <div style="flex:1"><div class="p-video-title">${escapeHtml(vtitle)}</div><div class="p-video-meta">${escapeHtml(vmeta)}</div></div>
          <span class="chip ${vreq ? 'chip-green' : 'chip-gray'}" style="font-size:10px">${vreq ? 'Required' : 'Optional'}</span>
        </div>
      </div>`;
    }

    if (type.startsWith('code')) {
      const lang = type.replace('code', '').trim() || 'python';
      let ctitle = 'Code Example', clines = [];
      lines.forEach(l => {
        if (l.match(/^###\s+/)) ctitle = l.replace(/^###\s+/, '').trim();
        else clines.push(l);
      });
      const code = clines.join('\n').replace(/^\n/, '').replace(/\\n/g, '\n');
      return `<div class="p-code">
        <div class="p-code-hdr">
          <div class="p-code-dots"><div class="p-code-dot" style="background:#ff5f57"></div><div class="p-code-dot" style="background:#febc2e"></div><div class="p-code-dot" style="background:#28c840"></div></div>
          <span class="p-code-lang">${lang}</span>
          <span class="p-code-title">${escapeHtml(ctitle)}</span>
          <button class="p-copy-btn"><i class="fa-regular fa-copy"></i> Copy</button>
        </div>
        <div class="p-code-body"><pre>${highlightPython(code)}</pre></div>
      </div>`;
    }

    if (type === 'tip' || type === 'warning' || type === 'important') {
      let clabel = type.toUpperCase(), cbody = [];
      const icons = { tip: 'fa-lightbulb', warning: 'fa-triangle-exclamation', important: 'fa-circle-info' };
      lines.forEach(l => {
        if (l.match(/^###\s+/)) clabel = l.replace(/^###\s+/, '').trim();
        else if (l.trim()) cbody.push(inlineFormat(l.trim()));
      });
      return `<div class="p-callout p-callout-${type}">
        <i class="fa-solid ${icons[type]} p-callout-icon"></i>
        <div><span class="p-callout-lbl">${clabel}</span><div class="p-callout-text">${cbody.join('<br>')}</div></div>
      </div>`;
    }

    if (type === 'keypoints') {
      let kptitle = 'Key Takeaways', kppts = [];
      lines.forEach(l => {
        if (l.match(/^###\s+/)) kptitle = l.replace(/^###\s+/, '').trim();
        else if (l.trim().startsWith('-')) kppts.push(l.trim().replace(/^-\s*/, ''));
      });
      const kphtml = kppts.map(p => `<div class="p-kp-item"><div class="p-kp-dot"><i class="fa-solid fa-check"></i></div>${inlineFormat(p)}</div>`).join('');
      return `<div class="p-keypoints"><div class="p-kp-title"><i class="fa-solid fa-key"></i>${kptitle}</div><div class="p-kp-list">${kphtml}</div></div>`;
    }

    if (type === 'quiz') {
      let question = '', opts = { A: '', B: '', C: '', D: '' }, correct = 'A', explain = '';
      lines.forEach(l => {
        const lm = l.trim();
        if (lm.startsWith('Q:')) question = lm.replace('Q:', '').trim();
        else if (lm.startsWith('A:')) opts.A = lm.replace('A:', '').trim();
        else if (lm.startsWith('B:')) opts.B = lm.replace('B:', '').trim();
        else if (lm.startsWith('C:')) opts.C = lm.replace('C:', '').trim();
        else if (lm.startsWith('D:')) opts.D = lm.replace('D:', '').trim();
        else if (lm.startsWith('CORRECT:')) correct = lm.replace('CORRECT:', '').trim();
        else if (lm.startsWith('EXPLAIN:')) explain = lm.replace('EXPLAIN:', '').trim();
      });
      const optsHtml = ['A', 'B', 'C', 'D'].filter(l => opts[l]).map(l => {
        return `<div class="p-quiz-opt">
          <div class="p-opt-ltr">${l}</div>
          <div>${escapeHtml(opts[l])}</div>
        </div>`;
      }).join('');
      return `<div class="p-quiz">
        <div class="p-quiz-badge">📝 Mini Quiz</div>
        <div class="p-quiz-q">${escapeHtml(question)}</div>
        <div class="p-quiz-opts">${optsHtml}</div>
        <button class="p-quiz-submit"><i class="fa-solid fa-paper-plane"></i> Submit Answer</button>
      </div>`;
    }

    if (type === 'task-hero') {
      let tprefix = 'Task —', ttitle = 'Project Challenge', tdesc = '', tstats = [];
      lines.forEach(l => {
        const lm = l.trim();
        if (lm.match(/^#\s+/)) tprefix = lm.replace(/^#\s+/, '');
        else if (lm.match(/^##\s+/)) ttitle = lm.replace(/^##\s+/, '');
        else if (lm.startsWith('- ')) tstats.push(lm.replace(/^-\s*/, ''));
        else if (lm && !lm.match(/^#/)) tdesc = lm;
      });
      const statsHtml = tstats.map(s => `<div class="p-task-stat"><i class="fa-solid fa-circle-dot"></i>${escapeHtml(s)}</div>`).join('');
      return `<div class="p-task-hero">
        <div class="p-task-top">
          <div class="p-task-badge"><i class="fa-solid fa-bolt" style="font-size:9px"></i>Task Day · Day ${currentDay}</div>
          <div class="p-task-title"><span style="color:#a8a29e">${escapeHtml(tprefix)} </span><em>${escapeHtml(ttitle)}</em></div>
          ${tdesc ? `<div class="p-task-desc">${escapeHtml(tdesc)}</div>` : ''}
          ${statsHtml ? `<div class="p-task-stats">${statsHtml}</div>` : ''}
        </div>
      </div>`;
    }

    if (type === 'requirements') {
      let sections = { beg: [], int: [], adv: [] };
      let curSection = 'int';
      lines.forEach(l => {
        const lm = l.trim().toUpperCase();
        if (lm.includes('BEGINNER')) { curSection = 'beg'; return; }
        if (lm.includes('INTERMEDIATE')) { curSection = 'int'; return; }
        if (lm.includes('ADVANCED')) { curSection = 'adv'; return; }
        if (l.trim().startsWith('-')) sections[curSection].push(l.trim().replace(/^-\s*/, ''));
      });
      const makeReqBox = (cls, label, items) => {
        return `<div class="p-req-${cls} p-req-box"><div class="p-req-title">${label}</div>
          <div class="p-req-list">${items.map(it => `<div class="p-req-item">${escapeHtml(it)}</div>`).join('')}</div></div>`;
      };
      return `<div class="p-card">
        <div class="p-card-label"><i class="fa-solid fa-sliders"></i>Difficulty Level</div>
        <div class="p-diff-tabs">
          <div class="p-diff-tab ${sections.beg.length ? '' : 'disabled'}">🟢 Beginner</div>
          <div class="p-diff-tab active">🟡 Intermediate</div>
          <div class="p-diff-tab">🔴 Advanced</div>
        </div>
        <div class="p-diff-content active">${makeReqBox('int', '🟡 Intermediate Requirements', sections.int)}</div>
      </div>`;
    }

    if (type === 'checklist') {
      const items = lines.filter(l => l.trim().startsWith('-')).map(l => l.trim().replace(/^-\s*/, ''));
      const itemsHtml = items.map(item => `
        <div class="p-check-item">
          <div class="p-check-box"><i class="fa-solid fa-check"></i></div>
          ${escapeHtml(item)}
        </div>
      `).join('');
      return `<div class="p-card"><div class="p-card-label"><i class="fa-solid fa-list-check"></i>Pre-Submit Checklist</div><div class="p-checklist">${itemsHtml}</div></div>`;
    }

    if (type === 'scoring') {
      const scoreItems = [];
      lines.forEach(l => {
        const lm = l.trim();
        if (lm.startsWith('SCORE:')) {
          const parts = lm.replace('SCORE:', '').trim().split('|');
          if (parts.length >= 3) scoreItems.push({ label: parts[0].trim(), val: parts[1].trim(), max: parts[2].trim(), isPass: false });
        }
        if (lm.startsWith('PASS:')) {
          const parts = lm.replace('PASS:', '').trim().split('|');
          if (parts.length >= 3) scoreItems.push({ label: parts[0].trim(), val: parts[1].trim(), max: parts[2].trim(), isPass: true });
        }
      });
      const sgrid = scoreItems.map(s => `
        <div class="p-score-item${s.isPass ? ' pass' : ''}">
          <div class="p-score-val">${s.val}<span class="p-score-max">/${s.max}</span></div>
          <div class="p-score-lbl">${escapeHtml(s.label)}</div>
        </div>
      `).join('');
      return `<div class="p-card"><div class="p-card-label"><i class="fa-solid fa-robot"></i>AI Scoring</div><div class="p-score-grid">${sgrid}</div></div>`;
    }

    if (type === 'submit') {
      return `<div class="p-card">
        <div class="p-submit-box">
          <div class="p-submit-lbl"><i class="fa-brands fa-github" style="margin-right:5px"></i>Submit GitHub Repository</div>
          <div class="p-input-row">
            <input class="p-input" type="url" placeholder="https://github.com/username/repo-name">
            <button class="btn btn-primary btn-sm"><i class="fa-solid fa-paper-plane"></i> Submit</button>
          </div>
        </div>
      </div>`;
    }

    if (type === 'wyl') {
      const wylItems = lines.filter(l => l.trim().startsWith('-')).map(l => l.trim().replace(/^-\s*/, ''));
      const wylHtml = wylItems.map(item => `<div class="p-wyl-item"><i class="fa-solid fa-check"></i>${escapeHtml(item)}</div>`).join('');
      return `<div class="p-wyl"><div class="p-wyl-lbl"><i class="fa-solid fa-graduation-cap" style="margin-right:4px"></i>What You Will Learn Today</div><div class="p-wyl-grid">${wylHtml}</div></div>`;
    }

    return `<div class="p-card"><div class="p-concept"><div class="p-concept-b">${inlineFormat(content.trim())}</div></div></div>`;
  };

  const parseMarkdown = (md) => {
    let html = '';
    const lines = md.split('\n');
    let i = 0;

    const nextLine = () => { i++; };
    const collectBlock = (openTag) => {
      let content = [];
      nextLine();
      while (i < lines.length) {
        const l = lines[i].trimEnd();
        if (l.trim() === ':::') { nextLine(); break; }
        content.push(lines[i]);
        nextLine();
      }
      return content.join('\n');
    };

    while (i < lines.length) {
      const line = lines[i] ? lines[i].trimEnd() : '';

      if (line.match(/^:::/)) {
        const blockType = line.replace(/^:::/, '').trim();
        const blockContent = collectBlock(blockType);
        html += renderBlock(blockType, blockContent);
        continue;
      }

      if (line.match(/^#\s+/)) {
        const txt = line.replace(/^#\s+/, '');
        const dayTypeStr = (days[currentDay - 1] && days[currentDay - 1].type === 'task') ? '<span class="chip chip-amber" style="font-size:10px">⚡ Task Day</span>' : '<span class="chip chip-gray" style="font-size:10px">📖 Learning</span>';
        html += `<div class="p-day-hero"><div class="p-day-meta"><span class="chip chip-green" style="font-size:10px">Day ${currentDay}</span>${dayTypeStr}</div><div class="p-day-title">${inlineFormat(txt)}</div>`;
        nextLine();
        while (i < lines.length && lines[i] && !lines[i].match(/^#/) && !lines[i].match(/^:::/)) {
          const subline = lines[i].trimEnd();
          if (subline.startsWith('## ') || subline.startsWith('### ')) break;
          if (subline.trim()) html += `<div class="p-day-desc">${inlineFormat(subline)}</div>`;
          nextLine();
          if (!lines[i] || !lines[i].trim()) { nextLine(); break; }
        }
        html += '</div>';
        continue;
      }

      if (line.match(/^##\s+/)) {
        const txt2 = line.replace(/^##\s+/, '');
        html += `<div class="p-card"><div class="p-h2">${inlineFormat(txt2)}</div>`;
        nextLine();
        let inner = '';
        while (i < lines.length) {
          const nl = lines[i] ? lines[i].trimEnd() : '';
          if (nl.match(/^#/)) break;
          if (nl.match(/^:::/)) {
            const bt = nl.replace(/^:::/, '').trim();
            const bc = collectBlock(bt);
            inner += renderBlock(bt, bc);
            continue;
          }
          if (nl.trim()) inner += `<div class="p-para">${inlineFormat(nl)}</div>`;
          nextLine();
        }
        html += inner + '</div>';
        continue;
      }

      if (line.match(/^###\s+/)) {
        const txt3 = line.replace(/^###\s+/, '');
        html += `<div class="p-h3">${inlineFormat(txt3)}</div>`;
        nextLine();
        continue;
      }

      if (line.trim() === '---') {
        html += '<div class="p-hr"></div>';
        nextLine();
        continue;
      }

      if (!line.trim()) { nextLine(); continue; }

      html += `<div class="p-para">${inlineFormat(line)}</div>`;
      nextLine();
    }
    return html;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewHtml(parseMarkdown(mdContent));
    }, 500);
    return () => clearTimeout(timer);
  }, [mdContent]);

  // Keep scroll in sync when HTML updates
  useEffect(() => {
    handleEditorScroll();
  }, [previewHtml]);

  useEffect(() => {
    if (setup && days[currentDay - 1]) {
      setMdContent(days[currentDay - 1].markdown || '');
    }
  }, [currentDay]);

  const handleMdChange = (newVal) => {
    setMdContent(newVal || '');
    if (setup && days[currentDay - 1]) {
      const titleMatch = (newVal || '').match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim().replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1') : '';
      const updatedDays = [...days];
      updatedDays[currentDay - 1] = {
        ...updatedDays[currentDay - 1],
        markdown: newVal || '',
        title: title
      };
      setDays(updatedDays);
    }
  };

  const selectDay = (num) => {
    setSearchParams({ day: num });
    if (days[num - 1]) {
      setMdContent(days[num - 1].markdown);
    } else {
      setMdContent('');
    }
  };

  const addDay = () => {
    const n = days.length + 1;
    const newDay = { num: n, type: n % 5 === 0 ? 'task' : 'learn', done: false, markdown: '', title: '' };
    setDays([...days, newDay]);
    setSetup({ ...setup, totalDays: n });
    selectDay(n);
    triggerToast(`Day ${n} added!`);
  };

  const completeCurrentDay = () => {
    const updatedDays = [...days];
    updatedDays[currentDay - 1].done = !updatedDays[currentDay - 1].done;
    setDays(updatedDays);
    triggerToast(updatedDays[currentDay - 1].done ? `Day ${currentDay} marked complete! 🎉` : 'Marked incomplete');
  };

  const handleSnippetClick = (type) => {
    setActiveBtn(type);
    insertSnippet(type);
    setTimeout(() => setActiveBtn(null), 300);
  };

  const insertSnippet = (type) => {
    const snippetStr = SNIPPETS[type] || '';
    const snippet = snippetStr.replace(/\\n/g, '\n');
    if (!editorRef.current) return;

    const ta = editorRef.current;
    const safeContent = mdContent || '';

    // If the textarea is NOT the active element, it means we clicked a button without focusing first.
    // In this case, we default to adding the snippet to the very end of the document.
    const isFocused = document.activeElement === ta;
    let pos = (isFocused && ta.selectionEnd !== undefined) ? ta.selectionEnd : safeContent.length;

    const before = safeContent.substring(0, pos);
    const after = safeContent.substring(pos);
    const insertStr = (before.length && !before.endsWith('\n\n') ? '\n\n' : '') + snippet + '\n\n';
    const newMd = before + insertStr + after;
    handleMdChange(newMd);

    setTimeout(() => {
      if (editorRef.current) {
        const newPos = pos + insertStr.length;
        editorRef.current.focus();
        editorRef.current.setSelectionRange(newPos, newPos);

        // Ensure scroll reaches the bottom if inserted near the end
        if (newPos >= newMd.length - 10) {
          editorRef.current.scrollTop = editorRef.current.scrollHeight;
        }
        handleEditorScroll();
      }
    }, 10);
  };

  const handleImport = () => {
    if (!importMd.trim()) { triggerToast('Paste some markdown first!'); return; }
    if (importDayNum >= 1 && importDayNum <= days.length) {
      const updatedDays = [...days];
      updatedDays[importDayNum - 1].markdown = importMd;
      updatedDays[importDayNum - 1].type = importType;
      setDays(updatedDays);
      selectDay(importDayNum);
    } else {
      setMdContent(importMd);
    }
    setIsImportOpen(false);
    triggerToast(`Day ${importDayNum} content imported! ✓`);
  };

  // --- Setup Component ---
  if (!setup) {
    return (
      <div className="setup cw-admin-wrap" style={{ minHeight: '100vh' }}>
        <div className="setup-card">
          <div className="setup-logo">
            <div className="setup-logo-icon"><i className="fa-solid fa-graduation-cap"></i></div>
            <div className="setup-logo-text">CareerWizard AI</div>
          </div>
          <div className="setup-title">Day Content Builder</div>
          <div className="setup-sub">Create professional internship day content using simple Markdown. Images, videos, quizzes — sab auto-render hoga.</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="setup-lbl" style={{ marginBottom: '4px' }}>Task Name</label>
              <input className="setup-input" id="setup-taskname" placeholder="e.g. AI/ML Bootcamp" defaultValue="AI/ML Bootcamp" style={{ marginBottom: 0 }} />
            </div>
            <div>
              <label className="setup-lbl" style={{ marginBottom: '4px' }}>Type</label>
              <div style={{ position: 'relative', zIndex: isTypeDropdownOpen ? 50 : 1 }}>
                <div style={{ position: 'absolute', left: '14px', top: '15px', pointerEvents: 'none', color: 'var(--text2)', fontSize: '14px', zIndex: 10 }}>
                  <i className="fa-solid fa-layer-group"></i>
                </div>
                <div 
                  className="setup-input"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: '40px', marginBottom: 0, position: 'relative', zIndex: 5 }}
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                >
                  <span style={{flex: 1}}>{setupType === 'internship' ? 'Internship' : 'Certificate Course'}</span>
                  <i className="fa-solid fa-chevron-down" style={{ color: 'var(--muted)', fontSize: '12px' }}></i>
                </div>
                {isTypeDropdownOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setIsTypeDropdownOpen(false)}></div>
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 20 }}>
                      <div className="setup-dropdown-item" style={{ padding: '10px 14px', cursor: 'pointer', background: setupType === 'internship' ? 'var(--cream2)' : 'transparent', color: setupType === 'internship' ? 'var(--text)' : 'var(--text2)', fontWeight: setupType === 'internship' ? 600 : 400, borderBottom: '1px solid var(--border)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => { setSetupType('internship'); setIsTypeDropdownOpen(false); }}>
                        <i className="fa-solid fa-briefcase" style={{ color: setupType === 'internship' ? 'var(--gm)' : 'var(--muted)' }}></i> Internship
                      </div>
                      <div className="setup-dropdown-item" style={{ padding: '10px 14px', cursor: 'pointer', background: setupType === 'certificate' ? 'var(--cream2)' : 'transparent', color: setupType === 'certificate' ? 'var(--text)' : 'var(--text2)', fontWeight: setupType === 'certificate' ? 600 : 400, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => { setSetupType('certificate'); setIsTypeDropdownOpen(false); }}>
                        <i className="fa-solid fa-graduation-cap" style={{ color: setupType === 'certificate' ? 'var(--gm)' : 'var(--muted)' }}></i> Certificate Course
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '8px' }}>
            <div>
              <label className="setup-lbl" style={{ marginBottom: '4px' }}>Duration</label>
              <div className="setup-day-pills" style={{ marginBottom: 0 }}>
                {[15, 30, 45].map(d => (
                  <div key={d} className={`setup-day-pill ${setupDuration === d ? 'sel' : ''}`} onClick={() => setSetupDuration(d)} style={{ padding: '6px 12px', fontSize: '11.5px' }}>{d} Days</div>
                ))}
              </div>
            </div>
            <div>
              <label className="setup-lbl" style={{ marginBottom: '4px' }}>Domain</label>
              <div style={{ position: 'relative', zIndex: isDomainDropdownOpen ? 50 : 1 }}>
                <div style={{ position: 'absolute', left: '14px', top: '15px', pointerEvents: 'none', color: 'var(--text2)', fontSize: '14px', zIndex: 10 }}>
                  <i className="fa-solid fa-laptop-code"></i>
                </div>
                <div 
                  className="setup-input"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: '40px', marginBottom: 0, position: 'relative', zIndex: 5 }}
                  onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}
                >
                  <span style={{flex: 1}}>
                    {setupDomain === 'aiml' && 'AI / ML Engineering'}
                    {setupDomain === 'webdev' && 'Full Stack Web Dev'}
                    {setupDomain === 'datascience' && 'Data Science'}
                    {setupDomain === 'devops' && 'Cloud & DevOps'}
                  </span>
                  <i className="fa-solid fa-chevron-down" style={{ color: 'var(--muted)', fontSize: '12px' }}></i>
                </div>
                {isDomainDropdownOpen && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setIsDomainDropdownOpen(false)}></div>
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 20 }}>
                      {[
                        { id: 'aiml', label: 'AI / ML Engineering', icon: 'fa-robot' },
                        { id: 'webdev', label: 'Full Stack Web Dev', icon: 'fa-globe' },
                        { id: 'datascience', label: 'Data Science', icon: 'fa-chart-pie' },
                        { id: 'devops', label: 'Cloud & DevOps', icon: 'fa-cloud' }
                      ].map(dom => (
                        <div 
                          key={dom.id}
                          className="setup-dropdown-item" 
                          style={{ padding: '10px 14px', cursor: 'pointer', background: setupDomain === dom.id ? 'var(--cream2)' : 'transparent', color: setupDomain === dom.id ? 'var(--text)' : 'var(--text2)', fontWeight: setupDomain === dom.id ? 600 : 400, borderBottom: dom.id !== 'devops' ? '1px solid var(--border)' : 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }} 
                          onClick={() => { setSetupDomain(dom.id); setIsDomainDropdownOpen(false); }}
                        >
                          <i className={`fa-solid ${dom.icon}`} style={{ color: setupDomain === dom.id ? 'var(--gm)' : 'var(--muted)' }}></i> {dom.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '10px', marginTop: '14px', fontSize: '14px', fontFamily: "'Fraunces', serif", letterSpacing: '0.3px', fontWeight: '700', borderRadius: 'var(--radius)' }} onClick={() => {
            const taskName = document.getElementById("setup-taskname").value || "New Task";
            const type = setupType;
            const newDays = Array.from({ length: setupDuration }, (_, i) => {
              let defMd = "";
              if (i === 0) defMd = DEFAULT_DAY1.replace(/\\n/g, '\n');
              else if (i === 4) defMd = DEFAULT_DAY5.replace(/\\n/g, '\n');
              else defMd = `# Day ${i + 1} — ${(i + 1) % 5 === 0 ? 'Task Day' : 'Learning Day'}\n\nAdd your content here using the toolbar above or paste markdown using the Import button.\n\n:::tip\n### Getting Started\nClick any toolbar button to insert a content block, or use Import Markdown to paste your prepared content.\n:::`;

              return {
                num: i + 1, type: (i + 1) % 5 === 0 ? 'task' : 'learn', done: false, markdown: defMd
              };
            });
            setDays(newDays);
            setSetup({ name: type, track: taskName, totalDays: setupDuration, domain: setupDomain });
            setSearchParams({ day: 1 });
            setMdContent(newDays[0].markdown);
          }}>
            <i className="fa-solid fa-rocket"></i> Launch Content Builder
          </button>
        </div>
      </div>
    );
  }

  const curDayObj = days[currentDay - 1];
  const completedCount = days.filter(d => d.done).length;
  const pct = Math.round((completedCount / days.length) * 100);

  return (
    <div className="cw-admin-wrap" style={{ height: '100%', width: '100%', display: 'flex' }}>
      <div className="shell" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* MAIN */}
        <div className="main" style={{ flex: 1 }}>
          {/* TOPBAR */}
          <div className="topbar">
            <div className="tb-left">
              <div className="bc">Builder / <span>Day {currentDay} — {curDayObj?.type === 'task' ? 'Task Day 🔥' : 'Learning'}</span></div>
            </div>
            <div className="tb-right">
              <div className="chip chip-green"><div className="pdot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></div><span>Editing Day {currentDay}</span></div>
              <button className="icon-btn" onClick={() => setIsImportOpen(true)}><i className="fa-solid fa-file-import"></i></button>
              <button className="icon-btn" onClick={() => setIsHelpOpen(true)}><i className="fa-solid fa-circle-question"></i></button>
            </div>
          </div>

          {/* TWO PANE */}
          <div className="two-pane">
            {/* LEFT: EDITOR */}
            <div className="pane pane-left" style={{ display: isFullscreen ? 'none' : '' }}>
              <div className="pane-header">
                <div className="pane-title"><i className="fa-solid fa-code"></i>Markdown Editor</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setIsImportOpen(true)} style={{ border: '1px solid var(--border)' }}><i className="fa-solid fa-file-import"></i> Import Markdown</button>
                  <button className="btn btn-primary btn-sm" onClick={() => triggerToast('Preview updated successfully!')} style={{ padding: '5px 12px' }}><i className="fa-solid fa-play"></i> Render Preview</button>
                </div>
              </div>
              <div className="md-toolbar">
                <button className={`md-btn ${activeBtn === 'concept' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('concept')}><i className="fa-solid fa-book-open"></i> Concept</button>
                <button className={`md-btn ${activeBtn === 'image' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('image')}><i className="fa-solid fa-image"></i> Image</button>
                <button className={`md-btn ${activeBtn === 'video' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('video')}><i className="fa-brands fa-youtube"></i> Video</button>
                <div className="md-sep"></div>
                <button className={`md-btn ${activeBtn === 'code' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('code')}><i className="fa-solid fa-code"></i> Code</button>
                <button className={`md-btn ${activeBtn === 'callout-tip' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('callout-tip')}><i className="fa-solid fa-lightbulb"></i> Tip</button>
                <button className={`md-btn ${activeBtn === 'callout-warning' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('callout-warning')}><i className="fa-solid fa-triangle-exclamation"></i> Warning</button>
                <div className="md-sep"></div>
                <button className={`md-btn ${activeBtn === 'keypoints' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('keypoints')}><i className="fa-solid fa-key"></i> Key Points</button>
                <button className={`md-btn ${activeBtn === 'quiz' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('quiz')}><i className="fa-solid fa-question"></i> Quiz</button>
                <div className="md-sep"></div>
                <button className={`md-btn ${activeBtn === 'task-hero' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('task-hero')}><i className="fa-solid fa-bolt"></i> Task Hero</button>
                <button className={`md-btn ${activeBtn === 'requirements' ? 'md-active' : ''}`} onMouseDown={(e) => e.preventDefault()} onClick={() => handleSnippetClick('requirements')}><i className="fa-solid fa-list-check"></i> Requirements</button>
              </div>
              <div className="pane-body">
                <textarea
                  className="md-textarea"
                  ref={editorRef}
                  value={mdContent}
                  onChange={(e) => handleMdChange(e.target.value)}
                  onScroll={handleEditorScroll}
                  placeholder="Type your day content here in CareerWizard Markdown...&#10;&#10;Click any toolbar button above to insert a snippet!"
                />
              </div>
            </div>

            {/* RIGHT: PREVIEW */}
            <div className={`pane pane-right ${isFullscreen ? 'fullscreen-mode' : ''}`} style={isFullscreen ? { gridColumn: '1 / -1', borderLeft: 'none' } : {}}>
              <div className="pane-header">
                <div className="pane-title"><i className="fa-solid fa-eye"></i>Live Preview</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                    <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i> {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={completeCurrentDay}>
                    {curDayObj?.done ? <><i className="fa-solid fa-check-circle"></i> Completed ✓</> : <><i className="fa-solid fa-check"></i> Mark Done</>}
                  </button>
                </div>
              </div>
              <div className="pane-body">
                <div className="preview-wrap" ref={previewRef} style={{ overflowY: 'auto', height: '100%' }} onScroll={handlePreviewScroll}>
                  {!mdContent.trim() ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center', color: 'var(--muted)' }}>
                      <i className="fa-solid fa-eye-slash" style={{ fontSize: '36px', marginBottom: '14px', color: 'var(--muted2)' }}></i>
                      <div style={{ fontFamily: "'Fraunces',serif", fontSize: '18px', fontWeight: 600, color: 'var(--text2)', marginBottom: '6px' }}>Preview appears here</div>
                      <div style={{ fontSize: '13px', lineHeight: 1.6, maxWidth: '300px' }}>Write content in the editor and click <strong>Render Preview</strong> — or use the toolbar to insert blocks</div>
                    </div>
                  ) : (
                    <div className="preview-inner" dangerouslySetInnerHTML={{ __html: previewHtml }}></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMPORT MODAL */}
      {isImportOpen && (
        <div className="overlay" onClick={() => setIsImportOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <div className="modal-hdr">
              <div className="modal-ttl"><i className="fa-solid fa-file-import" style={{ color: 'var(--gm)' }}></i>Import Day Content</div>
              <button className="modal-cls" onClick={() => setIsImportOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body">
              <label className="modal-lbl">Day Number</label>
              <input className="modal-input" type="number" min="1" max="60" value={importDayNum} onChange={e => setImportDayNum(Number(e.target.value))} style={{ width: '100px', marginBottom: '14px' }} />
              <label className="modal-lbl">Day Type</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setImportType('learn')} style={importType === 'learn' ? { borderColor: 'var(--bm)', color: 'var(--bm)' } : {}}>📖 Learning Day</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setImportType('task')} style={importType === 'task' ? { borderColor: 'var(--am)', color: 'var(--am)' } : {}}>⚡ Task Day</button>
              </div>
              <label className="modal-lbl">Paste your Markdown content below</label>
              <textarea className="modal-textarea" value={importMd} onChange={e => setImportMd(e.target.value)} placeholder="Paste your full day markdown content here..." />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={handleImport}><i className="fa-solid fa-check"></i> Import & Render</button>
              <button className="btn btn-ghost" onClick={() => setIsImportOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      {isHelpOpen && (
        <div className="overlay" onClick={() => setIsHelpOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-hdr">
              <div className="modal-ttl"><i className="fa-solid fa-book" style={{ color: 'var(--gm)' }}></i>Complete Syntax Reference</div>
              <button className="modal-cls" onClick={() => setIsHelpOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="modal-body" style={{ fontFamily: "'DM Mono',monospace", fontSize: '11.5px', lineHeight: 1.9, color: 'var(--text2)' }}>
              <div className="syntax-guide">
                <div className="sg-head">📝 Basic Markdown</div>
                <div className="sg-row"><span className="sg-key"># Title</span><span className="sg-val">→ H1 heading (Page/Day title)</span></div>
                <div className="sg-row"><span className="sg-key">## Title</span><span className="sg-val">→ H2 section heading</span></div>
                <div className="sg-row"><span className="sg-key">### Title</span><span className="sg-val">→ H3 sub-heading</span></div>
                <div className="sg-row"><span className="sg-key">**bold**</span><span className="sg-val">→ Bold text</span></div>
                <div className="sg-row"><span className="sg-key">:::concept</span><span className="sg-val">→ Blue concept explanation box</span></div>
                <div className="sg-row"><span className="sg-key">:::image</span><span className="sg-val">→ Image. url: link, caption: text, alt: text</span></div>
                <div className="sg-row"><span className="sg-key">:::video</span><span className="sg-val">→ Video player. url:, title:, duration:, required: true/false</span></div>
                <div className="sg-row"><span className="sg-key">:::code python</span><span className="sg-val">→ Code block. Language after :::code. First ### line = title</span></div>
                <div className="sg-row"><span className="sg-key">:::quiz</span><span className="sg-val">→ Interactive quiz. Q:, A:, B:, C:, D:, CORRECT:, EXPLAIN:</span></div>
                <div className="sg-row"><span className="sg-key">:::task-hero</span><span className="sg-val">→ Task day dark hero. #=task prefix, ##=title, body=desc</span></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setIsHelpOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`toast ${showToast ? 'show' : ''}`}><i className="fa-solid fa-circle-check"></i><span>{toastMsg}</span></div>
    </div>
  );
}