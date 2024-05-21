import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { usePractice } from '../context/practice-context';
import { HeartIcon } from '../icons/HeartIcon';
import { FilledHeartIcon } from '../icons/FilledHeartIcon';
import { useFlashcard } from '../context/flashcard-context';
import { ThemeContext } from '../context/theme-context';

export const Practice: React.FC = () => {
    const { fetchFlashcards, flashcards, reviewType, shuffleFC, deckName } =
        usePractice();
    const { editFlashcard } =
        useFlashcard();
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
                            <div className="flex justify-center items-center overflow-y-auto" style={{height: 'calc(100vh - 450px)'}}>
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
                </>
            )}
        </div>
    );
};
