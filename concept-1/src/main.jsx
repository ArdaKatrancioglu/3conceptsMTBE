import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, Bell, Check, CheckCircle2, ChevronDown, ChevronRight, Clock3, Home, MapPin, Pill, Plus, ShoppingBag, Smartphone, Users, Volume2, X } from 'lucide-react';
import './style.css';

const sampleMeds = [
  { id: 'morning', time: '08:00', period: 'Morning', name: 'Metformin', detail: '500 mg · with breakfast', status: 'taken' },
  { id: 'midday', time: '13:00', period: 'Midday', name: 'Glucose check reminder', detail: 'After lunch · personal reminder', status: 'due' },
  { id: 'evening', time: '20:00', period: 'Evening', name: 'Metformin', detail: '500 mg · with dinner', status: 'upcoming' },
];

const priceSets = {
  'Glucose tablets · 10-pack': [
    { store: 'Kruidvat', price: 2.49, distance: '1.2 km' },
    { store: 'Etos', price: 2.89, distance: '1.8 km' },
    { store: 'Linden Pharmacy', price: 3.25, distance: '0.6 km' },
  ],
  'Lancets · 100-pack': [
    { store: 'Kruidvat', price: 5.49, distance: '1.2 km' },
    { store: 'Etos', price: 6.19, distance: '1.8 km' },
    { store: 'Linden Pharmacy', price: 5.95, distance: '0.6 km' },
  ],
  'Glucose sensor patches · 5-pack': [
    { store: 'Kruidvat', price: 8.95, distance: '1.2 km' },
    { store: 'Etos', price: 9.49, distance: '1.8 km' },
    { store: 'Linden Pharmacy', price: 8.75, distance: '0.6 km' },
  ],
};

