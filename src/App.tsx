import React from 'react';
import {useEffect, useContext} from 'react';
import {Routes, Route, useNavigate, Navigate} from 'react-router-dom';
import {AuthContext} from './context/auth-context';
import Login from './pages/Login';
import Home from './pages/Home';
import {SignUp} from './pages/SignUp';
import {PracticeProvider} from './context/practice-context';

const App: React.FC = () => {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();

    // Check if the current user exists on the initial render.
    useEffect(() => {
        if (currentUser) {
            navigate('/home');
        }
    }, []);

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    currentUser ? <Navigate replace to="/home" /> : <Login />
                }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route
                path="/home/:deckId?"
                element={
                    currentUser ? (
                        <PracticeProvider>
                            <Home />
                        </PracticeProvider>
                    ) : (
                        <Login />
                    )
                }
            />
            <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
    );
};

export default App;
