
import React, { useState, useEffect } from 'react';

interface WaveJournalModalProps {
  onClose: () => void;
  onSubmit: (log: { feeling: string; trigger: string; succeeded: boolean }) => void;
}

const WaveJournalModal: React.FC<WaveJournalModalProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState<'exercise' | 'journal'>('exercise');
  const [timer, setTimer] = useState(90);
  const [feeling, setFeeling] = useState('');
  const [trigger, setTrigger] = useState('');

  useEffect(() => {
    if (step === 'exercise' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setStep('journal');
    }
  }, [step, timer]);
  
  const getExercisePhase = () => {
    if (timer > 60) return { name: 'تنفس بعمق', color: 'bg-blue-500' };
    if (timer > 30) return { name: 'تحرك قليلاً', color: 'bg-green-500' };
    return { name: 'لاحظ ما حولك', color: 'bg-purple-500' };
  };

  const handleSubmit = (succeeded: boolean) => {
    if (feeling.trim() && trigger.trim()) {
      onSubmit({ feeling, trigger, succeeded });
    } else {
      alert('الرجاء ملء حقلي الشعور والمحفز.');
    }
  };
  
  const exercisePhase = getExercisePhase();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all duration-300 scale-95 animate-fade-in-up">
        {step === 'exercise' ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">{exercisePhase.name}</h2>
            <p className="text-gray-300 mb-6">هذا التمرين سيساعدك على تجاوز الموجة. ركز في اللحظة الحالية.</p>
            <div className="relative w-48 h-48 mx-auto flex justify-center items-center">
                <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-700" strokeWidth="5" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle 
                        className="text-blue-500" 
                        strokeWidth="5"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - timer / 90)}
                        strokeLinecap="round"
                        stroke="currentColor" 
                        fill="transparent" 
                        r="45" cx="50" cy="50"
                        style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%'}}
                    />
                </svg>
              <span className="text-5xl font-mono font-bold">{timer}</span>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">سجّل ملاحظاتك</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                placeholder="بماذا شعرت؟ (مثال: ملل، قلق، فضول)"
                className="w-full bg-gray-700 border-gray-600 border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                placeholder="ما هو المحفز؟ (مثال: تصفح السوشيال ميديا، نهاية العمل)"
                className="w-full bg-gray-700 border-gray-600 border-2 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleSubmit(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
                >
                    نجحت في الصمود
                </button>
                <button
                    onClick={() => handleSubmit(false)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
                >
                    استسلمت للموجة
                </button>
            </div>
             <button onClick={onClose} className="w-full mt-4 text-gray-400 hover:text-white">إغلاق</button>
          </div>
        )}
      </div>
       <style>{`
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
       `}</style>
    </div>
  );
};

export default WaveJournalModal;
