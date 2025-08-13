
import React from 'react';
import { DrawnCard } from '../types';

interface TarotCardProps {
    card: DrawnCard | null;
    isFlipped: boolean;
}

export const TarotCard: React.FC<TarotCardProps> = ({ card, isFlipped }) => {
    if (!card) return null;

    const { name } = card.card;
    const { isReversed } = card;

    // Use a simple hash to get a consistent-ish image for a card name
    const imageId = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000;

    return (
        <div className={`card-inner w-full h-full ${isFlipped ? 'card-flipped' : ''}`}>
            {/* Card Back */}
            <div className="card-back absolute w-full h-full rounded-2xl bg-indigo-900 border-2 border-purple-400 overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 opacity-20"></div>
                <div className="w-full h-full flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-purple-300 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v11.494m-5.747-8.592l11.494 5.698M6.253 18l11.494-5.698M19.747 12a7.747 7.747 0 11-15.494 0 7.747 7.747 0 0115.494 0z"/></svg>
                </div>
            </div>

            {/* Card Front */}
            <div className="card-front absolute w-full h-full rounded-2xl bg-gray-800 border-2 border-yellow-400 overflow-hidden shadow-2xl shadow-purple-500/40">
                <div className={`w-full h-full flex flex-col transition-transform duration-500 ${isReversed ? 'rotate-180' : ''}`}>
                    <div className="flex-grow bg-gray-700 relative">
                        <img src={`https://picsum.photos/id/${imageId}/250/400`} alt={name} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black opacity-10"></div>
                    </div>
                    <div className="p-3 bg-gray-900 text-center">
                        <h3 className="font-cinzel text-base text-yellow-300">{name}</h3>
                        <p className="text-xs text-yellow-500">{isReversed ? 'Reversed' : 'Upright'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
