import React from 'react';
import {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {db} from '../firebase/firebase';
import {AuthContext} from '../context/auth-context';

interface Deck {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    flashcardCount: number;
}

interface DeckContextProps {
    decks: Deck[];
    createDeck: (deckData: any) => Promise<void>;
    editDeck: (deckId: string, deckData: any) => Promise<void>;
    deleteDeck: (deckId: string) => Promise<void>;
}

const DeckContext = createContext<DeckContextProps | undefined>(undefined);

export function DeckProvider({
    children
}: {
    children: ReactNode;
}): React.ReactElement {
    const [decks, setDecks] = useState<Deck[]>([]);
    const {currentUser} = useContext(AuthContext);
    const userId = currentUser?.uid;

    useEffect(() => {
        const fetchDecks = db
            .collection(`users/${userId}/decks`)
            .onSnapshot(async snapshot => {
                const decksData: Deck[] = [];
                for (const doc of snapshot.docs) {
                    const deckData = {
                        id: doc.id,
                        name: doc.data().name,
                        created_at: doc.data().created_at,
                        updated_at: doc.data().updated_at,
                        flashcardCount: 0, // Default value

                        //Asynchronously fetch the size of the flashcards subcollection
                        async fetchFlashcardSize(): Promise<number> {
                            try {
                                const flashcardsSnapshot = await db
                                    .collection(
                                        `users/${userId}/decks/${doc.id}/flashcards`
                                    )
                                    .get();
                                return flashcardsSnapshot.size;
                            } catch (error) {
                                console.error(
                                    'Error fetching flashcards:',
                                    error
                                );
                                return 0;
                            }
                        }
                    };

                    // Update the flashcards property with the size of the flashcards subcollection
                    deckData.flashcardCount =
                        await deckData.fetchFlashcardSize();
                    decksData.push(deckData);
                }
                decksData.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                );
                setDecks(decksData);
            });
        return fetchDecks;
    }, [userId]);

    const createDeck = async (deckData: any): Promise<void> => {
        await db.collection(`users/${userId}/decks`).add(deckData);
    };

    const editDeck = async (deckId: string, deckData: any): Promise<void> => {
        await db
            .collection(`users/${userId}/decks`)
            .doc(deckId)
            .update(deckData);
    };

    const deleteDeck = async (deckId: string): Promise<void> => {
        await db.collection(`users/${userId}/decks`).doc(deckId).delete();
    };

    const contextValue: DeckContextProps = {
        decks,
        createDeck,
        editDeck,
        deleteDeck
    };

    return (
        <DeckContext.Provider value={contextValue}>
            {children}
        </DeckContext.Provider>
    );
}

export function useDeck(): DeckContextProps {
    const context = useContext(DeckContext);
    if (!context) {
        throw new Error('useDeck must be used within a DeckProvider');
    }

    return context;
}
