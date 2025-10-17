
import React, { useState, useEffect } from 'react';
import { getSurpriseTestAlternatives } from '../services/geminiService';
import { LogEntry } from '../types';

interface SurpriseTestCardProps {
    onAnswer: (points: number) => void;
    onClose: () => void;
    logs: LogEntry[];
}

const SurpriseTestCard: React.FC<SurpriseTestCardProps> = ({ onAnswer, onClose, logs }) => {
    const [alternatives, setAlternatives] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAlternatives = async () => {
            setIsLoading(true);
            const alts = await getSurpriseTestAlternatives(logs);
            setAlternatives(alts);
            setIsLoading(false);
        };
        fetchAlternatives();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelect = () => {
        onAnswer(2); // +2 control points
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-2xl p-6 my-6 border border-yellow-500/50 shadow-lg w-full max-w-sm mx-4 animate-fade-in-up">
                <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">اختبار مفاجئ!</h3>
                <p className="text-center text-gray-300 mb-6">ما المحفز الآن؟ اختر بديلاً صحياً لمواجهته.</p>
                {isLoading ? (
                    <div className="space-y-3">
                       {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-700 rounded-lg animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {alternatives.map((alt, index) => (
                            <button
                                key={index}
                                onClick={handleSelect}
                                className="w-full text-center bg-gray-700 hover:bg-yellow-600 font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
                            >
                                {alt}
                            </button>
                        ))}
                    </div>
                )}
                 <button onClick={onClose} className="w-full mt-6 text-gray-400 hover:text-white">تجاهل</button>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SurpriseTestCard;
