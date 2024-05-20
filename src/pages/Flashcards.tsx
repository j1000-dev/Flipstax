import React, { ChangeEvent, useEffect, useState } from 'react';
import { useFlashcard } from '../context/flashcard-context';
import { useParams } from 'react-router-dom';
import { HeartIcon } from '../icons/HeartIcon';
import { FilledHeartIcon } from '../icons/FilledHeartIcon';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { Modal } from '../components/Modal';

export const Flashcards: React.FC = () => {
    const { flashcards, fetchFlashcards, deleteFlashcard, editFlashcard } =
        useFlashcard();
    const [editModal, setEditModal] = useState<Boolean>(false);
    const [frontText, setFrontText] = useState<string>('');
    const [backText, setBackText] = useState<string>('');
    const [selectedFlashcard, setSelectedFlashcard] = useState<string>('');
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const { deckId } = useParams();

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
        setDeleteModal(false);
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

    const handleFrontText = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setFrontText(event.target.value);
    };

    const handleBackText = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setBackText(event.target.value);
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
        <div className="overflow-y-auto" style={{ height: '80%' }}>
            {flashcards.map(fc => (
                <div
                    className="cursor-pointer py-3 mx-2"
                    key={fc.id}
                    onClick={() => {
                        handleEditClick(fc.id);
                    }}>
                    <div
                        className=" 
                        block rounded-lg shadow
                        max-w-sm p-4 
                        bg-slate-50 border-slate-300 hover:bg-slate-100
                        dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <div className="flex items-center justify-between">
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: fc.front_text
                                }}
                                className="tracking-tighter text-slate-900 dark:text-white md:text-lg"
                            />
                            <div className="flex items-center">
                                <svg
                                    onClick={event => {
                                        event.stopPropagation(),
                                        setDeleteModal(true),
                                        setEditModal(false),
                                        setSelectedFlashcard(fc.id);
                                    }}
                                    className="w-6 h-6 text-slate-600 dark:text-white transition-colors duration-300 ease-in-out hover:text-blue-300 dark:hover:text-blue-400"
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
                                <div
                                    onClick={event =>
                                        favoriteFlashcard(
                                            fc.id,
                                            fc.favorited,
                                            event
                                        )
                                    }>
                                    {fc.favorited == true ? (
                                        <FilledHeartIcon />
                                    ) : (
                                        <HeartIcon />
                                    )}
                                </div>
                            </div>
                        </div>
                        <p
                            className="text-slate-500 dark:text-gray-400"
                            dangerouslySetInnerHTML={{ __html: fc.back_text }}
                        />
                    </div>
                </div>
            ))}
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
                        <p className="text-base leading-relaxed text-gray-400 dark:text-gray-400">
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
        </div>
    );
};
