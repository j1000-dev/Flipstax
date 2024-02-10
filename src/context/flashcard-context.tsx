import React, {ReactNode} from 'react';
import {createContext, useState, useContext} from 'react';
import {db} from '../firebase/firebase';
import {AuthContext} from '../context/auth-context';

interface Flashcard {
    id: string;
    deck_id: string;
    front_text: string;
    back_text: string;
    favorited: Boolean;
    created_at: string;
    updated_at: string;
}

interface FlashcardContextProps {
    flashcards: Flashcard[];
    createFlashcard: (deckId: string, flashcardData: any) => Promise<void>;
    editFlashcard: (
        deckId: string,
        flashcardId: string,
        flashcardData: any
    ) => Promise<void>;
    deleteFlashcard: (deckId: string, flashcardId: string) => Promise<void>;
    fetchFlashcards: (deckId: string) => void;
    deckName: (deckId: string) => Promise<string | null>;
}

const FlashcardContext = createContext<FlashcardContextProps | undefined>(
    undefined
);

export function FlashcardProvider({
    children
}: {
    children: ReactNode;
}): React.ReactElement {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const {currentUser} = useContext(AuthContext);
    const userId = currentUser?.uid;

    const fetchFlashcards = (deckId: string): (() => void) => {
        const getFlashcards = db
            .collection(`users/${userId}/decks/${deckId}/flashcards`)
            .onSnapshot(flashcardsSnapshot => {
                const flashcardsData: Flashcard[] = flashcardsSnapshot.docs.map(
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
                flashcardsData.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                );
                setFlashcards(flashcardsData);
            });

        return () => getFlashcards();
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

    const createFlashcard = async (
        deckId: string,
        flashcardData: any
    ): Promise<void> => {
        await db
            .collection(`users/${userId}/decks/${deckId}/flashcards`)
            .add(flashcardData);
    };
    const editFlashcard = async (
        deckId: string,
        flashcardId: string,
        flashcardData: any
    ): Promise<void> => {
        await db
            .collection(`users/${userId}/decks/${deckId}/flashcards`)
            .doc(flashcardId)
            .update(flashcardData);
    };
    const deleteFlashcard = async (
        deckId: string,
        flashcardId: string
    ): Promise<void> => {
        await db
            .collection(`users/${userId}/decks/${deckId}/flashcards`)
            .doc(flashcardId)
            .delete();
    };

    const contextValue: FlashcardContextProps = {
        flashcards,
        createFlashcard,
        editFlashcard,
        deleteFlashcard,
        fetchFlashcards,
        deckName
    };

    return (
        <FlashcardContext.Provider value={contextValue}>
            {children}
        </FlashcardContext.Provider>
    );
}

export function useFlashcard(): FlashcardContextProps {
    const context = useContext(FlashcardContext);

    if (!context) {
        throw new Error('useFlashcard must be used within a FlashcardProvider');
    }

    return context;
}
