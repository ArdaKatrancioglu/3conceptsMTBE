import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, Clock3, MapPin, MessageSquare, Pill, Plus, Printer, Stethoscope, UserRound } from 'lucide-react';
import './style.css';

const initialSteps = [
  { id: 1, time: 'Today · 12:30', title: 'Drink a glass of water', note: 'Keep water nearby through the day', complete: false },
  { id: 2, time: 'Tomorrow', title: 'Collect your prescription', note: 'Linden Pharmacy · ready after 09:00', complete: false },
];

function pageFromPath(path) {
  if (path.endsWith('/appointments')) return 'appointments';
  if (path.endsWith('/medication')) return 'medication';
  return 'summary';
}

const pagePaths = { summary: '/concept-3/', appointments: '/concept-3/appointments', medication: '/concept-3/medication' };

function App() {
  const [steps, setSteps] = useState(initialSteps);
  const [notice, setNotice] = useState('');
  const [page, setPage] = useState(() => pageFromPath(window.location.pathname));
  const [appointment, setAppointment] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [reminder, setReminder] = useState(true);

  useEffect(() => {
    const onPopState = () => setPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function showNotice(message) {
    setNotice(message);
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => setNotice(''), 2400);
  }

  function navigate(nextPage) {
    window.history.pushState({}, '', pagePaths[nextPage]);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleStep(id) {
    setSteps(current => current.map(step => step.id === id ? { ...step, complete: !step.complete } : step));
  }

  function saveAppointment(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setAppointment({ date: form.get('date'), time: form.get('time'), type: form.get('type') });
    setShowAppointmentForm(false);
    showNotice('Appointment added to this demo schedule.');
  }

  const pageMeta = {
    summary: ['AFTER YOUR APPOINTMENT', 'Your visit summary', 'A clear record of what you discussed with your GP.'],
    appointments: ['YOUR CARE PLAN', 'Appointments', 'Keep track of visits and the next steps around your care.'],
    medication: ['YOUR PRESCRIPTION', 'Medication', 'Prescription and collection details from your GP visit.'],
  }[page];

  return <div className="page-shell">
    <header className="topbar">
      <a className="practice-name" href="/" aria-label="Back to concept selection"><span className="practice-mark"><Stethoscope size={17} /></span><span>Northside Family Practice</span></a>
      <nav className="top-nav" aria-label="Patient record">
        {[['summary', 'Visit summary'], ['appointments', 'Appointments'], ['medication', 'Medication']].map(([id, label]) => <button key={id} className={page === id ? 'selected' : ''} aria-current={page === id ? 'page' : undefined} onClick={() => navigate(id)}>{label}</button>)}
      </nav>
      <button className="patient-menu" onClick={() => showNotice('Signed in as Emma de Vries')}><span className="avatar">EV</span><span>Emma de Vries</span><ChevronDown size={15} /></button>
    </header>

    <main className="content">
      <div className="page-heading">
        <div><div className="overline">{pageMeta[0]}</div><h1>{pageMeta[1]}</h1><p>{pageMeta[2]}</p></div>
        <button className="quiet-button" onClick={() => page === 'appointments' ? setShowAppointmentForm(true) : window.print()}>{page === 'appointments' ? <><Plus size={16} /> Add appointment</> : <><Printer size={16} /> Print</>}</button>
      </div>

      {page === 'summary' && <>
        <section className="visit-card" aria-labelledby="visit-title">
          <div className="visit-card-top"><span className="visit-type"><Stethoscope size={15} /> GP consultation</span><span className="visit-date">12 October 2026</span></div>
          <h2 id="visit-title">Migraine</h2>
          <p className="visit-intro">You spoke with Dr. J. van Dijk about your headaches and how to manage them.</p>
          <div className="doctor-row"><span className="doctor-avatar">JD</span><span><b>Dr. J. van Dijk</b><small>Your GP · Northside Family Practice</small></span></div>
        </section>
        <div className="main-grid">
          <div className="primary-column">
            <section className="content-section">
              <div className="section-title"><span className="section-number">01</span><div><h2>What we discussed</h2><p>Notes from your appointment</p></div></div>
              <div className="note-card">
                <div className="note-row"><h3>About migraine</h3><p>Migraine can cause recurring headaches. Some people notice warning signs before the pain starts.</p></div>
                <div className="note-row"><h3>What may help</h3><p>Keeping regular sleep and meal times may help. Your GP suggested noting when headaches happen and what was going on that day.</p></div>
                <div className="note-row"><h3>When to contact the practice</h3><p>Get in touch if your headaches change, become more frequent, or your medication is not helping.</p></div>
              </div>
            </section>
            <section className="content-section">
              <div className="section-title"><span className="section-number">02</span><div><h2>Your next steps</h2><p>Things to remember after the visit</p></div></div>
              <div className="steps-card">{steps.map((step, index) => <div className={'step-row ' + (step.complete ? 'is-complete' : '')} key={step.id}>
                <span className="step-time">{step.time}</span><button className="step-check" aria-label={step.complete ? 'Mark incomplete' : 'Mark complete'} onClick={() => toggleStep(step.id)}>{step.complete && <Check size={14} />}</button><div className="step-copy"><b>{step.title}</b><small>{step.note}</small></div>
                {index === 0 && <span className="step-rule" />}
              </div>)}</div>
            </section>
          </div>
          <aside className="side-column">
            <button className="summary-link-card" onClick={() => navigate('appointments')}><span className="side-icon calendar"><CalendarDays size={17} /></span><span><b>Appointments</b><small>{appointment ? `${appointment.type} · ${appointment.date}` : 'No follow-up booked'}</small></span><ArrowRight size={16} /></button>
            <button className="summary-link-card" onClick={() => navigate('medication')}><span className="side-icon"><Pill size={17} /></span><span><b>Medication</b><small>Sumatriptan · 50 mg · pickup tomorrow</small></span><ArrowRight size={16} /></button>
            <button className="contact-card" onClick={() => showNotice('Your practice contact details are ready.')}><span className="contact-icon"><MessageSquare size={17} /></span><span><b>Questions about this summary?</b><small>Contact your family practice</small></span><ArrowRight size={16} /></button>
          </aside>
        </div>
      </>}

      {page === 'appointments' && <div className="appointments-page">
        <section className="next-visit-card">
          <div className="next-visit-copy"><div className="card-kicker">NEXT APPOINTMENT</div><h2>{appointment ? appointment.type : 'No follow-up booked'}</h2><p>{appointment ? `Added for ${appointment.date} at ${appointment.time}.` : 'Your GP did not schedule a follow-up. You can add an appointment here if you arrange one with the practice.'}</p>{!appointment && <button className="text-action" onClick={() => setShowAppointmentForm(true)}><Plus size={15} /> Add an appointment you arranged <ArrowRight size={15} /></button>}</div>
          <div className="calendar-date-card"><CalendarDays size={20} /><span>{appointment ? appointment.date : '12 OCT'}</span><small>{appointment ? appointment.time : 'Last visit'}</small></div>
        </section>

        <div className="appointment-columns">
          <section className="page-panel care-calendar">
            <div className="panel-title-row"><div><h2>Care timeline</h2><p>Recent and upcoming items</p></div><span className="month-label">October 2026 <ChevronDown size={14}/></span></div>
            <div className="timeline-list">
              {appointment && <article className="timeline-item upcoming"><div className="timeline-date"><b>{appointment.date.slice(8, 10)}</b><small>OCT</small></div><div className="timeline-marker"><i/></div><div className="timeline-text"><span className="timeline-status">UPCOMING</span><h3>{appointment.type}</h3><p>{appointment.time} · Northside Family Practice</p></div></article>}
              <article className="timeline-item"><div className="timeline-date"><b>15</b><small>OCT</small></div><div className="timeline-marker"><i/></div><div className="timeline-text"><span className="timeline-status pharmacy-status">PICK-UP</span><h3>Prescription ready</h3><p>Linden Pharmacy · after 09:00</p><button onClick={() => navigate('medication')}>View medication <ArrowRight size={14}/></button></div></article>
              <article className="timeline-item"><div className="timeline-date"><b>14</b><small>OCT</small></div><div className="timeline-marker"><i/></div><div className="timeline-text"><span className="timeline-status today-status">TODAY</span><h3>Keep a headache diary</h3><p>Note when a headache starts and what you were doing.</p></div></article>
              <article className="timeline-item past"><div className="timeline-date"><b>12</b><small>OCT</small></div><div className="timeline-marker"><i/></div><div className="timeline-text"><span className="timeline-status">COMPLETED</span><h3>GP consultation · Migraine</h3><p>Dr. J. van Dijk · Northside Family Practice</p><button onClick={() => navigate('summary')}>Open visit summary <ArrowRight size={14}/></button></div></article>
            </div>
          </section>
          <div className="appointment-side">
            <section className="page-panel followup-panel"><span className="side-icon calendar"><CalendarDays size={17}/></span><div className="card-kicker">FOLLOW-UP PLAN</div><h2>When to book</h2><p>Contact the practice if your headaches become more frequent, change, or your medication is not helping.</p><button className="secondary-action" onClick={() => showNotice('Northside Family Practice · 020 555 0140')}>Practice contact details <ArrowRight size={14}/></button></section>
            <section className="page-panel prep-panel"><div className="card-kicker">BEFORE YOUR NEXT VISIT</div><h2>Helpful to bring</h2><ul><li><CheckCircle2 size={15}/> Your headache diary</li><li><CheckCircle2 size={15}/> Any questions about treatment</li><li><CheckCircle2 size={15}/> Your current medication</li></ul></section>
          </div>
        </div>
      </div>}

      {page === 'medication' && <div className="medication-page">
        <section className="prescription-banner"><div className="rx-icon"><Pill size={22}/></div><div className="rx-copy"><div className="card-kicker">CURRENT PRESCRIPTION</div><h2>Sumatriptan <span>50 mg</span></h2><p>Prescribed after your GP visit on 12 October 2026.</p></div><span className="rx-status"><i/> Ready for collection</span></section>
        <div className="medication-columns">
          <div className="medication-main">
            <section className="page-panel directions-panel"><div className="panel-title-row"><div><h2>How to use</h2><p>Instructions recorded after your consultation</p></div><span className="instruction-label"><Stethoscope size={14}/> GP instructions</span></div><div className="direction-callout"><b>Use as needed for migraine.</b><p>Follow the directions on the pharmacy label and the advice from your GP. If anything is unclear, check with your pharmacist or practice.</p></div><div className="direction-row"><span>Medicine</span><b>Sumatriptan</b></div><div className="direction-row"><span>Strength</span><b>50 mg</b></div><div className="direction-row"><span>Purpose</span><b>Migraine</b></div></section>
            <section className="page-panel prescription-history"><div className="panel-title-row"><div><h2>Prescription details</h2><p>From your visit on 12 October</p></div><span className="history-count">1 prescription</span></div><div className="prescription-row"><span className="history-icon"><CheckCircle2 size={17}/></span><div><b>Prescription sent to pharmacy</b><small>12 October 2026 · Northside Family Practice</small></div><span className="history-complete">Ready</span></div><div className="prescription-row"><span className="history-icon pickup-icon"><MapPin size={17}/></span><div><b>Collect from Linden Pharmacy</b><small>15 October 2026 · after 09:00</small></div><button className="inline-arrow" onClick={() => showNotice('Linden Pharmacy · 14 Linden Street · Open until 18:00')} aria-label="Pharmacy details"><ArrowRight size={16}/></button></div></section>
          </div>
          <aside className="medication-side">
            <section className="page-panel pharmacy-panel"><span className="side-icon"><MapPin size={17}/></span><div className="card-kicker">COLLECTION</div><h2>Linden Pharmacy</h2><p>14 Linden Street<br/>Open today until 18:00</p><div className="pharmacy-meta"><Clock3 size={15}/> Prescription ready tomorrow after 09:00</div><button className="secondary-action" onClick={() => showNotice('Linden Pharmacy · 020 555 0187')}>Pharmacy contact details <ArrowRight size={14}/></button></section>
            <section className="page-panel reminder-panel"><div className="reminder-top"><span className="side-icon calendar"><Clock3 size={17}/></span><button className={'toggle ' + (reminder ? 'on' : '')} role="switch" aria-checked={reminder} onClick={() => {setReminder(!reminder); showNotice(reminder ? 'Collection reminder turned off.' : 'Collection reminder turned on.')}}><i/></button></div><h2>Collection reminder</h2><p>Reminder for your prescription pickup on 15 October.</p><span className="reminder-state">{reminder ? 'On for this device' : 'Off'}</span></section>
            <button className="contact-card" onClick={() => showNotice('Your practice contact details are ready.')}><span className="contact-icon"><MessageSquare size={17}/></span><span><b>Question about this medicine?</b><small>Ask your GP or pharmacist</small></span><ArrowRight size={16}/></button>
          </aside>
        </div>
      </div>}

      <footer className="page-footer"><span>{pageMeta[1]} · Emma de Vries · Demo record</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <ArrowDown size={14} /></button></footer>
    </main>

    {showAppointmentForm && <div className="modal-backdrop" role="presentation" onClick={() => setShowAppointmentForm(false)}><form className="appointment-modal" onSubmit={saveAppointment} onClick={event => event.stopPropagation()}><div className="modal-heading"><div><div className="card-kicker">PERSONAL CALENDAR</div><h2>Add an appointment</h2><p>For an appointment you arranged with the practice.</p></div><button type="button" className="modal-close" aria-label="Close" onClick={() => setShowAppointmentForm(false)}>×</button></div><label>Appointment type<input name="type" required defaultValue="GP follow-up"/></label><div className="form-row"><label>Date<input name="date" type="date" required defaultValue="2026-10-21"/></label><label>Time<input name="time" type="time" required defaultValue="10:00"/></label></div><p className="form-note"><UserRound size={14}/> This is a personal reminder; it does not book a visit with the practice.</p><div className="modal-actions"><button type="button" className="modal-cancel" onClick={() => setShowAppointmentForm(false)}>Cancel</button><button className="modal-save" type="submit"><Check size={15}/> Save to my calendar</button></div></form></div>}
    {notice && <div className="notice" role="status">{notice}</div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
