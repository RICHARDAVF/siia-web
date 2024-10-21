// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Login from './views/Login';
import { Content } from './components/Content';


const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
                <Content/>
            </Router>
        </AuthProvider>
    );
};

export default App;
