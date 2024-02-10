import React, {ReactNode, MouseEvent} from 'react';

interface DeckModalProps {
    title: string;
    body: ReactNode;
    footer: ReactNode;
    onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const DeckModal: React.FC<DeckModalProps> = ({title, body, footer, onClose}) => {
    return (
        <div
            id="default-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-full overflow-y-auto">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                {/* Modal content */}
                <div className="relative bg-gray-700 dark:bg-gray-700 rounded-lg shadow">
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600 dark:border-gray-600">
                        <h3 className="text-xl text-white dark:text-white">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
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
                        {body}
                    </div>
                    {/* Modal footer */}
                    <div className="flex justify-end items-center p-4 md:p-5 border-t border-gray-600 rounded-b dark:border-gray-600">
                        {footer}
                    </div>
                </div>
            </div>
        </div>
    )
}