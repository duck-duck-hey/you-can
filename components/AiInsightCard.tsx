
import React from 'react';

interface AiInsightCardProps {
    title: string;
    content: string | null;
    isLoading: boolean;
}

const AiInsightCard: React.FC<AiInsightCardProps> = ({ title, content, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 my-6 border border-blue-500/30 shadow-lg animate-pulse">
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">{title}</h3>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
        );
    }

    if (!content) {
        return null;
    }

    return (
        <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 my-6 border border-blue-500/30 shadow-lg transition-all duration-300 hover:border-blue-500">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">{title}</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
        </div>
    );
};

export default AiInsightCard;
