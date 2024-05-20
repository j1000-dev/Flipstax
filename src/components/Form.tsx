import React, { useContext, useState, ChangeEvent, FormEvent } from 'react';
import { signInUser, auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from '../context/theme-context';

type FormProps = {
    formType: 'login' | 'signup';
};

const defaultFormFields = {
    email: '',
    password: ''
};

export const Form: React.FC<FormProps> = ({ formType }) => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { email, password } = formFields;
    const navigate = useNavigate();
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('themeContext must be used within a ThemeProvider');
    }

    const { theme, toggleTheme } = themeContext;

    const resetFormFields = (): void => {
        return setFormFields(defaultFormFields);
    };

    const handleLogin = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();
        try {
            const userCredential = await signInUser(email, password);
            if (userCredential) {
                resetFormFields();
                navigate('/home');
            }
        } catch (error: any) {
            setErrorMessage('Invalid Credentials.');
        }
    };

    const handleSignUp = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();
        await createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;
                const userDocRef = db.collection('users').doc(user.uid);
                userDocRef.set({
                    id: user.uid,
                    email: user.email,
                    created_at: new Date().toLocaleString(),
                    updated_at: new Date().toLocaleString()
                });
                resetFormFields();
                navigate('/login');
            })
            .catch(() => {
                setErrorMessage('Email already in use.');
            });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
    };

    return (
        <div className={`
            fixed top-0 left-0 w-full h-full overflow-hidden
            flex flex-col items-center justify-center p-4 md:p-8 lg:p-12
            bg-center bg-cover bg-no-repeat ${theme === 'light' ? 'bg-light-mode' : 'bg-dark-mode'}
        `}>
            <button
                onClick={toggleTheme}
                className="
                    px-4 py-2 rounded absolute top-0 right-0 mt-4 mr-4 
                    bg-gray-200 dark:bg-gray-800 text-slate-600 dark:text-white
                "
            >
                <i className="fa-solid fa-circle-half-stroke"></i>
            </button>
            <div className="
                    p-6 rounded-lg shadow w-full max-w-lg
                    bg-slate-50/50 dark:bg-gray-700/50 border border-slate-200 dark:border-gray-700
                "
            >
                {errorMessage !== '' && (
                    <div
                        id="toast-danger"
                        className="
                            flex items-center mx-auto w-full max-w-xs p-4 mb-4 rounded-lg shadow
                            bg-slate-200 text-slate-600 dark:text-slate-200 dark:bg-gray-700
                        "
                        role="alert"
                    >
                        <div className="
                                inline-flex items-center justify-center flex-shrink-0 w-8 h-8  rounded-lg 
                                text-red-200 bg-red-600 dark:bg-red-800 dark:text-red-200
                            "
                        >
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                            </svg>
                            <span className="sr-only">Error icon</span>
                        </div>
                        <div className="ms-3 text-sm font-normal">
                            {errorMessage}
                        </div>
                        <button
                            onClick={(): void => setErrorMessage('')}
                            type="button"
                            className="
                                ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5
                                inline-flex items-center justify-center h-8 w-8
                                text-gray-500 hover:text-slate-400 dark:hover:text-white dark:text-gray-500
                            "
                            data-dismiss-target="#toast-danger"
                            aria-label="Close">
                            <span className="sr-only">Close</span>
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
                        </button>
                    </div>
                )}
                <div className="card">
                    <form onSubmit={formType === 'login' ? handleLogin : handleSignUp}>
                        <div className="mb-5">
                            <label
                                htmlFor="email"
                                className="block mb-2 text-md tracking-wide font-medium text-slate-600 dark:text-slate-200">
                                Email
                            </label>
                            <input
                                className=" 
                                    text-slate-600 dark:text-slate-200
                                    block w-full p-2.5 rounded-lg text-sm
                                    border hover:border-slate-400
                                    dark:bg-slate-600 dark:border-slate-600 dark:hover:border-slate-400
                                "
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="mb-5">
                            <label
                                htmlFor="password"
                                className="block mb-2 text-md font-medium tracking-wide text-slate-600 dark:text-slate-200">
                                Password
                            </label>
                            <input
                                className="
                                    text-slate-600 dark:text-slate-200
                                    block w-full p-2.5 rounded-lg text-sm
                                    border hover:border-slate-400
                                    dark:bg-slate-600 dark:border-slate-600 dark:hover:border-slate-400
                                "
                                type="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <div className="flex flex-wrap justify-center">
                            <button
                                type="submit"
                                className="
                                    m-3 rounded-full xs:w-48 px-5 py-2.5 
                                    text-white dark:text-slate-800 font-medium text-sm tracking-wide 
                                    bg-primary hover:bg-primary-hover
                                    dark:bg-dark-primary dark:hover:bg-dark-primary-hover
                                    transition-colors duration-500
                                "
                            >
                                {formType === 'login' ? 'Login' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                    <div className="flex justify-center">
                        <Link to={formType === 'login' ? '/signup' : '/login'}>
                            <button
                                className="
                                    m-3 rounded-full text-sm xs:w-48 px-5 py-2.5
                                    text-slate-600 dark:text-slate-200 font-medium tracking-wide
                                    bg-transparent hover:bg-slate-200 dark:hover:bg-gray-600/50 
                                    border border-slate-300 dark:border-slate-600 
                                    transition-colors duration-500
                                ">
                                {formType === 'login' ? 'Sign Up' : (
                                    <div className="flex items-center">
                                        <svg
                                            className="rotate-180 w-3.5 h-3.5 ms-2"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 10">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M1 5h12m0 0L9 1m4 4L9 9"
                                            />
                                        </svg>
                                        <span className="ml-2">
                                            Back to Login
                                        </span>
                                    </div>
                                )}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
