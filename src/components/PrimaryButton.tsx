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
                text-white dark:text-slate-800 font-medium text-sm tracking-wide 
                bg-primary hover:bg-primary-hover
                dark:bg-dark-primary dark:hover:bg-dark-primary-hover
                transition-colors duration-500
            ">
            {content}
        </button>
    );
};
