import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3, MapPin, MessageSquare, Pill, Plus, Printer, Stethoscope, UserRound } from 'lucide-react';
import './style.css';

const initialSteps = [
  { id: 1, time: 'Today · 12:30', title: 'Drink a glass of water', note: 'Keep water nearby through the day', complete: false },
  { id: 2, time: 'Tomorrow', title: 'Collect your prescription', note: 'Linden Pharmacy · ready after 09:00', complete: false },
];

function pageFromPath(path) {
  if (path.endsWith('/calendar') || path.endsWith('/appointments')) return 'calendar';
  if (path.endsWith('/medication')) return 'medication';
  return 'summary';
}

const pagePaths = { summary: '/concept-3/', calendar: '/concept-3/calendar', medication: '/concept-3/medication' };

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function prettyDate(date) {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
}

function App() {
  const [steps, setSteps] = useState(initialSteps);
  const [notice, setNotice] = useState('');
  const [page, setPage] = useState(() => pageFromPath(window.location.pathname));
  const [appointment, setAppointment] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [reminder, setReminder] = useState(true);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2026, 9, 1));
  const [selectedDate, setSelectedDate] = useState('2026-10-14');

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
    const date = form.get('date');
    setAppointment({ date, time: form.get('time'), type: form.get('type') });
    setSelectedDate(date);
    setCalendarMonth(new Date(`${date}T12:00:00`));
    setShowAppointmentForm(false);
    showNotice('Appointment added to this demo schedule.');
  }

  const pageMeta = {
    summary: ['AFTER YOUR APPOINTMENT', 'Your visit summary', 'A clear record of what you discussed with your GP.'],
    calendar: ['YOUR CARE PLAN', 'Calendar', 'Appointments and care reminders in one place.'],
    medication: ['YOUR PRESCRIPTION', 'Medication & extras', 'Prescription and collection details from your GP visit.'],
  }[page];

  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const monthOffset = (monthStart.getDay() + 6) % 7;
  const calendarStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1 - monthOffset);
  const cellCount = Math.ceil((monthOffset + new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()) / 7) * 7;
  const calendarDays = Array.from({ length: cellCount }, (_, index) => new Date(calendarStart.getFullYear(), calendarStart.getMonth(), calendarStart.getDate() + index));
  const calendarEvents = [
    { date: '2026-10-12', kind: 'appointment', title: 'GP consultation', detail: 'Dr. J. van Dijk · Migraine' },
    { date: '2026-10-14', kind: 'reminder', title: 'Headache diary', detail: 'Note when a headache starts and what you were doing.' },
    { date: '2026-10-15', kind: 'pickup', title: 'Prescription collection', detail: 'Linden Pharmacy · after 09:00' },
    ...(appointment ? [{ date: appointment.date, kind: 'appointment', title: appointment.type, detail: `${appointment.time} · Personal calendar entry` }] : []),
  ];
  const selectedEvents = calendarEvents.filter(event => event.date === selectedDate);

  return <div className="page-shell">
    <header className="topbar">
      <a className="practice-name" href="/" aria-label="Back to concept selection"><span className="practice-mark"><Stethoscope size={17} /></span><span>Northside Family Practice</span></a>
      <nav className="top-nav" aria-label="Patient record">
        {[['summary', 'Visit summary'], ['calendar', 'Calendar'], ['medication', 'Medication & extras']].map(([id, label]) => <button key={id} className={page === id ? 'selected' : ''} aria-current={page === id ? 'page' : undefined} onClick={() => navigate(id)}>{label}</button>)}
      </nav>
      <button className="patient-menu" onClick={() => showNotice('Signed in as Emma de Vries')}><span className="avatar">EV</span><span>Emma de Vries</span><ChevronDown size={15} /></button>
    </header>

    <main className="content">
      <div className="page-heading">
        <div><div className="overline">{pageMeta[0]}</div><h1>{pageMeta[1]}</h1><p>{pageMeta[2]}</p></div>
        <button className="quiet-button" onClick={() => page === 'calendar' ? setShowAppointmentForm(true) : window.print()}>{page === 'calendar' ? <><Plus size={16} /> Add to calendar</> : <><Printer size={16} /> Print</>}</button>
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
            <button className="summary-link-card" onClick={() => navigate('calendar')}><span className="side-icon calendar"><CalendarDays size={17} /></span><span><b>Calendar</b><small>{appointment ? `${appointment.type} · ${appointment.date}` : 'No follow-up booked'}</small></span><ArrowRight size={16} /></button>
            <button className="summary-link-card" onClick={() => navigate('medication')}><span className="side-icon"><Pill size={17} /></span><span><b>Medication & extras</b><small>Sumatriptan · 50 mg · pickup tomorrow</small></span><ArrowRight size={16} /></button>
            <button className="contact-card" onClick={() => showNotice('Your practice contact details are ready.')}><span className="contact-icon"><MessageSquare size={17} /></span><span><b>Questions about this summary?</b><small>Contact your family practice</small></span><ArrowRight size={16} /></button>
          </aside>
        </div>
      </>}

      {page === 'calendar' && <div className="calendar-page">
        <section className="page-panel calendar-panel">
          <div className="calendar-panel-head"><div><div className="card-kicker">CARE CALENDAR</div><h2>{new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(calendarMonth)}</h2></div><div className="calendar-controls"><button aria-label="Previous month" onClick={() => {const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1); setCalendarMonth(next); setSelectedDate(dateKey(next));}}><ChevronLeft size={17}/></button><button className="today-button" onClick={() => {const today = new Date(2026, 9, 14); setCalendarMonth(new Date(2026, 9, 1)); setSelectedDate(dateKey(today));}}>Today</button><button aria-label="Next month" onClick={() => {const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1); setCalendarMonth(next); setSelectedDate(dateKey(next));}}><ChevronRight size={17}/></button></div></div>
          <div className="calendar-grid" role="grid" aria-label="Calendar">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <div className="weekday" role="columnheader" key={day}>{day}</div>)}
            {calendarDays.map(day => {
              const key = dateKey(day);
              const events = calendarEvents.filter(event => event.date === key);
              return <button role="gridcell" aria-selected={selectedDate === key} key={key} className={`calendar-day ${day.getMonth() === calendarMonth.getMonth() ? '' : 'outside'} ${selectedDate === key ? 'selected-day' : ''}`} onClick={() => {setSelectedDate(key); if (day.getMonth() !== calendarMonth.getMonth()) setCalendarMonth(new Date(day.getFullYear(), day.getMonth(), 1));}}><span>{day.getDate()}</span>{events.length > 0 && <i className={`event-dots ${events[0].kind}`} />}</button>;
            })}
          </div>
          <div className="calendar-legend"><span><i className="legend-visit"/> Appointment</span><span><i className="legend-reminder"/> Reminder</span><span><i className="legend-pickup"/> Prescription pickup</span></div>
        </section>
        <aside className="calendar-agenda">
          <section className="page-panel selected-day-panel"><div className="selected-date-heading"><div><div className="card-kicker">SELECTED DAY</div><h2>{prettyDate(new Date(`${selectedDate}T12:00:00`))}</h2></div><span className="selected-date-icon"><CalendarDays size={18}/></span></div>
            {selectedEvents.length ? <div className="selected-events">{selectedEvents.map((event, index) => <article className="selected-event" key={`${event.date}-${event.title}-${index}`}><span className={`event-type-icon ${event.kind}`}>{event.kind === 'pickup' ? <Pill size={16}/> : event.kind === 'appointment' ? <Stethoscope size={16}/> : <CheckCircle2 size={16}/>}</span><div><span className="event-label">{event.kind === 'pickup' ? 'PRESCRIPTION PICKUP' : event.kind === 'appointment' ? 'APPOINTMENT' : 'CARE REMINDER'}</span><h3>{event.title}</h3><p>{event.detail}</p>{event.kind === 'appointment' && event.date === '2026-10-12' && <button onClick={() => navigate('summary')}>View visit summary <ArrowRight size={13}/></button>}{event.kind === 'pickup' && <button onClick={() => navigate('medication')}>View medication <ArrowRight size={13}/></button>}</div></article>)}</div> : <div className="day-empty"><CalendarDays size={20}/><b>Nothing planned for this day</b><span>Add an appointment or reminder you arranged yourself.</span><button onClick={() => setShowAppointmentForm(true)}><Plus size={14}/> Add to calendar</button></div>}
          </section>
          <section className="page-panel upcoming-panel"><div className="panel-title-row"><div><h2>Coming up</h2><p>Next items in your care plan</p></div></div><button className="upcoming-row" onClick={() => {setSelectedDate('2026-10-15'); setCalendarMonth(new Date(2026, 9, 1));}}><span className="upcoming-date">15<small>OCT</small></span><span><b>Prescription pickup</b><small>Linden Pharmacy · after 09:00</small></span><ChevronRight size={15}/></button>{appointment && <button className="upcoming-row" onClick={() => {setSelectedDate(appointment.date); setCalendarMonth(new Date(`${appointment.date}T12:00:00`));}}><span className="upcoming-date">{appointment.date.slice(8, 10)}<small>{new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(new Date(`${appointment.date}T12:00:00`)).toUpperCase()}</small></span><span><b>{appointment.type}</b><small>{appointment.time} · Personal calendar</small></span><ChevronRight size={15}/></button>}<div className="calendar-help"><span className="side-icon calendar"><Clock3 size={16}/></span><p>Your GP suggested keeping a headache diary before your next visit.</p></div></section>
        </aside>
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

    {showAppointmentForm && <div className="modal-backdrop" role="presentation" onClick={() => setShowAppointmentForm(false)}><form className="appointment-modal" onSubmit={saveAppointment} onClick={event => event.stopPropagation()}><div className="modal-heading"><div><div className="card-kicker">PERSONAL CALENDAR</div><h2>Add an appointment</h2><p>For an appointment you arranged with the practice.</p></div><button type="button" className="modal-close" aria-label="Close" onClick={() => setShowAppointmentForm(false)}>×</button></div><label>Appointment type<input name="type" required defaultValue="GP follow-up"/></label><div className="form-row"><label>Date<input name="date" type="date" required defaultValue={selectedDate}/></label><label>Time<input name="time" type="time" required defaultValue="10:00"/></label></div><p className="form-note"><UserRound size={14}/> This is a personal reminder; it does not book a visit with the practice.</p><div className="modal-actions"><button type="button" className="modal-cancel" onClick={() => setShowAppointmentForm(false)}>Cancel</button><button className="modal-save" type="submit"><Check size={15}/> Save to my calendar</button></div></form></div>}
    {notice && <div className="notice" role="status">{notice}</div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