function App() {
  const [meds, setMeds] = useState(sampleMeds);
  const [priceProduct, setPriceProduct] = useState(Object.keys(priceSets)[0]);
  const [devices, setDevices] = useState({ google: true, apple: false });
  const [family, setFamily] = useState({ sophie: true, noah: false });
  const [notifications, setNotifications] = useState(true);
  const [notice, setNotice] = useState('');

  function toast(message) {
    setNotice(message);
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => setNotice(''), 2600);
  }

  function markTaken(id) {
    setMeds(current => current.map(med => med.id === id ? { ...med, status: 'taken' } : med));
    toast('Marked as done for today.');
  }

  const doneCount = meds.filter(med => med.status === 'taken').length;
  const offers = priceSets[priceProduct];
  const lowestPrice = Math.min(...offers.map(offer => offer.price));

  return <div className="daily-app">
    <header className="daily-header">
      <a className="daily-brand" href="/"><span className="daily-brand-icon"><Activity size={18}/></span><span>Daily care</span><small>CONCEPT 01</small></a>
      <nav className="daily-nav"><a className="active" href="#today">Today</a><a href="#medication">Medication</a><a href="#family">Family & home</a></nav>
      <button className={'notification-button '+(!notifications?'muted':'')} aria-label="Toggle notifications" onClick={() => {setNotifications(!notifications);toast(notifications?'Notifications paused':'Notifications enabled');}}><Bell size={18}/><i/></button>
      <button className="daily-user" onClick={() => toast('Patient profile · Emma de Vries')}><span>EV</span><b>Emma de Vries</b><ChevronDown size={14}/></button>
    </header>

    <main className="daily-main" id="today">
      <section className="daily-welcome"><div><div className="date-label">WEDNESDAY · 14 OCTOBER 2026</div><h1>Good morning, Emma</h1><p>Today’s plan for your diabetes care.</p></div><button className="caregiver-button" onClick={() => toast('Sophie can see today’s care plan.')}><Users size={16}/> Shared with Sophie</button></section>

      <section className="day-overview" aria-label="Today at a glance">
        <div className="overview-item"><div className="overview-icon green"><CheckCircle2 size={17}/></div><span><small>MEDICATION PLAN</small><b>{doneCount} of {meds.length} complete</b></span><div className="progress-track"><i style={{width:`${(doneCount / meds.length) * 100}%`}}/></div></div>
        <div className="overview-item"><div className="overview-icon sand"><Clock3 size={17}/></div><span><small>NEXT REMINDER</small><b>Today at 13:00</b></span><span className="reminder-state">{notifications?'On':'Paused'}</span></div>
        <div className="overview-item"><div className="overview-icon lavender"><Home size={17}/></div><span><small>HOME DEVICE</small><b>{devices.google?'Google Home connected':'No device connected'}</b></span><span className="connection-dot"/></div>
      </section>

      <div className="daily-grid">
        <div className="daily-left">
          <section className="daily-card medication-card" id="medication">
            <div className="card-heading"><div><div className="card-overline">TODAY</div><h2>Medication & reminders</h2></div><button className="manage-button" onClick={() => toast('Medication schedule opened.')}>Manage <ChevronRight size={14}/></button></div>
            <div className="med-list">{meds.map(med => <article className={'med-row '+med.status} key={med.id}><div className="med-time"><b>{med.time}</b><small>{med.period}</small></div><span className="med-marker">{med.status==='taken'?<Check size={13}/>:null}</span><div className="med-info"><b>{med.name}</b><small>{med.detail}</small></div>{med.status==='taken'?<span className="dose-status taken-status"><CheckCircle2 size={14}/> Done</span>:med.status==='due'?<button className="take-button" onClick={() => markTaken(med.id)}>Mark done</button>:<span className="dose-status upcoming-status">Upcoming</span>}</article>)}</div>
            <div className="med-card-footer"><span><Bell size={14}/> Reminders go to your phone{devices.google?' and Google Home':''}</span><button onClick={() => {setNotifications(!notifications);toast(notifications?'Medication reminders paused':'Medication reminders enabled');}}>{notifications?'Pause reminders':'Turn reminders on'}</button></div>
          </section>

          <section className="daily-card price-card">
            <div className="card-heading price-heading"><div><div className="card-overline">NEARBY STORES</div><h2>Find care supplies</h2></div><label className="product-select"><ShoppingBag size={15}/><select value={priceProduct} onChange={event => setPriceProduct(event.target.value)}>{Object.keys(priceSets).map(product => <option key={product}>{product}</option>)}</select><ChevronDown size={14}/></label></div>
            <div className="offer-list">{offers.map(offer => <div className={'offer-row '+(offer.price===lowestPrice?'best-offer':'')} key={offer.store}><div className="store-icon"><MapPin size={15}/></div><span className="store-name"><b>{offer.store}</b><small>{offer.distance} · pickup available</small></span>{offer.price===lowestPrice&&<span className="lowest-label">LOWEST</span>}<b className="offer-price">€{offer.price.toFixed(2)}</b><button className="store-action" aria-label={`View ${offer.store}`} onClick={() => toast(`${offer.store} · Demo price only`)}><ChevronRight size={16}/></button></div>)}</div>
            <p className="price-note">Example prices for this concept only. Check with the store for current availability and price.</p>
          </section>
        </div>

        <div className="daily-right">
          <section className="daily-card family-card" id="family">
            <div className="card-heading"><div><div className="card-overline">CARE CIRCLE</div><h2>Family members</h2></div><button className="add-small" aria-label="Add family member" onClick={() => toast('Invite link copied for your family member.')}><Plus size={17}/></button></div>
            <div className="family-person"><span className="family-avatar sophie">SD</span><span className="family-person-info"><b>Sophie de Vries</b><small>Partner · can view care plan</small></span><button className={'permission-toggle '+(family.sophie?'on':'')} role="switch" aria-label="Sophie access" aria-checked={family.sophie} onClick={() => {setFamily({...family,sophie:!family.sophie});toast(family.sophie?'Sophie’s access paused':'Sophie can view the care plan');}}><i/></button></div>
            <div className="family-person"><span className="family-avatar noah">ND</span><span className="family-person-info"><b>Noah de Vries</b><small>Caregiver · medication alerts</small></span><button className={'permission-toggle '+(family.noah?'on':'')} role="switch" aria-label="Noah alerts" aria-checked={family.noah} onClick={() => {setFamily({...family,noah:!family.noah});toast(family.noah?'Noah’s alerts paused':'Noah will receive medication alerts');}}><i/></button></div>
            <div className="family-note"><Users size={15}/><span>{Object.values(family).filter(Boolean).length} family member{Object.values(family).filter(Boolean).length===1?'':'s'} connected to your care</span><button onClick={() => toast('Family care settings opened.')}>Manage</button></div>
          </section>

          <section className="daily-card home-card">
            <div className="card-heading"><div><div className="card-overline">AT HOME</div><h2>Connected devices</h2></div><button className="text-link" onClick={() => toast('Home device settings opened.')}>Set up <ChevronRight size={14}/></button></div>
            <div className="device-row"><span className="device-icon google-icon"><Volume2 size={17}/></span><span className="device-copy"><b>Google Home</b><small>{devices.google?'Kitchen speaker':'Not connected'}</small></span><button className={'device-toggle '+(devices.google?'on':'')} role="switch" aria-label="Google Home connection" aria-checked={devices.google} onClick={() => {setDevices({...devices,google:!devices.google});toast(devices.google?'Google Home disconnected':'Google Home connected');}}><i/></button></div>
            <div className="device-row"><span className="device-icon apple-icon"><Smartphone size={17}/></span><span className="device-copy"><b>Apple Home</b><small>{devices.apple?'HomePod mini':'Not connected'}</small></span><button className={'device-toggle '+(devices.apple?'on':'')} role="switch" aria-label="Apple Home connection" aria-checked={devices.apple} onClick={() => {setDevices({...devices,apple:!devices.apple});toast(devices.apple?'Apple Home disconnected':'Apple Home connected');}}><i/></button></div>
            <div className="device-foot"><span className="privacy-mark"><CheckCircle2 size={14}/></span>Only care reminders are shared with your home devices.</div>
          </section>

          <section className="routine-card"><div className="routine-icon"><Clock3 size={17}/></div><div><small>FAMILY ROUTINE</small><b>School drop-off · 08:15</b><span>Sophie has it covered this morning</span></div><button onClick={() => toast('Routine details opened.')} aria-label="Routine details"><ChevronRight size={16}/></button></section>
        </div>
      </div>
      <footer className="daily-footer"><span>Concept 01 · Sample patient and store data</span><button onClick={() => toast('Notification settings opened.')}>Notification settings <ChevronRight size={13}/></button></footer>
    </main>
    {notice&&<div className="daily-toast" role="status"><CheckCircle2 size={16}/>{notice}<button aria-label="Dismiss" onClick={() => setNotice('')}><X size={14}/></button></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
