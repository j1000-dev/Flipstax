import React from 'react';

export const HeartIcon: React.FC = () => (
    <svg
        className="w-6 h-6 text-white dark:text-white transition-colors duration-300 ease-in-out hover:text-red-500"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24">
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
        />
    </svg>
);
