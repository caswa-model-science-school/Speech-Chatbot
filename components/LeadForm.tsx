import React, { useState } from 'react';

interface LeadFormProps {
  onComplete: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onComplete }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { onComplete(); }, 3000);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center space-y-4 bg-blue-50 rounded-[1.5rem] border border-blue-100">
        <div className="w-16 h-16 bg-[#002147] rounded-full flex items-center justify-center text-white mx-auto text-2xl shadow-lg">
          ✓
        </div>
        <h3 className="text-xl font-black text-[#002147]">Shukriya!</h3>
        <p className="text-sm text-blue-700 font-medium">
          Our team will contact you shortly regarding admissions.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
      <div className="border-b border-slate-200 pb-2 mb-2">
        <h3 className="text-lg font-black text-[#002147]">Admission Inquiry</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Get a callback today</p>
      </div>
      
      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Your Name</label>
        <input 
          type="text" 
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student or Parent Name"
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#002147] transition-all"
        />
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">WhatsApp Number</label>
        <input 
          type="tel" 
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+92 3XX XXXXXXX"
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#002147] transition-all"
        />
      </div>

      <button 
        type="submit"
        className="w-full py-4 bg-[#002147] text-white text-sm font-black rounded-xl hover:bg-blue-800 transition-all shadow-xl hover:shadow-blue-200/50 active:scale-[0.98] uppercase tracking-widest"
      >
        Submit Request
      </button>
    </form>
  );
};