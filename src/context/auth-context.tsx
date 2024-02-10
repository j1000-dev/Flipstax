import React from 'react';
import {User} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import {SignOutUser, userStateListener} from '../firebase/firebase';
import {createContext, useState, useEffect, ReactNode} from 'react';

interface Props {
    children?: ReactNode;
}

export const AuthContext = createContext({
    currentUser: {} as User | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setCurrentUser: (_user: User) => {},
    signOut: () => {}
});

export const AuthProvider = ({children}: Props): React.ReactElement => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = userStateListener(user => {
            if (user) {
                setCurrentUser(user);
            }
        });
        return unsubscribe;
    }, []);

    // As soon as setting the current user to null,
    // the user will be redirected to the home page.
    const signOut = (): void => {
        SignOutUser();
        setCurrentUser(null);
        navigate('/');
    };

    const value = {
        currentUser,
        setCurrentUser,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
