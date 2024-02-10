import React, {useState, ChangeEvent} from 'react';
import {useDeck} from '../context/deck-context';
import {useNavigate} from 'react-router-dom';
import {Modal} from '../components/Modal';
import {SecondaryButton} from '../components/SecondaryButton';
import {PrimaryButton} from '../components/PrimaryButton';

export const Decks: React.FC = () => {
    const {decks} = useDeck();
    const navigate = useNavigate();
    const [deckName, setDeckName] = useState<string>('');
    const [editModal, setEditModal] = useState<Boolean>(false);
    const [deleteModal, setDeleteModal] = useState<Boolean>(false);
    const [deckId, setDeckId] = useState<string>('');
    const {editDeck, deleteDeck} = useDeck();

    const handleDeckClick = (
        deckName: string,
        deckId: string,
        type: string,
        event: React.MouseEvent
    ): void => {
        event.stopPropagation(); //Stop the svg click from propagating to the deck div
        setDeckName(deckName);
        switch (type) {
            case 'edit':
                setEditModal(true);
                break;
            case 'delete':
                setDeleteModal(true);
                break;
            default:
                navigate(`/home/${deckId}`);
                break;
        }
        setDeckId(deckId);
    };

    const handleEdit = async (): Promise<void> => {
        try {
            await editDeck(deckId, {
                name: deckName,
                updated_at: new Date().toLocaleString()
            });
            setDeckName('');
            setEditModal(false);
        } catch (error) {
            console.error('Error creating deck:', error);
        }
    };

    const handleDelete = async (): Promise<void> => {
        try {
            await deleteDeck(deckId);
            setDeleteModal(false);
        } catch (error) {
            console.error('Error creating deck:', error);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setDeckName(event.target.value);
    };

    return (
        <div className="overflow-y-auto" style={{height: '80%'}}>
            {decks.map(deck => (
                <div
                    className="cursor-pointer py-3 mx-2"
                    key={deck.id}
                    onClick={event =>
                        handleDeckClick(deck.name, deck.id, 'deck', event)
                    }>
                    <div
                        className="
                        text-white 
                        block rounded-lg shadow
                        max-w-sm p-4 
                        bg-gray-800 border-gray-700 hover:bg-gray-700 
                        dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <p className="tracking-tighter text-white dark:text-white md:text-lg">
                            {deck.name}
                        </p>
                        <div className="flex items-center justify-between">
                            <p className="text-gray-400 dark:text-gray-400">
                                {deck.flashcardCount} flashcards
                            </p>
                            <div className="flex items-center justify-between">
                                <svg
                                    onClick={event =>
                                        handleDeckClick(
                                            deck.name,
                                            deck.id,
                                            'delete',
                                            event
                                        )
                                    }
                                    className="w-6 h-6 text-white dark:text-white transition-colors duration-300 ease-in-out hover:text-blue-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                                    />
                                </svg>
                                <svg
                                    onClick={event =>
                                        handleDeckClick(
                                            deck.name,
                                            deck.id,
                                            'edit',
                                            event
                                        )
                                    }
                                    className="ml-2 w-7 h-7 text-white dark:text-white transition-colors duration-300 ease-in-out hover:text-blue-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m14.3 4.8 2.9 2.9M7 7H4a1 1 0 0 0-1 1v10c0 .6.4 1 1 1h11c.6 0 1-.4 1-1v-4.5m2.4-10a2 2 0 0 1 0 3l-6.8 6.8L8 14l.7-3.6 6.9-6.8a2 2 0 0 1 2.8 0Z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {editModal == true && (
                <Modal
                    title="Edit your deck"
                    onClose={() => setEditModal(false)}
                    body={
                        <div className="mb-5">
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-white dark:text-white">
                                Deck name
                            </label>
                            <input
                                className="
                                    bg-gray-700 border border-gray-600 text-white placeholder-gray-400
                                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                    text-sm rounded-lg block w-full p-2.5 
                                    focus:ring focus:outline-none focus focus:ring-blue-500 focus:border-blue-500 
                                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="deckName"
                                name="deckName"
                                value={deckName}
                                onChange={handleChange}
                                placeholder="Name"
                                required
                            />
                        </div>
                    }
                    footer={
                        <SecondaryButton
                            content={'Save'}
                            onClick={handleEdit}
                        />
                    }
                />
            )}
            {deleteModal == true && (
                <Modal
                    title="Delete your deck"
                    onClose={() => setDeleteModal(false)}
                    body={
                        <p className="text-base leading-relaxed text-gray-400 dark:text-gray-400">
                            Are you sure you want to delete this deck?
                        </p>
                    }
                    footer={
                        <>
                            <PrimaryButton
                                content="Yes"
                                onClick={handleDelete}
                            />
                            <span className="mx-1"></span>
                            <SecondaryButton
                                content="Cancel"
                                onClick={() => setDeleteModal(false)}
                            />
                        </>
                    }
                />
            )}
        </div>
    );
};
