import React from 'react';
import {useState, ChangeEvent, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import {useFlashcard} from '../context/flashcard-context';
import {usePractice} from '../context/practice-context';

export const CreateFlashcard: React.FC = () => {
    const [openModal, setOpenModal] = useState<Boolean>(false);
    const [practiceModal, setPracticeModal] = useState<Boolean>(false);
    const [deck, setDeck] = useState<string>('');
    const [frontText, setFrontText] = useState<string>('');
    const [backText, setBackText] = useState<string>('');
    const {createFlashcard, deckName} = useFlashcard();
    const {setType, setMode, reviewType} = usePractice();
    const {deckId} = useParams();

    useEffect(() => {
        const fetchDeckName = async (): Promise<void> => {
            if (deckId) {
                const deck = await deckName(deckId);
                setDeck(deck || '');
            }
        };
        fetchDeckName();
    }, [deckId]);

    const addFlashcard = async (type: string): Promise<void> => {
        try {
            if (deckId) {
                await createFlashcard(deckId, {
                    deck_id: deckId,
                    front_text: frontText.replace(/\n/g, '<br>'),
                    back_text: backText.replace(/\n/g, '<br>'),
                    favorited: false,
                    created_at: new Date().toLocaleString(),
                    updated_at: new Date().toLocaleString()
                });
            } else {
                console.error('deckId is undefined');
            }
        } catch (error) {
            console.error('Error creating deck:', error);
        }
        if (type === 'saveAndClose') {
            setOpenModal(false);
        }
        setFrontText('');
        setBackText('');
    };

    const handleFrontText = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setFrontText(event.target.value);
    };

    const handleBackText = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setBackText(event.target.value);
    };

    const practiceFlashcards = (): void => {
        const selectedValue = (
            document.querySelector(
                'input[name="review"]:checked'
            ) as HTMLInputElement
        )?.value;
        setType(selectedValue);
        setMode(true);
        setPracticeModal(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <Link to="/home" className="cursor-pointer">
                    <div className="flex items-center">
                        <svg
                            className="rotate-180 w-3.5 h-3.5 ms-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                        <h4 className="mx-3">{deck}</h4>
                    </div>
                </Link>
                <button
                    onClick={(): void => setOpenModal(true)}
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Create Flashcard
                </button>
            </div>
            <hr className="h-px my-4 bg-gray-700 border-0 dark:bg-gray-700"></hr>
            <div className="flex items-center justify-center">
                <button
                    onClick={(): void => setPracticeModal(true)}
                    type="button"
                    className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    Practice
                </button>
            </div>
            {/* //TODO: Make modals a reusable component */}
            {openModal == true && (
                <div
                    id="default-modal"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-full overflow-y-auto">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        {/* Modal content */}
                        <div className="relative bg-gray-700 rounded-lg shadow dark:bg-gray-700">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600 dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-white dark:text-white">
                                    Create Flashcard
                                </h3>
                                <button
                                    onClick={(): void => setOpenModal(false)}
                                    type="button"
                                    className="text-white bg-transparent hover:bg-gray-600 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                                        htmlFor="frontText"
                                        className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Front
                                    </label>
                                    <textarea
                                        onChange={handleFrontText}
                                        value={frontText}
                                        id="frontTxt"
                                        name="frontText"
                                        rows={5}
                                        style={{whiteSpace: 'pre-line'}}
                                        className="block p-2.5 w-full text-sm text-gray-900 rounded border focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500"
                                        placeholder="Add a term to remember or a question to answer."></textarea>
                                </div>
                                <div className="mt-5">
                                    <label
                                        htmlFor="back"
                                        className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Back
                                    </label>
                                    <textarea
                                        onChange={handleBackText}
                                        value={backText}
                                        id="back"
                                        rows={5}
                                        className="block p-2.5 w-full text-sm text-gray-900 rounded border focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500"
                                        placeholder="Keep the definition or answer simple and focused."></textarea>
                                </div>
                            </div>
                            {/* Modal footer */}
                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button
                                    onClick={() => addFlashcard('saveAndClose')}
                                    className="mx-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Save and close
                                </button>
                                <button
                                    onClick={() => addFlashcard('addAnother')}
                                    className="bg-pink-600 hover:bg-pink-500 focus:ring-pink-600 mx-2 text-white focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-500 dark:focus:ring-pink-600">
                                    Add another
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {practiceModal && (
                <div
                    id="default-modal"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-full overflow-y-auto">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        {/* Modal content */}
                        <div className="relative bg-gray-700 rounded-lg shadow dark:bg-gray-700">
                            {/* Modal header */}
                            <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-600 rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-white dark:text-white">
                                    Pick items to review
                                </h3>
                                <button
                                    onClick={(): void =>
                                        setPracticeModal(false)
                                    }
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-600 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                                <p className="text-white">Pick the items you would like to review</p>
                                <div className="flex items-center mb-4">
                                    <input
                                        id="review-option-all"
                                        type="radio"
                                        name="review"
                                        value="all"
                                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                                        defaultChecked={reviewType == 'all'}
                                    />
                                    <label
                                        htmlFor="review-option-all"
                                        className="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
                                        All items
                                    </label>
                                </div>

                                <div className="flex items-center mb-4">
                                    <input
                                        id="review-option-favorite"
                                        type="radio"
                                        name="review"
                                        value="favorites"
                                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                                        defaultChecked={
                                            reviewType == 'favorites'
                                        }
                                    />
                                    <label
                                        htmlFor="review-option-favorite"
                                        className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Favorites only
                                    </label>
                                </div>
                            </div>
                            {/* Modal footer */}
                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button
                                    onClick={() => practiceFlashcards()}
                                    className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 mx-2 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Practice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
