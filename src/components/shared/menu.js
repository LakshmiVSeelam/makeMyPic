
import React from 'react';
import { Link } from 'react-router-dom'


const MainMenu = () => {

    const menuItems = [
        {id: 1, name: 'Home', path: '/'},
        {id: 2, name: 'Images', path: '/uploadimages'},
        {id: 3, name: 'Categories', path: '/categories'}
    ]

    return (
        <nav className="navbar navbar-expand-lg bg-light fixed-top py-0">
            <div className="container">
                {/* <a className="navbar-brand" href="#">makemypic</a> */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                    {menuItems.map((item) => {
                        return (
                            <li className="nav-item" key={item.id}>
                                <Link className="nav-link active" to={item.path}>{item.name}</Link>
                            </li>
                        )
                        
                    })}
                    
                    
                </ul>
                </div>
            </div>
        </nav>
    );
 }

 export default MainMenu;