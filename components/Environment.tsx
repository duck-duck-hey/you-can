
import React from 'react';

interface EnvironmentProps {
    energy: number;
}

const Environment: React.FC<EnvironmentProps> = ({ energy }) => {
    const getEnvironment = () => {
        if (energy >= 100) return { emoji: '🏙️', name: 'مدينة مزدهرة', description: 'لقد بنيت عالماً جديداً. عقلك هو حصنك.' };
        if (energy >= 50) return { emoji: '🏝️', name: 'جزيرة خضراء', description: 'عاداتك الجديدة تخلق واحة من السلام.' };
        if (energy >= 25) return { emoji: '🌳', name: 'حديقة', description: 'تنمو قوتك وتزدهر مع كل قرار صحيح.' };
        if (energy >= 10) return { emoji: '🌱', name: 'شجرة صغيرة', description: 'بذور التغيير قد نبتت. استمر في رعايتها.' };
        return { emoji: '✨', name: 'بذرة', description: 'كل نقطة طاقة هي بداية لشيء عظيم.' };
    };

    const env = getEnvironment();

    return (
        <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 my-6 text-center border border-green-500/30 shadow-lg">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mb-2">بيئتك الداخلية</h3>
            <div className="text-6xl my-4 transition-transform transform hover:scale-110">{env.emoji}</div>
            <p className="text-2xl font-bold">{env.name}</p>
            <p className="text-gray-400">{env.description}</p>
        </div>
    );
};

export default Environment;
