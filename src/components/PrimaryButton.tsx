import React, {ReactNode, MouseEvent} from 'react';

interface PrimaryButtonProps {
    content: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    content,
    onClick
}) => {
    return (
        <button
            type="submit"
            onClick={onClick}
            className="
            text-black 
            m-3
            focus:ring-4 focus:outline-none focus:ring-blue-300 focus:ring-green-800
            font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 
            bg-green-300 hover:bg-green-400 
            dark:bg-green-300 dark:hover:bg-green-400 
            dark:focus:ring-green-800">
            {content}
        </button>
    );
};
