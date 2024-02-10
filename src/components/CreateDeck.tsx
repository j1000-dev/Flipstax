import React, {useState, ChangeEvent} from 'react';
import {useDeck} from '../context/deck-context';

export const CreateDeck: React.FC = () => {
    const [openModal, setOpenModal] = useState<Boolean>(false);
    const [deckName, setDeckName] = useState<string>('');
    const {createDeck} = useDeck();

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setDeckName(event.target.value);
    };
    const handleNextButtonClick = async (): Promise<void> => {
        try {
            await createDeck({
                name: deckName,
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString()
            });
            setDeckName('');
        } catch (error) {
            console.error('Error creating deck:', error);
        }
    };

    return (
        <div className="mb-5">
            <div className="flex justify-between items-center">
                <h4>Decks</h4>
                <button
                    onClick={(): void => setOpenModal(true)}
                    className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Create Deck
                </button>
            </div>
            {openModal == true && (
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
                                    Name your new deck
                                </h3>
                                <button
                                    onClick={(): void => setOpenModal(false)}
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
                                    onClick={handleNextButtonClick}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
