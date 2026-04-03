import React from 'react';

const INFO_DATA = [
  { title: 'STEM & Robotics', desc: 'Modern curriculum integrated with AI and Hands-on Science.', icon: '🤖' },
  { title: 'Curriculum', desc: 'KG1 to Grade 12 following National Standards with modern skillsets.', icon: '📚' },
  { title: 'Timings', desc: 'Mon - Sat: 8:30 AM to 1:30 PM.', icon: '⏰' },
  { title: 'Scholarships', desc: 'Financial support available for deserving and bright students.', icon: '🎓' },
];

export const InfoCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {INFO_DATA.map((item, idx) => (
        <div key={idx} className="p-6 bg-white rounded-2xl border border-blue-50 hover:border-blue-200 transition-all shadow-sm group">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-[#002147] group-hover:text-white transition-all duration-300">
            {item.icon}
          </div>
          <h3 className="font-extrabold text-[#002147] mb-2">{item.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
        </div>
      ))}
    </div>
  );
};