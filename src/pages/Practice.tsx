import React, { useEffect, useState, useContext, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { usePractice } from '../context/practice-context';
import { HeartIcon } from '../icons/HeartIcon';
import { FilledHeartIcon } from '../icons/FilledHeartIcon';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { Modal } from '../components/Modal';
import { useFlashcard } from '../context/flashcard-context';
import { ThemeContext } from '../context/theme-context';

export const Practice: React.FC = () => {
    const { fetchFlashcards, flashcards, reviewType, shuffleFC, deckName } =
        usePractice();
    const { editFlashcard, deleteFlashcard } =
        useFlashcard();
    const [selectedFlashcard, setSelectedFlashcard] = useState<string>('');
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [editModal, setEditModal] = useState<Boolean>(false);
    const [frontText, setFrontText] = useState<string>('');
    const [backText, setBackText] = useState<string>('');
    const [curIndex, setCurIndex] = useState<number>(0);
    const [showFront, setShowFront] = useState<boolean>(true);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [deck, setDeck] = useState<string>('');
    const { deckId } = useParams();
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('themeContext must be used within a ThemeProvider');
    }
    const { theme } = themeContext;

    useEffect(() => {
        fetchFlashcards();
    }, [deckId, reviewType]);

    useEffect(() => {
        const fetchDeckName = async (): Promise<void> => {
            if (deckId) {
                const deck = await deckName(deckId);
                setDeck(deck || '');
            }
        };
        fetchDeckName();
    }, [deckId]);

    const handleClick = (type: string): void => {
        let tempIndex = curIndex;
        if (type === 'prev') {
            tempIndex -= 1;
            if (tempIndex < 0) {
                setCurIndex(flashcards.length - 1);
            } else {
                setCurIndex(tempIndex);
            }
        } else {
            tempIndex += 1;
            if (tempIndex >= flashcards.length) {
                setCurIndex(0);
            } else {
                setCurIndex(tempIndex);
            }
        }
        // Reset flip state when navigating to a new card
        setShowFront(true);
    };

    const handleDeleteClick = async (
        event: React.MouseEvent
    ): Promise<void> => {
        event.stopPropagation();
        if (deckId) {
            deleteFlashcard(deckId, selectedFlashcard);
        }
        setDeleteModal(false);
    };

    const handleEditClick = (id: string): void => {
        setSelectedFlashcard(id);
        //Retrieve the selected flashcard details and set the initial values for frontText and backText
        const selectedFlashcardDetails = flashcards.find(fc => fc.id === id);
        if (selectedFlashcardDetails) {
            setFrontText(selectedFlashcardDetails.front_text);
            setBackText(selectedFlashcardDetails.back_text);
        }

        setEditModal(true);
        setDeleteModal(false);
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

    const handleFrontText = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setFrontText(event.target.value);
    };

    const handleBackText = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setBackText(event.target.value);
    };

    const handleFlip = (): void => {
        setIsFlipped(!isFlipped);
        setShowFront(!showFront);
    };

    const favoriteFlashcard = async (
        flashcardId: string,
        favorited: Boolean,
        event: React.MouseEvent
    ): Promise<void> => {
        event.stopPropagation();
        if (deckId) {
            editFlashcard(deckId, flashcardId, { favorited: !favorited });
        }
    };


    // Check if flashcards array is not empty before rendering
    if (flashcards.length === 0) {
        return <p className="text-center">No flashcards selected to practice 😊</p>; // or any loading indicator
    }

    return (
        <div>
            {flashcards.length > 0 && (
                <>
                    <div className="flex items-center justify-center m-3">
                        <p className="tracking-wider text-slate-600 md:text-lg capitalize dark:text-gray-400">
                            {reviewType} flashcards: {deck}
                        </p>
                        <svg
                            onClick={() => {
                                shuffleFC();
                                setCurIndex(0);
                            }}
                            className="cursor-pointer w-6 h-6 dark:text-slate-600 dark:text-white mx-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13.5 9.2 15 7h5m0 0-3-3m3 3-3 3M4 17h4l1.6-2.3M4 7h4l7 10h5m0 0-3 3m3-3-3-3"
                            />
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center my-5">
                        <p className="text-center tracking-tight text-gray-600 md:text-lg dark:text-gray-400">
                            {curIndex + 1} of {flashcards.length} flashcards
                        </p>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => handleClick('prev')}
                                className="
                                    px-5 py-2.5 m-2
                                    text-slate-600 dark:text-white 
                                    bg-slate-200 dark:bg-gray-800 
                                    hover:bg-slate-300 dark:hover:bg-gray-600
                                    focus:outline-none font-medium 
                                    border border-slate-300 dark:border-gray-600
                                    rounded-lg text-sm
                                "
                            >
                                Prev
                            </button>
                            <button
                                type="button"
                                className={`px-5 py-2.5 m-2 border border-slate-300 dark:border-gray-600 text-slate-600 dark:text-white ${theme === 'dark' ? 'bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' :
                                    'bg-gradient-to-r from-cyan-200 to-blue-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'}`}
                                onClick={() => handleFlip()}>
                                Flip
                            </button>
                            <button
                                onClick={() => handleClick('next')}
                                className="
                                    px-5 py-2.5 m-2
                                    text-slate-600 dark:text-white 
                                    bg-slate-200 dark:bg-gray-800 
                                    hover:bg-slate-300 dark:hover:bg-gray-600 
                                    focus:outline-none font-medium 
                                    border border-slate-300 dark:border-gray-600
                                    rounded-lg text-sm
                                "
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div
                            className={`
                            max-w-screen text-center p-6 rounded-lg shadow
                            bg-slate-100 border border-gray-200
                            dark:bg-gray-800 dark:border-gray-700 ${isFlipped ? 'flip flip-card' : 'flip'}`}
                            style={{ height: '400px', width: '80%' }}>
                            <div className={`py-3 tracking-normal text-center text-slate-600 md:text-lg dark:text-gray-400 ${isFlipped ? 'flip-card-back' : ''}`}>
                                {showFront == true ? (
                                    <div className="grid grid-cols-3">
                                        <p className="text-center col-start-2 text-xl font-bold">Front</p>
                                        <div className="flex justify-end col-start-3"
                                        >
                                            <svg
                                                onClick={event => {
                                                    event.stopPropagation(),
                                                        setDeleteModal(false)
                                                    setEditModal(true)
                                                    handleEditClick(flashcards[curIndex].id);
                                                }}
                                                className="w-6 h-6 cursor-pointer text-slate-600 dark:text-white transition-colors duration-300 ease-in-out hover:text-blue-300 dark:hover:text-blue-400"
                                                aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24">
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                                />
                                            </svg>
                                            <svg
                                                onClick={event => {
                                                    event.stopPropagation(),
                                                        setDeleteModal(true),
                                                        setEditModal(false),
                                                        setSelectedFlashcard(flashcards[curIndex].id);
                                                }}
                                                className="w-6 h-6 cursor-pointer text-slate-600 dark:text-white transition-colors duration-300 ease-in-out hover:text-blue-300 dark:hover:text-blue-400"
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
                                            {flashcards[curIndex].favorited == true ? (
                                                <span className="cursor-pointer" onClick={event =>
                                                    favoriteFlashcard(
                                                        flashcards[curIndex].id,
                                                        flashcards[curIndex].favorited,
                                                        event
                                                    )
                                                }><FilledHeartIcon /></span>
                                            ) : (
                                                <span className="cursor-pointer" onClick={event =>
                                                    favoriteFlashcard(
                                                        flashcards[curIndex].id,
                                                        flashcards[curIndex].favorited,
                                                        event
                                                    )
                                                }><HeartIcon /></span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className='text-xl font-bold'>Back</p>
                                )}
                            </div>
                            <div className="flex justify-center items-center overflow-y-auto" style={{ height: 'calc(100vh - 450px)' }}>
                                {showFront === true ? (
                                    <p
                                        className={`text-slate-600 text-lg dark:text-white h-full ${isFlipped ? 'flip-card-back' : ''}`}
                                        dangerouslySetInnerHTML={{
                                            __html: flashcards[curIndex]
                                                .front_text
                                        }}
                                    />
                                ) : (
                                    <p
                                        className={`text-slate-600 text-lg dark:text-white h-full ${isFlipped ? 'flip-card-back' : ''}`}
                                        dangerouslySetInnerHTML={{
                                            __html: flashcards[curIndex]
                                                .back_text
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {editModal == true && (
                        <Modal
                            title="Edit Flashcard"
                            onClose={() => setEditModal(false)}
                            body={
                                <>
                                    <div className="mb-5">
                                        <label
                                            htmlFor="frontText"
                                            className="block my-2 text-sm font-medium text-slate-600 dark:text-white">
                                            Front
                                        </label>
                                        <textarea
                                            onChange={handleFrontText}
                                            value={frontText.replace(/<br>/g, '\n')}
                                            id="frontText"
                                            name="frontText"
                                            rows={5}
                                            style={{ whiteSpace: 'pre-line' }}
                                            className="block p-2.5 w-full text-sm text-gray-900 rounded border focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500"
                                            placeholder="Add a term to remember or a question to answer."></textarea>
                                    </div>
                                    <div className="mt-5">
                                        <label
                                            htmlFor="backText"
                                            className="block my-2 text-sm font-medium text-slate-600 dark:text-white">
                                            Back
                                        </label>
                                        <textarea
                                            onChange={handleBackText}
                                            value={backText.replace(/<br>/g, '\n')}
                                            id="backText"
                                            style={{ whiteSpace: 'pre-line' }}
                                            rows={5}
                                            className="block p-2.5 w-full text-sm text-gray-900 rounded border focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500"
                                            placeholder="Keep the definition or answer simple and focused."></textarea>
                                    </div>
                                </>
                            }
                            footer={
                                <PrimaryButton
                                    content="Save and close"
                                    onClick={() => editFC()}
                                />
                            }
                        />
                    )}
                    {deleteModal == true && (
                        <Modal
                            title="Delete your flashcard"
                            onClose={() => setDeleteModal(false)}
                            body={
                                <p className="text-base leading-relaxed text-slate-600 dark:text-gray-400">
                                    Are you sure you want to delete this flashcard?
                                </p>
                            }
                            footer={
                                <>
                                    <PrimaryButton
                                        content="Yes"
                                        onClick={event => handleDeleteClick(event)}
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
                </>
            )}
        </div>
    );
};
