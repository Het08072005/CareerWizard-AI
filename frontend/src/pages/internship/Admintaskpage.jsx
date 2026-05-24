import { useState, useRef, useEffect, useCallback } from "react";

// ─── INLINE EDIT HELPER ───────────────────────────────────────────────────────
function Editable({ value, onChange, tag: Tag = "span", className = "", multiline = false, placeholder = "Click to edit..." }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const ref = useRef();
  useEffect(() => { setVal(value); }, [value]);
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); if (ref.current.select) ref.current.select(); } }, [editing]);
  const commit = () => { setEditing(false); onChange(val); };
  if (editing) {
    if (multiline) return (
      <textarea ref={ref} className={className + " editable-input editable-textarea"} value={val}
        onChange={e => setVal(e.target.value)} onBlur={commit}
        onKeyDown={e => { if (e.key === "Escape") { setVal(value); setEditing(false); } }} />
    );
    return (
      <input ref={ref} className={className + " editable-input"} value={val}
        onChange={e => setVal(e.target.value)} onBlur={commit}
        onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setVal(value); setEditing(false); } }} />
    );
  }
  return (
    <Tag className={className + " editable-field"} onClick={() => setEditing(true)} title="Click to edit">
      {val || <span style={{ color: "var(--muted2)", fontStyle: "italic" }}>{placeholder}</span>}
    </Tag>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ show: false, msg: "" });
  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2800);
  }, []);
  return [toast, showToast];
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// ─── IMAGE CAROUSEL ───────────────────────────────────────────────────────────
function ImageCarousel({ images, onChange }) {
  const [idx, setIdx] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [capInput, setCapInput] = useState("");
  const cur = images[idx] || null;
  const addImage = () => {
    if (!urlInput.trim()) return;
    const newImgs = [...images, { url: urlInput.trim(), caption: capInput.trim() || "Image caption" }];
    onChange(newImgs);
    setIdx(newImgs.length - 1);
    setUrlInput(""); setCapInput(""); setAddModal(false);
  };
  const removeImage = () => {
    if (!images.length) return;
    const newImgs = images.filter((_, i) => i !== idx);
    onChange(newImgs);
    setIdx(Math.max(0, idx - 1));
  };
  const updateCaption = (cap) => {
    const newImgs = images.map((img, i) => i === idx ? { ...img, caption: cap } : img);
    onChange(newImgs);
  };
  return (
    <div className="img-block" style={{ position: "relative" }}>
      {images.length === 0 ? (
        <div className="img-placeholder">
          <i className="fa-solid fa-image" />
          <span>No images added yet</span>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => setAddModal(true)}><i className="fa-solid fa-plus" /> Add Image</button>
        </div>
      ) : (
        <>
          <div style={{ position: "relative" }}>
            <img src={cur.url} alt={cur.caption} style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }}
              onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            />
            <div className="img-placeholder" style={{ display: "none" }}>
              <i className="fa-solid fa-image" />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{cur.url}</span>
            </div>
            {images.length > 1 && (
              <>
                <button className="carousel-nav carousel-prev" onClick={() => setIdx((idx - 1 + images.length) % images.length)}><i className="fa-solid fa-chevron-left" /></button>
                <button className="carousel-nav carousel-next" onClick={() => setIdx((idx + 1) % images.length)}><i className="fa-solid fa-chevron-right" /></button>
                <div className="carousel-dots">
                  {images.map((_, i) => <span key={i} className={"carousel-dot" + (i === idx ? " active" : "")} onClick={() => setIdx(i)} />)}
                </div>
              </>
            )}
            <div className="img-edit-bar">
              <button className="img-edit-btn" onClick={() => setAddModal(true)}><i className="fa-solid fa-plus" /> Add</button>
              <button className="img-edit-btn" onClick={removeImage}><i className="fa-solid fa-trash" /> Remove</button>
              <span style={{ fontSize: 10, color: "var(--muted2)", fontFamily: "'DM Mono',monospace" }}>{idx + 1}/{images.length}</span>
            </div>
          </div>
          <div className="img-caption">
            <Editable value={cur.caption} onChange={updateCaption} placeholder="Add caption..." />
          </div>
        </>
      )}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Image">
        <label className="modal-lbl">Image URL</label>
        <input className="text-input" style={{ width: "100%", marginBottom: 10 }} value={urlInput}
          onChange={e => setUrlInput(e.target.value)} placeholder="https://example.com/image.png" />
        <label className="modal-lbl">Caption</label>
        <input className="text-input" style={{ width: "100%" }} value={capInput}
          onChange={e => setCapInput(e.target.value)} placeholder="Image caption..." />
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button className="btn btn-primary" onClick={addImage}><i className="fa-solid fa-plus" /> Add Image</button>
          <button className="btn btn-ghost" onClick={() => setAddModal(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── CODE EDITOR ──────────────────────────────────────────────────────────────
function CodeEditor({ block, onChange, onDelete }) {
  const [editMode, setEditMode] = useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText(block.code).then(() => {}).catch(() => {});
  };
  return (
    <div className="code-block" style={{ position: "relative" }}>
      <div className="code-header">
        <div className="code-lang-badge">
          <span className="lang-dot ld-red" /><span className="lang-dot ld-yellow" /><span className="lang-dot ld-green" />
          <Editable value={block.lang} onChange={v => onChange({ ...block, lang: v })} className="code-lang-name" placeholder="python" />
        </div>
        <Editable value={block.title} onChange={v => onChange({ ...block, title: v })} className="code-title-text" placeholder="Code title..." />
        <div style={{ display: "flex", gap: 6 }}>
          <button className="copy-btn" onClick={() => setEditMode(!editMode)}><i className="fa-solid fa-pen" /> {editMode ? "Done" : "Edit"}</button>
          <button className="copy-btn" onClick={copyCode}><i className="fa-regular fa-copy" /> Copy</button>
          <button className="copy-btn" onClick={onDelete} style={{ color: "#ff6b6b" }}><i className="fa-solid fa-trash" /></button>
        </div>
      </div>
      <div className="code-body">
        {editMode ? (
          <textarea value={block.code} onChange={e => onChange({ ...block, code: e.target.value })}
            style={{ width: "100%", minHeight: 180, background: "transparent", border: "none", outline: "none", fontFamily: "'DM Mono',monospace", fontSize: 12, lineHeight: 1.7, color: "#d4d4d4", resize: "vertical" }} />
        ) : (
          <pre style={{ margin: 0, fontFamily: "'DM Mono',monospace", fontSize: 12, lineHeight: 1.7, color: "#d4d4d4", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{block.code}</pre>
        )}
      </div>
    </div>
  );
}

// ─── QUIZ EDITOR ──────────────────────────────────────────────────────────────
function QuizBlock({ quizzes, onChange }) {
  const [activeQ, setActiveQ] = useState(0);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [addModal, setAddModal] = useState(false);
  const [newQ, setNewQ] = useState({ question: "", options: ["", "", "", ""], correct: "A", explanation: "" });

  const addQuiz = () => {
    if (!newQ.question.trim()) return;
    onChange([...quizzes, { ...newQ, id: Date.now() }]);
    setNewQ({ question: "", options: ["", "", "", ""], correct: "A", explanation: "" });
    setAddModal(false);
  };
  const removeQuiz = (i) => { onChange(quizzes.filter((_, qi) => qi !== i)); if (activeQ >= quizzes.length - 1) setActiveQ(Math.max(0, activeQ - 1)); };
  const updateQuiz = (i, data) => { onChange(quizzes.map((q, qi) => qi === i ? { ...q, ...data } : q)); };

  const letters = ["A", "B", "C", "D"];
  const q = quizzes[activeQ];

  const submit = () => {
    const ans = selected[activeQ];
    if (!ans) return;
    setSubmitted({ ...submitted, [activeQ]: true });
  };

  return (
    <div>
      {quizzes.length > 1 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          {quizzes.map((qu, i) => (
            <button key={i} className={"diff-tab" + (i === activeQ ? " active" : "")} style={{ fontSize: 11 }} onClick={() => setActiveQ(i)}>Q{i + 1}</button>
          ))}
        </div>
      )}
      {q && (
        <div className="quiz-block">
          <div className="quiz-header">
            <span className="quiz-badge">📝 Quiz {activeQ + 1}/{quizzes.length}</span>
            <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
              <button className="copy-btn" onClick={() => removeQuiz(activeQ)} style={{ color: "#ff6b6b" }}><i className="fa-solid fa-trash" /></button>
            </div>
          </div>
          <Editable value={q.question} onChange={v => updateQuiz(activeQ, { question: v })} className="quiz-q" multiline placeholder="Enter question..." />
          <div className="quiz-options" style={{ marginBottom: 14 }}>
            {letters.map((l, li) => {
              const isCorrect = q.correct === l;
              const isSelected = selected[activeQ] === l;
              const isSubmitted = submitted[activeQ];
              let cls = "quiz-opt";
              if (isSubmitted) { if (isCorrect) cls += " correct"; else if (isSelected && !isCorrect) cls += " wrong"; }
              else if (isSelected) cls += " selected";
              return (
                <div key={l} className={cls} onClick={() => !isSubmitted && setSelected({ ...selected, [activeQ]: l })}>
                  <div className="opt-letter">{l}</div>
                  <div className="opt-text" style={{ flex: 1 }}>
                    <Editable value={q.options[li]} onChange={v => { const opts = [...q.options]; opts[li] = v; updateQuiz(activeQ, { options: opts }); }} placeholder={`Option ${l}...`} />
                  </div>
                  <span style={{ fontSize: 10, marginLeft: 8, cursor: "pointer", color: isCorrect ? "var(--green-mid)" : "var(--muted2)" }}
                    onClick={e => { e.stopPropagation(); updateQuiz(activeQ, { correct: l }); }} title="Set as correct">
                    {isCorrect ? "✓ Correct" : "Set correct"}
                  </span>
                </div>
              );
            })}
          </div>
          {submitted[activeQ] && (
            <div className="quiz-explanation show">
              <i className="fa-solid fa-check-circle" style={{ marginRight: 6, color: "var(--green-mid)" }} />
              <Editable value={q.explanation} onChange={v => updateQuiz(activeQ, { explanation: v })} multiline placeholder="Add explanation..." />
            </div>
          )}
          {!submitted[activeQ] && (
            <button className="quiz-submit" onClick={submit}><i className="fa-solid fa-paper-plane" /> Submit Answer</button>
          )}
        </div>
      )}
      <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => setAddModal(true)}><i className="fa-solid fa-plus" /> Add Question</button>
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Quiz Question">
        <label className="modal-lbl">Question</label>
        <textarea className="text-input" style={{ width: "100%", marginBottom: 10, minHeight: 60 }} value={newQ.question}
          onChange={e => setNewQ({ ...newQ, question: e.target.value })} placeholder="Enter question..." />
        {letters.map((l, li) => (
          <div key={l} style={{ marginBottom: 8 }}>
            <label className="modal-lbl">{l}. Option</label>
            <input className="text-input" style={{ width: "100%" }} value={newQ.options[li]}
              onChange={e => { const o = [...newQ.options]; o[li] = e.target.value; setNewQ({ ...newQ, options: o }); }} placeholder={`Option ${l}`} />
          </div>
        ))}
        <label className="modal-lbl">Correct Answer</label>
        <select className="text-input" style={{ width: "100%", marginBottom: 10 }} value={newQ.correct}
          onChange={e => setNewQ({ ...newQ, correct: e.target.value })}>
          {letters.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <label className="modal-lbl">Explanation</label>
        <textarea className="text-input" style={{ width: "100%", marginBottom: 14 }} value={newQ.explanation}
          onChange={e => setNewQ({ ...newQ, explanation: e.target.value })} placeholder="Explain the correct answer..." />
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" onClick={addQuiz}><i className="fa-solid fa-plus" /> Add Question</button>
          <button className="btn btn-ghost" onClick={() => setAddModal(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── VIDEO BLOCK ──────────────────────────────────────────────────────────────
function VideoBlocks({ videos, onChange }) {
  const [addModal, setAddModal] = useState(false);
  const [newV, setNewV] = useState({ url: "", title: "", meta: "", duration: "", required: true });
  const getYTId = (url) => {
    const m = url.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  };
  const addVideo = () => {
    if (!newV.url.trim()) return;
    onChange([...videos, { ...newV, id: Date.now() }]);
    setNewV({ url: "", title: "", meta: "", duration: "", required: true });
    setAddModal(false);
  };
  const removeVideo = (i) => onChange(videos.filter((_, vi) => vi !== i));
  const updateVideo = (i, data) => onChange(videos.map((v, vi) => vi === i ? { ...v, ...data } : v));

  return (
    <div>
      {videos.map((v, i) => {
        const ytId = getYTId(v.url);
        return (
          <div key={v.id || i} className="video-block" style={{ position: "relative" }}>
            <div className="video-thumb" style={{ cursor: "pointer" }} onClick={() => v.url && window.open(v.url, "_blank")}>
              {ytId ? (
                <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt={v.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0, opacity: 0.7 }} />
              ) : null}
              <div className="play-btn" style={{ position: "relative", zIndex: 2 }}><i className="fa-solid fa-play" /></div>
              {v.duration && <div className="video-dur-badge">{v.duration}</div>}
            </div>
            <div className="video-info">
              <div className="yt-icon"><i className="fa-brands fa-youtube" /></div>
              <div style={{ flex: 1 }}>
                <Editable value={v.title} onChange={val => updateVideo(i, { title: val })} className="video-title" placeholder="Video title..." />
                <Editable value={v.meta} onChange={val => updateVideo(i, { meta: val })} className="video-meta" placeholder="YouTube · duration · description" />
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span className={"chip" + (v.required ? " chip-green" : "")} style={{ fontSize: 10, cursor: "pointer" }}
                  onClick={() => updateVideo(i, { required: !v.required })}>
                  {v.required ? "Required" : "Optional"}
                </span>
                <button style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 12 }} onClick={() => removeVideo(i)}><i className="fa-solid fa-trash" /></button>
              </div>
            </div>
          </div>
        );
      })}
      <button className="btn btn-ghost btn-sm" onClick={() => setAddModal(true)}><i className="fa-solid fa-plus" /> Add Video</button>
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Video">
        <label className="modal-lbl">YouTube / Video URL</label>
        <input className="text-input" style={{ width: "100%", marginBottom: 10 }} value={newV.url}
          onChange={e => setNewV({ ...newV, url: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
        <label className="modal-lbl">Title</label>
        <input className="text-input" style={{ width: "100%", marginBottom: 10 }} value={newV.title}
          onChange={e => setNewV({ ...newV, title: e.target.value })} placeholder="Video title" />
        <label className="modal-lbl">Meta (channel, duration)</label>
        <input className="text-input" style={{ width: "100%", marginBottom: 10 }} value={newV.meta}
          onChange={e => setNewV({ ...newV, meta: e.target.value })} placeholder="YouTube · 10 min · Overview" />
        <label className="modal-lbl">Duration</label>
        <input className="text-input" style={{ width: "100%", marginBottom: 10 }} value={newV.duration}
          onChange={e => setNewV({ ...newV, duration: e.target.value })} placeholder="10:30" />
        <label className="modal-lbl">Type</label>
        <select className="text-input" style={{ width: "100%", marginBottom: 14 }} value={newV.required ? "required" : "optional"}
          onChange={e => setNewV({ ...newV, required: e.target.value === "required" })}>
          <option value="required">Required</option>
          <option value="optional">Optional</option>
        </select>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" onClick={addVideo}><i className="fa-solid fa-plus" /> Add</button>
          <button className="btn btn-ghost" onClick={() => setAddModal(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── CONTENT BLOCK RENDERER ───────────────────────────────────────────────────
function ContentSection({ section, onChange, onDelete, onMoveUp, onMoveDown }) {
  const { type } = section;
  const upd = (data) => onChange({ ...section, ...data });

  if (type === "concept") return (
    <div className="concept-block" style={{ position: "relative", borderColor: section.borderColor || "var(--blue-mid)" }}>
      <div className="block-controls">
        <button onClick={onMoveUp}><i className="fa-solid fa-arrow-up" /></button>
        <button onClick={onMoveDown}><i className="fa-solid fa-arrow-down" /></button>
        <button onClick={onDelete}><i className="fa-solid fa-trash" /></button>
      </div>
      <Editable value={section.head} onChange={v => upd({ head: v })} className="concept-head" placeholder="Concept heading..." />
      <Editable value={section.body} onChange={v => upd({ body: v })} className="concept-body" tag="div" multiline placeholder="Concept explanation..." />
    </div>
  );

  if (type === "analogy") return (
    <div className="analogy-block" style={{ position: "relative" }}>
      <div className="block-controls">
        <button onClick={onMoveUp}><i className="fa-solid fa-arrow-up" /></button>
        <button onClick={onMoveDown}><i className="fa-solid fa-arrow-down" /></button>
        <button onClick={onDelete}><i className="fa-solid fa-trash" /></button>
      </div>
      <div className="analogy-icon"><Editable value={section.emoji} onChange={v => upd({ emoji: v })} placeholder="🍕" /></div>
      <div>
        <div className="analogy-title"><Editable value={section.title} onChange={v => upd({ title: v })} placeholder="Analogy title..." /></div>
        <div className="analogy-text"><Editable value={section.text} onChange={v => upd({ text: v })} tag="div" multiline placeholder="Analogy text..." /></div>
      </div>
    </div>
  );

  if (type === "images") return (
    <div style={{ position: "relative", marginBottom: 14 }}>
      <div className="block-controls">
        <button onClick={onMoveUp}><i className="fa-solid fa-arrow-up" /></button>
        <button onClick={onMoveDown}><i className="fa-solid fa-arrow-down" /></button>
        <button onClick={onDelete}><i className="fa-solid fa-trash" /></button>
      </div>
      <ImageCarousel images={section.images || []} onChange={imgs => upd({ images: imgs })} />
    </div>
  );

  if (type === "callout") {
    const calloutTypes = ["tip", "warning", "important"];
    return (
      <div className={`callout callout-${section.calloutType || "tip"}`} style={{ position: "relative" }}>
        <div className="block-controls">
          <button onClick={onMoveUp}><i className="fa-solid fa-arrow-up" /></button>
          <button onClick={onMoveDown}><i className="fa-solid fa-arrow-down" /></button>
          <button onClick={onDelete}><i className="fa-solid fa-trash" /></button>
        </div>
        <i className={`fa-solid ${section.calloutType === "tip" ? "fa-lightbulb" : section.calloutType === "warning" ? "fa-triangle-exclamation" : "fa-circle-info"} callout-icon`} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Editable value={section.label} onChange={v => upd({ label: v })} className="callout-label" placeholder="Label..." />
            <select style={{ fontSize: 10, border: "1px solid var(--border)", borderRadius: 4, background: "transparent", cursor: "pointer" }}
              value={section.calloutType || "tip"} onChange={e => upd({ calloutType: e.target.value })}>
              {calloutTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Editable value={section.text} onChange={v => upd({ text: v })} className="callout-text" tag="div" multiline placeholder="Callout content..." />
        </div>
      </div>
    );
  }

  if (type === "code") return (
    <div style={{ position: "relative", marginBottom: 14 }}>
      <div className="block-controls">
        <button onClick={onMoveUp}><i className="fa-solid fa-arrow-up" /></button>
        <button onClick={onMoveDown}><i className="fa-solid fa-arrow-down" /></button>
        <button onClick={onDelete}><i className="fa-solid fa-trash" /></button>
      </div>
      <CodeEditor block={section} onChange={data => onChange({ ...section, ...data })} onDelete={onDelete} />
    </div>
  );

  if (type === "keypoints") return (
    <div className="keypoints-block" style={{ position: "relative", marginBottom: 14 }}>
      <div className="block-controls">
        <button onClick={onMoveUp}><i className="fa-solid fa-arrow-up" /></button>
        <button onClick={onMoveDown}><i className="fa-solid fa-arrow-down" /></button>
        <button onClick={onDelete}><i className="fa-solid fa-trash" /></button>
      </div>
      <div className="kp-title"><i className="fa-solid fa-key" /><Editable value={section.title} onChange={v => upd({ title: v })} placeholder="Key Points title..." /></div>
      <div className="kp-list">
        {(section.points || []).map((pt, i) => (
          <div key={i} className="kp-item">
            <div className="kp-bullet"><i className="fa-solid fa-check" /></div>
            <Editable value={pt} onChange={v => { const pts = [...(section.points || [])]; pts[i] = v; upd({ points: pts }); }} placeholder="Key point..." />
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 11 }}
              onClick={() => { const pts = (section.points || []).filter((_, pi) => pi !== i); upd({ points: pts }); }}><i className="fa-solid fa-xmark" /></button>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }}
          onClick={() => upd({ points: [...(section.points || []), "New point..."] })}>
          <i className="fa-solid fa-plus" /> Add Point
        </button>
      </div>
    </div>
  );

  if (type === "videos") return (
    <div style={{ position: "relative", marginBottom: 14 }}>
      <div className="block-controls">
        <button onClick={onMoveUp}><i className="fa-solid fa-arrow-up" /></button>
        <button onClick={onMoveDown}><i className="fa-solid fa-arrow-down" /></button>
        <button onClick={onDelete}><i className="fa-solid fa-trash" /></button>
      </div>
      <VideoBlocks videos={section.videos || []} onChange={vids => upd({ videos: vids })} />
    </div>
  );

  if (type === "quiz") return (
    <div style={{ position: "relative", marginBottom: 14 }}>
      <div className="block-controls">
        <button onClick={onMoveUp}><i className="fa-solid fa-arrow-up" /></button>
        <button onClick={onMoveDown}><i className="fa-solid fa-arrow-down" /></button>
        <button onClick={onDelete}><i className="fa-solid fa-trash" /></button>
      </div>
      <QuizBlock quizzes={section.quizzes || []} onChange={qs => upd({ quizzes: qs })} />
    </div>
  );

  return null;
}

// ─── ADD BLOCK MENU ───────────────────────────────────────────────────────────
function AddBlockMenu({ onAdd }) {
  const [open, setOpen] = useState(false);
  const blocks = [
    { type: "concept", label: "📖 Concept Block", default: { head: "Concept Heading", body: "Concept explanation here..." } },
    { type: "analogy", label: "💡 Analogy Block", default: { emoji: "🍕", title: "Simple Analogy", text: "Analogy text here..." } },
    { type: "images", label: "🖼️ Image Gallery", default: { images: [] } },
    { type: "callout", label: "📢 Callout", default: { calloutType: "tip", label: "Pro Tip", text: "Callout content..." } },
    { type: "code", label: "💻 Code Block", default: { lang: "python", title: "Code Example", code: "# Your code here\nprint('Hello World')" } },
    { type: "keypoints", label: "⚡ Key Points", default: { title: "Key Takeaways", points: ["First point", "Second point"] } },
    { type: "videos", label: "🎥 Video Resources", default: { videos: [] } },
    { type: "quiz", label: "📝 Quiz", default: { quizzes: [] } },
  ];
  return (
    <div style={{ position: "relative", marginBottom: 14 }}>
      <button className="btn btn-ghost" style={{ width: "100%", borderStyle: "dashed", color: "var(--muted)" }}
        onClick={() => setOpen(!open)}>
        <i className="fa-solid fa-plus" /> Add Content Block
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", zIndex: 200, padding: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {blocks.map(b => (
              <button key={b.type} className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}
                onClick={() => { onAdd({ type: b.type, id: Date.now(), ...b.default }); setOpen(false); }}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LEARNING DAY SCREEN ──────────────────────────────────────────────────────
function LearningDayScreen({ day, onChange, onComplete }) {
  const d = day;
  const upd = (data) => onChange({ ...d, ...data });
  const updateSection = (i, sec) => { const s = [...d.sections]; s[i] = sec; upd({ sections: s }); };
  const deleteSection = (i) => { upd({ sections: d.sections.filter((_, si) => si !== i) }); };
  const moveUp = (i) => { if (i === 0) return; const s = [...d.sections]; [s[i - 1], s[i]] = [s[i], s[i - 1]]; upd({ sections: s }); };
  const moveDown = (i) => { if (i >= d.sections.length - 1) return; const s = [...d.sections]; [s[i], s[i + 1]] = [s[i + 1], s[i]]; upd({ sections: s }); };
  const addSection = (sec) => upd({ sections: [...d.sections, sec] });

  return (
    <div>
      {/* Hero */}
      <div className="hero-banner hero-learn fade d1">
        <div className="hero-top">
          <div className="hero-emoji">
            <Editable value={d.emoji} onChange={v => upd({ emoji: v })} placeholder="🤖" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="chip" style={{ background: "var(--blue-light)", color: "var(--blue)", borderColor: "#93c5fd", fontSize: 10 }}>Day {d.dayNum}</span>
              <span className="chip chip-green" style={{ fontSize: 10 }}>Learning Day</span>
              <span className="chip" style={{ background: "var(--bg)", color: "var(--muted)", borderColor: "var(--border)", fontSize: 10 }}>
                <i className="fa-regular fa-clock" style={{ fontSize: 9 }} /> <Editable value={d.duration} onChange={v => upd({ duration: v })} placeholder="75 min" />
              </span>
            </div>
            <Editable value={d.title} onChange={v => upd({ title: v })} className="hero-head" placeholder="Day title..." />
            <Editable value={d.subtitle} onChange={v => upd({ subtitle: v })} className="hero-sub" tag="div" multiline placeholder="Day description..." />
          </div>
        </div>
        <div className="wyl-list">
          <div className="wyl-lbl"><i className="fa-solid fa-graduation-cap" style={{ marginRight: 4 }} />What you will learn today</div>
          <div className="wyl-items">
            {(d.learnPoints || []).map((pt, i) => (
              <div key={i} className="wyl-item">
                <i className="fa-solid fa-check" />
                <Editable value={pt} onChange={v => { const pts = [...d.learnPoints]; pts[i] = v; upd({ learnPoints: pts }); }} placeholder="Learning point..." />
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 11 }}
                  onClick={() => upd({ learnPoints: d.learnPoints.filter((_, pi) => pi !== i) })}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, fontSize: 11 }}
            onClick={() => upd({ learnPoints: [...(d.learnPoints || []), "New learning point"] })}>
            <i className="fa-solid fa-plus" /> Add Point
          </button>
        </div>
      </div>

      {/* Sections */}
      {d.sections.map((sec, i) => (
        <div key={sec.id || i} className="card fade" style={{ animationDelay: `${0.04 * (i + 2)}s` }}>
          <ContentSection section={sec} onChange={s => updateSection(i, s)} onDelete={() => deleteSection(i)}
            onMoveUp={() => moveUp(i)} onMoveDown={() => moveDown(i)} />
        </div>
      ))}

      {/* Add Block */}
      <div className="card">
        <AddBlockMenu onAdd={addSection} />
      </div>

      {/* Complete */}
      <div className="card fade d5">
        <button className={"complete-btn" + (d.completed ? " done" : "")} onClick={onComplete}>
          <i className="fa-solid fa-check-circle" /> {d.completed ? `Day ${d.dayNum} Completed! ✅` : `Mark Day ${d.dayNum} as Complete`}
        </button>
      </div>
    </div>
  );
}

// ─── TASK DAY SCREEN ──────────────────────────────────────────────────────────
function TaskDayScreen({ day, onChange, showToast }) {
  const d = day;
  const upd = (data) => onChange({ ...d, ...data });
  const [checked, setChecked] = useState({});
  const [gitUrl, setGitUrl] = useState("");
  const [diff, setDiff] = useState("int");

  const letters = ["A", "B", "C", "D"];
  const diffLabels = { beg: "🟢 Beginner", int: "🟡 Intermediate", adv: "🔴 Advanced" };
  const diffColors = { beg: "req-box-beg", int: "req-box-int", adv: "req-box-adv" };

  const submitTask = () => {
    if (!gitUrl.trim()) { showToast("GitHub URL paste karo pehle!"); return; }
    if (!gitUrl.startsWith("https://github.com/")) { showToast("Valid GitHub URL chahiye — https://github.com/..."); return; }
    showToast("Submitted! AI review 2-5 min mein complete hoga 🤖");
    setGitUrl("");
  };

  return (
    <div>
      {/* Task Hero */}
      <div className="task-hero fade d1">
        <div className="task-hero-top">
          <div className="task-day-badge"><i className="fa-solid fa-bolt" style={{ fontSize: 9 }} />Task Day · Day {d.dayNum} of {d.totalDays}</div>
          <div className="task-title-big">
            <Editable value={d.taskPrefix} onChange={v => upd({ taskPrefix: v })} placeholder="Task 1 —" />
            {" "}<em><Editable value={d.title} onChange={v => upd({ title: v })} placeholder="Task title..." /></em>
          </div>
          <div className="task-desc">
            <Editable value={d.description} onChange={v => upd({ description: v })} tag="div" multiline placeholder="Task description..." />
          </div>
          <div className="task-hero-stats">
            <div className="th-stat"><i className="fa-solid fa-clock" /><Editable value={d.estimated} onChange={v => upd({ estimated: v })} placeholder="3–4 hours" /></div>
            <div className="th-stat"><i className="fa-solid fa-calendar" />Due: <Editable value={d.due} onChange={v => upd({ due: v })} placeholder="11:59 PM Today" /></div>
            <div className="th-stat"><i className="fa-solid fa-rotate" />Max <Editable value={d.maxAttempts} onChange={v => upd({ maxAttempts: v })} placeholder="2" /> attempts</div>
            <div className="th-stat"><i className="fa-solid fa-trophy" />Pass: <Editable value={d.passScore} onChange={v => upd({ passScore: v })} placeholder="60/100" /></div>
          </div>
        </div>
        <div className="task-hero-body">
          <div style={{ fontSize: 11, color: "var(--amber)", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 8, fontWeight: 600 }}>
            <i className="fa-solid fa-book-open" style={{ marginRight: 5 }} />Pre-Task Reminder
          </div>
          <Editable value={d.reminder} onChange={v => upd({ reminder: v })} className="task-desc" tag="div" multiline placeholder="Pre-task reminder..." />
        </div>
      </div>

      {/* Difficulty */}
      <div className="card fade d2">
        <div className="card-title"><i className="fa-solid fa-sliders" />Choose Your Difficulty Level</div>
        <div className="diff-tabs">
          {["beg", "int", "adv"].map(lv => (
            <div key={lv} className={"diff-tab" + (diff === lv ? " active" : "")} onClick={() => setDiff(lv)}>{diffLabels[lv]}</div>
          ))}
        </div>
        {["beg", "int", "adv"].map(lv => (
          <div key={lv} className={"diff-content" + (diff === lv ? " active" : "")}>
            <div className={`req-box ${diffColors[lv]}`}>
              <div className="req-title">{diffLabels[lv]} Requirements</div>
              <div className="req-list">
                {(d.requirements[lv] || []).map((req, i) => (
                  <div key={i} className="req-item" style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                    <span style={{ flexShrink: 0, fontSize: 11, marginTop: 1 }}>→</span>
                    <Editable value={req} onChange={v => {
                      const reqs = { ...d.requirements };
                      reqs[lv] = [...(reqs[lv] || [])];
                      reqs[lv][i] = v;
                      upd({ requirements: reqs });
                    }} placeholder="Requirement..." />
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 11, flexShrink: 0 }}
                      onClick={() => {
                        const reqs = { ...d.requirements };
                        reqs[lv] = (reqs[lv] || []).filter((_, ri) => ri !== i);
                        upd({ requirements: reqs });
                      }}><i className="fa-solid fa-xmark" /></button>
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => {
                  const reqs = { ...d.requirements };
                  reqs[lv] = [...(reqs[lv] || []), "New requirement..."];
                  upd({ requirements: reqs });
                }}><i className="fa-solid fa-plus" /> Add Requirement</button>
              </div>
            </div>
            <div className="tags-row">
              {(d.tags[lv] || []).map((tag, i) => (
                <span key={i} className="tag" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {tag}
                  <span style={{ cursor: "pointer", fontSize: 10 }} onClick={() => {
                    const t = { ...d.tags }; t[lv] = (t[lv] || []).filter((_, ti) => ti !== i); upd({ tags: t });
                  }}>×</span>
                </span>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => {
                const tagName = prompt("Tag name:");
                if (!tagName) return;
                const t = { ...d.tags }; t[lv] = [...(t[lv] || []), tagName]; upd({ tags: t });
              }}><i className="fa-solid fa-plus" /> Tag</button>
            </div>
          </div>
        ))}
      </div>

      {/* Starter Code */}
      <div className="card fade d3">
        <div className="card-title"><i className="fa-solid fa-code" />Starter Code</div>
        <CodeEditor block={d.starterCode} onChange={sc => upd({ starterCode: sc })} onDelete={() => {}} />
      </div>

      {/* AI Scoring */}
      <div className="card fade d4">
        <div className="card-title"><i className="fa-solid fa-robot" />AI Scoring Breakdown</div>
        <div className="scoring-grid">
          {(d.scoring || []).map((s, i) => (
            <div key={i} className={"score-item" + (s.isPass ? " pass-score" : "")}>
              <div className="score-val">
                <Editable value={String(s.val)} onChange={v => {
                  const sc = [...d.scoring]; sc[i] = { ...sc[i], val: v }; upd({ scoring: sc });
                }} />
                <span className="score-max">/<Editable value={String(s.max)} onChange={v => {
                  const sc = [...d.scoring]; sc[i] = { ...sc[i], max: v }; upd({ scoring: sc });
                }} /></span>
              </div>
              <div className="score-lbl"><Editable value={s.label} onChange={v => {
                const sc = [...d.scoring]; sc[i] = { ...sc[i], label: v }; upd({ scoring: sc });
              }} /></div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3 }}>
                <Editable value={s.desc} onChange={v => {
                  const sc = [...d.scoring]; sc[i] = { ...sc[i], desc: v }; upd({ scoring: sc });
                }} placeholder="Description..." />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist + Submit */}
      <div className="card fade d5">
        <div className="card-title"><i className="fa-solid fa-list-check" />Pre-Submit Checklist</div>
        <div className="checklist">
          {(d.checklist || []).map((item, i) => (
            <div key={i} className={"check-item" + (checked[i] ? " checked" : "")} onClick={() => setChecked({ ...checked, [i]: !checked[i] })}>
              <div className="check-box"><i className="fa-solid fa-check" /></div>
              <Editable value={item} onChange={v => {
                const cl = [...d.checklist]; cl[i] = v; upd({ checklist: cl });
              }} className="check-text" onClick={e => e.stopPropagation()} placeholder="Checklist item..." />
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 11, marginLeft: "auto" }}
                onClick={e => { e.stopPropagation(); upd({ checklist: d.checklist.filter((_, ci) => ci !== i) }); }}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={() => upd({ checklist: [...(d.checklist || []), "New checklist item"] })}>
            <i className="fa-solid fa-plus" /> Add Item
          </button>
        </div>
        <div className="submit-box">
          <div className="submit-lbl"><i className="fa-brands fa-github" style={{ marginRight: 5 }} />Submit Your GitHub Repository</div>
          <div className="input-row">
            <input className="text-input" type="url" value={gitUrl} onChange={e => setGitUrl(e.target.value)} placeholder="https://github.com/username/repo-name" />
            <button className="btn btn-primary" onClick={submitTask}><i className="fa-solid fa-paper-plane" /> Submit</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => showToast("AI Help: Ask anything about today task!")}><i className="fa-solid fa-robot" /> Ask AI Help</button>
          <button className="btn btn-ghost btn-sm" onClick={() => showToast("Discussion board open!")}><i className="fa-solid fa-comments" /> Discussion</button>
          <button className="btn btn-ghost btn-sm" onClick={() => showToast("Rubric: Check scoring section above")}><i className="fa-solid fa-list-check" /> View Rubric</button>
        </div>
        <div className="callout callout-important">
          <i className="fa-solid fa-circle-info callout-icon" />
          <div>
            <div className="callout-label">After Submit</div>
            <Editable value={d.afterSubmitNote} onChange={v => upd({ afterSubmitNote: v })} className="callout-text" tag="div" multiline placeholder="After submit instructions..." />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SETUP WIZARD ─────────────────────────────────────────────────────────────
const DOMAIN_OPTIONS = [
  { id: "aiml", label: "AI/ML Engineering", icon: "fa-robot", color: "var(--green-mid)" },
  { id: "web", label: "Full Stack Web Dev", icon: "fa-globe", color: "var(--blue-mid)" },
  { id: "data", label: "Data Science", icon: "fa-chart-bar", color: "var(--purple-mid)" },
  { id: "cyber", label: "Cybersecurity", icon: "fa-shield-halved", color: "var(--red-mid)" },
  { id: "cloud", label: "Cloud & DevOps", icon: "fa-cloud", color: "var(--amber-mid)" },
  { id: "mobile", label: "Mobile Dev", icon: "fa-mobile-screen", color: "var(--orange-mid)" },
];

function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState(null);
  const [trackName, setTrackName] = useState("");
  const [days, setDays] = useState(15);
  const [userName, setUserName] = useState("");
  const [plan, setPlan] = useState("Pro");

  const canNext1 = domain !== null;
  const canNext2 = trackName.trim().length > 0;
  const canNext3 = days >= 5 && days <= 60 && userName.trim().length > 0;

  return (
    <div style={{ height: "100%", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 560 }}>

        {/* Steps indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: step >= s ? "var(--green-mid)" : "var(--bg2)", border: "1px solid",
                borderColor: step >= s ? "var(--green-mid)" : "var(--border)",
                color: step >= s ? "#fff" : "var(--muted)", fontSize: 13, fontWeight: 700
              }}>{s}</div>
              {s < 3 && <div style={{ width: 40, height: 2, background: step > s ? "var(--green-mid)" : "var(--border)", borderRadius: 2 }} />}
            </div>
          ))}
        </div>

        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 32, boxShadow: "var(--shadow-lg)" }}>

          {/* Step 1: Domain */}
          {step === 1 && (
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Select Domain</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Choose the internship domain you want to create</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {DOMAIN_OPTIONS.map(d => (
                  <div key={d.id} onClick={() => setDomain(d.id)}
                    style={{
                      padding: "16px 14px", borderRadius: "var(--radius-lg)", border: "2px solid",
                      borderColor: domain === d.id ? d.color : "var(--border)",
                      background: domain === d.id ? "var(--green-bg)" : "var(--bg)",
                      cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", gap: 12
                    }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: domain === d.id ? d.color : "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className={`fa-solid ${d.icon}`} style={{ color: domain === d.id ? "#fff" : "var(--muted)", fontSize: 16 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: domain === d.id ? "var(--green)" : "var(--text)" }}>{d.label}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 24 }} disabled={!canNext1} onClick={() => setStep(2)}>
                Continue <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          )}

          {/* Step 2: Track Name + Days */}
          {step === 2 && (
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Configure Track</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Set up your internship track details</div>
              <label className="modal-lbl">Track / Task Name *</label>
              <input className="text-input" style={{ width: "100%", marginBottom: 16 }} value={trackName}
                onChange={e => setTrackName(e.target.value)} placeholder="e.g. House Price Predictor Challenge" />
              <label className="modal-lbl">Total Days (5–60)</label>
              <div style={{ display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                {[10, 15, 20, 30].map(n => (
                  <button key={n} className={"diff-tab" + (days === n ? " active" : "")} onClick={() => setDays(n)}>{n} Days</button>
                ))}
              </div>
              <input type="number" className="text-input" style={{ width: "100%", marginBottom: 6 }} value={days}
                onChange={e => setDays(Math.max(5, Math.min(60, Number(e.target.value))))} min={5} max={60} />
              <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace", marginBottom: 24 }}>
                Every 5th day will be a Task day. Your track: {Math.floor(days / 5)} tasks, {days - Math.floor(days / 5)} learning days.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}><i className="fa-solid fa-arrow-left" /> Back</button>
                <button className="btn btn-primary" style={{ flex: 1 }} disabled={!canNext2} onClick={() => setStep(3)}>
                  Continue <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: User */}
          {step === 3 && (
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Your Profile</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Almost done! Set up your intern profile</div>
              <label className="modal-lbl">Your Name *</label>
              <input className="text-input" style={{ width: "100%", marginBottom: 16 }} value={userName}
                onChange={e => setUserName(e.target.value)} placeholder="e.g. Het Panchal" />
              <label className="modal-lbl">Plan</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                {["Free", "Pro", "Premium"].map(p => (
                  <button key={p} className={"diff-tab" + (plan === p ? " active" : "")} onClick={() => setPlan(p)}>{p}</button>
                ))}
              </div>

              {/* Summary */}
              <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px 16px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace", marginBottom: 8 }}>TRACK SUMMARY</div>
                <div style={{ fontSize: 13, color: "var(--text)", display: "flex", flexDirection: "column", gap: 5 }}>
                  <div><strong>Domain:</strong> {DOMAIN_OPTIONS.find(d => d.id === domain)?.label}</div>
                  <div><strong>Track:</strong> {trackName}</div>
                  <div><strong>Duration:</strong> {days} days ({Math.floor(days / 5)} task days)</div>
                  <div><strong>Intern:</strong> {userName || "—"} · {plan}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost" onClick={() => setStep(2)}><i className="fa-solid fa-arrow-left" /> Back</button>
                <button className="btn btn-primary" style={{ flex: 1 }} disabled={!canNext3}
                  onClick={() => onComplete({ domain, trackName, days, userName, plan })}>
                  <i className="fa-solid fa-rocket" /> Launch Internship
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DEFAULT DATA GENERATORS ──────────────────────────────────────────────────
function makeDefaultLearningDay(dayNum, totalDays) {
  return {
    dayNum, totalDays, type: "learn", completed: false,
    emoji: "🤖", title: `What is Machine Learning?`, subtitle: "Understand ML fundamentals, its 3 types, real-world applications, and set up your Python environment for the internship.",
    duration: "75 min",
    learnPoints: [
      "What ML is and why it matters in 2025",
      "Real-world ML apps you use daily",
      "3 types: Supervised, Unsupervised, Reinforcement",
      "Setup Python + Jupyter environment"
    ],
    sections: [
      {
        id: 1, type: "concept", head: "📖 Core Concept", body: "<b>ML kya hota hai?</b><br><br>Machine Learning ek AI ka part hai jisme computer data se khud seekhta hai bina explicitly program kiye. Traditional programming mein aap rules likhte the — ML mein aap data dete ho aur machine khud rules discover karti hai.<br><br><b>Simple example:</b> Spam filter — aapne manually rules nahi likhe \"agar email mein 'lottery' hai toh spam hai.\" Aapne 10,000 spam emails dikhaye aur model ne khud patterns seekhe.",
      },
      {
        id: 2, type: "analogy", emoji: "🍕", title: "SIMPLE ANALOGY", text: "Bacche ko pizza pehchanna sikhana — 1000 pizza photos aur 1000 non-pizza photos dikhao. Baccha patterns seekh leta hai (round, cheesy, toppings) bina koi rule bataye. Yahi ML karta hai, but millions of examples ke saath."
      },
      {
        id: 3, type: "images", images: [{ url: "https://r2.careerwizard.ai/aiml/day1/ml-types-diagram.png", caption: "3 Types of Machine Learning — Supervised, Unsupervised aur Reinforcement ka comparison" }]
      },
      {
        id: 4, type: "concept", head: "3 Types of ML — Ek Ek Samjho", body: "<b>1. Supervised Learning</b> — Labelled data dete ho. Model input → output mapping seekhta hai. Example: House price prediction, spam detection, image classification.<br><br><b>2. Unsupervised Learning</b> — Unlabelled data. Model khud groups/patterns dhundta hai. Example: Customer segmentation, anomaly detection, topic modeling.<br><br><b>3. Reinforcement Learning</b> — Agent environment mein actions leta hai, reward/penalty milta hai. Model maximize reward seekhta hai. Example: Chess AI, game bots, robot control."
      },
      {
        id: 5, type: "videos", videos: [
          { url: "https://www.youtube.com/watch?v=zH39E_u3_Gk", title: "Machine Learning in 100 Seconds — Fireship", meta: "YouTube · 2 min · Quick overview", required: true, duration: "1:42" },
          { url: "https://www.youtube.com/watch?v=aircAruvnKk", title: "Neural Networks from Scratch — 3Blue1Brown", meta: "YouTube · 19 min · Deep dive (optional)", required: false, duration: "19:13" }
        ]
      },
      {
        id: 6, type: "concept", head: "💻 Hands-On — Environment Setup", body: ""
      },
      {
        id: 7, type: "callout", calloutType: "tip", label: "BEFORE YOU CODE", text: "Python 3.9+ installed hona chahiye. Check karo: python --version terminal mein. Agar nahi hai toh python.org se install karo pehle."
      },
      {
        id: 8, type: "code", lang: "python", title: "Step 1 — Library Installation", code: "# Terminal mein run karo (not in Python file)\npip install numpy pandas matplotlib scikit-learn jupyter\n\n# Verify installation\npip list | grep -E \"numpy|pandas|matplotlib|scikit\""
      },
      {
        id: 9, type: "code", lang: "python", title: "Step 2 — Test Setup in Jupyter", code: "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn import datasets\n\n# Test karo\nprint(\"NumPy version:\", np.__version__)\nprint(\"Pandas version:\", pd.__version__)\nprint(\"✅ Setup complete! Ready for Day 2.\")\n\n# Jupyter start karo\n# jupyter notebook"
      },
      {
        id: 10, type: "callout", calloutType: "tip", label: "PRO TIP", text: "NumPy aur Pandas — yeh 2 libraries practically har ML project mein use hoti hain. Aaj setup ke baad Day 2 mein inhe properly seekhenge. Aaj ka goal sirf: environment ready karo."
      },
      {
        id: 11, type: "keypoints", title: "Key Takeaways — Day 1", points: [
          "ML = data se patterns seekhna, explicit rules nahi likhne",
          "Supervised: labelled data → predict output",
          "Unsupervised: unlabelled data → find patterns",
          "Reinforcement: reward/penalty se seekhna",
          "Python + Jupyter = industry standard ML setup"
        ]
      },
      {
        id: 12, type: "quiz", quizzes: [{
          id: 1, question: "Supervised Learning mein kya hota hai?",
          options: ["Model ko labelled data diya jata hai", "Model bina data ke seekhta hai", "Model sirf punishment se seekhta hai", "Model khud groups dhundta hai unlabelled data mein"],
          correct: "A", explanation: "Supervised learning requires labeled data mapping inputs to outputs."
        }]
      }
    ]
  };
}

function makeDefaultTaskDay(dayNum, totalDays, trackName) {
  return {
    dayNum, totalDays, type: "task",
    taskPrefix: `Task ${Math.ceil(dayNum / 5)} —`,
    title: trackName || "Project Challenge",
    description: "Apply everything learned in the previous days. Build a complete project and submit on GitHub.",
    estimated: "3–4 hours", due: "11:59 PM Today", maxAttempts: "2", passScore: "60/100",
    reminder: "Review previous days content before starting. Each piece builds on the last.",
    requirements: {
      beg: ["Load dataset and explore it", "Create 2 basic visualizations", "Train a simple model", "Print accuracy/score", "Add README.md"],
      int: ["Use provided dataset with proper preprocessing", "Handle missing values with explanation", "Compare 2 models", "Add cross-validation (k=5)", "Document with Markdown cells in Jupyter"],
      adv: ["Compare 4 models with GridSearchCV tuning", "Use sklearn Pipeline", "Save model with joblib", "Build a simple Streamlit UI", "Deploy and share live URL"]
    },
    tags: {
      beg: ["Python", "Pandas", "Matplotlib"],
      int: ["Python", "Scikit-Learn", "Jupyter", "Cross-Validation"],
      adv: ["Python", "Pipeline", "GridSearchCV", "Streamlit", "Deploy"]
    },
    starterCode: {
      lang: "python", title: "starter_template.py",
      code: `import pandas as pd\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import r2_score\n\n# TODO 1: Load your dataset\n# df = pd.read_csv('data.csv')\n\n# TODO 2: Explore\n# print(df.head())\n# print(df.info())\n\n# TODO 3: Features and target\n# X = df[['feature1', 'feature2']]\n# y = df['target']\n\n# TODO 4: Split\n# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# TODO 5: Train\n# model = LinearRegression()\n# model.fit(X_train, y_train)\n\n# TODO 6: Evaluate\n# y_pred = model.predict(X_test)\n# print(f"R2 Score: {r2_score(y_test, y_pred):.3f}")`
    },
    scoring: [
      { val: "25", max: "25", label: "Correctness", desc: "Task solve hua?" },
      { val: "25", max: "25", label: "Approach", desc: "Logic sahi hai?" },
      { val: "25", max: "25", label: "Code Quality", desc: "Clean + comments" },
      { val: "60", max: "100", label: "Pass Score", desc: "Minimum required", isPass: true }
    ],
    checklist: [
      "GitHub repo public hai (private nahi)", "README.md hai aur project explain karta hai",
      "All cells run successfully", "Model score printed in output", "No API keys in code", "CSV in .gitignore"
    ],
    afterSubmitNote: "AI review 2–5 minutes mein complete hoga. Score aur feedback email pe aayega. Pass (60+) toh next phase unlock hoga."
  };
}

function generateDays(config) {
  const { days, trackName } = config;
  const daysArr = [];
  for (let i = 1; i <= days; i++) {
    if (i % 5 === 0) daysArr.push(makeDefaultTaskDay(i, days, trackName));
    else daysArr.push(makeDefaultLearningDay(i, days));
  }
  return daysArr;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Admintaskpage() {
  const [setup, setSetup] = useState(null);
  const [days, setDays] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [toast, showToast] = useToast();

  const handleSetupComplete = (config) => {
    setSetup(config);
    setDays(generateDays(config));
    setCurrentDay(1);
  };

  const updateDay = (idx, data) => {
    setDays(prev => prev.map((d, i) => i === idx ? data : d));
  };

  const completeDay = (idx) => {
    updateDay(idx, { ...days[idx], completed: true });
    showToast(`Day ${days[idx].dayNum} complete! 🎉`);
    if (idx + 1 < days.length) setCurrentDay(days[idx + 1].dayNum);
  };

  const addDay = () => {
    const newDayNum = days.length + 1;
    const newDay = newDayNum % 5 === 0
      ? makeDefaultTaskDay(newDayNum, newDayNum, setup.trackName)
      : makeDefaultLearningDay(newDayNum, newDayNum);
    setDays(prev => [...prev, newDay]);
    showToast(`Day ${newDayNum} added!`);
  };

  const deleteDay = (idx) => {
    if (days.length <= 1) { showToast("At least 1 day required!"); return; }
    setDays(prev => prev.filter((_, i) => i !== idx));
    if (currentDay > days.length - 1) setCurrentDay(days.length - 1);
    showToast("Day deleted");
  };

  if (!setup) return (
    <div className="cw-admin-builder" style={{ height: "100%" }}>
      <style>{CSS}</style>
      <SetupWizard onComplete={handleSetupComplete} />
    </div>
  );

  const curIdx = days.findIndex(d => d.dayNum === currentDay);
  const curDay = days[curIdx];
  const domain = DOMAIN_OPTIONS.find(d => d.id === setup.domain);
  const completedCount = days.filter(d => d.completed).length;
  const pct = Math.round((completedCount / days.length) * 100);

  return (
    <div className="cw-admin-builder">
      <style>{CSS}</style>
      <div className="shell">


        {/* MAIN */}
        <div className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div className="tb-left">
              <div className="bc">Internship / <span>{curDay ? `Day ${curDay.dayNum} — ${curDay.type === "task" ? "Task Day 🔥" : "Learning"}` : "—"}</span></div>
            </div>
            <div className="tb-right">
              <div className="chip chip-green"><div className="pdot" /><span>Active · Day {currentDay} of {days.length}</span></div>
              <div className="icon-btn" onClick={() => showToast("No new notifications")}><i className="fa-solid fa-bell" /><div className="nb" /></div>
              <div className="icon-btn" onClick={() => showToast("Help center!")}><i className="fa-solid fa-circle-question" /></div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="content">
            {/* Day Navigator */}
            <div className="day-nav fade">
              <div className="day-nav-top">
                <div className="track-info">
                  <div className="track-name-big">{setup.trackName.split(" ").slice(0, 2).join(" ")} <em>{setup.trackName.split(" ").slice(2).join(" ") || "Track"}</em></div>
                  <div className="track-sub">{days.length}-Day Track · {setup.plan} Plan · {domain?.label}</div>
                </div>
                <div className="day-chips">
                  <span className="chip chip-green" style={{ fontSize: 10 }}><i className="fa-solid fa-code" style={{ fontSize: 9 }} />{domain?.label}</span>
                  <button className="btn btn-ghost btn-sm" onClick={addDay}><i className="fa-solid fa-plus" /> Add Day</button>
                </div>
              </div>
              <div className="prog-row">
                <span className="prog-lbl">Progress</span>
                <span className="prog-val">{completedCount} / {days.length} days — {pct}%</span>
              </div>
              <div className="prog-track"><div className="prog-fill" style={{ width: `${pct}%` }} /></div>
              {/* Day Nodes */}
              <div className="day-nodes">
                {days.map((d, i) => {
                  const isToday = d.dayNum === currentDay;
                  const isDone = d.completed;
                  let cls = "dn ";
                  if (isDone) cls += d.type === "task" ? "dn-task-done" : "dn-done";
                  else if (isToday) cls += "dn-today";
                  else if (d.type === "task") cls += "dn-task";
                  else cls += "dn-locked";
                  const showSep = i > 0 && d.dayNum % 5 === 1 && d.dayNum !== 1;
                  return (
                    <span key={d.dayNum} style={{ display: "contents" }}>
                      {showSep && <span className="dn-sep" />}
                      <div className={cls} onClick={() => setCurrentDay(d.dayNum)}>
                        {d.dayNum}
                        <div className="dn-tooltip">{d.type === "task" ? "⚡ Task" : "📖 Learn"} Day {d.dayNum}</div>
                      </div>
                    </span>
                  );
                })}
              </div>
              {/* Delete day button */}
              {curDay && (
                <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace" }}>
                    Viewing Day {currentDay} · {curDay.type === "task" ? "⚡ Task Day" : "📖 Learning Day"}
                  </span>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, color: "var(--red-mid)", borderColor: "var(--red-light)" }}
                    onClick={() => deleteDay(curIdx)}>
                    <i className="fa-solid fa-trash" /> Delete Day
                  </button>
                </div>
              )}
            </div>

            {/* Day Content */}
            {curDay && curDay.type === "learn" && (
              <LearningDayScreen key={currentDay} day={curDay} onChange={d => updateDay(curIdx, d)} onComplete={() => completeDay(curIdx)} />
            )}
            {curDay && curDay.type === "task" && (
              <TaskDayScreen key={currentDay} day={curDay} onChange={d => updateDay(curIdx, d)} showToast={showToast} />
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={"toast" + (toast.show ? " show" : "")}>
        <i className="fa-solid fa-circle-check" /><span>{toast.msg}</span>
      </div>
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
.cw-admin-builder *,.cw-admin-builder *::before,.cw-admin-builder *::after{box-sizing:border-box;}
.cw-admin-builder{font-family:'DM Sans',sans-serif;color:#1a1916;height:100%;width:100%;overflow:hidden;}
.cw-admin-builder button{font-family:inherit;cursor:pointer}
.cw-admin-builder input,.cw-admin-builder select,.cw-admin-builder textarea{font-family:inherit}
:root{
  --white:#ffffff;--bg:#f0eeea;--bg2:#e6e3de;
  --surface:#ffffff;--border:#e0ddd5;--border2:#ccc9be;
  --text:#1a1916;--text2:#48453e;--muted:#8a877e;--muted2:#b8b5ac;
  --green:#166534;--green-mid:#16a34a;--green-light:#dcfce7;--green-bg:#f0fdf4;
  --amber:#92400e;--amber-mid:#d97706;--amber-light:#fef3c7;--amber-bg:#fffbeb;
  --blue:#1e3a8a;--blue-mid:#2563eb;--blue-light:#dbeafe;--blue-bg:#eff6ff;
  --purple:#4c1d95;--purple-mid:#7c3aed;--purple-light:#ede9fe;--purple-bg:#f5f3ff;
  --red:#991b1b;--red-mid:#dc2626;--red-light:#fee2e2;--red-bg:#fef2f2;
  --orange:#9a3412;--orange-mid:#ea580c;--orange-light:#ffedd5;--orange-bg:#fff7ed;
  --radius-sm:6px;--radius-md:10px;--radius-lg:14px;--radius-xl:20px;
  --shadow-sm:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --shadow:0 4px 12px rgba(0,0,0,.07),0 2px 4px rgba(0,0,0,.04);
  --shadow-lg:0 12px 32px rgba(0,0,0,.09),0 4px 8px rgba(0,0,0,.05);
}
.cw-admin-builder .shell{display:flex;height:100%;width:100%}
.sidebar{width:240px;min-width:240px;background:var(--white);border-right:1px solid var(--border);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;z-index:100}
.s-logo{padding:20px 18px 16px;border-bottom:1px solid var(--border)}
.logo-word{font-family:'Fraunces',serif;font-weight:700;font-size:16px;color:var(--text);letter-spacing:-.4px}
.logo-tag{display:inline-flex;align-items:center;gap:4px;margin-top:5px;padding:2px 8px;background:var(--green-light);border:1px solid #86efac;border-radius:100px;font-size:10px;font-family:'DM Mono',monospace;color:var(--green);font-weight:500}
.s-nav{padding:14px 10px;flex:1;overflow-y:auto}
.s-lbl{font-size:9.5px;color:var(--muted2);text-transform:uppercase;letter-spacing:1.2px;font-weight:500;padding:0 8px;margin:12px 0 4px;font-family:'DM Mono',monospace}
.s-lbl:first-child{margin-top:0}
.s-item{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:var(--radius-md);font-size:13px;font-weight:500;color:var(--text2);cursor:pointer;transition:all .15s;margin-bottom:1px;border:1px solid transparent}
.s-item i{width:16px;text-align:center;font-size:13px;flex-shrink:0}
.s-item:hover{background:var(--bg);color:var(--text)}
.s-item.active{background:var(--green-bg);color:var(--green);border-color:#bbf7d0}
.s-bottom{padding:12px 10px;border-top:1px solid var(--border)}
.user-row{display:flex;align-items:center;gap:9px;padding:9px 10px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer}
.u-av{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#166534,#16a34a);display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-weight:700;font-size:13px;color:#fff;flex-shrink:0}
.u-name{font-size:12.5px;font-weight:600;color:var(--text)}
.u-plan{font-size:10px;color:var(--muted);font-family:'DM Mono',monospace;margin-top:1px}
.main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}
.topbar{background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:90;flex-shrink:0}
.tb-left{display:flex;align-items:center;gap:10px}
.bc{font-size:12px;color:var(--muted);font-family:'DM Mono',monospace}
.bc span{color:var(--text);font-weight:500}
.tb-right{display:flex;align-items:center;gap:8px}
.chip{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:100px;font-size:11px;font-weight:500;font-family:'DM Mono',monospace;border:1px solid}
.chip-green{background:var(--green-bg);color:var(--green);border-color:#86efac}
.pdot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:blink 2s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.icon-btn{width:34px;height:34px;border-radius:var(--radius-md);background:var(--bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);font-size:14px;transition:all .15s;position:relative}
.icon-btn:hover{background:var(--bg2);color:var(--text2)}
.nb{position:absolute;top:5px;right:5px;width:6px;height:6px;border-radius:50%;background:var(--red-mid);border:1.5px solid var(--white)}
.content{flex:1;overflow-y:auto;padding:24px}
.day-nav{background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px 22px;margin-bottom:20px;box-shadow:var(--shadow-sm)}
.day-nav-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:10px}
.track-name-big{font-family:'Fraunces',serif;font-size:18px;font-weight:700;color:var(--text);letter-spacing:-.3px}
.track-name-big em{color:var(--green-mid);font-style:italic}
.track-sub{font-size:12px;color:var(--muted);margin-top:3px;font-family:'DM Mono',monospace}
.day-chips{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.prog-row{display:flex;justify-content:space-between;margin-bottom:6px}
.prog-lbl{font-size:11.5px;color:var(--muted)}
.prog-val{font-size:11.5px;color:var(--green-mid);font-weight:600;font-family:'DM Mono',monospace}
.prog-track{height:5px;background:var(--bg2);border-radius:100px;overflow:hidden;margin-bottom:14px}
.prog-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#166534,#16a34a);transition:width .5s}
.day-nodes{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.dn{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;font-family:'DM Mono',monospace;border:1px solid;cursor:pointer;transition:all .18s;position:relative}
.dn-done{background:var(--green-light);border-color:#86efac;color:var(--green)}
.dn-today{background:#16a34a;border-color:#16a34a;color:#fff;box-shadow:0 2px 8px rgba(22,163,74,.35)}
.dn-locked{background:var(--bg);border-color:var(--border);color:var(--muted2)}
.dn-task{background:var(--amber-light);border-color:#fcd34d;color:var(--amber)}
.dn-task-done{background:var(--amber-bg);border-color:#fde68a;color:var(--amber)}
.dn-sep{width:16px;height:1px;background:var(--border2);flex-shrink:0}
.dn-tooltip{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);background:var(--text);color:#fff;font-size:9px;padding:4px 7px;border-radius:5px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s;z-index:10}
.dn:hover .dn-tooltip{opacity:1}
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px 22px;box-shadow:var(--shadow-sm);margin-bottom:16px}
.card-title{font-family:'Fraunces',serif;font-weight:600;font-size:15px;color:var(--text);display:flex;align-items:center;gap:7px;margin-bottom:16px}
.card-title i{font-size:14px;color:var(--muted)}
.hero-banner{border-radius:var(--radius-lg);padding:20px 22px;margin-bottom:16px;border:1px solid}
.hero-learn{background:linear-gradient(135deg,var(--blue-bg),var(--green-bg));border-color:#bfdbfe}
.hero-top{display:flex;align-items:flex-start;gap:16px;margin-bottom:14px}
.hero-emoji{font-size:36px;flex-shrink:0;min-width:40px}
.hero-head{font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:var(--text);letter-spacing:-.3px;margin-bottom:4px;display:block;width:100%}
.hero-sub{font-size:13px;color:var(--text2);line-height:1.6;display:block;width:100%}
.wyl-list{margin-top:12px;padding-top:12px;border-top:1px solid rgba(0,0,0,.06)}
.wyl-lbl{font-size:10.5px;font-family:'DM Mono',monospace;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;font-weight:500}
.wyl-items{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.wyl-item{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--text2);line-height:1.4;flex-wrap:wrap}
.wyl-item i{color:var(--green-mid);font-size:11px;flex-shrink:0}
.sec-lbl{font-family:'Fraunces',serif;font-size:16px;font-weight:700;color:var(--text);margin-bottom:14px;letter-spacing:-.3px}
.concept-block{background:var(--bg);border-radius:var(--radius-md);padding:16px 18px;margin-bottom:14px;border-left:3px solid var(--blue-mid);position:relative}
.concept-head{font-size:14px;font-weight:600;color:var(--text);margin-bottom:8px;display:block;width:100%}
.concept-body{font-size:13px;color:var(--text2);line-height:1.7;display:block;width:100%}
.analogy-block{background:var(--amber-bg);border:1px solid #fde68a;border-radius:var(--radius-md);padding:14px 16px;margin-bottom:14px;display:flex;align-items:flex-start;gap:10px;position:relative}
.analogy-icon{font-size:20px;flex-shrink:0}
.analogy-title{font-size:12px;font-weight:600;color:var(--amber);margin-bottom:4px;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.5px;display:block}
.analogy-text{font-size:12.5px;color:var(--amber);line-height:1.6;display:block}
.img-block{border-radius:var(--radius-lg);overflow:hidden;margin-bottom:0;border:1px solid var(--border);box-shadow:var(--shadow-sm);position:relative}
.img-placeholder{background:linear-gradient(135deg,#e8e6e0,#d4d1c8);height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
.img-placeholder i{font-size:32px;color:var(--muted2)}
.img-placeholder span{font-size:12px;color:var(--muted);font-family:'DM Mono',monospace}
.img-caption{padding:10px 14px;background:var(--bg);font-size:11.5px;color:var(--text2);font-style:italic;border-top:1px solid var(--border)}
.carousel-nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.5);border:none;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;font-size:13px;transition:background .15s}
.carousel-nav:hover{background:rgba(0,0,0,.8)}
.carousel-prev{left:10px}
.carousel-next{right:10px}
.carousel-dots{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:5px}
.carousel-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.5);cursor:pointer;transition:background .15s}
.carousel-dot.active{background:#fff}
.img-edit-bar{position:absolute;top:10px;right:10px;display:flex;gap:5px;z-index:10}
.img-edit-btn{background:rgba(0,0,0,.6);border:none;color:#fff;font-size:11px;padding:4px 8px;border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:4px;font-family:'DM Mono',monospace;transition:background .15s}
.img-edit-btn:hover{background:rgba(0,0,0,.85)}
.video-block{border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;margin-bottom:14px;box-shadow:var(--shadow-sm)}
.video-thumb{background:linear-gradient(135deg,#1a1916,#2d2b26);height:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;cursor:pointer;position:relative;overflow:hidden}
.video-thumb::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at center,rgba(22,163,74,.15),transparent 70%)}
.play-btn{width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;backdrop-filter:blur(4px);transition:all .2s;position:relative;z-index:2}
.play-btn:hover{background:var(--green-mid);border-color:var(--green-mid);transform:scale(1.08)}
.video-dur-badge{position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.7);color:#fff;font-size:10px;font-family:'DM Mono',monospace;padding:3px 7px;border-radius:4px;z-index:2}
.video-info{padding:12px 14px;display:flex;align-items:center;gap:10px;border-top:1px solid var(--border)}
.yt-icon{width:28px;height:28px;border-radius:6px;background:var(--red-light);display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--red-mid);flex-shrink:0}
.video-title{font-size:12.5px;font-weight:600;color:var(--text);display:block}
.video-meta{font-size:10.5px;color:var(--muted);margin-top:1px;display:block}
.code-block{border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--border);box-shadow:var(--shadow-sm)}
.code-header{background:#1a1916;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px}
.code-lang-badge{display:flex;align-items:center;gap:7px;flex-shrink:0}
.lang-dot{width:8px;height:8px;border-radius:50%}
.ld-red{background:#ff5f57}.ld-yellow{background:#febc2e}.ld-green{background:#28c840}
.code-lang-name{font-size:11px;font-family:'DM Mono',monospace;color:#a8a29e;margin-left:4px}
.code-title-text{font-size:12px;font-family:'DM Mono',monospace;color:#e7e5e4;font-weight:500;flex:1}
.copy-btn{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:5px;padding:4px 9px;font-size:10px;font-family:'DM Mono',monospace;color:#a8a29e;cursor:pointer;transition:all .15s;white-space:nowrap}
.copy-btn:hover{background:rgba(255,255,255,.14);color:#e7e5e4}
.code-body{background:#1e1e1e;padding:16px 18px;overflow-x:auto}
.code-body pre{margin:0;font-family:'DM Mono',monospace;font-size:12px;line-height:1.7;color:#d4d4d4;white-space:pre-wrap;word-break:break-word}
.callout{border-radius:var(--radius-md);padding:13px 15px;margin-bottom:14px;display:flex;align-items:flex-start;gap:10px;border-left:3px solid;position:relative}
.callout-tip{background:var(--green-bg);border-color:var(--green-mid)}
.callout-warning{background:var(--amber-bg);border-color:var(--amber-mid)}
.callout-important{background:var(--blue-bg);border-color:var(--blue-mid)}
.callout-icon{font-size:14px;flex-shrink:0;margin-top:1px}
.callout-tip .callout-icon{color:var(--green-mid)}
.callout-warning .callout-icon{color:var(--amber-mid)}
.callout-important .callout-icon{color:var(--blue-mid)}
.callout-label{font-size:10px;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.8px;font-weight:600;margin-bottom:4px;display:block}
.callout-tip .callout-label{color:var(--green)}
.callout-warning .callout-label{color:var(--amber)}
.callout-important .callout-label{color:var(--blue)}
.callout-text{font-size:12.5px;line-height:1.6;display:block;width:100%}
.callout-tip .callout-text{color:#166534}
.callout-warning .callout-text{color:#713f12}
.callout-important .callout-text{color:#1e3a8a}
.keypoints-block{background:var(--purple-bg);border:1px solid #c4b5fd;border-radius:var(--radius-lg);padding:16px 18px}
.kp-title{font-size:12px;font-weight:600;color:var(--purple);font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;display:flex;align-items:center;gap:6px}
.kp-list{display:flex;flex-direction:column;gap:7px}
.kp-item{display:flex;align-items:center;gap:8px;font-size:13px;color:#4c1d95;line-height:1.45;flex-wrap:wrap}
.kp-bullet{width:18px;height:18px;border-radius:50%;background:#7c3aed;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.kp-bullet i{font-size:9px;color:#fff}
.quiz-block{background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 20px;margin-bottom:0;box-shadow:var(--shadow-sm)}
.quiz-header{display:flex;align-items:center;gap:8px;margin-bottom:14px}
.quiz-badge{background:#7c3aed;color:#fff;font-size:10px;font-family:'DM Mono',monospace;padding:3px 8px;border-radius:4px;font-weight:500}
.quiz-q{font-size:14px;font-weight:600;color:var(--text);line-height:1.4;margin-bottom:14px;display:block;width:100%}
.quiz-options{display:flex;flex-direction:column;gap:8px}
.quiz-opt{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:var(--radius-md);border:1.5px solid var(--border);cursor:pointer;transition:all .18s;background:var(--bg)}
.quiz-opt:hover{border-color:var(--border2);background:var(--bg2)}
.quiz-opt.selected{border-color:var(--blue-mid);background:var(--blue-light)}
.quiz-opt.correct{border-color:var(--green-mid);background:var(--green-light)}
.quiz-opt.wrong{border-color:var(--red-mid);background:var(--red-light)}
.opt-letter{width:26px;height:26px;border-radius:7px;background:var(--white);border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'DM Mono',monospace;color:var(--text2);flex-shrink:0;transition:all .18s}
.quiz-opt.correct .opt-letter{background:var(--green-mid);border-color:var(--green-mid);color:#fff}
.quiz-opt.wrong .opt-letter{background:var(--red-mid);border-color:var(--red-mid);color:#fff}
.quiz-opt.selected .opt-letter{background:var(--blue-mid);border-color:var(--blue-mid);color:#fff}
.opt-text{font-size:13px;color:var(--text2);line-height:1.4;flex:1}
.quiz-explanation{background:var(--green-bg);border:1px solid #86efac;border-radius:var(--radius-md);padding:12px 14px;font-size:12.5px;color:var(--green);line-height:1.6;display:none;margin-top:10px}
.quiz-explanation.show{display:block}
.quiz-submit{padding:9px 18px;border-radius:var(--radius-md);background:var(--green-mid);color:#fff;border:none;font-size:13px;font-weight:600;cursor:pointer;transition:all .18s;margin-top:12px;display:flex;align-items:center;gap:6px}
.quiz-submit:hover{background:var(--green)}
.diff-tabs{display:flex;gap:7px;margin-bottom:14px;flex-wrap:wrap}
.diff-tab{padding:8px 16px;border-radius:var(--radius-md);font-size:12.5px;font-weight:600;cursor:pointer;border:1.5px solid var(--border);background:var(--bg);color:var(--muted);transition:all .15s}
.diff-tab:hover{background:var(--bg2);color:var(--text2)}
.diff-tab.active{background:var(--green-mid);border-color:var(--green-mid);color:#fff}
.diff-content{display:none}
.diff-content.active{display:block}
.req-box{padding:14px 16px;margin-bottom:14px;border-left:3px solid;border-radius:0 var(--radius-md) var(--radius-md) 0}
.req-box-beg{background:#f0fdf4;border-color:#16a34a}
.req-box-int{background:#fffbeb;border-color:#d97706}
.req-box-adv{background:#fef2f2;border-color:#dc2626}
.req-title{font-size:12px;font-weight:600;margin-bottom:10px;display:flex;align-items:center;gap:6px;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.5px}
.req-box-beg .req-title{color:var(--green)}
.req-box-int .req-title{color:var(--amber)}
.req-box-adv .req-title{color:var(--red)}
.req-list{display:flex;flex-direction:column;gap:8px}
.req-item{display:flex;align-items:flex-start;gap:7px;font-size:12.5px;line-height:1.5}
.req-box-beg .req-item{color:#166534}
.req-box-int .req-item{color:#713f12}
.req-box-adv .req-item{color:#991b1b}
.dataset-card{background:var(--blue-bg);border:1px solid #93c5fd;border-radius:var(--radius-md);padding:14px 16px;margin-bottom:14px}
.ds-title{font-size:12px;font-weight:600;color:var(--blue);font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;display:flex;align-items:center;gap:6px}
.ds-cols{display:flex;flex-direction:column;gap:5px}
.ds-col{font-size:12px;color:var(--blue);display:flex;gap:8px}
.ds-col-name{font-family:'DM Mono',monospace;font-weight:600;min-width:150px}
.tags-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.tag{display:inline-flex;align-items:center;padding:3px 9px;border-radius:var(--radius-sm);font-size:11px;font-weight:500;font-family:'DM Mono',monospace;background:var(--bg);color:var(--text2);border:1px solid var(--border)}
.submit-box{background:var(--bg);border:1.5px dashed var(--border2);border-radius:var(--radius-md);padding:14px 16px;margin-bottom:14px}
.submit-lbl{font-size:10.5px;font-family:'DM Mono',monospace;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:9px;font-weight:500}
.input-row{display:flex;gap:8px}
.text-input{flex:1;padding:9px 12px;background:var(--white);border:1px solid var(--border);border-radius:var(--radius-md);font-family:'DM Mono',monospace;font-size:12px;color:var(--text);outline:none;transition:border-color .15s;min-width:0}
.text-input:focus{border-color:var(--green-mid);box-shadow:0 0 0 3px rgba(22,163,74,.1)}
.text-input::placeholder{color:var(--muted2)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 16px;border-radius:var(--radius-md);font-size:13px;font-weight:600;cursor:pointer;border:1px solid;transition:all .15s;white-space:nowrap}
.btn-primary{background:var(--green-mid);color:#fff;border-color:var(--green-mid)}
.btn-primary:hover:not(:disabled){background:var(--green);transform:translateY(-1px);box-shadow:0 4px 12px rgba(22,163,74,.25)}
.btn-primary:disabled{opacity:.5;cursor:not-allowed}
.btn-ghost{background:var(--white);color:var(--text2);border-color:var(--border)}
.btn-ghost:hover{background:var(--bg)}
.btn-sm{padding:6px 11px;font-size:12px;gap:4px}
.checklist{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
.check-item{display:flex;align-items:center;gap:10px;padding:10px 13px;border-radius:var(--radius-md);background:var(--bg);border:1px solid var(--border);cursor:pointer;transition:all .15s}
.check-item:hover{border-color:var(--border2);background:var(--bg2)}
.check-item.checked{background:var(--green-bg);border-color:#86efac}
.check-box{width:20px;height:20px;border-radius:5px;border:2px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .18s;background:var(--white)}
.check-item.checked .check-box{background:var(--green-mid);border-color:var(--green-mid)}
.check-box i{font-size:10px;color:#fff;opacity:0;transition:opacity .15s}
.check-item.checked .check-box i{opacity:1}
.check-text{font-size:12.5px;color:var(--text2);flex:1}
.check-item.checked .check-text{color:var(--green);text-decoration:line-through;text-decoration-color:#86efac}
.scoring-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
.score-item{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-md);padding:13px 14px;text-align:center}
.score-val{font-family:'Fraunces',serif;font-size:22px;font-weight:700;color:var(--text);line-height:1;display:flex;align-items:baseline;justify-content:center;gap:2px}
.score-max{font-size:11px;color:var(--muted);font-family:'DM Mono',monospace}
.score-lbl{font-size:11px;color:var(--text2);margin-top:4px;font-weight:500}
.score-item.pass-score{background:var(--green-bg);border-color:#86efac}
.score-item.pass-score .score-val{color:var(--green)}
.task-hero{border-radius:var(--radius-lg);overflow:hidden;margin-bottom:16px;border:1px solid #fde68a;box-shadow:var(--shadow)}
.task-hero-top{background:linear-gradient(135deg,#1a1916,#292524);padding:22px 24px;position:relative;overflow:hidden}
.task-hero-top::before{content:'';position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:radial-gradient(circle,rgba(217,119,6,.2),transparent 70%)}
.task-day-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(217,119,6,.2);border:1px solid rgba(217,119,6,.4);border-radius:100px;padding:4px 11px;font-size:10px;font-family:'DM Mono',monospace;color:#fbbf24;margin-bottom:10px}
.task-title-big{font-family:'Fraunces',serif;font-size:22px;font-weight:700;color:#fff;letter-spacing:-.4px;margin-bottom:6px;display:block}
.task-title-big em{color:#34d399;font-style:italic}
.task-desc{font-size:13px;color:#a8a29e;line-height:1.65}
.task-hero-stats{display:flex;gap:16px;margin-top:14px;flex-wrap:wrap}
.th-stat{display:flex;align-items:center;gap:6px;font-size:11.5px;font-family:'DM Mono',monospace;color:#a8a29e}
.th-stat i{color:#34d399;font-size:11px}
.task-hero-body{background:var(--amber-bg);padding:18px 22px;border-top:1px solid #fde68a}
.complete-btn{width:100%;padding:12px;border-radius:var(--radius-lg);background:var(--green-mid);color:#fff;border:none;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .18s}
.complete-btn:hover{background:var(--green);transform:translateY(-1px);box-shadow:0 6px 18px rgba(22,163,74,.3)}
.complete-btn.done{background:var(--bg);color:var(--green);border:2px solid #86efac;cursor:default;transform:none;box-shadow:none}
.toast{position:fixed;bottom:22px;right:22px;background:#1a1916;color:#fff;padding:11px 16px;border-radius:var(--radius-lg);font-size:13px;font-weight:500;box-shadow:var(--shadow-lg);opacity:0;transform:translateY(8px);transition:opacity .3s,transform .3s;pointer-events:none;z-index:999;display:flex;align-items:center;gap:8px;max-width:320px}
.toast.show{opacity:1;transform:translateY(0)}
.toast i{color:#4ade80}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:500;padding:20px;backdrop-filter:blur(4px)}
.modal-box{background:var(--white);border-radius:var(--radius-xl);max-width:480px;width:100%;max-height:85vh;overflow-y:auto;box-shadow:var(--shadow-lg)}
.modal-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--border)}
.modal-title{font-family:'Fraunces',serif;font-size:16px;font-weight:700;color:var(--text)}
.modal-close{background:none;border:none;font-size:18px;color:var(--muted);cursor:pointer;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px}
.modal-close:hover{background:var(--bg);color:var(--text)}
.modal-body{padding:22px}
.modal-lbl{font-size:10.5px;font-family:'DM Mono',monospace;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;display:block;margin-bottom:5px;font-weight:500}
.editable-field{cursor:text;border-radius:4px;transition:background .1s;min-height:1em;display:inline-block;word-break:break-word}
.editable-field:hover{background:rgba(22,163,74,.07);outline:1px dashed rgba(22,163,74,.3)}
.editable-input{background:rgba(22,163,74,.06);border:1.5px solid var(--green-mid)!important;border-radius:4px;padding:2px 6px;outline:none;font-size:inherit;font-weight:inherit;font-family:inherit;color:inherit;width:100%;line-height:inherit}
.editable-textarea{min-height:60px;resize:vertical;padding:6px 8px}
.block-controls{position:absolute;top:8px;right:8px;display:flex;gap:4px;opacity:0;transition:opacity .15s;z-index:20}
.concept-block:hover .block-controls,.analogy-block:hover .block-controls,.callout:hover .block-controls{opacity:1}
.block-controls button{background:rgba(255,255,255,.9);border:1px solid var(--border);border-radius:5px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--muted);cursor:pointer}
.block-controls button:hover{color:var(--text);border-color:var(--border2)}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.fade{animation:fadeUp .35s ease both}
.d1{animation-delay:.04s}.d2{animation-delay:.08s}.d3{animation-delay:.12s}.d4{animation-delay:.16s}.d5{animation-delay:.2s}
`;