import React, { useState, useCallback } from 'react';
import { AssistantPanel } from './components/AssistantPanel';
import { InfoCards } from './components/InfoCards';
import { LeadForm } from './components/LeadForm';
import { Header } from './components/Header';
import { Message } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = useCallback((role: 'user' | 'assistant', text: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        role,
        text,
        timestamp: new Date()
      }
    ]);
  }, []);

  const socialLinks = [
    { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61586203620997', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', color: 'hover:text-[#1877F2]' },
    { name: 'Instagram', url: 'https://www.instagram.com/caswa.model.science.school/', icon: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10.5 4.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z', color: 'hover:text-[#E4405F]' },
    { name: 'X', url: 'https://x.com/Caswa_MS_School', icon: 'M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0016 3.542a6.658 6.658 0 01-1.889.518 3.301 3.301 0 001.447-1.817 6.533 6.533 0 01-2.087.793A3.286 3.286 0 008.742 3.5a3.287 3.287 0 00-3.287 3.287c0 .257.029.508.085.75A9.317 9.317 0 012.8 3.51a3.289 3.289 0 001.017 4.382 3.223 3.223 0 01-1.49-.41v.041a3.287 3.287 0 002.636 3.223 3.227 3.227 0 01-1.482.056 3.287 3.287 0 003.067 2.281 6.588 6.588 0 01-4.08 1.407c-.266 0-.528-.015-.787-.046A9.284 9.284 0 005.026 15z', color: 'hover:text-black' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@caswa.model.scien', icon: 'M9 12a1 1 0 102 0V4a1 1 0 00-1-1H7a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 00-1 1v10a3 3 0 003 3h4a3 3 0 003-3v-5a1 1 0 00-1-1H9z', color: 'hover:text-[#00F2EA]' },
    { name: 'YouTube', url: 'https://www.youtube.com/@CASWAModelScienceSchool', icon: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z', color: 'hover:text-[#FF0000]' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/caswa-model-science-school-b2574a3a7/', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z', color: 'hover:text-[#0A66C2]' },
    { name: 'Pinterest', url: 'https://www.pinterest.com/caswamodelscienceschool/_profile/', icon: 'M4.97 3.5c4.441 0 8.03 3.589 8.03 8.03 0 3.42-2.126 6.347-5.132 7.487-.1-.663-.19-1.68.04-2.404l1.114-4.717s-.284-.568-.284-1.408c0-1.32.765-2.305 1.716-2.305.81 0 1.2.608 1.2 1.336 0 .813-.518 2.03-.786 3.158-.224.945.474 1.715 1.406 1.715 1.687 0 2.986-1.778 2.986-4.345 0-2.27-1.632-3.858-3.962-3.858-2.699 0-4.283 2.025-4.283 4.116 0 .816.314 1.69.706 2.163.078.093.089.175.058.303l-.261 1.066c-.042.17-.138.206-.319.122-1.192-.555-1.936-2.296-1.936-3.696 0-3.007 2.185-5.77 6.3-5.77 3.308 0 5.879 2.358 5.879 5.508 0 3.287-2.073 5.932-4.95 5.932-.966 0-1.875-.502-2.185-1.093l-.595 2.264c-.215.827-.796 1.865-1.185 2.5a8.032 8.032 0 01-3.13-7.513c0-4.441 3.589-8.03 8.03-8.03z', color: 'hover:text-[#BD081C]' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-10">
        {/* Identity Banner */}
        <div className="mb-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-[#002147] text-[11px] font-black uppercase tracking-[0.25em] rounded-full mb-4">
            Future of Education
          </span>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Welcome to Jacobabad's <span className="text-[#002147] font-black underline decoration-rose-500 decoration-4 underline-offset-4">first AI-powered digital school</span>. 
            Meet your guide, EdVisor.
          </p>
          
          {/* Important Dates Banner */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-blue-50 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Admissions Open</p>
                <p className="text-xs font-bold text-[#002147]">April 15 - April 30</p>
              </div>
            </div>
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-rose-50 flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Classes Start</p>
                <p className="text-xs font-bold text-[#002147]">May 04, 2026</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-slate-200"></div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              An initiative of <span className="text-[#002147]">CASWA</span> & <span className="text-rose-500">EVOLUTION School of Excellence</span>
            </p>
            <div className="h-px w-8 bg-slate-200"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visual Assistant & Chat */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <AssistantPanel 
              onMessage={addMessage} 
              messages={messages} 
            />
            <div className="mt-4">
               <InfoCards />
            </div>
          </div>

          {/* Right Column: Admission, Contact & Leads */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-blue-100">
               <LeadForm onComplete={() => {}} />
            </div>
            
            <div className="bg-[#002147] p-8 rounded-[2.5rem] shadow-xl text-white">
              <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Visit & Contact</h3>
              <p className="text-blue-200 text-sm leading-relaxed font-medium mb-6">
                Wagha Street, Near Jamia Pir Bukhari Masjid,<br />
                Jacobabad, Sindh, Pakistan.
              </p>
              
              {/* Google Maps Link */}
              <a 
                href="https://share.google/CqVOPDkf6jEMfOGiV" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all mb-6 group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">Google Maps</p>
                  <p className="text-xs font-bold group-hover:underline">View Location</p>
                </div>
              </a>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                     <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.451 5.451l.773-1.548a1 1 0 011.06-.539l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                  </div>
                  <div>
                    <span className="opacity-60 uppercase text-[9px] font-black tracking-widest block">Phone</span>
                    <span className="font-bold text-lg">+92 332 2875909</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                     <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                  </div>
                  <div>
                    <span className="opacity-60 uppercase text-[9px] font-black tracking-widest block">Email</span>
                    <span className="font-bold">info@caswa.edu.pk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-blue-100">
              <h3 className="text-xl font-black mb-6 uppercase tracking-tighter text-[#002147]">Follow Us</h3>
              <div className="grid grid-cols-4 gap-4">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center transition-all duration-300 shadow-sm border border-slate-100 ${social.color} hover:shadow-md hover:-translate-y-1`}
                    title={social.name}
                  >
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            CASWA Model Science School is an initiative of <span className="text-[#002147]">CASWA</span> and <span className="text-rose-500">EVOLUTION School of Excellence</span>
          </p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
            © 2024 COMMUNITY ADVANCEMENT & SUPPORT WELFARE ASSOCIATION (CASWA)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;