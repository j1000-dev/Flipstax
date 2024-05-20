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
import { ThemeContext } from '../context/theme-context';

const Home: React.FC = () => {
    const { signOut } = useContext(AuthContext);
    const { practiceMode } = usePractice();
    const { deckId } = useParams();
    const [isAsideOpen, setIsAsideOpen] = useState<boolean>(true);
    const isDeckRoute = deckId !== undefined;
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('themeContext must be used within a ThemeProvider');
    }

    const { toggleTheme } = themeContext;

    const handleToggleAside = (): void => {
        setIsAsideOpen((prevIsAsideOpen) => !prevIsAsideOpen);
    };

    const navbarHeight = 64; // Adjust this value according to your navbar's height
    const contentHeight = `calc(100vh - ${navbarHeight}px)`;

    return (
        <div className="flex flex-col text-slate-600 dark:text-white" style={{ height: '100vh' }}>
            <div className="bg-slate-300 dark:bg-gray-600 px-3">
                <div className="max-w-full flex items-center justify-between">
                    <div className="flex items-center">
                        {!isAsideOpen && (
                            <button
                                onClick={handleToggleAside}
                                className="p-2 text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
                                </svg>
                            </button>
                        )}
                        <p className="mx-3">Welcome!</p>
                    </div>
                    <div className="flex items-center">
                        <PrimaryButton content={'Sign Out'} onClick={signOut} />
                        <button
                            onClick={toggleTheme}
                            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-slate-600 dark:text-white">
                            <i className="fa-solid fa-circle-half-stroke"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex overflow-hidden" style={{ height: contentHeight }}>
                <aside className={`z-50 fixed inset-y-0 left-0 transform ${isAsideOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-96 bg-white dark:bg-[#131B2E] p-4`}>
                    <button
                        type="button"
                        onClick={handleToggleAside}
                        className="md:hidden text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                        <span className="sr-only">Toggle menu</span>
                    </button>
                    <div className="overflow-y-auto max-h-full">
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
                <main className={`flex-1 p-4 transition-all duration-300 ${isAsideOpen ? 'md:ml-96' : 'md:ml-0'}`}>
                    {practiceMode ? (
                        <FlashcardProvider>
                            <Practice />
                        </FlashcardProvider>
                    ) : (
                        <h1 className="text-center">No flashcards selected to practice.</h1>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Home;
