import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, CalendarDays, Check, ChevronDown, Clock3, MapPin, MessageSquare, Pill, Printer, Stethoscope } from 'lucide-react';
import './style.css';

const initialSteps = [
  { id: 1, time: 'Today · 12:30', title: 'Drink a glass of water', note: 'Keep water nearby through the day', complete: false },
  { id: 2, time: 'Tomorrow', title: 'Collect your prescription', note: 'Linden Pharmacy · ready after 09:00', complete: false },
];

function App() {
  const [steps, setSteps] = useState(initialSteps);
  const [notice, setNotice] = useState('');
  const [activeNav, setActiveNav] = useState('Visit summary');

  function showNotice(message) {
    setNotice(message);
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => setNotice(''), 2400);
  }

  function toggleStep(id) {
    setSteps(current => current.map(step => step.id === id ? { ...step, complete: !step.complete } : step));
  }

  return <div className="page-shell">
    <header className="topbar">
      <a className="practice-name" href="/" aria-label="Back to concept selection"><span className="practice-mark"><Stethoscope size={17} /></span><span>Northside Family Practice</span></a>
      <nav className="top-nav" aria-label="Patient record">
        {['Visit summary', 'Appointments', 'Medication'].map((item) => <button key={item} className={activeNav === item ? 'selected' : ''} onClick={() => {
          setActiveNav(item);
          if (item !== 'Visit summary') document.getElementById(item === 'Appointments' ? 'next-steps' : 'medication')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}>{item}</button>)}
      </nav>
      <button className="patient-menu" onClick={() => showNotice('Signed in as Emma de Vries')}><span className="avatar">EV</span><span>Emma de Vries</span><ChevronDown size={15} /></button>
    </header>

    <main className="content">
      <div className="page-heading">
        <div><div className="overline">AFTER YOUR APPOINTMENT</div><h1>Your visit summary</h1><p>A clear record of what you discussed with your GP.</p></div>
        <button className="quiet-button" onClick={() => window.print()}><Printer size={16} /> Print</button>
      </div>

      <section className="visit-card" aria-labelledby="visit-title">
        <div className="visit-card-top"><span className="visit-type"><Stethoscope size={15} /> GP consultation</span><span className="visit-date">12 October 2026</span></div>
        <h2 id="visit-title">Migraine</h2>
        <p className="visit-intro">You spoke with Dr. J. van Dijk about your headaches and how to manage them.</p>
        <div className="doctor-row"><span className="doctor-avatar">JD</span><span><b>Dr. J. van Dijk</b><small>Your GP · Northside Family Practice</small></span></div>
      </section>

      <div className="main-grid">
        <div className="primary-column">
          <section className="content-section" id="summary">
            <div className="section-title"><span className="section-number">01</span><div><h2>What we discussed</h2><p>Notes from your appointment</p></div></div>
            <div className="note-card">
              <div className="note-row"><h3>About migraine</h3><p>Migraine can cause recurring headaches. Some people notice warning signs before the pain starts.</p></div>
              <div className="note-row"><h3>What may help</h3><p>Keeping regular sleep and meal times may help. Your GP suggested noting when headaches happen and what was going on that day.</p></div>
              <div className="note-row"><h3>When to contact the practice</h3><p>Get in touch if your headaches change, become more frequent, or your medication is not helping.</p></div>
            </div>
          </section>

          <section className="content-section" id="next-steps">
            <div className="section-title"><span className="section-number">02</span><div><h2>Your next steps</h2><p>Things to remember after the visit</p></div></div>
            <div className="steps-card">{steps.map((step, index) => <div className={'step-row ' + (step.complete ? 'is-complete' : '')} key={step.id}>
              <span className="step-time">{step.time}</span><button className="step-check" aria-label={step.complete ? 'Mark incomplete' : 'Mark complete'} onClick={() => toggleStep(step.id)}>{step.complete && <Check size={14} />}</button><div className="step-copy"><b>{step.title}</b><small>{step.note}</small></div>
              {index === 0 && <span className="step-rule" />}
            </div>)}</div>
          </section>
        </div>

        <aside className="side-column">
          <section className="side-card" id="medication">
            <div className="side-heading"><span className="side-icon"><Pill size={17} /></span><div><h2>Medication</h2><p>As discussed with your GP</p></div></div>
            <div className="medicine-name">Sumatriptan <span>50 mg</span></div>
            <p className="medicine-detail">Take as needed for migraine. Follow the instructions on the packet.</p>
            <div className="side-divider" />
            <div className="pickup"><MapPin size={16} /><span><b>Linden Pharmacy</b><small>Ready for collection tomorrow after 09:00</small></span></div>
          </section>

          <section className="side-card appointment-card">
            <div className="side-heading"><span className="side-icon calendar"><CalendarDays size={17} /></span><div><h2>Follow-up</h2><p>Next appointment</p></div></div>
            <div className="appointment-empty"><Clock3 size={16} /><span>No follow-up appointment booked</span></div>
          </section>

          <button className="contact-card" onClick={() => showNotice('Your practice contact details are ready.') }><span className="contact-icon"><MessageSquare size={17} /></span><span><b>Questions about this summary?</b><small>Contact your family practice</small></span><ArrowRight size={16} /></button>
        </aside>
      </div>

      <footer className="page-footer"><span>Visit summary · 12 October 2026</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <ArrowDown size={14} /></button></footer>
    </main>
    {notice && <div className="notice" role="status">{notice}</div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
