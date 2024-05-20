import React from 'react';
import {useEffect, useContext} from 'react';
import {Routes, Route, useNavigate, Navigate} from 'react-router-dom';
import {AuthContext} from './context/auth-context';
import Login from './pages/Login';
import Home from './pages/Home';
import {SignUp} from './pages/SignUp';
import {PracticeProvider} from './context/practice-context';
import { ThemeContext } from './context/theme-context';


const App: React.FC = () => {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('themeContext must be used within a ThemeProvider');
    }

    const { theme } = themeContext;

    // Check if the current user exists on the initial render.
    useEffect(() => {
        if (currentUser) {
            navigate('/home');
        }
    }, []);

    return (
        <div className={`app ${theme === 'dark' ? 'dark' : ''}`}>
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
        </div>
    );
};

export default App;
