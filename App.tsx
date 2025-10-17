
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, LogEntry } from './types';
import WaveJournalModal from './components/WaveJournalModal';
import { analyzeJournal, getPersonalizedSuggestion } from './services/geminiService';
import AiInsightCard from './components/AiInsightCard';
import Environment from './components/Environment';
import SurpriseTestCard from './components/SurpriseTestCard';
import { AwarenessIcon, ControlIcon, EnergyIcon } from './components/Icons';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(() => {
        const savedState = localStorage.getItem('rewireQuestState');
        if (savedState) {
            return JSON.parse(savedState);
        }
        return {
            currentDay: 1,
            level: 1,
            awarenessPoints: 0,
            controlPoints: 0,
            energy: 0,
            logs: [],
            lastSuccessTimestamp: null,
            aiInsight: null,
            insightRequested: false,
        };
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
    const [showSurpriseTest, setShowSurpriseTest] = useState(false);
    
    useEffect(() => {
        localStorage.setItem('rewireQuestState', JSON.stringify(gameState));
    }, [gameState]);

    const fetchAiInsight = useCallback(async () => {
        if (gameState.logs.length > 0 && !gameState.insightRequested) {
            setIsLoadingInsight(true);
            const insight = await analyzeJournal(gameState.logs);
            setGameState(prev => ({ ...prev, aiInsight: insight, insightRequested: true }));
            setIsLoadingInsight(false);
        }
    }, [gameState.logs, gameState.insightRequested]);

    const fetchAiSuggestion = useCallback(async () => {
        if (gameState.logs.length > 0) {
            setIsLoadingSuggestion(true);
            const suggestion = await getPersonalizedSuggestion(gameState.logs);
            setAiSuggestion(suggestion);
            setIsLoadingSuggestion(false);
        }
    }, [gameState.logs]);

    useEffect(() => {
        if (gameState.currentDay >= 4 && !gameState.insightRequested) {
            fetchAiInsight();
        }
        if (gameState.level === 3 && !aiSuggestion) {
            fetchAiSuggestion();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState.currentDay, gameState.level, gameState.insightRequested]);

    useEffect(() => {
        let surpriseTimer: NodeJS.Timeout;
        if (gameState.level === 2 && !isModalOpen && !showSurpriseTest) {
            const timeSinceLastLog = gameState.logs.length > 0 ? Date.now() - gameState.logs[gameState.logs.length - 1].timestamp : Infinity;
            // show test randomly between 1 and 2 hours after last action
            const randomTime = Math.random() * (3600000) + 3600000;
            if (timeSinceLastLog > randomTime) {
                 surpriseTimer = setTimeout(() => {
                    setShowSurpriseTest(true);
                }, 1000); // short delay to show
            }
        }
        return () => clearTimeout(surpriseTimer);
    }, [gameState.level, gameState.logs, isModalOpen, showSurpriseTest]);


    const handleWaveSubmit = (log: { feeling: string; trigger: string; succeeded: boolean }) => {
        const newLog: LogEntry = {
            ...log,
            day: gameState.currentDay,
            timestamp: Date.now(),
        };

        setGameState(prev => {
            let { currentDay, level, awarenessPoints, controlPoints, energy, lastSuccessTimestamp } = prev;
            
            if (log.succeeded) {
                const now = new Date();
                const lastSuccessDate = lastSuccessTimestamp ? new Date(lastSuccessTimestamp) : null;
                
                if (!lastSuccessDate || lastSuccessDate.toDateString() !== now.toDateString()) {
                    currentDay++;
                    lastSuccessTimestamp = now.getTime();
                }

                if (level === 1) awarenessPoints++;
                else if (level === 2) controlPoints++;
                else if (level === 3) energy++;

            } else {
                const levelStartDay = level === 1 ? 1 : (level === 2 ? 4 : 8);
                currentDay = Math.max(levelStartDay, currentDay - 1);
            }

            if (currentDay >= 8) level = 3;
            else if (currentDay >= 4) level = 2;
            else level = 1;

            return {
                ...prev,
                currentDay,
                level,
                awarenessPoints,
                controlPoints,
                energy,
                lastSuccessTimestamp,
                logs: [...prev.logs, newLog],
            };
        });

        setIsModalOpen(false);
    };

    const handleSurpriseTestAnswer = (points: number) => {
        setGameState(prev => ({
            ...prev,
            controlPoints: prev.controlPoints + points
        }));
        setShowSurpriseTest(false);
    }
    
    const getLevelInfo = () => {
        switch (gameState.level) {
            case 1: return { name: 'المستوى ١: الوعي', color: 'text-blue-400' };
            case 2: return { name: 'المستوى ٢: السيطرة', color: 'text-yellow-400' };
            case 3: return { name: 'المستوى ٣: التبديل', color: 'text-green-400' };
            default: return { name: 'مستوى غير معروف', color: 'text-white' };
        }
    };
    
    const levelInfo = getLevelInfo();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 sm:p-6 md:p-8">
            <div className="max-w-2xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Rewire Quest</h1>
                    <p className="text-gray-400 mt-2">رحلتك لبناء عقل جديد</p>
                </header>

                <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl mb-8 grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-400 text-sm">اليوم الحالي</p>
                        <p className="text-5xl font-bold">{gameState.currentDay}</p>
                    </div>
                    <div className="text-left">
                        <p className="text-gray-400 text-sm">المستوى</p>
                        <p className={`text-2xl font-bold ${levelInfo.color}`}>{levelInfo.name}</p>
                    </div>
                     <div className="col-span-2 border-t border-gray-700 pt-4 flex justify-around">
                        <div className="text-center">
                            <p className="text-sm text-blue-400 flex items-center justify-center"><AwarenessIcon /> وعي</p>
                            <p className="text-2xl font-bold">{gameState.awarenessPoints}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-yellow-400 flex items-center justify-center"><ControlIcon/> سيطرة</p>
                            <p className="text-2xl font-bold">{gameState.controlPoints}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-green-400 flex items-center justify-center"><EnergyIcon/> طاقة</p>
                            <p className="text-2xl font-bold">{gameState.energy}</p>
                        </div>
                    </div>
                </div>

                <main>
                    <div className="text-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transform transition-transform hover:scale-105"
                        >
                            واجه موجة الآن
                        </button>
                        <p className="text-gray-500 mt-3 text-sm">اضغط هنا عند الشعور بالرغبة أو المحفز</p>
                    </div>

                    <AiInsightCard title="رؤية من مساعدك الذكي" content={gameState.aiInsight} isLoading={isLoadingInsight} />

                    {gameState.level === 3 && <Environment energy={gameState.energy} />}
                    {gameState.level === 3 && <AiInsightCard title="اقتراح مخصص لك" content={aiSuggestion} isLoading={isLoadingSuggestion} />}
                </main>
            </div>
            
            {isModalOpen && <WaveJournalModal onClose={() => setIsModalOpen(false)} onSubmit={handleWaveSubmit} />}
            {showSurpriseTest && <SurpriseTestCard logs={gameState.logs} onClose={() => setShowSurpriseTest(false)} onAnswer={handleSurpriseTestAnswer} />}
        </div>
    );
};

export default App;
