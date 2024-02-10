import React from 'react';
import {ChangeEvent, FormEvent, useState} from 'react';
import {signInUser, auth, db} from '../firebase/firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {useNavigate, Link} from 'react-router-dom';

type FormProps = {
    formType: 'login' | 'signup';
};

const defaultFormFields = {
    email: '',
    password: ''
};

export const Form: React.FC<FormProps> = ({formType}) => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const {email, password} = formFields;
    const navigate = useNavigate();

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
        const {name, value} = event.target;
        setFormFields({...formFields, [name]: value});
    };

    return (
        <div className="flex flex-col items-center">
            <img src="/img/logo.png" height={400} width={400} />
            <div
                className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                style={{width: '500px'}}>
                {errorMessage !== '' && (
                    <div
                        id="toast-danger"
                        className="flex items-center mx-auto w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-700"
                        role="alert">
                        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
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
                            className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-600"
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
                    <form
                        onSubmit={
                            formType === 'login' ? handleLogin : handleSignUp
                        }>
                        <div className="mb-5">
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Email
                            </label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Password
                            </label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-300 dark:hover:bg-green-400 dark:focus:ring-blue-800">
                                {formType == 'login'
                                    ? 'Login'
                                    : 'Create Account'}
                            </button>
                            <Link
                                to={formType == 'login' ? '/signup' : '/login'}>
                                <button className="text-black focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-pink-600">
                                    {formType == 'login' ? (
                                        'Sign Up'
                                    ) : (
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
                    </form>
                </div>
            </div>
        </div>
    );
};
