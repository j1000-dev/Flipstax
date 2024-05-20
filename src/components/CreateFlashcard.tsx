import React from 'react';
import { useState, ChangeEvent, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFlashcard } from '../context/flashcard-context';
import { usePractice } from '../context/practice-context';
import { PrimaryButton } from './PrimaryButton';
import { Modal } from './Modal';
import { SecondaryButton } from './SecondaryButton';

export const CreateFlashcard: React.FC = () => {
    const [openModal, setOpenModal] = useState<Boolean>(false);
    const [practiceModal, setPracticeModal] = useState<Boolean>(false);
    const [deck, setDeck] = useState<string>('');
    const [frontText, setFrontText] = useState<string>('');
    const [backText, setBackText] = useState<string>('');
    const { createFlashcard, deckName } = useFlashcard();
    const { setType, setMode, reviewType } = usePractice();
    const { deckId } = useParams();

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
                <PrimaryButton
                    content="Create Flashcard"
                    onClick={(): void => setOpenModal(true)}
                />
            </div>
            <hr className="h-px my-4 bg-gray-300 border-0 dark:bg-gray-700"></hr>
            <div className="flex items-center justify-center">
                <button
                    onClick={(): void => setPracticeModal(true)}
                    type="button"
                    className="text-black 
                        bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 
                        hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 
                        dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    Practice
                </button>
            </div>
            {openModal == true && (
                <Modal
                    title="Create Flashcard"
                    onClose={(): void => setOpenModal(false)}
                    body={
                        <>
                            <div className="mb-5">
                                <label
                                    htmlFor="frontText"
                                    className="block my-2 text-sm font-medium text-white dark:text-white">
                                    Front
                                </label>
                                <textarea
                                    onChange={handleFrontText}
                                    value={frontText}
                                    id="frontText"
                                    name="frontText"
                                    rows={5}
                                    style={{ whiteSpace: 'pre-line' }}
                                    className="block p-2.5 w-full text-sm text-gray-900 rounded border focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500"
                                    placeholder="Add a term to remember or a question to answer."></textarea>
                            </div>
                            <div className="mt-5">
                                <label
                                    htmlFor="back"
                                    className="block my-2 text-sm font-medium text-white dark:text-white">
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
                        </>
                    }
                    footer={
                        <>
                            <PrimaryButton
                                content="Save and close"
                                onClick={() => addFlashcard('saveAndClose')}
                            />
                            <span className="mx-1"></span>
                            <SecondaryButton
                                content="Add another"
                                onClick={() => addFlashcard('addAnother')}
                            />
                        </>
                    }
                />
            )}
            {practiceModal && (
                <Modal
                    title="Pick items to review"
                    onClose={() => setPracticeModal(false)}
                    body={
                        <>
                            <p className="text-slate-600 dark:text-white">
                                Pick the items you would like to review
                            </p>
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
                                    className="block ms-2 text-sm font-medium text-slate-500 dark:text-gray-300">
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
                                    defaultChecked={reviewType == 'favorites'}
                                />
                                <label
                                    htmlFor="review-option-favorite"
                                    className="block ms-2 text-sm font-medium text-slate-500 dark:text-gray-300">
                                    Favorites only
                                </label>
                            </div>
                        </>
                    }
                    footer={
                        <PrimaryButton
                            content="Let's go!"
                            onClick={() => practiceFlashcards()}
                        />
                    }
                />
            )}
        </div>
    );
};
