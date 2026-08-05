import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decode, decodeAudioData, createBlob } from '../utils/audio';
import { ConnectionStatus, Message } from '../types';
import logoImg from '../src/assets/images/caswa_logo_1785940202046.jpg';

interface AssistantPanelProps {
  onMessage: (role: 'user' | 'assistant', text: string) => void;
  messages: Message[];
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ onMessage, messages }) => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const SYSTEM_INSTRUCTION = `
    You are CASWA-EdVisor (pronounced "KAS-WA-EdVisor"), the official Female AI Voice Assistant and Digital Guide of CASWA Model Science School (CMSS), Jacobabad, Pakistan.

    🌸 IDENTITY & BEHAVIOR:
    - You are a living, attentive, female digital guide.
    - Start with: "Assalam-o-Alaikum! I am CASWA-EdVisor from CASWA Model Science School."
    - Tone: Calm, friendly, human-like, female. Speak as if you are physically present at school reception.
    - Always refer to the school as "CASWA Model Science School" and mention it is the "first AI-powered digital school in the region."
    - Avoid long monologues.

    🔊 PRONUNCIATION RULES (CRITICAL):
    - The word "CASWA" MUST be pronounced as "KAS-WA" (/KAZ-wah/).
    - Use a clear, hard "K" sound. NEVER pronounce it as "SASWA".
    - Emphasize the first syllable slightly: KAS-wa.
    - When speaking the greeting, say "CASWA" as "KAS-WA" clearly and confidently.

    🧠 ATTENTIVENESS & MANNERS:
    - When listening: use short acknowledgements like “Ji…”, “Hmm…”, “I’m listening…”, “Bataiye…”.
    - When thinking: use “Let me check that for you…”, “Acha, main aap ko guide karti hoon…”.
    - When user stops: confirm gently “Kya main aap ki madad kar sakti hoon?” or “Kya aap admissions ke hawalay se poochna chahtay hain?”.
    - If idle: “Aap abhi bhi yahin hain? Main madad ke liye available hoon.”

    🏫 SCHOOL MANAGEMENT & PARTNERSHIP:
    - CASWA Model Science School is an initiative of CASWA and EVOLUTION School of Excellence.
    - CASWA operates and manages the school.
    - EVOLUTION School of Excellence provides academic and system support, including curriculum development, system improvements, and teacher training.
    - CASWA (pronounced KAS-WA) is a non-profit organization based in Jacobabad.
    - CASWA's mission includes: Digital Education, Climate Change, and Employability skills.

    📅 CONTEXT:
    - Admissions 2026: Start August 01, 2026. End August 14, 2026.
    - Classes Start: August 24, 2026.
    - Focus: Science, Robotics, AI, STEM, Entrepreneurship, Financial Literacy.
    - Location: Wagha Street, near Jamia Pir Bukhari Masjid, Jacobabad.
    - Phone Number: +92 332 2875909.
    - Provide this phone number politely for admission follow-up or any queries.
  `;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, transcription]);

  const startAssistant = async () => {
    if (status !== ConnectionStatus.DISCONNECTED && status !== ConnectionStatus.ERROR) return;
    try {
      setErrorMessage(null);
      setStatus(ConnectionStatus.CONNECTING);
      
      // Check for API key and prompt if missing (for preview models)
      let apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
      console.log('API Key present:', !!apiKey, 'Length:', apiKey?.length);
      
      if ((!apiKey || apiKey === 'undefined' || apiKey === '') && (window as any).aistudio) {
        console.log('No API key found in environment, checking AI Studio selection...');
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          console.log('No key selected, opening dialog...');
          await (window as any).aistudio.openSelectKey();
          // Re-check after dialog
          apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
        }
      }

      if (!apiKey || apiKey === 'undefined' || apiKey === '') {
        throw new Error('Gemini API Key is missing. Please ensure GEMINI_API_KEY is set in project settings (Secrets).');
      }

      console.log('Initializing GoogleGenAI with key length:', apiKey.length);
      const ai = new GoogleGenAI({ apiKey });
      
      console.log('Requesting microphone access...');
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone access granted.');
      } catch (mediaError) {
        console.error('Microphone error:', mediaError);
        throw new Error('Microphone access denied. Please allow microphone permissions in your browser.');
      }
      
      // Create and resume AudioContexts
      console.log('Initializing AudioContexts...');
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      await audioContextRef.current.resume();
      await outputAudioContextRef.current.resume();
      console.log('AudioContexts resumed.');

      const modelName = 'gemini-3.1-flash-live-preview';
      console.log(`Connecting to Live API with model: ${modelName}...`);

      const sessionPromise = ai.live.connect({
        model: modelName,
        callbacks: {
          onopen: () => {
            console.log('Live API connection opened successfully.');
            setStatus(ConnectionStatus.CONNECTED);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ audio: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            if (message.serverContent?.turnComplete) {
              setTranscription(t => { if (t.trim()) onMessage('assistant', t); return ''; });
            }
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              const ctx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onerror: (e) => { 
            console.error('Live API Error Object:', e);
            let detail = 'Unknown error';
            if (e && typeof e === 'object') {
              detail = (e as any).message || JSON.stringify(e);
            }
            
            const isPublished = !window.location.hostname.includes('ais-dev') && !window.location.hostname.includes('localhost');
            if (isPublished) {
              setErrorMessage(`Connection failed (${detail}). Ensure GEMINI_API_KEY is set in Settings > Secrets and REPUBLISH the app.`);
            } else {
              setErrorMessage(`Connection error: ${detail}`);
            }
            setStatus(ConnectionStatus.ERROR); 
          },
          onclose: (e) => { 
            console.log('Live API connection closed:', e);
            setStatus(ConnectionStatus.DISCONNECTED); 
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          outputAudioTranscription: {},
        }
      });
      sessionPromiseRef.current = sessionPromise;
      
      // Connection timeout
      setTimeout(() => {
        setStatus(currentStatus => {
          if (currentStatus === ConnectionStatus.CONNECTING) {
            console.warn('Connection attempt timed out.');
            setErrorMessage('Connection timed out. Please try again.');
            return ConnectionStatus.ERROR;
          }
          return currentStatus;
        });
      }, 15000);

    } catch (err: any) {
      console.error('Failed to start assistant:', err);
      setErrorMessage(err.message || 'Failed to start assistant');
      setStatus(ConnectionStatus.ERROR);
    }
  };

  const stopAssistant = () => {
    if (sessionPromiseRef.current) sessionPromiseRef.current.then(s => s.close());
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    setStatus(ConnectionStatus.DISCONNECTED);
    setIsSpeaking(false);
  };

  const statusClass = isSpeaking ? 'status-speaking' : 
                    status === ConnectionStatus.CONNECTED ? 'status-listening' : 
                    status === ConnectionStatus.CONNECTING ? 'status-thinking' : 
                    status === ConnectionStatus.ERROR ? 'status-error' : 'status-idle';

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-blue-100 flex flex-col h-[780px] transition-all">
      <div className="bg-[#002147] py-2.5 px-6 flex items-center justify-center gap-2.5 shadow-md">
        <img 
          src={logoImg} 
          alt="CASWA Logo" 
          className="w-6 h-6 rounded-full bg-white p-0.5 object-contain"
          referrerPolicy="no-referrer"
        />
        <h3 className="text-white text-[11px] font-black uppercase tracking-[0.4em]">
          CASWA Model Science School
        </h3>
      </div>

      <div className="bg-white pt-12 pb-4 px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-black text-[#002147] tracking-tighter drop-shadow-sm">
          CASWA-EdVisor
        </h2>
        <p className="text-blue-500 font-bold tracking-widest text-[10px] uppercase mt-3">
          Your Living Digital Guide & Assistant
        </p>
      </div>

      <div className="flex-grow relative overflow-y-auto p-6 space-y-4 bg-slate-50/20 flex flex-col items-center">
        {messages.length === 0 && !transcription ? (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className={`living-mic-container ${statusClass}`}>
              <div className="mic-pulse-circle"></div>
              <div className="mic-ray"></div>
              <div className="mic-ray"></div>
              <div className="mic-ray"></div>
              
              <button 
                onClick={status === ConnectionStatus.CONNECTED ? stopAssistant : startAssistant}
                disabled={status === ConnectionStatus.CONNECTING}
                className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-90 border-8 border-white ${
                  status === ConnectionStatus.CONNECTED 
                    ? (isSpeaking ? 'bg-rose-500 scale-105' : 'bg-[#002147]') 
                    : status === ConnectionStatus.CONNECTING 
                      ? 'bg-blue-100 text-blue-300' 
                      : status === ConnectionStatus.ERROR
                        ? 'bg-rose-600 text-white'
                        : 'bg-[#002147] text-white'
                }`}
                style={isSpeaking ? { animation: 'speech-pulse 1.5s infinite' } : {}}
              >
                <div className={`${status === ConnectionStatus.CONNECTED && !isSpeaking ? 'animate-bounce' : ''}`}>
                  {status === ConnectionStatus.CONNECTED ? (
                    <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-20 h-20 mb-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" />
                    </svg>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] mt-3">
                  {status === ConnectionStatus.CONNECTED ? (isSpeaking ? 'SPEAKING' : 'LISTENING') : status === ConnectionStatus.CONNECTING ? 'THINKING' : status === ConnectionStatus.ERROR ? 'ERROR - RETRY' : 'TAP TO START'}
                </span>
              </button>
              {errorMessage && (
                <div className="absolute -bottom-16 w-64 text-center">
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider leading-tight">
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 pb-8 w-full">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[1.5rem] px-6 py-4 shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-[#002147] text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-blue-100 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed font-medium">{m.text}</p>
                </div>
              </div>
            ))}
            {transcription && (
              <div className="flex justify-start">
                <div className="bg-blue-50/80 border border-blue-100 text-[#002147] max-w-[85%] rounded-[1.5rem] px-6 py-4 animate-pulse italic text-sm font-medium">
                  "{transcription}..."
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {(messages.length > 0 || transcription) && (
        <div className="p-6 bg-white border-t border-blue-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full transition-colors ${status === ConnectionStatus.CONNECTED ? (isSpeaking ? 'bg-rose-500' : 'bg-green-500 animate-pulse') : 'bg-slate-300'}`}></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Active</span>
          </div>
          <button 
            onClick={status === ConnectionStatus.CONNECTED ? stopAssistant : startAssistant}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all transform active:scale-90 bg-rose-600 text-white shadow-rose-200/50"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};