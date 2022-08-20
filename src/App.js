import ReactDOM from 'react-dom';
import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    useLocation
  } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'


import ImagesPage from './pages/ImagesPage';
import MainMenu from './components/shared/menu';
import CategoryPage from './pages/CategoryPage';

const App = () => {
    return (
        <Router>
            <MainMenu />\
            <div className='container h-100 pt-5'>
                <Routes>
                <Route exact path="/" element={<ImagesPage />}></Route>
                <Route exact path="/uploadimages" element={<ImagesPage />}></Route>
                <Route exact path="/categories" element={<CategoryPage />}></Route>
                </Routes>
            </div>
        </Router>
    )
}

export default App;