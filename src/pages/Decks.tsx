import React, {useState, ChangeEvent} from 'react';
import {useDeck} from '../context/deck-context';
import {useNavigate} from 'react-router-dom';

export const Decks: React.FC = () => {
    const {decks} = useDeck();
    const navigate = useNavigate();
    const [deckName, setDeckName] = useState<string>('');
    const [editModal, setEditModal] = useState<Boolean>(false);
    const [deleteModal, setDeleteModal] = useState<Boolean>(false);
    const [deckId, setDeckId] = useState<string>('');
    const {editDeck, deleteDeck} = useDeck();

    const handleDeckClick = (
        deckId: string,
        type: string,
        event: React.MouseEvent
    ): void => {
        event.stopPropagation(); //Stop the svg click from propagating to the deck div
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
        <>
            {decks.map(deck => (
                <div
                    className="cursor-pointer py-3"
                    key={deck.id}
                    onClick={event => handleDeckClick(deck.id, 'deck', event)}>
                    <div className="block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <h3 className="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
                            {deck.name}
                        </h3>
                        <div className="flex items-center justify-between">
                            <h2>{deck.flashcardCount} flashcards</h2>
                            <div className="flex items-center justify-between">
                                <svg
                                    onClick={event =>
                                        handleDeckClick(
                                            deck.id,
                                            'delete',
                                            event
                                        )
                                    }
                                    className="w-6 h-6 text-gray-800 dark:text-white transition-colors duration-300 ease-in-out hover:text-blue-500"
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
                                        handleDeckClick(deck.id, 'edit', event)
                                    }
                                    className="ml-2 w-7 h-7 text-gray-800 dark:text-white transition-colors duration-300 ease-in-out hover:text-blue-500"
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
                <div
                    id="default-modal"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-full overflow-y-auto">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Edit your deck
                                </h3>
                                <button
                                    onClick={(): void => setEditModal(false)}
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    data-modal-hide="default-modal">
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* Modal body */}
                            <div className="p-4 md:p-5 space-y-4">
                                <div className="mb-5">
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Deck name
                                    </label>
                                    <input
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring focus:outline-none focus focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="deckName"
                                        name="deckName"
                                        value={deckName}
                                        onChange={handleChange}
                                        placeholder="Name"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Modal footer */}
                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {deleteModal == true && (
                <div
                    id="default-modal"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-full overflow-y-auto">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Delete your deck
                                </h3>
                                <button
                                    onClick={(): void => setDeleteModal(false)}
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    data-modal-hide="default-modal">
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* Modal body */}
                            <div className="p-4 md:p-5 space-y-4">
                                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                    Are you sure you want to delete this deck?
                                </p>
                            </div>
                            {/* Modal footer */}
                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button
                                    onClick={handleDelete}
                                    data-modal-hide="default-modal"
                                    type="button"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    I accept
                                </button>
                                <button
                                    onClick={() => setDeleteModal(false)}
                                    data-modal-hide="default-modal"
                                    type="button"
                                    className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
