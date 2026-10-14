import React from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, ArrowRight, AudioLines, CalendarDays, CheckCircle2, ChevronRight, Heart, Home, LockKeyhole, Mic, Pill, Stethoscope, Users } from 'lucide-react';
import './style.css';

function Landing(){
  return <main className="landing">
    <header className="top"><a className="brand" href="/"><span><Activity size={19}/></span> MTBE Group 9 <small>3 Concepts</small></a><div className="top-note"><LockKeyhole size={14}/> Product concepts · 2026</div></header>
    <section className="intro"><div className="overline"><i/> MTBE GROUP 9 · 3 CONCEPTS</div><h1>GP consultation<br/><em>tools and patient follow-up.</em></h1><p>Select a concept to open its prototype.</p><div className="concept-count"><span>03</span> CONCEPTS <b/></div></section>
    <section className="cards">
      <a className="concept-card card-one" href="/concept-1/">
        <div className="card-top"><span className="number">CONCEPT 01</span><span className="open-icon"><ArrowRight size={17}/></span></div>
        <div className="mini-daily"><div className="daily-mini-top"><span><i/>Daily care</span><small>EMMA · TODAY</small></div><div className="daily-mini-welcome"><b>Good morning, Emma</b><small>Today’s diabetes care plan</small></div><div className="daily-mini-row"><span><Pill size={11}/></span><b>Medication reminder</b><i>08:00</i><small>DONE</small></div><div className="daily-mini-row"><span><Home size={11}/></span><b>Google Home</b><i/><small>ON</small></div><div className="daily-mini-family"><Users size={11}/> Sophie is sharing today’s plan</div></div>
        <div className="card-copy"><div className="card-icon green"><Home size={18}/></div><h2>Daily care at home</h2><p>Medication reminders, home devices, family support, and nearby supply prices.</p><div className="features"><span><Pill size={13}/> Medication reminders</span><span><Users size={13}/> Family sharing</span><span><Home size={13}/> Home devices</span></div></div>
        <div className="card-footer"><span>EXPLORE CONCEPT 01</span><ArrowRight size={16}/></div>
      </a>
      <a className="concept-card card-two" href="/concept-2/">
        <div className="card-top"><span className="number">CONCEPT 02</span><span className="open-icon"><ArrowRight size={17}/></span></div>
        <div className="mini-workspace"><div className="mini-bar"><i/><i/><i/><b>Consultation workspace</b></div><div className="mini-columns"><div className="mini-transcript"><div className="mini-live"><i/> LIVE TRANSCRIPT</div><div className="mini-lines"><i/><i/><i/></div><div className="mini-person"><b>AM</b><span/><span/></div><div className="mini-person doc"><b>JD</b><span/><span/></div><div className="mini-wave"><AudioLines size={16}/> <i/><i/><i/><i/><i/><i/></div></div><div className="mini-note"><small>AI-GENERATED DRAFT</small><b>Consultation note</b><div className="mini-soap"><i>S</i><span/><span/></div><div className="mini-soap"><i>O</i><span/><span/></div><div className="mini-code"><CheckCircle2 size={12}/> Suggested diagnosis</div><div className="mini-approve"><CheckCircle2 size={12}/> Review & approve</div></div></div></div>
        <div className="card-copy"><div className="card-icon green"><Stethoscope size={18}/></div><h2>GP dictation tool</h2><p>Capture dictation, review a structured note, and send it to the practice HIS.</p><div className="features"><span><Mic size={13}/> Dictation</span><span><AudioLines size={13}/> Transcript</span><span><CheckCircle2 size={13}/> Review and send</span></div></div>
        <div className="card-footer"><span>EXPLORE CONCEPT 02</span><ArrowRight size={16}/></div>
      </a>
      <a className="concept-card card-three" href="/concept-3/">
        <div className="card-top"><span className="number">CONCEPT 03</span><span className="open-icon"><ArrowRight size={17}/></span></div>
        <div className="mini-patient"><div className="patient-window"><div className="patient-sidebar"><div/><i/><i/><i/><i/></div><div className="patient-main"><div className="patient-welcome"><small>WEDNESDAY · 14 OCTOBER</small><b>Good morning, Emma ☀️</b><span>Your personal care overview</span></div><div className="patient-hero"><i/><div><small>YOUR VISIT, SUMMARIZED</small><b>Migraine: your plan<br/>for the weeks ahead</b><span>Dr. J. van Dijk · 4 min read</span></div></div><div className="patient-agenda"><CalendarDays size={15}/><b>Today for you</b><i/><i/><i/></div><div className="patient-guides"><span><Heart size={13}/></span><span/><span/></div></div></div></div>
        <div className="card-copy"><div className="card-icon peach"><Heart size={18}/></div><h2>Care that stays with patients</h2><p>A personal care space for visit summaries, next steps, medication, and appointments—ready to revisit at home.</p><div className="features"><span><Heart size={13}/> Personal summary</span><span><CalendarDays size={13}/> Follow-up plan</span><span><ChevronRight size={13}/> Patient view</span></div></div>
        <div className="card-footer"><span>EXPLORE CONCEPT 03</span><ArrowRight size={16}/></div>
      </a>
    </section>
    <footer className="landing-footer"><span><Activity size={14}/> MTBE GROUP 9 · 3 CONCEPTS</span><span>Prototype interfaces · Sample data only</span></footer>
  </main>
}
createRoot(document.getElementById('root')).render(<Landing/>);
