import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, ArrowLeft, AudioLines, Check, CheckCircle2, ChevronDown, FileText, Mic, Pause, Play, RotateCcw, ShieldCheck, Stethoscope, X } from 'lucide-react';
import './style.css';

const sampleTranscript = [
    { speaker: 'GP', time: '10:31', text: 'Alex Morgan reports headaches about twice a week over the past few weeks. They are usually one-sided and worse with bright light.' },
    { speaker: 'GP', time: '10:32', text: 'Episodes last most of the day and include mild nausea. No visual changes reported.' },
    { speaker: 'GP', time: '10:33', text: 'Discussed keeping a headache diary and reviewing treatment options. Follow up if symptoms worsen.' },
];
const sampleNote = {
  subjective: 'Headaches approximately twice weekly over recent weeks, usually unilateral and lasting most of the day. Photophobia and mild nausea. No visual changes reported.',
  objective: 'No examination findings dictated.',
  assessment: 'Recurrent headache; migraine considered. Confirm clinical assessment.',
  plan: 'Discuss headache diary and regular sleep and hydration. Review treatment options. Follow up if symptoms worsen or do not improve.',
};
const emptyNote = { subjective: '', objective: '', assessment: '', plan: '' };

function App() {
  const [state, setState] = useState('complete');
  const [transcript, setTranscript] = useState(sampleTranscript);
  const [note, setNote] = useState({ ...sampleNote });
  const [code, setCode] = useState('');
  const [approved, setApproved] = useState(false);
  const [sent, setSent] = useState(false);
  const [notice, setNotice] = useState('');

  const notify = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2500); };
  const start = () => {
    setState('recording'); setApproved(false); setSent(false); setTranscript([]); setNote({ ...emptyNote });
    notify('Demo recording started. Microphone is not connected.');
  };
  const stop = () => {
    setState('transcribing');
    window.setTimeout(() => {
      setTranscript(sampleTranscript); setNote({ ...sampleNote }); setState('complete');
      notify('Transcript ready. Review the draft before sending.');
    }, 700);
  };
  const editNote = (field, value) => { setNote({ ...note, [field]: value }); setApproved(false); setSent(false); };
  const clearSession = () => {
    setState('ready'); setTranscript([]); setNote({ ...emptyNote }); setCode(''); setApproved(false); setSent(false);
    notify('New note ready.');
  };

  return <div className="tool-shell">
    <header className="tool-topbar">
      <a className="suite-back-home" href="/" aria-label="Back to concepts"><ArrowLeft size={15}/></a>
      <div className="suite-brand"><span className="suite-brand-icon"><Activity size={17}/></span><span className="suite-brand-copy"><b>MTBE Group 9</b><small>3 Concepts</small></span></div>
      <span className="concept-marker">Concept 02 · GP dictation</span>
      <div className="destination"><span className="destination-dot"/> HIS destination <b>Practice system · Demo</b><ChevronDown size={14}/></div>
    </header>

    <main className="tool-main">
      <section className="session-head">
        <div><div className="eyebrow">GP DICTATION</div><h1>Dictation</h1></div>
        <label className="patient-ref"><span>Patient from HIS</span><input aria-label="Patient from HIS" defaultValue="Alex Morgan · NS-20481" readOnly/><ChevronDown size={15}/></label>
      </section>

      <div className="workbench">
        <section className="work-panel transcript-panel">
          <div className="panel-heading"><div><div className="panel-kicker">01 / CAPTURE</div><h2>Dictation transcript</h2></div><span className={'session-state '+(state === 'recording' ? 'live' : '')}>{state === 'recording' ? <><i/> Recording</> : state === 'transcribing' ? 'Transcribing…' : state === 'complete' ? 'Example transcript' : 'Ready'}</span></div>

          <div className="capture-box">
            {state === 'recording' ? <div className="recording-view"><div className="recording-orb"><AudioLines size={25}/></div><b>Listening to GP dictation</b><span>Live transcription will appear here</span><div className="waveform">{Array.from({length: 35}, (_, i) => <i key={i} style={{height: `${8 + ((i * 13) % 25)}px`}}/>)}</div></div> : state === 'ready' ? <div className="empty-state"><Mic size={25}/><b>Ready to capture</b><span>Start a dictation to create a transcript and draft note.</span></div> : <div className="transcript-list">{transcript.map((line, i) => <article className="transcript-line" key={i}><div className="speaker-icon gp"><Stethoscope size={15}/></div><div className="speech"><div className="speech-head"><b>{line.speaker}</b><time>{line.time}</time></div><p>{line.text}</p></div></article>)}</div>}
          </div>

          <div className="capture-controls">
            <div className="duration"><AudioLines size={15}/>{state === 'recording' ? '00:18' : state === 'complete' ? '02:46' : '00:00'} <span>· English</span></div>
            {state === 'recording' ? <button className="stop-button" onClick={stop}><Pause size={16} fill="currentColor"/> Stop dictation</button> : <button className="start-button" disabled={state === 'transcribing'} onClick={start}><Play size={15} fill="currentColor"/>{state === 'complete' ? 'New dictation' : 'Start dictation'}</button>}
          </div>
          <div className="panel-foot"><ShieldCheck size={14}/><span>Audio is deleted after transcription <b>·</b> sample flow</span></div>
        </section>

        <section className="work-panel note-panel">
          <div className="panel-heading"><div><div className="panel-kicker">02 / REVIEW</div><h2>Draft note</h2></div><span className="draft-tag"><FileText size={14}/>{sent ? 'Sent to HIS · Demo' : approved ? 'Reviewed' : state === 'complete' ? 'Needs review' : 'Waiting for transcript'}</span></div>
          {state === 'ready' || state === 'recording' || state === 'transcribing' ? <div className="draft-empty"><FileText size={24}/><b>Draft appears after dictation</b><span>Review and edit the note before sending it to the practice system.</span></div> : <div className="note-fields">
            <label className="note-field"><span><b>S</b> Subjective <small>Patient reported</small></span><textarea value={note.subjective} onChange={e => editNote('subjective', e.target.value)} rows={4}/></label>
            <label className="note-field"><span><b>O</b> Objective <small>Clinician observed</small></span><textarea value={note.objective} onChange={e => editNote('objective', e.target.value)} rows={2}/></label>
            <label className="note-field"><span><b>A</b> Assessment <small>Confirm before use</small></span><textarea value={note.assessment} onChange={e => editNote('assessment', e.target.value)} rows={2}/><div className="code-field"><span>Clinical code <small>Optional</small></span><input value={code} onChange={e => {setCode(e.target.value);setApproved(false);setSent(false)}} placeholder="Add after review"/></div></label>
            <label className="note-field"><span><b>P</b> Plan <small>Proposed next steps</small></span><textarea value={note.plan} onChange={e => editNote('plan', e.target.value)} rows={3}/></label>
          </div>}
          <div className="note-actions">{approved ? <span className="approved-state"><CheckCircle2 size={16}/> Reviewed by clinician</span> : <button className="approve-button" disabled={state !== 'complete'} onClick={() => {setApproved(true);notify('Draft marked reviewed.')}}><Check size={16}/> Mark reviewed</button>}<button className={'copy-button '+(sent?'sent':'')} disabled={!approved || sent} onClick={() => {setSent(true);notify('Demo: approved note sent to the selected practice HIS.')}}><CheckCircle2 size={15}/>{sent ? 'Sent to HIS' : 'Send to patient record'}</button></div>
        </section>
      </div>

      <footer className="tool-footer"><span>Review the note before sending it to the selected practice HIS.</span><button onClick={clearSession}><RotateCcw size={14}/> Clear session</button><span className="prototype-note">Prototype · no microphone or HIS connection active</span></footer>
    </main>
    {notice && <div className="toast"><CheckCircle2 size={16}/>{notice}<button aria-label="Dismiss" onClick={() => setNotice('')}><X size={14}/></button></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
