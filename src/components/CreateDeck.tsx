import React, {useState, ChangeEvent} from 'react';
import {useDeck} from '../context/deck-context';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { DeckModal } from './DeckModal';

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
            setOpenModal(false);
        } catch (error) {
            console.error('Error creating deck:', error);
        }
    };

    return (
        <div className="mb-5">
            <div className="flex justify-between items-center">
                <p className="tracking-wide text-gray-300 md:text-lg dark:text-gray-300">Decks</p>
                <PrimaryButton content={'Create Deck'} onClick={(): void => setOpenModal(true)}/>
            </div>
            {openModal == true && (
                <DeckModal 
                    title="Name your new deck"
                    onClose={() => setOpenModal(false)}
                    body={(
                        <div className="mb-5">
                            <label
                                htmlFor="deckName"
                                className="block mb-2 text-sm font-normal text-white dark:text-white">
                                Deck name
                            </label>
                            <input
                                className="
                                    text-sm 
                                    block w-full p-2.5 rounded-lg 
                                    focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500
                                    bg-gray-700 border border-gray-600 placeholder-gray-400 text-white
                                    dark:bg-gray-700 
                                    dark:border-gray-600 
                                    dark:placeholder-gray-400 
                                    dark:text-white 
                                    dark:focus:ring-blue-500 
                                    dark:focus:border-blue-500
                                "
                                type="deckName"
                                name="deckName"
                                value={deckName}
                                onChange={handleChange}
                                placeholder="Name"
                                required
                            />
                        </div>     
                    )}
                    footer={(
                        <SecondaryButton content={'Save'} onClick={handleNextButtonClick} />
                    )}
                />
            )}
        </div>
    );
};
