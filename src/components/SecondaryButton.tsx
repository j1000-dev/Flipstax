
import React, { ReactNode, MouseEvent } from 'react'

interface SecondaryButtonProps {
    content: ReactNode,
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({content, onClick }) => {
    return (
        <button
            type="submit"
            onClick={onClick}
            className="
            text-black 
            bg-blue-400 
            hover:bg-blue-500 
            focus:ring-blue-600 
            focus:ring-4 focus:outline-none focus:ring-pink-300 
            font-medium 
            rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center 
            dark:bg-blue-400 
            dark:hover:bg-blue-500 
            dark:focus:ring-blue-600"
        >
            {content}
        </button>
    )

}