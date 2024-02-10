import React, {ReactNode, createContext, useState, useContext} from 'react';
import {db} from '../firebase/firebase';
import {AuthContext} from './auth-context';
import {useParams} from 'react-router-dom';

interface Flashcard {
    id: string;
    deck_id: string;
    front_text: string;
    back_text: string;
    favorited: Boolean;
    created_at: string;
    updated_at: string;
}

interface PracticeContextProps {
    flashcards: Flashcard[];
    practiceMode: Boolean;
    reviewType: string;
    setMode: (mode: boolean) => void;
    setType: (reviewType: string) => void;
    fetchFlashcards: () => void;
    shuffleFC: () => void;
    deckName: (deckId: string) => Promise<string | null>;
}

const PracticeContext = createContext<PracticeContextProps | undefined>(
    undefined
);

export function PracticeProvider({
    children
}: {
    children: ReactNode;
}): React.ReactElement {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const {currentUser} = useContext(AuthContext);
    const userId = currentUser?.uid;
    const [reviewType, setReviewType] = useState<string>('all');
    const [practiceMode, setPracticeMode] = useState<Boolean>(false);
    const {deckId} = useParams();

    const fetchFlashcards = (): (() => void) => {
        const getFlashcards = db
            .collection(`users/${userId}/decks/${deckId}/flashcards`)
            .onSnapshot(flashcardsSnapshot => {
                let flashcardsData: Flashcard[] = flashcardsSnapshot.docs.map(
                    flashcardDoc => ({
                        id: flashcardDoc.id,
                        deck_id: flashcardDoc.data().deck_id,
                        front_text: flashcardDoc.data().front_text,
                        back_text: flashcardDoc.data().back_text,
                        favorited: flashcardDoc.data().favorited,
                        created_at: flashcardDoc.data().created_at,
                        updated_at: flashcardDoc.data().updated_at
                    })
                );
                if (reviewType === 'favorites') {
                    flashcardsData = flashcardsData.filter(
                        f => f.favorited && f.deck_id === deckId
                    );
                }
                setFlashcards(flashcardsData);
            });

        return () => getFlashcards();
    };

    const setMode = (reviewType: Boolean): void => {
        setPracticeMode(reviewType);
    };

    const setType = (reviewType: string): void => {
        setReviewType(reviewType);
    };

    const deckName = async (deckId: string): Promise<string | null> => {
        try {
            const deckDoc = await db
                .collection(`users/${userId}/decks`)
                .doc(deckId)
                .get();

            if (deckDoc.exists) {
                const deckName = deckDoc.data()?.name;
                return deckName || null;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error getting deck:', error);
            return null;
        }
    };

    //Fisher-Yates shuffle algorithm
    const shuffleFC = (): void => {
        // Create a copy of the flashcards array to avoid modifying the original array directly
        const shuffled = [...flashcards];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setFlashcards(shuffled);
    };

    const contextValue: PracticeContextProps = {
        flashcards,
        setType,
        fetchFlashcards,
        practiceMode,
        setMode,
        reviewType,
        shuffleFC,
        deckName
    };

    return (
        <PracticeContext.Provider value={contextValue}>
            {children}
        </PracticeContext.Provider>
    );
}

export function usePractice(): PracticeContextProps {
    const context = useContext(PracticeContext);
    if (!context) {
        throw new Error('usePractice must be used within a PracticeProvider');
    }
    return context;
}
