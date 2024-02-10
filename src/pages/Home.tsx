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
import {PrimaryButton} from '../components/PrimaryButton';

const Home: React.FC = () => {
    const {signOut} = useContext(AuthContext);
    const {practiceMode} = usePractice();
    const {deckId} = useParams();
    const isDeckRoute = deckId !== undefined;

    return (
        <div className="min-h-screen text-white">
            <nav className="bg-gray-600 p-4">
                <div className="max-w-full flex items-center justify-between">
                    <h3>Welcome!</h3>
                    <PrimaryButton content={'Sign Out'} onClick={signOut} />
                </div>
            </nav>
            <div className="md:grid md:grid-cols-4">
                <div className="md:mr-5 md:col-start-1 md:col-span-1">
                    <div className="flex">
                        <aside className="md:w-96 md:h-screen bg-[#131B2E] p-4">
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
                <div className="md:ml-5 md:p-4 md:col-start-2 md:col-span-3">
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
