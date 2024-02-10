import React from 'react';
import {useContext} from 'react';
import {AuthContext} from '../context/auth-context';
import {DeckProvider} from '../context/deck-context';
import {Decks} from './Decks';
import {useParams} from 'react-router-dom';
import {CreateDeck} from '../components/CreateDeck';
import {CreateFlashcard} from '../components/CreateFlashcard';
import {FlashcardProvider} from '../context/flashcard-context';
import {Flashcards} from './Flashcards';
import {usePractice} from '../context/practice-context';
import {Practice} from './Practice';

const Home: React.FC = () => {
    const {signOut} = useContext(AuthContext);
    const {practiceMode} = usePractice();
    const {deckId} = useParams();
    const isDeckRoute = deckId !== undefined;

    return (
        <div className="h-screen text-white">
            <nav className="bg-gray-600">
                <div className="max-w-full flex items-center justify-between p-4">
                    <h3>Welcome!</h3>
                    <button onClick={signOut}>Sign Out</button>
                </div>
            </nav>
            <div className="grid grid-cols-4">
                <div className="mr-5 col-start-1 col-span-1">
                    <div className="flex">
                        <aside className="fixed w-96 h-screen bg-[#131B2E] p-4">
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
                        </aside>
                    </div>
                </div>
                <div className="ml-5 p-4 col-start-2 col-span-3">
                    {practiceMode ? (
                        <Practice />
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
