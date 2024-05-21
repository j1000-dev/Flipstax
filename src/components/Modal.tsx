import React, { ReactNode, MouseEvent } from 'react';

interface ModalProps {
    title: string;
    body: ReactNode;
    footer: ReactNode;
    onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const Modal: React.FC<ModalProps> = ({ title, body, footer, onClose }) => {
    return (
        <div
            id="default-modal"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed inset-0 flex items-center justify-center z-50 bg-black dark:bg-slate-400 dark:bg-opacity-50 bg-opacity-50">
            <div className="relative p-4 w-full max-w-md md:max-w-2xl max-h-full overflow-y-auto">
                {/* Modal content */}
                <div className="relative bg-slate-200 dark:bg-gray-700 rounded-lg shadow">
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-slate-300 dark:border-gray-600">
                        <h3 className="text-xl text-slate-600 dark:text-white">
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
                    <div className="p-4 md:p-5 space-y-4">{body}</div>
                    {/* Modal footer */}
                    <div className="flex justify-end items-center p-4 md:p-5 border-t border-slate-300 rounded-b dark:border-gray-600">
                        {footer}
                    </div>
                </div>
            </div>
        </div>
    );
};