import React from 'react';
import {HashRouter as Router, Routes, Route} from 'react-router-dom';
import MoviesPage from './pages/MoviesPage';
import FavoritesPage from './pages/FavoritesPage';
import Header from "./components/Header/Header.tsx";

function App() {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="/" element={<MoviesPage/>}/>
                <Route path="/favorites" element={<FavoritesPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
