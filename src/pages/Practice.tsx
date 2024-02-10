import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {usePractice} from '../context/practice-context';

export const Practice: React.FC = () => {
    const {fetchFlashcards, flashcards, reviewType, shuffleFC} = usePractice();
    const [curIndex, setCurIndex] = useState<number>(0);
    const [showFront, setShowFront] = useState<boolean>(true);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const {deckId} = useParams();

    useEffect(() => {
        fetchFlashcards();
    }, [deckId, reviewType]);

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

    // Check if flashcards array is not empty before rendering
    if (flashcards.length === 0) {
        return <p>Waiting for flashcards to practice...</p>; // or any loading indicator
    }

    return (
        <div style={{height: '80%'}}>
            {flashcards.length > 0 && (
                <>
                    <div className="flex items-center">
                        <p className="mr-3 tracking-wider text-gray-500 md:text-lg capitalize dark:text-gray-400">
                            {reviewType} flashcards
                        </p>
                        <svg
                            onClick={() => {
                                shuffleFC();
                                setCurIndex(0);
                            }}
                            className="cursor-pointer w-6 h-6 text-gray-800 dark:text-white"
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
                        <p className="text-center tracking-tight text-gray-500 md:text-lg dark:text-gray-400">
                            {curIndex + 1} of {flashcards.length} flashcards
                        </p>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => handleClick('prev')}
                                className="mx-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                Prev
                            </button>
                            <button
                                onClick={() => handleClick('next')}
                                className="mx-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                Next
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div
                            className={`max-w-screen text-center p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ${isFlipped ? 'flip flip-card' : 'flip'}`}
                            style={{height: '500px', width: '70%'}}>
                            <div className="flex justify-center items-center h-full">
                                {showFront === true ? (
                                    <p
                                        className="text-gray-900 text-xl dark:text-white"
                                        dangerouslySetInnerHTML={{
                                            __html: flashcards[curIndex]
                                                .front_text
                                        }}
                                    />
                                ) : (
                                    <p
                                        className="flip-card-back text-gray-900 text-xl dark:text-white"
                                        dangerouslySetInnerHTML={{
                                            __html: flashcards[curIndex]
                                                .back_text
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="my-5 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                            onClick={() => handleFlip()}>
                            Flip
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};