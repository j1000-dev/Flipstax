import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/auth-context';
import { DeckProvider } from '../context/deck-context';
import { Decks } from './Decks';
import { useParams } from 'react-router-dom';
import { CreateDeck } from '../components/CreateDeck';
import { CreateFlashcard } from '../components/CreateFlashcard';
import { FlashcardProvider } from '../context/flashcard-context';
import { Flashcards } from './Flashcards';
import { usePractice } from '../context/practice-context';
import { Practice } from './Practice';
import { PrimaryButton } from '../components/PrimaryButton';

const Home: React.FC = () => {
    const { signOut } = useContext(AuthContext);
    const { practiceMode } = usePractice();
    const { deckId } = useParams();
    const [isAsideOpen, setIsAsideOpen] = useState<boolean>(true);
    const isDeckRoute = deckId !== undefined;

    const handleToggleAside = (): void => {
        setIsAsideOpen((prevIsAsideOpen) => !prevIsAsideOpen);
    };

    return (
        <div className="min-h-screen text-white">
            <div className="bg-gray-600 px-3 sticky top-0 z-10">
                <div className="max-w-full flex items-center justify-between">
                    <div className="flex items-center justify-center">
                        {
                            !isAsideOpen && (
                                <button onClick={handleToggleAside} className="p-2 text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                    <svg
                                        className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
                                    </svg>
                                </button>
                            )
                        }
                        <p className="mx-3">Welcome!</p>
                    </div>
                    <PrimaryButton content={'Sign Out'} onClick={signOut} />
                </div>
            </div>
            <div className="md:flex">
                <aside className={`md:w-96 md:h-screen bg-[#131B2E] p-4 ${
                    isAsideOpen ? '' : 'hidden md:block'
                }`}>
                    <button
                        type="button"
                        onClick={handleToggleAside}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <svg
                            aria-hidden="true"
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="sr-only">Toggle menu</span>
                    </button>
                    <div className="overflow-y-auto max-h-screen" style={{height: '95%'}}>
                        {isDeckRoute ? (
                            <FlashcardProvider>
                                <CreateFlashcard />
                                <Flashcards />
                            </FlashcardProvider>
                        ) : (
                            <DeckProvider>
                                <CreateDeck />
                                <Decks />
                            </DeckProvider>
                        )}
                    </div>
                </aside>
                <div className={`md:p-4 ${!isAsideOpen ? 'md:w-full' : ''}`}>
                    {practiceMode ? (
                        <FlashcardProvider>
                            <Practice />
                        </FlashcardProvider>
                    ) : (
                        <h1 className="text-center">
                            No flashcards selected to practice.
                        </h1>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Home;
