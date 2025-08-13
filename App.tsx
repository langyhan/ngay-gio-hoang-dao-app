
import React, { useState, useCallback, useEffect } from 'react';
import { CardData, DrawnCard, AppState } from './types';
import { ALL_CARDS } from './constants/tarot';
import { generateReading } from './services/geminiService';
import { TarotCard } from './components/TarotCard';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('IDLE');
    const [question, setQuestion] = useState<string>('');
    const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null);
    const [reading, setReading] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    const handleDrawCard = useCallback(async () => {
        if (appState === 'LOADING') return;

        setAppState('LOADING');
        setError(null);
        setReading('');
        setIsFlipped(false);

        // Select a random card
        const cardIndex = Math.floor(Math.random() * ALL_CARDS.length);
        const selectedCard: CardData = ALL_CARDS[cardIndex];
        const isReversed = Math.random() > 0.5;
        const newDrawnCard = { card: selectedCard, isReversed };
        setDrawnCard(newDrawnCard);

        try {
            const generatedText = await generateReading(newDrawnCard.card.name, newDrawnCard.isReversed, question);
            setReading(generatedText);
            setAppState('RESULT');
            setTimeout(() => setIsFlipped(true), 100); // flip after a short delay
        } catch (e) {
            console.error(e);
            setError('The ethereal connection was lost. Please try again.');
            setAppState('IDLE');
        }
    }, [question, appState]);

    const handleReset = () => {
        setAppState('IDLE');
        setQuestion('');
        setDrawnCard(null);
        setReading('');
        setError(null);
        setIsFlipped(false);
    };

    const renderReading = (text: string) => {
        const sections = text.split(/(The Card's Essence|Your Reading)/).filter(Boolean);
        const formattedSections = [];
        for (let i = 0; i < sections.length; i += 2) {
            const title = sections[i];
            const content = sections[i + 1];
            if (title && content) {
                formattedSections.push(
                    <div key={title}>
                        <h3 className="text-xl font-cinzel text-purple-300 mt-4 mb-2">{title}</h3>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{content.trim()}</p>
                    </div>
                );
            } else {
                 formattedSections.push(<p key={i} className="text-gray-300 leading-relaxed whitespace-pre-wrap">{title}</p>)
            }
        }
        return formattedSections;
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
            <header className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-purple-200 tracking-wider">
                    Mystic Visions Tarot
                </h1>
                <p className="text-purple-300 mt-2 text-sm sm:text-base">Gaze into the digital ether and find your truth.</p>
            </header>

            <main className="w-full max-w-4xl flex flex-col items-center">
                {appState !== 'RESULT' && (
                    <div className="w-full max-w-lg text-center bg-black bg-opacity-20 p-6 rounded-xl shadow-2xl backdrop-blur-sm border border-purple-500 border-opacity-30">
                        <label htmlFor="question" className="block text-lg font-cinzel text-gray-200 mb-3">
                            Focus your mind. Ask your question.
                        </label>
                        <input
                            id="question"
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Or simply seek general guidance..."
                            className="w-full bg-gray-800 bg-opacity-50 border border-purple-400 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                            disabled={appState === 'LOADING'}
                        />
                         {error && <p className="text-red-400 mt-4">{error}</p>}
                    </div>
                )}
                
                <div className="mt-8 flex flex-col lg:flex-row items-center justify-center gap-8 w-full">
                    <div className="w-[250px] h-[400px] perspective">
                        {appState === 'IDLE' && (
                             <button onClick={handleDrawCard} className="w-full h-full bg-indigo-900 rounded-2xl shadow-lg border-2 border-purple-400 flex flex-col items-center justify-center text-purple-200 hover:bg-indigo-800 hover:shadow-purple-400/30 transition-all duration-300 transform hover:scale-105">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-5.747-8.592l11.494 5.698M6.253 18l11.494-5.698"/></svg>
                                 <span className="font-cinzel text-xl">Draw a Card</span>
                             </button>
                        )}
                        {appState === 'LOADING' && (
                            <div className="w-full h-full bg-gray-800 rounded-2xl shadow-lg border-2 border-purple-400 flex flex-col items-center justify-center">
                                <LoadingSpinner />
                                <p className="mt-4 font-cinzel text-purple-300 animate-pulse">Shuffling the cosmos...</p>
                            </div>
                        )}
                        {(appState === 'RESULT') && (
                            <TarotCard card={drawnCard} isFlipped={isFlipped} />
                        )}
                    </div>
                    
                    {appState === 'RESULT' && reading && (
                        <div className="lg:max-w-md w-full bg-black bg-opacity-30 p-6 rounded-xl shadow-2xl backdrop-blur-sm border border-purple-500 border-opacity-20 animate-fade-in">
                            <h2 className="text-2xl font-cinzel text-center text-purple-200 mb-4">{drawnCard?.card.name} - {drawnCard?.isReversed ? 'Reversed' : 'Upright'}</h2>
                            <div className="max-h-[300px] overflow-y-auto pr-2">
                               {renderReading(reading)}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    {appState === 'RESULT' && (
                        <button onClick={handleReset} className="bg-purple-600 text-white font-bold py-2 px-6 rounded-full hover:bg-purple-500 transition-colors shadow-lg animate-fade-in">
                            New Reading
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;
