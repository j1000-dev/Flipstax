import React, { ReactNode, MouseEvent } from 'react';

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
                m-3 rounded-lg sm:w-auto px-5 py-2.5
                text-slate-800 dark:text-slate-800 hover:text-white font-medium text-sm tracking-wide 
                bg-primary hover:bg-primary-hover/50
                dark:bg-dark-primary dark:hover:bg-dark-primary-hover
                transition-colors duration-300
            ">
            {content}
        </button>
    );
};
