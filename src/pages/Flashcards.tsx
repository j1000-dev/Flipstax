import React, {ChangeEvent, useEffect, useState} from 'react';
import {useFlashcard} from '../context/flashcard-context';
import {useParams} from 'react-router-dom';
import {HeartIcon} from '../icons/HeartIcon';
import {FilledHeartIcon} from '../icons/FilledHeartIcon';

export const Flashcards: React.FC = () => {
    const {flashcards, fetchFlashcards, deleteFlashcard, editFlashcard} =
        useFlashcard();
    const [editModal, setEditModal] = useState<Boolean>(false);
    const [frontText, setFrontText] = useState<string>('');
    const [backText, setBackText] = useState<string>('');
    const [selectedFlashcard, setSelectedFlashcard] = useState<string>('');
    const {deckId} = useParams();

    useEffect(() => {
        if (deckId) {
            fetchFlashcards(deckId);
        } else {
            console.error('deckId is undefined');
        }
    }, [deckId]);

    const handleEditClick = (id: string): void => {
        setSelectedFlashcard(id);

        //Retrieve the selected flashcard details and set the initial values for frontText and backText
        const selectedFlashcardDetails = flashcards.find(fc => fc.id === id);
        if (selectedFlashcardDetails) {
            setFrontText(selectedFlashcardDetails.front_text);
            setBackText(selectedFlashcardDetails.back_text);
        }

        setEditModal(true);
    };

    const handleDeleteClick = async (flashcardId: string): Promise<void> => {
        if (deckId) {
            deleteFlashcard(deckId, flashcardId);
        }
    };

    const handleFrontText = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setFrontText(event.target.value);
    };

    const handleBackText = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setBackText(event.target.value);
    };

    const favoriteFlashcard = async (
        flashcardId: string,
        favorited: Boolean
    ): Promise<void> => {
        if (deckId) {
            editFlashcard(deckId, flashcardId, {favorited: !favorited});
        }
    };

    const editFC = async (): Promise<void> => {
        if (deckId) {
            editFlashcard(deckId, selectedFlashcard, {
                front_text: frontText.replace(/\n/g, '<br>'),
                back_text: backText.replace(/\n/g, '<br>'),
                updated_at: new Date().toLocaleString()
            });
        }
        setEditModal(false);
    };

    return (
        <div className="overflow-y-auto" style={{height: '80%'}}>
            {flashcards.map(fc => (
                <div className="cursor-pointer py-3" key={fc.id}>
                    <a className="block max-w-sm p-3 hover:bg-gray-100 bg-gray-800 border-gray-700 hover:bg-gray-700 border rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <div className="flex items-center justify-between">
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: fc.front_text
                                }}
                                className="mb-2 font-bold tracking-tight text-white dark:text-white"
                            />
                            <div className="flex items-center">
                                <svg
                                    onClick={() => handleDeleteClick(fc.id)}
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
                                    onClick={() => {
                                        handleEditClick(fc.id);
                                    }}
                                    className="ml-2 mr-1 w-7 h-7 text-gray-800 dark:text-white transition-colors duration-300 ease-in-out hover:text-blue-500"
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
                                <div
                                    onClick={() =>
                                        favoriteFlashcard(fc.id, fc.favorited)
                                    }>
                                    {fc.favorited == true ? (
                                        <FilledHeartIcon />
                                    ) : (
                                        <HeartIcon />
                                    )}
                                </div>
                            </div>
                        </div>
                        <p dangerouslySetInnerHTML={{__html: fc.back_text}} />
                    </a>
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
                                    Edit Flashcard
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
                                        htmlFor="frontText"
                                        className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Front
                                    </label>
                                    <textarea
                                        onChange={handleFrontText}
                                        value={frontText.replace(/<br>/g, '\n')}
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
                                        value={backText.replace(/<br>/g, '\n')}
                                        id="back"
                                        rows={5}
                                        className="block p-2.5 w-full text-sm text-gray-900 rounded border focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500"
                                        placeholder="Keep the definition or answer simple and focused."></textarea>
                                </div>
                            </div>
                            {/* Modal footer */}
                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button
                                    onClick={() => editFC()}
                                    className="mx-2 text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Save and close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};